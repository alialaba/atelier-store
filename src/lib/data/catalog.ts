import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import type { categories, products, productStock } from "@/db/schema";
import type { Collection, Product } from "@/lib/product";

/*
 * Catalog reads. Every function is cached with the "catalog" tag; after a
 * write (e.g. a future admin or stock update), call `updateTag("catalog")`.
 * Stock changes, so entries expire within minutes rather than hours.
 */
const CATALOG_TAG = "catalog";

type ProductRow = typeof products.$inferSelect & {
  category: typeof categories.$inferSelect;
  stock: (typeof productStock.$inferSelect)[];
};

const productRelations = {
  category: true,
  stock: { orderBy: (stock, { asc }) => [asc(stock.sortOrder)] },
} satisfies NonNullable<Parameters<typeof db.query.products.findMany>[0]>["with"];

/** Maps a database row onto the storefront's `Product` shape. */
function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    category: row.category.name,
    price: row.priceCents,
    description: row.description,
    details: row.details,
    images: row.images,
    colors: row.colors,
    sizes: row.stock.map((entry) => ({ label: entry.size, stock: entry.quantity })),
  };
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("minutes");

  const rows = await db.query.products.findMany({
    with: productRelations,
    orderBy: (product, { desc }) => [desc(product.createdAt)],
    limit,
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("minutes");

  const row = await db.query.products.findFirst({
    where: (product, { eq }) => eq(product.slug, slug),
    with: productRelations,
  });
  return row ? toProduct(row) : null;
}

/** Products from the same category first, then the newest of the rest. */
export async function getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("minutes");

  const current = await db.query.products.findFirst({
    where: (product, { eq }) => eq(product.slug, slug),
    columns: { id: true, categoryId: true },
  });
  if (!current) return [];

  const rows = await db.query.products.findMany({
    where: (product, { ne }) => ne(product.id, current.id),
    with: productRelations,
    orderBy: (product, { desc, sql }) => [
      sql`case when ${product.categoryId} = ${current.categoryId} then 0 else 1 end`,
      desc(product.createdAt),
    ],
    limit,
  });
  return rows.map(toProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("minutes");

  const rows = await db.query.products.findMany({ columns: { slug: true } });
  return rows.map((row) => row.slug);
}

/** Categories flagged as featured, shaped as homepage tiles. */
export async function getFeaturedCategories(): Promise<Collection[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("minutes");

  const rows = await db.query.categories.findMany({
    where: (category, { eq }) => eq(category.featured, true),
    orderBy: (category, { asc }) => [asc(category.sortOrder)],
  });

  return rows.flatMap((category) =>
    category.imageUrl
      ? [
          {
            slug: category.slug,
            title: category.name,
            href: `/${category.slug}`,
            image: { src: category.imageUrl, alt: category.imageAlt ?? "" },
          },
        ]
      : [],
  );
}
