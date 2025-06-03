"use client";

import { trpc } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/use-confirm";
import { useState } from "react";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";

interface Props {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const [data] = trpc.meetings.getOne.useSuspenseQuery({
    id: meetingId,
  });
  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

  const [RemoveConfirmationDialog, confirm] = useConfirm(
    "Remove Meeting",
    `Are you sure you want to remove this meeting? The following action will be irreversible and delete your ${data.meetingCount} meetings`
  );

  const utils = trpc.useUtils();
  const router = useRouter();

  const removeMeeting = trpc.meetings.remove.useMutation({
    onSuccess: async () => {
      await utils.meetings.getMany.invalidate();
      router.push("/meetings");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleRemoveMeeting = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;
    removeMeeting.mutate({ id: meetingId });
  };

  const isActive = data.status === "active";
  const isUpcoming = data.status === "upcoming";
  const isProcessing = data.status === "processing";
  const isCancelled = data.status === "cancelled";
  const isCompleted = data.status === "completed";

  return (
    <>
      <div className="px-4 pb-4 flex flex-col flex-1 gap-y-4 md:px-8">
        <MeetingIdViewHeader
          meetingId={data.id}
          meetingName={data.name}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        {isUpcoming && (
          <UpcomingState
            meetingId={data.id}
            onCancelMeeting={() => {}}
            isCancelling={false}
          />
        )}
        {isCancelled && <CancelledState />}
        {isActive && <ActiveState meetingId={data.id} />}
        {isProcessing && <ProcessingState />}
      </div>
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />
      <RemoveConfirmationDialog />
    </>
  );
};

export const MeetingLoadingView = () => {
  return (
    <LoadingState
      title="Loading meeting"
      description="This might take a while..."
    />
  );
};

export const MeetingErrorView = () => {
  return (
    <ErrorState
      title="Something went wrong"
      description="Please try again later."
    />
  );
};
