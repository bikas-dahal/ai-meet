"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { trpc } from "@/trpc/client";

export const MeetingViews = () => {
  const [data] = trpc.meetings.getMany.useSuspenseQuery({
    page: 1,
    pageSize: 10,
  });

  return (
    <div>
      {data.items.map((meeting) => (
        <div key={meeting.id}>{meeting.name}</div>
      ))}
    </div>
  );
};

export const MeetingLoadingView = () => {
  return (
    <LoadingState
      title="Loading agents"
      description="This might take a while..."
    />
  );
};

export const MeetingErrorView = () => {
  return (
    <ErrorState
      title="Error loading agents"
      description="Please try again later."
    />
  );
};
