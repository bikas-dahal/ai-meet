import { db } from "@/db";
import { agent } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../types";
import { z } from "zod";
import { and, eq, ilike, getTableColumns, desc, count } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search } = input;
      const conditions = [eq(agent.userId, ctx.auth.user.id)];
      if (search) {
        conditions.push(ilike(agent.name, `%${search}%`));
      }

      // Get the agents data without count for now
      const data = await db
        .select({
          ...getTableColumns(agent),

          // Remove meetingCount for now, or implement proper JOIN if you have a meetings table
        })
        .from(agent)
        .where(and(...conditions))
        .orderBy(desc(agent.createdAt), desc(agent.id))
        .limit(pageSize)
        .offset(((page || DEFAULT_PAGE) - 1) * pageSize);

      // Get total count separately
      const [total] = await db
        .select({
          count: count(),
        })
        .from(agent)
        .where(and(...conditions));

      const totalPages = Math.ceil((total.count || 0) / pageSize);

      return {
        items: data,
        total: total.count || 0,
        totalPages,
      };
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingAgent] = await db
        .select({
          ...getTableColumns(agent),
          // Remove meetingCount for now, or implement proper JOIN if you have a meetings table
        })
        .from(agent)
        .where(and(eq(agent.id, input.id), eq(agent.userId, ctx.auth.user.id)));

      if (!existingAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent you are looking for not found" });
      }

      return existingAgent;
    }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agent)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdAgent;
    }),
});
