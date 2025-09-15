import { categoriesRouter } from "@/modules/categories/server/procedures";
import { createTRPCRouter } from "../init";
import { productRouter } from "@/modules/products/server/procedures";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  products: productRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
