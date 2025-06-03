import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import {
  MeetingErrorView,
  MeetingLoadingView,
  MeetingIdView,
} from "@/modules/meetings/ui/views/meeting-id-view";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function MeetingPage({ params }: Props) {
  const { meetingId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  void trpc.meetings.getOne.prefetch({
    id: meetingId,
  });   

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<MeetingErrorView />}>
        <Suspense fallback={<MeetingLoadingView />}>
          <MeetingIdView meetingId={meetingId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}
