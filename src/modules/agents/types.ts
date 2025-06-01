import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";


export type AgentGetOne = inferRouterOutputs<AppRouter>['agents']['getOne']

export const agentsInsertSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }).max(100, { message: "Name must be at most 100 characters long" }),
  instructions: z.string().min(3, { message: "Instructions must be at least 3 characters long" }).max(1000, { message: "Instructions must be at most 1000 characters long" }),
});



export type AgentsInsertSchema = z.infer<typeof agentsInsertSchema>;
