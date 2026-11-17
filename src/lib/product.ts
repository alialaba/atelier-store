/*
 * Product types and pure helpers. Safe to import from client components
 * (unlike catalog.ts, which carries the sample data set).
 */

export type CatalogImage = {
  src: string;
  alt: string;
};

/** A linked image tile: a homepage category or department. */
export type Collection = {
  slug: string;
  title: string;
  href: string;
  image: CatalogImage;
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductSize = {
  label: string;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  /** Price in minor units (cents). */
  price: number;
  description: string;
  details: string[];
  /** Gallery, in display order. [0] is the primary shot, [1] the hover/alternate shot. */
  images: CatalogImage[];
  colors: ProductColor[];
  sizes: ProductSize[];
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(minorUnits: number): string {
  return priceFormatter.format(minorUnits / 100);
}

export const LOW_STOCK_THRESHOLD = 3;

export type StockStatus = {
  level: "in" | "low" | "out";
  label: string;
};

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return { level: "out", label: "Out of stock" };
  if (stock <= LOW_STOCK_THRESHOLD) {
    return { level: "low", label: `Low stock: only ${stock} left` };
  }
  return { level: "in", label: "In stock" };
}

export function totalStock(product: Product): number {
  return product.sizes.reduce((sum, size) => sum + size.stock, 0);
}

/** True when the product has a single size, which is selected implicitly. */
export function isOneSize(product: Product): boolean {
  return product.sizes.length === 1;
}
