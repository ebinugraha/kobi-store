import { categoriesRouter } from "@/modules/categories/server/procedures";
import { createTRPCRouter } from "../init";
import { productDashboardRouter } from "@/modules/dashboard/server/procedures";
import { productRouter } from "@/modules/products/server/procedures";
import { productViewsRouter } from "@/modules/productViews/server/procedures";
import { commentsRouter } from "@/modules/comments/server/procedure";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  productsDashboard: productDashboardRouter,
  product: productRouter,
  productView: productViewsRouter,
  comments: commentsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
