import { EmptyState } from "@/components/empty-state";


export const CancelledState = () => {
  return (
    <div className="flex flex-col items-center gap-y-8 justify-center rounded-lg bg-white px-4 py-5">
      <EmptyState
        title="Meeting Cancelled"
        description="Meeting has been cancelled."
        image="/cancelled.svg"
      />
    </div>
  );
};
