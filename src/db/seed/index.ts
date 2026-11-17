/*
 * Idempotent catalog seed: `npm run db:seed`.
 *
 * Upserts categories and products by slug and replaces each seeded product's
 * stock rows. Everything runs in one `db.batch()`, which Neon executes as a
 * single transaction. Foreign keys are resolved with subselects, so no step
 * depends on ids returned by an earlier one.
 *
 * Builds its own client instead of importing `src/db`, which imports
 * `server-only` and throws outside Next.
 */

import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { count, inArray, sql, type AnyColumn } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "../schema";
import { categories, products, productStock } from "../schema";
import { seedCategories, seedProducts } from "./data";

config({ path: [".env.local", ".env"], quiet: true });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

const db = drizzle({ client: neon(url), schema });

/** `excluded.<column>` for ON CONFLICT DO UPDATE. */
const excluded = (column: AnyColumn) => sql.raw(`excluded."${column.name}"`);

/** Stable "New arrivals" order: first product in the list is the newest. */
const NEWEST = new Date("2026-10-01T00:00:00Z").getTime();
const HOUR = 60 * 60 * 1000;

async function main() {
  const categoryNames = new Set(seedCategories.map((c) => c.name));
  for (const product of seedProducts) {
    if (!categoryNames.has(product.category)) {
      throw new Error(`Product "${product.slug}" has unknown category "${product.category}"`);
    }
  }

  const productSlugs = seedProducts.map((p) => p.slug);

  await db.batch([
    db
      .insert(categories)
      .values(
        seedCategories.map((c) => ({
          slug: c.slug,
          name: c.name,
          imageUrl: c.imageUrl ?? null,
          imageAlt: c.imageAlt ?? null,
          featured: c.featured,
          sortOrder: c.sortOrder,
        })),
      )
      .onConflictDoUpdate({
        target: categories.slug,
        set: {
          name: excluded(categories.name),
          imageUrl: excluded(categories.imageUrl),
          imageAlt: excluded(categories.imageAlt),
          featured: excluded(categories.featured),
          sortOrder: excluded(categories.sortOrder),
        },
      }),

    db
      .insert(products)
      .values(
        seedProducts.map((p, index) => ({
          slug: p.slug,
          sku: p.sku,
          name: p.name,
          categoryId: sql`(select id from ${categories} where ${categories.name} = ${p.category} limit 1)`,
          priceCents: p.price,
          description: p.description,
          details: p.details,
          images: p.images,
          colors: p.colors,
          createdAt: new Date(NEWEST - index * HOUR),
        })),
      )
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          sku: excluded(products.sku),
          name: excluded(products.name),
          categoryId: excluded(products.categoryId),
          priceCents: excluded(products.priceCents),
          description: excluded(products.description),
          details: excluded(products.details),
          images: excluded(products.images),
          colors: excluded(products.colors),
          createdAt: excluded(products.createdAt),
          updatedAt: sql`now()`,
        },
      }),

    db
      .delete(productStock)
      .where(
        inArray(
          productStock.productId,
          db.select({ id: products.id }).from(products).where(inArray(products.slug, productSlugs)),
        ),
      ),

    db.insert(productStock).values(
      seedProducts.flatMap((p) =>
        p.sizes.map((size, index) => ({
          productId: sql`(select id from ${products} where ${products.slug} = ${p.slug})`,
          size: size.label,
          quantity: size.stock,
          sortOrder: index,
        })),
      ),
    ),
  ]);

  const [[categoryCount], [productCount], [stockCount]] = await db.batch([
    db.select({ n: count() }).from(categories),
    db.select({ n: count() }).from(products),
    db.select({ n: count() }).from(productStock),
  ]);

  console.log(
    `Seeded catalog: ${categoryCount.n} categories, ${productCount.n} products, ${stockCount.n} stock rows.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
