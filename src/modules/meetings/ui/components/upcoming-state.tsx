import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { BanIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props {
    meetingId: string;
    onCancelMeeting: () => void;
    isCancelling: boolean;
}

export const UpcomingState = ({ meetingId, onCancelMeeting, isCancelling }: Props) => {
  return (
    <div className="flex flex-col items-center gap-y-8 justify-center rounded-lg bg-white px-4 py-5">
      <EmptyState
        title="Not Started Yet"
        description="Once you start the meeting, it will begin processing and a summary will be appeared here."
        image="/upcoming.svg"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2">
        <Button variant={'secondary'} className="w-full lg:w-auto" onClick={onCancelMeeting} disabled={isCancelling}>
            <BanIcon />
            Cancel Meeting
        </Button>
        <Button asChild className="w-full lg:w-auto" disabled={isCancelling}>
            <Link href={`call/${meetingId}`}>
                <VideoIcon />
                Start Meeting
            </Link>
        </Button>
      </div>
    </div>
  );
};
