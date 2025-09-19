import db from "@/db";
import { productImages, products } from "@/db/schema";
import {
  productInsertSchema,
  productUpdateSchema,
} from "@/modules/dashboard/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray, lt, or } from "drizzle-orm";
import z from "zod";

export const productDashboardRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const { id: userId } = ctx.session.user;

      const [product] = await db
        .select()
        .from(products)
        .where(and(eq(products.userId, userId), eq(products.id, id)));

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const productWithImage = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, product.id));

      const result = {
        ...product,
        productImages: productWithImage || [],
      };

      return result;
    }),
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
  update: protectedProcedure
    .input(productUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.session.user;

      if (!input.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [updatedProduct] = await db
        .update(products)
        .set({
          name: input.name,
          description: input.description,
          isAvailable: input.isAvailable,
          price: input.price,
          categoryId: input.categoryId,
          updatedAt: new Date(),
        })
        .where(and(eq(products.id, input.id), eq(products.userId, userId)))
        .returning();

      const oldImages = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, updatedProduct.id));

      const newImages = input.images;

      // 1. Buat map untuk akses cepat
      const oldMap = new Map(oldImages.map((img) => [img.id, img]));

      // 2. Deteksi gambar baru dan update
      const toAdd: typeof newImages = [];
      const toUpdate: typeof newImages = [];

      for (const img of newImages) {
        if (!img.id) {
          // Gambar baru (tidak ada id)
          toAdd.push(img);
        } else if (oldMap.has(img.id)) {
          // Gambar lama yang masih ada → cek perubahan order/url
          const old = oldMap.get(img.id);
          if (old!.url !== img.url || old!.order !== img.order) {
            toUpdate.push(img);
          }
          oldMap.delete(img.id); // hapus dari oldMap karena sudah dihandle
        }
      }

      // 3. Sisa di oldMap berarti dihapus
      const toDelete = Array.from(oldMap.values());

      // 4. Eksekusi DB paralel
      await Promise.all([
        // Tambah baru
        ...toAdd.map((img) =>
          db.insert(productImages).values({
            productId: updatedProduct.id,
            url: img.url,
            order: img.order,
          })
        ),
        // Update lama
        ...toUpdate.map((img) =>
          db
            .update(productImages)
            .set({ url: img.url, order: img.order, updatedAt: new Date() })
            .where(eq(productImages.id, img.id))
        ),
        // Hapus
        ...toDelete.map((img) =>
          db.delete(productImages).where(eq(productImages.id, img.id))
        ),
      ]);

      return updatedProduct;
    }),
});
