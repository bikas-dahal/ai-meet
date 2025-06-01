"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { trpc } from "@/trpc/client";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const MeetingViews = () => {
  const [data] = trpc.meetings.getMany.useSuspenseQuery({
    page: 1,
    pageSize: 10,
  });

  return (
    <div className="px-4 pb-4 flex flex-col flex-1 gap-y-4 md:px-8">
      <DataTable columns={columns} data={data.items} />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Create a meeting to get started by providing a name and instructions. Meetings are AI-powered assistants that can help you with a variety of tasks."
        />
      )}
    </div>
  );
};

export const MeetingLoadingView = () => {
  return (
    <LoadingState
      title="Loading meetings"
      description="This might take a while..."
    />
  );
};

export const MeetingErrorView = () => {
  return (
    <ErrorState
      title="Error loading meetings"
      description="Please try again later."
    />
  );
};
