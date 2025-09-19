import db from "@/db";
import { user } from "@/db/schema";
import { comments } from "@/db/schema/comment";
import { auth } from "@/lib/auth";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
  lt,
  or,
} from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        value: z.string(),
        parentId: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, value, parentId } = input;
      const { id: userId } = ctx.session.user;

      const [createdComment] = await db
        .insert(comments)
        .values({
          productId,
          userId,
          parentId,
          value,
        })
        .returning();
    }),

  getMany: baseProcedure
    .input(
      z.object({
        productId: z.string(),
        parentId: z.string().nullish(),
        cursor: z
          .object({
            id: z.string(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { productId, parentId, cursor, limit } = input;

      const currentUser = await auth.api.getSession({
        headers: await headers(),
      });

      const currentUserId = currentUser?.user.id;

      let userId;

      const [userActive] = await db
        .select()
        .from(user)
        .where(inArray(user.id, currentUserId ? [currentUserId] : []));

      if (userActive) {
        userId = userActive.id;
      }

      const replies = db.$with("replies").as(
        db
          .select({
            count: count(comments.id).as("count"),
            parentId: comments.parentId,
          })
          .from(comments)
          .where(isNotNull(comments.parentId))
          .groupBy(comments.parentId)
      );

      const [totalData, data] = await Promise.all([
        db
          .select({
            count: count(),
          })
          .from(comments)
          .where(eq(comments.productId, productId)),
        db
          .with(replies)
          .select({
            ...getTableColumns(comments),
            user: user,
            replyCount: replies.count,
          })
          .from(comments)
          .where(
            and(
              eq(comments.productId, productId),
              parentId && parentId !== undefined
                ? eq(comments.parentId, parentId)
                : isNull(comments.parentId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updatedAt),
                    and(
                      eq(comments.updatedAt, cursor.updatedAt),
                      lt(comments.id, cursor.id)
                    )
                  )
                : undefined
            )
          )
          .innerJoin(user, eq(comments.userId, user.id))
          .leftJoin(replies, eq(comments.id, replies.parentId))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1),
      ]);

      const hasMore = data.length > limit;

      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];

      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        totalData: totalData[0].count,
        items,
        nextCursor,
      };
    }),
});
