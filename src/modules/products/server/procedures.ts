import db from "@/db";
import { productImages, products } from "@/db/schema";
import { productInsertSchema } from "@/modules/products/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const productRouter = createTRPCRouter({
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
