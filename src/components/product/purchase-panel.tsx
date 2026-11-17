"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Button, ButtonLink } from "@/components/ui";
import { addToBag } from "@/lib/bag";
import { cn } from "@/lib/cn";
import {
  isOneSize,
  stockStatus,
  totalStock,
  type Product,
  type StockStatus,
} from "@/lib/product";

const statusTone: Record<StockStatus["level"], { text: string; dot: string }> = {
  in: { text: "text-success", dot: "bg-success" },
  low: { text: "text-ink", dot: "bg-ink" },
  out: { text: "text-danger", dot: "bg-danger" },
};

type PurchasePanelProps = {
  product: Product;
  /** `compact` adds a link to the full product page (used in quick view). */
  layout?: "compact" | "full";
};

/** Colour, size, stock status and add-to-bag. Shared by quick view and the product page. */
export function PurchasePanel({ product, layout = "full" }: PurchasePanelProps) {
  const id = useId();
  const oneSize = isOneSize(product);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(
    oneSize ? product.sizes[0].label : null,
  );
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const selectedSize = product.sizes.find((s) => s.label === size);
  const soldOut = totalStock(product) === 0;
  const status = stockStatus(selectedSize ? selectedSize.stock : totalStock(product));
  const tone = statusTone[status.level];

  function handleAdd() {
    if (!size) {
      setError("Please select a size.");
      return;
    }
    addToBag({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      color,
      size,
      image: product.images[0].src,
    });
    setError(null);
    setAdded(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="flex flex-col gap-6">
      {product.colors.length > 0 && (
        <fieldset>
          <legend className="mb-3 type-label">
            Colour: <span className="font-regular tracking-normal normal-case">{color}</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((option) => (
              <label key={option.name} className="cursor-pointer" title={option.name}>
                <input
                  type="radio"
                  name={`${id}-colour`}
                  value={option.name}
                  checked={color === option.name}
                  onChange={() => setColor(option.name)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="block size-7 rounded-full border border-line-faint outline-offset-2 transition-[outline-color] peer-checked:outline peer-checked:outline-ink peer-focus-visible:outline-2 peer-focus-visible:outline-ink"
                  style={{ backgroundColor: option.hex }}
                />
                <span className="sr-only">{option.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {oneSize ? (
        <p className="type-body-sm text-ink-muted">Size: {product.sizes[0].label}</p>
      ) : (
        <fieldset aria-describedby={error ? `${id}-error` : undefined}>
          <legend className="mb-3 type-label">
            Size
            {size && (
              <>
                : <span className="font-regular tracking-normal normal-case">{size}</span>
              </>
            )}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((option) => {
              const unavailable = option.stock === 0;
              return (
                <label key={option.label}>
                  <input
                    type="radio"
                    name={`${id}-size`}
                    value={option.label}
                    checked={size === option.label}
                    disabled={unavailable}
                    onChange={() => {
                      setSize(option.label);
                      setError(null);
                    }}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "flex h-10 min-w-12 cursor-pointer items-center justify-center border border-line px-3 type-body-sm transition-colors",
                      "hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white",
                      "peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
                      "peer-disabled:cursor-not-allowed peer-disabled:border-line peer-disabled:text-ink-disabled peer-disabled:line-through",
                    )}
                  >
                    {option.label}
                  </span>
                  {unavailable && <span className="sr-only">, out of stock</span>}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <p className={cn("flex items-center gap-2 type-body-sm", tone.text)}>
        <span aria-hidden="true" className={cn("size-2 rounded-full", tone.dot)} />
        {status.label}
      </p>

      <div className="flex flex-col gap-3">
        <Button variant="primary" size="lg" fullWidth onClick={handleAdd} disabled={soldOut}>
          {soldOut ? "Out of stock" : added ? "Added to bag" : "Add to bag"}
        </Button>
        {error && (
          <p id={`${id}-error`} role="alert" className="type-body-sm text-danger">
            {error}
          </p>
        )}
        {layout === "compact" && (
          <ButtonLink href={`/products/${product.slug}`} variant="secondary" size="lg" fullWidth>
            View full details
          </ButtonLink>
        )}
        <p aria-live="polite" className="sr-only">
          {added ? `${product.name}, ${color}, ${size}, added to bag.` : ""}
        </p>
      </div>
    </div>
  );
}
