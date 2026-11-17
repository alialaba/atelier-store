import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Relative import: drizzle-kit loads this file outside Next and may not resolve `@/`.
import type { CatalogImage, ProductColor } from "../../lib/product";

export const categories = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  /** Homepage tile image; optional for categories that aren't featured. */
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  /** Shown in the homepage "Shop by category" tiles. */
  featured: boolean().notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable(
  "products",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull().unique(),
    sku: text().notNull().unique(),
    name: text().notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    priceCents: integer("price_cents").notNull(),
    description: text().notNull().default(""),
    details: text().array().notNull().default(sql`'{}'::text[]`),
    /** Ordered gallery: [0] primary shot, [1] hover/alternate shot. */
    images: jsonb().$type<CatalogImage[]>().notNull().default([]),
    /** Display-only swatches; stock is tracked per size, not per colour. */
    colors: jsonb().$type<ProductColor[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    index("products_created_at_idx").on(table.createdAt),
    check("products_price_cents_non_negative", sql`${table.priceCents} >= 0`),
  ],
);

export const productStock = pgTable(
  "product_stock",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** Size label as shown to shoppers, e.g. "EU 41", "M", "One size". */
    size: text().notNull(),
    quantity: integer().notNull().default(0),
    /** Display order of sizes within a product (XS → XL, EU 38 → 43). */
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.size] }),
    check("product_stock_quantity_non_negative", sql`${table.quantity} >= 0`),
  ],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  stock: many(productStock),
}));

export const productStockRelations = relations(productStock, ({ one }) => ({
  product: one(products, {
    fields: [productStock.productId],
    references: [products.id],
  }),
}));
