"use client";

import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { BagPlusIcon, CloseIcon } from "@/components/icons";
import { buttonClassName, LoadingDots, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatPrice, type Product } from "@/lib/product";

import { ProductGallery } from "./product-gallery";
import { PurchasePanel } from "./purchase-panel";

/** Keeps the loading state visible long enough to read as feedback, not a flicker. */
const MIN_LOADING_MS = 450;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type QuickViewButtonProps = {
  slug: string;
  name: string;
};

/**
 * Cart-icon button for product cards. Fetches the product, showing loading
 * dots in place of the icon, then opens it in a modal quick view.
 */
export function QuickViewButton({ slug, name }: QuickViewButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const loading = status === "loading";

  // Next keeps the previous page mounted but hidden after navigation (e.g. via
  // "View full details"); close the modal so it can't keep the page scroll-locked.
  useEffect(() => {
    const dialog = dialogRef.current;
    return () => dialog?.close();
  }, []);

  async function open() {
    if (loading) return;
    if (product) {
      dialogRef.current?.showModal();
      return;
    }

    setStatus("loading");
    try {
      const [response] = await Promise.all([
        fetch(`/api/products/${encodeURIComponent(slug)}`),
        wait(MIN_LOADING_MS),
      ]);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = (await response.json()) as Product;
      // Render the content before opening so focus lands inside it.
      flushSync(() => {
        setProduct(data);
        setStatus("idle");
      });
      dialogRef.current?.showModal();
    } catch {
      setStatus("error");
    }
  }

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-busy={loading}
        aria-label={
          status === "error"
            ? `Couldn't load ${name}. Try again`
            : `Quick view and add ${name} to bag`
        }
        className={cn(buttonClassName({ variant: "secondary", size: "icon" }), "shrink-0")}
      >
        {loading ? <LoadingDots label={`Loading ${name}`} /> : <BagPlusIcon />}
      </button>
      {status === "error" && (
        <span role="alert" className="sr-only">
          Couldn&apos;t load {name}. Please try again.
        </span>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="dialog-panel w-[min(100%-2rem,60rem)] max-h-[min(92svh,46rem)] overflow-y-auto overscroll-contain"
        onClick={(event) => {
          // Clicks on the backdrop land on the <dialog> element itself.
          if (event.target === event.currentTarget) close();
        }}
      >
        {product && (
          <QuickViewContent product={product} titleId={titleId} onClose={close} />
        )}
      </dialog>
    </>
  );
}

function QuickViewContent({
  product,
  titleId,
  onClose,
}: {
  product: Product;
  titleId: string;
  onClose: () => void;
}) {
  return (
    <div className="relative grid md:grid-cols-2">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close quick view"
        className="btn-icon absolute top-1 right-1 z-10 inline-flex items-center justify-center transition-opacity hover:opacity-60"
      >
        <CloseIcon />
      </button>

      <ProductGallery
        images={product.images}
        sizes="(min-width: 768px) 26rem, 100vw"
        railFrom="md"
        className="md:py-6 md:pl-6"
      />

      <div className="flex flex-col gap-6 px-5 pt-6 pb-8 md:px-10 md:pt-12 md:pb-10">
        <div className="flex flex-col gap-2 pr-10">
          <Text variant="caption" tone="subtle" className="uppercase">
            {product.category}
          </Text>
          <h2 id={titleId} className="type-h2">
            {product.name}
          </h2>
          <Text variant="caption" tone="subtle">
            SKU {product.sku}
          </Text>
        </div>
        <p className="text-lg font-medium">{formatPrice(product.price)}</p>
        <div className="border-t border-line pt-6">
          <PurchasePanel product={product} layout="compact" />
        </div>
      </div>
    </div>
  );
}
