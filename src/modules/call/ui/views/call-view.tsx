"use client";

import { EmptyState } from "@/components/empty-state";
import { trpc } from "@/trpc/client";
import { CallProvider } from "../components/call-provider";

interface Props {
  meetingId: string;
}

export const CallView = ({ meetingId }: Props) => {
  const [data] = trpc.meetings.getOne.useSuspenseQuery({
    id: meetingId,
  });

  if (data.status === 'completed') {
    return (
        <div className="flex h-screen justify-center items-center">
            <EmptyState
                title="Meeting Completed"
                description="You can no longer join this meeting."
                image="/completed.svg"
            />
        </div>
    )
  }

  return (
    <div>
      <CallProvider meetingId={meetingId} meetingName={data?.name} />
    </div>
  );
};
