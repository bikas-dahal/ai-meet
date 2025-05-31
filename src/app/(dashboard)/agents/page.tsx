import { AgentsView, AgentLoadingView, AgentErrorView } from "@/modules/agents/ui/views/agents-view";
import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'; 


export default function AgentsPage() {
  void trpc.agents.getMany.prefetch();

  return (
    <HydrateClient>
        <ErrorBoundary fallback={<AgentErrorView />}>
            <Suspense fallback={<AgentLoadingView />}>
                <AgentsView />
            </Suspense>
        </ErrorBoundary>
    </HydrateClient>
  );
}
