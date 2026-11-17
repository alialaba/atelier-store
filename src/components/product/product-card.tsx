import Image from "next/image";
import Link from "next/link";

import { Media, Text } from "@/components/ui";
import { formatPrice, totalStock, type Product } from "@/lib/product";

import { QuickViewButton } from "./quick-view";

const cardSizes = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}`;
  const [primary, alternate] = product.images;
  const soldOut = totalStock(product) === 0;

  return (
    <article className="flex h-full flex-col">
      {/* Duplicate of the name link below, so it is hidden from keyboard and screen readers. */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="group/media block">
        <Media ratio="product">
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            sizes={cardSizes}
            className="transition-[opacity,scale] duration-700 group-hover/media:scale-[1.02]"
          />
          {alternate && (
            <Image
              src={alternate.src}
              alt=""
              fill
              sizes={cardSizes}
              className="scale-[1.04] opacity-0 transition-[opacity,scale] duration-700 group-hover/media:scale-100 group-hover/media:opacity-100"
            />
          )}
        </Media>
      </Link>

      <div className="flex flex-1 flex-col gap-0.5 px-3 pt-3 pb-1 md:px-4">
        <Text variant="caption" tone="subtle" className="uppercase">
          {product.category}
          {soldOut && <span className="text-danger"> · Out of stock</span>}
        </Text>
        <h3 className="type-body-sm">
          <Link href={href} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <Text variant="small" tone="muted">
            {formatPrice(product.price)}
          </Text>
          <QuickViewButton slug={product.slug} name={product.name} />
        </div>
      </div>
    </article>
  );
}
