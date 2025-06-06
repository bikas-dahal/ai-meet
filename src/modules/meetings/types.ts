import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type MeetingGetMany =
  inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"];

export const meetingsInsertSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  agentId: z.string().min(1, { message: "Agent ID is required" }),
});

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
  id: z.string().min(1, { message: "Meeting ID is required" }),
});

export type MeetingsInsertSchema = z.infer<typeof meetingsInsertSchema>;
export type MeetingsUpdateSchema = z.infer<typeof meetingsUpdateSchema>;

export enum MeetingStatus {
  Upcoming = "upcoming",
  Active = "active",
  Completed = "completed",
  Processing = "processing",
  Cancelled = "cancelled",
}

export type StreamTranscriptItem = {
  speaker_id: string 
  type: string
  text: string
  start_ts: number
  end_ts: number
}