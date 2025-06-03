import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  meetingId: string;
}

export const ActiveState = ({ meetingId }: Props) => {
  return (
    <div className="flex flex-col items-center gap-y-8 justify-center rounded-lg bg-white px-4 py-5">
      <EmptyState
        title="Meeting is in progress"
        description="Meeting will end once all participants leave the meeting."
        image="/upcoming.svg"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2">
        <Button asChild className="w-full lg:w-auto">
          <Link
            className=""
            href={`call/${meetingId}`}
          >
            <VideoIcon />
            Join Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
