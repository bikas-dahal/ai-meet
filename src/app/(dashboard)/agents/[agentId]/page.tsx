import { AgentIdErrorView, AgentIdLoadingView, AgentIdView } from "@/modules/agents/ui/views/agent-id-view";
import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{ agentId: string }>;
}

export default async function AgentPage({ params }: Props) {
  const { agentId } = await params;

  void trpc.agents.getOne.prefetch({
    id: agentId,
  });

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<AgentIdErrorView />}>
        <Suspense fallback={<AgentIdLoadingView />}>
          <AgentIdView agentId={agentId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
