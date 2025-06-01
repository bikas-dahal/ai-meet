"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { trpc } from "@/trpc/client";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const [data] = trpc.agents.getOne.useSuspenseQuery({
    id: agentId,
  });
  return (
    <div className="flex flex-col gap-y-4 flex-1 px-4 md:px-8 py-4">
      <AgentIdViewHeader
        agentId={data.id}
        agentName={data.name}
        onEdit={() => {}}
        onRemove={() => {}}
      />
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              variant="botttsNeutral"
              className="size-10"
              seed={data.name}
            />
            <h2 className="font-medium text-2xl">{data.name}</h2>
          </div>
          <Badge
            variant={"outline"}
            className="flex items-center gap-x-2 [&>svg]:size-4"
          >
            <VideoIcon className="h-4 text-pink-500 w-4" />
            <span>
              {data.meetingCount}{" "}
              {data.meetingCount === 1 ? "Meeting" : "Meetings"}
            </span>
          </Badge>
          <div className="flex flex-col gap-y-2">
            <p className="font-medium text-lg">Instructions</p>
            <p className="text-muted-foreground">{data.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AgentIdLoadingView = () => {
  return (
    <LoadingState
      title="Loading agent"
      description="This might take a while..."
    />
  );
};

export const AgentIdErrorView = () => {
  return (
    <ErrorState
      title="Error loading agent"
      description="Please try again later."
    />
  );
};
