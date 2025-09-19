import { foreignKey, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v4 as uuid } from "uuid";
import { user } from "./user";
import { products } from "./product";
import { relations } from "drizzle-orm";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const comments = pgTable(
  "comments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .references(() => products.id, {
        onDelete: "cascade",
      })
      .notNull(),
    value: text("value").notNull(),
    parentId: text("parent_id"),
    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => {
    return [
      {
        parentReferences: foreignKey({
          columns: [t.parentId],
          foreignColumns: [t.id],
          name: "comment_parent_id_fkey",
        }).onDelete("cascade"),
      },
    ];
  }
);

export const commentRelation = relations(comments, ({ one, many }) => ({
  user: one(user, {
    fields: [comments.userId],
    references: [user.id],
  }),
  product: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
  // commentReaction: many(commentReactions),
}));

export const commentInsertSchema = createInsertSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);
export const commentSelectSchema = createSelectSchema(comments);
