import db from "@/db";
import { productImages, products, user } from "@/db/schema";
import { productView } from "@/db/schema/product-view";
import { auth } from "@/lib/auth";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";

export const productRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      const userAuth = await auth.api.getSession({
        headers: await headers(),
      });

      const userId = userAuth?.user.id;
      let userIdAuth;

      const [currentUser] = await db
        .select()
        .from(user)
        .where(inArray(user.id, userId ? [userId] : []));

      if (currentUser) {
        userIdAuth = currentUser.id;
      }

      const [existingProduct] = await db
        .select({
          ...getTableColumns(products),
          viewCount: db.$count(
            productView,
            eq(products.id, productView.productId)
          ),
          user: {
            ...getTableColumns(user),
          },
        })
        .from(products)
        .innerJoin(user, eq(user.id, products.userId))
        .where(eq(products.id, id));

      if (!existingProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const productImage = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, existingProduct.id));

      const result = {
        ...existingProduct,
        image: productImage,
      };

      return result;
    }),
});
