import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";


export type MeetingGetOne = inferRouterOutputs<AppRouter>['meetings']['getOne']

export const meetingsInsertSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }).max(100, { message: "Name must be at most 100 characters long" }),
  agentId: z.string().min(1, { message: "Agent ID is required" }),
});

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
  id: z.string().min(1, { message: "Meeting ID is required" }),
})

export type MeetingsInsertSchema = z.infer<typeof meetingsInsertSchema>;
export type MeetingsUpdateSchema = z.infer<typeof meetingsUpdateSchema>;
