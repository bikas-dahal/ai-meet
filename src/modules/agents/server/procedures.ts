import { db } from "@/db";
import { agent } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
        const data = await db.select().from(agent)
        // throw new TRPCError({
        //     code: "INTERNAL_SERVER_ERROR",
        //     message: "Internal server error",
        // })

        return data
    })
})