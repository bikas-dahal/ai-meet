"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { CornerDownRight, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <GeneratedAvatar
            seed={row.original.name}
            variant="botttsNeutral"
            className="size-6 rounded-full"
          />
          <span className="font-semibold capitalize">
            {row.original.name}
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <CornerDownRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-semibold capitalize truncate max-w-[150px]">
            {row.original.instructions}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: ({ row }) => (
      <Badge variant={'outline'} className="flex items-center gap-x-2 [&>svg]:h-4 [&>svg]:w-4">
        <VideoIcon className="text-pink-500" />
        {row.original.meetingCount} {row.original.meetingCount === 1 ? "Meeting" : "Meetings"}
      </Badge>
    ),
  },
];
