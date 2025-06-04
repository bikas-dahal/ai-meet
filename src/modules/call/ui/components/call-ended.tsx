import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CallEnded = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-radial from-pink-400 to-teal-600">
      <div className="flex flex-1 py-4 px-4 md:px-8 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 p-10 shadow-sm bg-background rounded-lg">
          <div className="flex flex-col gap-y-2 text-center">
            <h5 className="text-xl font-medium">You have ended the call</h5>
            <p className="text-muted-foreground text-sm">
              Summary will be appeared in a moment
            </p>
          </div>
          <Button asChild>
            <Link href="/meetings">Back to meetings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
