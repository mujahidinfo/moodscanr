import { db } from "~/server/db";
import {  users } from "~/server/db/schema";
import { and, asc, desc, eq, ilike, isNull, isNotNull, or, sql, gt, gte } from "drizzle-orm";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    if (!ctx.session?.user?.email) return null;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, ctx.session.user.email));
    return user[0];
  }),
  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        sortBy: z.enum(["name", "email", "role", "createdAt"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const {
        search,
        sortBy = "name",
        sortOrder = "asc",
        page,
        limit,
      } = input;

      // Build where conditions array
      const whereConditions = [];

      // Add search conditions
      if (search) {
        whereConditions.push(
          or(
            ilike(users.name, `%${search}%`),
            ilike(users.email, `%${search}%`),
          )
        );
      }

      // Combine all conditions
      const whereCondition =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Determine order clause with proper field mapping
      let orderClause;
      switch (sortBy) {
        case "name":
          orderClause =
            sortOrder === "desc" ? desc(users.name) : asc(users.name);
          break;
        case "email":
          orderClause =
            sortOrder === "desc" ? desc(users.email) : asc(users.email);
          break;
        default:
          orderClause =
            sortOrder === "desc" ? desc(users.name) : asc(users.name);
      }

      const offset = (page - 1) * limit;

      // Fetch data with DISTINCT to prevent duplicates
      const data = await db
        .selectDistinct({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
          emailVerified: users.emailVerified,
        })
        .from(users)
        .where(whereCondition)
        .orderBy(orderClause, desc(users.id)) // Add secondary sort by ID for consistency
        .limit(limit)
        .offset(offset);

      // Fetch total count with DISTINCT
      const totalCountResult = await db
        .select({ count: sql<number>`count(DISTINCT ${users.id})` })
        .from(users)
        .where(whereCondition);

      const total = Number(totalCountResult[0]?.count ?? 0);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const customer = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id));
      return customer[0];
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      let imageUrl: string | undefined;

      if (input.image) {
        const uploadResponse = await cloudinary.uploader.upload(input.image, {
          folder: "genres/users",
        });
        imageUrl = uploadResponse.secure_url;
      }

      const updateData = {
        ...(input.name && { name: input.name }),
        ...(input.email && { email: input.email }),
        ...(imageUrl && { image: imageUrl }),
      };

      const customer = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, input.id))
        .returning();

      return customer[0];
    }),

  // update user pfofile
  updateProfile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        phone: z.string().optional(),
        image: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      let imageUrl: string | undefined;

      if (input.image) {
        const uploadResponse = await cloudinary.uploader.upload(input.image, {
          folder: "genres/users",
        });
        imageUrl = uploadResponse.secure_url;
      }

      const updateData = {
        ...(input.name && { name: input.name }),
        ...(input.phone && { phone: input.phone }),
        ...(imageUrl && { image: imageUrl }),
      };

      const customer = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, input.id))
        .returning();

      return customer[0];
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await db.delete(users).where(eq(users.id, input.id)).returning();
    }),

  // Get user statistics
  getStats: publicProcedure.query(async () => {
    const totalUsers = await db.select({ count: sql<number>`count(*)`.as("count") }).from(users)
    const activeUsers = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(users)
      .where(isNotNull(users.emailVerified))
    const inactiveUsers = await db.select({ count: sql<number>`count(*)`.as("count") }).from(users).where(isNull(users.emailVerified));
    
    return {
      total: totalUsers[0]?.count,
      active: activeUsers[0]?.count,
      inactive: inactiveUsers[0]?.count,
    };
  }),
});
