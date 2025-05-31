import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  title: string;
  description: string;
}

export const LoadingState = ({ title, description }: LoadingStateProps) => {
  return (
    <div className="py-4 px-8 flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-y-6 p-10 bg-background rounded-lg">
        <Loader2 className="size-6 animate-spin text-primary" />
        <div className="flex flex-col gap-y-2 text-center">
          <h6 className="text-lg font-medium">{title}</h6>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
