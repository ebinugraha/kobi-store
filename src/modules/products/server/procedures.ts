import db from "@/db";
import { productImages, products } from "@/db/schema";
import { productInsertSchema } from "@/modules/products/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray, lt, or } from "drizzle-orm";
import z from "zod";

export const productRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.session.user;

      const cursorCondition = cursor
        ? or(
            lt(products.updatedAt, cursor.updatedAt),
            and(
              eq(products.updatedAt, cursor.updatedAt),
              lt(products.id, cursor.id)
            )
          )
        : undefined;

      const allProducts = await db
        .select()
        .from(products)
        .where(and(eq(products.userId, userId), cursorCondition ?? undefined))
        .orderBy(desc(products.updatedAt), desc(products.id))
        .limit(limit + 1);

      const productIds = allProducts.map((p) => p.id);

      const allProductsImages = await db
        .select()
        .from(productImages)
        .where(inArray(productImages.productId, productIds));

      const result = allProducts.map((product) => {
        const images = allProductsImages.filter(
          (img) => img.productId === product.id
        );
        return {
          ...product,
          productImages: images,
        };
      });

      const hasMore = result.length > limit;
      const items = hasMore ? result.slice(0, -1) : result;
      const lastItem = items[items.length - 1];

      const nextCursor = hasMore
        ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
        : null;

      return {
        items,
        nextCursor,
      };
    }),

  create: protectedProcedure
    .input(productInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.session.user;

      if (input.images.length < 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gambar produk tidak ada",
        });
      }

      const [product] = await db
        .insert(products)
        .values({ ...input, userId: userId })
        .returning();

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product gagal di tambah",
        });
      }

      const imagesData = input.images.map((image, index) => ({
        url: image.url,
        order: index,
        productId: product.id,
      }));

      await db.insert(productImages).values(imagesData);

      return product;
    }),
});
