"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { NewAgentDialog } from "./new-agent-dialog";

export const AgentListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <div className="p-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-semibold">My Agents</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            Add Agent
          </Button>
        </div>
      </div>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
};
