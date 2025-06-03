import { EmptyState } from "@/components/empty-state";


export const ProcessingState = () => {
  return (
    <div className="flex flex-col items-center gap-y-8 justify-center rounded-lg bg-white px-4 py-5">
      <EmptyState
        title="Meeting Completed"
        description="The meeting has been completed and a summary will be appeared here soon."
        image="/processing.svg"
      />
    </div>
  );
};
