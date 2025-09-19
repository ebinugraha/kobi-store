import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { products } from "./product";
import { relations } from "drizzle-orm";

import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const productView = pgTable(
  "product_view",
  {
    userId: text("user_id")
      .references(() => user.id, {
        onDelete: "cascade",
      })
      .notNull(),
    productId: text("video_id")
      .references(() => products.id, {
        onDelete: "cascade",
      })
      .notNull(),

    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    primaryKey({
      name: "product_view_pk",
      columns: [t.productId, t.userId],
    }),
  ]
);

export const productViewRelations = relations(productView, ({ one }) => ({
  users: one(user, {
    fields: [productView.userId],
    references: [user.id],
  }),
  videos: one(products, {
    fields: [productView.productId],
    references: [products.id],
  }),
}));

export const productViewInsertSchema = createInsertSchema(productView);
export const productViewUpdateSchema = createUpdateSchema(productView);
export const productViewSelectSchema = createSelectSchema(productView);
