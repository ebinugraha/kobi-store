import db from "@/db";
import { comments } from "@/db/schema/comment";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
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
});
