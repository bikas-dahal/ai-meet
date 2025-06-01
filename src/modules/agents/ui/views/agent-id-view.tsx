"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { trpc } from "@/trpc/client";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);
  const [data] = trpc.agents.getOne.useSuspenseQuery({
    id: agentId,
  });

  const utils = trpc.useUtils();
  const router = useRouter();

  const removeAgent = trpc.agents.remove.useMutation({
    onSuccess: async () => {
      await utils.agents.getMany.invalidate();
      router.push("/agents");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [RemoveConfirmationDialog, confirm] = useConfirm(
    "Remove Agent",
    `Are you sure you want to remove this agent? the following action witll be irreversible and delete your ${data.meetingCount} meetings`
  );

  const handleRemoveAgent = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;
    removeAgent.mutate({ id: agentId });
  };

  return (
    <>

      <div className="flex flex-col gap-y-4 flex-1 px-4 md:px-8 py-4">
        <AgentIdViewHeader
          agentId={data.id}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
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
      <RemoveConfirmationDialog />
      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={data}
      />
    </>
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
