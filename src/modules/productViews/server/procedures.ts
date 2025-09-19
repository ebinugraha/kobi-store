import db from "@/db";
import { products } from "@/db/schema";
import { productView } from "@/db/schema/product-view";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const productViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { productId } = input;
      const { id: userId } = ctx.session.user;

      const [existingProductView] = await db
        .select()
        .from(productView)
        .where(
          and(
            eq(productView.userId, userId),
            eq(productView.productId, productId)
          )
        );

      if (existingProductView) return existingProductView;

      const [createdProductView] = await db
        .insert(productView)
        .values({ userId, productId })
        .returning();

      return createdProductView;
    }),
});
