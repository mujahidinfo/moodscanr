import { count, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { users } from "~/server/db/schema";

export const overviewRouter = createTRPCRouter({
  getOverviewStats: protectedProcedure.query(async ({ ctx }) => {
    //  get user count
    const userCount = await ctx.db.select({ count: count() }).from(users)
    return {
      userCount: userCount[0]?.count || 0,
    };
  }),
});