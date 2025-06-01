import { HydrateClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import {
  MeetingErrorView,
  MeetingViews,
  MeetingLoadingView,
} from "@/modules/meetings/ui/views/meetings-view";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MeetingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  void trpc.meetings.getMany.prefetch({
    page: 1,
    pageSize: 10,
  });
  return (
    <>
      <MeetingsListHeader />
      <HydrateClient>
        <ErrorBoundary fallback={<MeetingErrorView />}>
          <Suspense fallback={<MeetingLoadingView />}>
            <MeetingViews />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </>
  );
}
