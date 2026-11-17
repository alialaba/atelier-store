import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

const ratios = {
  product: "aspect-product",
  portrait: "aspect-portrait",
  square: "aspect-square",
  landscape: "aspect-landscape",
} as const;

type MediaProps = ComponentPropsWithoutRef<"div"> & {
  ratio?: keyof typeof ratios;
};

/**
 * Fixed-ratio frame on a neutral well. Put a `next/image` with `fill` (or an
 * img/video) inside; it is cropped to cover the frame.
 */
export function Media({ ratio = "product", className, ...props }: MediaProps) {
  return (
    <div className={cn("media-well", ratios[ratio], className)} {...props} />
  );
}
