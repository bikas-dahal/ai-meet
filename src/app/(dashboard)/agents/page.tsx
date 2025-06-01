import { AgentListHeader } from "@/modules/agents/ui/components/agent-list-header";
import {
  AgentsView,
  AgentLoadingView,
  AgentErrorView,
} from "@/modules/agents/ui/views/agents-view";
import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function AgentsPage({searchParams}: Props) {

  const filters = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");
  void trpc.agents.getMany.prefetch({
    ...filters,
  });

  return (
    <>
      <AgentListHeader />
      <HydrateClient>
        <ErrorBoundary fallback={<AgentErrorView />}>
          <Suspense fallback={<AgentLoadingView />}>
            <AgentsView />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </>
  );
}
