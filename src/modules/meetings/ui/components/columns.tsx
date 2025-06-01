"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MeetingGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  CircleXIcon,
  CircleCheckIcon,
  ClockArrowUpIcon,
  CornerDownRight,
  LoaderIcon,
  VideoIcon,
  ClockFadingIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import humanizeDuration from "humanize-duration";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    round: true,
    language: "en",
    units: ["h", "m", "s"],
    delimiter: " ",
  });
}

const statusItemMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: "bg-blue-500/20 text-blue-500 border-blue-500/10",
  active: "bg-yellow-500/20 text-yellow-500 border-yellow-500/10",
  completed: "bg-green-500/20 text-green-500 border-green-500/10",
  processing: "bg-gray-500/20 text-gray-500 border-gray-500/10",
  cancelled: "bg-rose-500/20 text-rose-500 border-rose-500/10",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground font-semibold capitalize">
          {row.original.name}
        </span>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <CornerDownRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-semibold capitalize truncate max-w-[150px]">
              {row.original.agent.name}
            </span>
          </div>
          <GeneratedAvatar
            seed={row.original.agent.name}
            variant="botttsNeutral"
            className="size-6 rounded-full"
          />
          <span className="text-xs text-muted-foreground font-semibold capitalize">
            {row.original.startedAt
              ? format(row.original.startedAt, "MMM d")
              : ""}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon =
        statusItemMap[row.original.status as keyof typeof statusItemMap];
      const color =
        statusColorMap[row.original.status as keyof typeof statusColorMap];
      return (
        <Badge variant="outline" className={cn("capitalize [&>svg]:h-4 [&>svg]:w-4  text-muted-foreground", color)}>
          <Icon className={
            cn(
              row.original.status === "processing" ? "animate-spin" : "",
            )
          } />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize flex items-center gap-x-2 [&>svg]:h-4 [&>svg]:w-4 text-muted-foreground"
      >
        <ClockFadingIcon className="text-pink-500" />
        { row.original.duration ? formatDuration(row.original.duration) : "Not started"}
      </Badge>
    )
  },
];
