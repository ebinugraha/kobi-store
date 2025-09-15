import { productInsertSchema } from "@/modules/products/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(productInsertSchema)
    .mutation(async ({ ctx }) => {}),
});
