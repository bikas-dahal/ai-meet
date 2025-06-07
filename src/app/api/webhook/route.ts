import { db } from "@/db";
import { agent, meetings } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { streamVideo } from "@/lib/stream-video";
import {
  CallEndedEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent,
} from "@stream-io/node-sdk";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey || !signature) {
    return NextResponse.json(
      {
        error: "Missing API key or signature",
      },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json(
      {
        error: "Invalid signature",
      },
      { status: 401 }
    );
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        error: "Invalid payload",
      },
      { status: 400 }
    );
  }

  const eventType = (payload as Record<string, unknown>)?.event_type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json(
        {
          error: "Missing meeting ID",
        },
        { status: 400 }
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "processing"))
        )
      );

    if (!existingMeeting) {
      return NextResponse.json(
        {
          error: "Meeting not found",
        },
        { status: 404 }
      );
    }

    await db
      .update(meetings)
      .set({ status: "active", createdAt: new Date() })
      .where(eq(meetings.id, meetingId));

    const [existingAgent] = await db
      .select()
      .from(agent)
      .where(eq(agent.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json(
        {
          error: "Agent not found",
        },
        { status: 404 }
      );
    }

    const call = streamVideo.video.call("default", meetingId);
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id,
    });

    realtimeClient.updateSession({
      instructions: existingAgent.instructions,
    });
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json(
        {
          error: "Missing meeting ID",
        },
        { status: 400 }
      );
    }

    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json(
        {
          error: "Missing meeting ID",
        },
        { status: 400 }
      );
    }

    await db
      .update(meetings)
      .set({ status: "processing", endedAt: new Date() })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    const [updatedMeeting] = await db
      .update(meetings)
      .set({ transcriptUrl: event.call_transcription.url })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updatedMeeting) {
      return NextResponse.json(
        {
          error: "Meeting not found",
        },
        { status: 404 }
      );
    }

    await inngest.send({
        name: "meetings/processing",
        data: {
            meetingId,
            transcriptUrl: event.call_transcription.url,
        } 
    })
  } else if (eventType === 'call.recording_ready') {
    const event = payload as CallRecordingReadyEvent
    const meetingId = event.call_cid.split(":")[1];

    await db.update(meetings).set({
        recordingUrl: event.call_recording.url
    }).where(eq(meetings.id, meetingId))
  }

  return NextResponse.json(
    {
      message: "OK",
    },
    { status: 200 }
  );
}
