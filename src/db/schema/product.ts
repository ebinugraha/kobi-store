import {
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { v4 as uuid } from "uuid";
import { user } from "./user";
import { categories } from "./categories";
import { relations } from "drizzle-orm";
import { productImages } from "./product-images";

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price").notNull(),
  isAvaible: boolean("is_avaible").default(false),
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  categoryId: text("category_id").references(() => categories.id),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(user, {
    fields: [products.id],
    references: [user.id],
  }),
  category: one(categories, {
    fields: [products.id],
    references: [categories.id],
  }),
  productImages: many(productImages),
}));
