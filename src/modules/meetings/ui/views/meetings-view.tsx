"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { trpc } from "@/trpc/client";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";
import { useRouter } from "next/navigation";

export const MeetingViews = () => {
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilters();

  const [data] = trpc.meetings.getMany.useSuspenseQuery({
    pageSize: 10,
    ...filters,
  });

  return (
    <div className="px-4 pb-4 flex flex-col flex-1 gap-y-4 md:px-8">
      <DataTable
        columns={columns}
        data={data.items}
        onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
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
