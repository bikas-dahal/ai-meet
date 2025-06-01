"use client";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { trpc } from "@/trpc/client";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";

export const AgentsView = () => {
  const [filters, setFilters] = useAgentsFilters();

  const [data] = trpc.agents.getMany.useSuspenseQuery({
    ...filters,
  });

  return (
    <div className="flex flex-col px-4 pb-4 md:px-8 gap-y-4">
      <DataTable columns={columns} data={data.items} />
      <DataPagination 
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to get started by providing a name and instructions. Agents are AI-powered assistants that can help you with a variety of tasks."
        />
      )}
    </div>
  );
};

export const AgentLoadingView = () => {
  return (
    <LoadingState
      title="Loading agents"
      description="This might take a while..."
    />
  );
};

export const AgentErrorView = () => {
  return (
    <ErrorState
      title="Error loading agents"
      description="Please try again later."
    />
  );
};
