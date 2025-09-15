import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v4 as uuid } from "uuid";
import { products } from "./product";
import { relations } from "drizzle-orm";

export const productImages = pgTable("product_images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  url: text("url").notNull(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  order: integer("order").default(0),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const productImagesRelation = relations(
  productImages,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productImages.productId],
      references: [products.id],
    }),
  })
);
