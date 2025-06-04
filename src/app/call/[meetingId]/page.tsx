import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import {
  MeetingErrorView,
  MeetingLoadingView,
  MeetingIdView,
} from "@/modules/meetings/ui/views/meeting-id-view";
import { CallView } from "@/modules/call/ui/views/call-view";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function CallPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  const { meetingId } = await params;

  void trpc.meetings.getOne.prefetch({
    id: meetingId,
  });

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<MeetingErrorView />}>
        <Suspense fallback={<MeetingLoadingView />}>
          <CallView meetingId={meetingId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
