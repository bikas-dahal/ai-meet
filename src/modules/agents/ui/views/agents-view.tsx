"use client";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { trpc } from "@/trpc/client";

export const AgentsView = () => {
  const [data] = trpc.agents.getMany.useSuspenseQuery();

  return (
    <div>
      <h1>Agents</h1>
      {data?.map((agent) => (
        <div key={agent.id}>
          <h2>{agent.name}</h2>
          <p>{agent.instructions}</p>
        </div>
      ))}
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
