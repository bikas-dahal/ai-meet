import { db } from "@/db";
import { meetings, agent } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, eq, ilike, getTableColumns, desc, count, sql } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../types";

export const meetingsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdMeeting;
    }),

  update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedMeeting] = await db
        .update(meetings)
        .set({
          ...input,
        })
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .returning();

      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting you are looking for not found",
        });
      }

      return updatedMeeting;
    }),

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
      const conditions = [eq(meetings.userId, ctx.auth.user.id)];
      if (search) {
        conditions.push(ilike(meetings.name, `%${search}%`));
      }

      // Get the agents data without count for now
      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agent,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
        })
        .from(meetings)
        .innerJoin(agent, eq(meetings.agentId, agent.id)) 
        .where(and(...conditions))
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset(((page || DEFAULT_PAGE) - 1) * pageSize);

      // Get total count separately
      const [total] = await db
        .select({
          count: count(),
        })
        .from(meetings)
        .innerJoin(agent, eq(meetings.agentId, agent.id)) 
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
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting you are looking for not found",
        });
      }

      return existingMeeting;
    }),
});
