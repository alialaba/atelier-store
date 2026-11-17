"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { ArrowRightIcon } from "@/components/icons";
import { Media } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { CatalogImage } from "@/lib/product";

// Full class strings per breakpoint so Tailwind can detect them.
const layouts = {
  md: {
    root: "md:flex-row-reverse md:items-start",
    thumbs: "md:w-16 md:flex-col md:px-0",
    thumb: "md:w-full",
    counter: "md:hidden",
  },
  lg: {
    root: "lg:flex-row-reverse lg:items-start",
    thumbs: "lg:w-20 lg:flex-col lg:px-0",
    thumb: "lg:w-full",
    counter: "lg:hidden",
  },
} as const;

type ProductGalleryProps = {
  images: CatalogImage[];
  /** `sizes` for the main image. */
  sizes: string;
  /** Preload the first image (use for the above-the-fold product page gallery). */
  preload?: boolean;
  /** Breakpoint at which thumbnails move from a row below to a rail on the left. */
  railFrom?: keyof typeof layouts;
  className?: string;
};

/**
 * One large image with selectable thumbnails. The main image is a swipeable,
 * snap-scrolling track; thumbnails and arrows scroll it, and scrolling keeps
 * the active thumbnail in sync.
 */
export function ProductGallery({
  images,
  sizes,
  preload = false,
  railFrom = "lg",
  className,
}: ProductGalleryProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const layout = layouts[railFrom];
  const count = images.length;

  function show(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const next = (index + count) % count;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: next * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
    setActive(next);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== active) setActive(index);
  }

  return (
    <div className={cn("flex flex-col gap-3", layout.root, className)}>
      <div className="relative min-w-0 flex-1">
        <ul
          ref={trackRef}
          onScroll={handleScroll}
          aria-label="Product images"
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        >
          {images.map((image, index) => (
            <li
              key={image.src}
              aria-label={`Image ${index + 1} of ${count}`}
              className="w-full shrink-0 snap-center"
            >
              <Media ratio="product">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={sizes}
                  preload={preload && index === 0}
                />
              </Media>
            </li>
          ))}
        </ul>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => show(active - 1)}
              aria-label="Previous image"
              className="btn-icon absolute top-1/2 left-2 inline-flex -translate-y-1/2 items-center justify-center bg-canvas/80 transition-colors hover:bg-canvas"
            >
              <ArrowRightIcon className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => show(active + 1)}
              aria-label="Next image"
              className="btn-icon absolute top-1/2 right-2 inline-flex -translate-y-1/2 items-center justify-center bg-canvas/80 transition-colors hover:bg-canvas"
            >
              <ArrowRightIcon />
            </button>
            <p
              aria-hidden="true"
              className={cn(
                "absolute right-3 bottom-3 bg-canvas/80 px-2 py-1 type-caption",
                layout.counter,
              )}
            >
              {active + 1} / {count}
            </p>
          </>
        )}
      </div>

      {count > 1 && (
        <ul aria-label="Choose image" className={cn("flex gap-2 px-4", layout.thumbs)}>
          {images.map((image, index) => (
            <li key={image.src} className={cn("w-16", layout.thumb)}>
              <button
                type="button"
                onClick={() => show(index)}
                aria-label={`Show image ${index + 1} of ${count}`}
                aria-current={index === active}
                className={cn(
                  "block w-full border p-0.5 transition-colors",
                  index === active ? "border-ink" : "border-transparent hover:border-line",
                )}
              >
                <Media ratio="product">
                  <Image src={image.src} alt="" fill sizes="80px" />
                </Media>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
