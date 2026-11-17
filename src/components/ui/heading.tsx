import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

const variants = {
  display: "type-display",
  h1: "type-h1",
  h2: "type-h2",
  h3: "type-h3",
  label: "type-label",
} as const;

type Level = 1 | 2 | 3 | 4 | 5 | 6;

const defaultVariant: Record<Level, keyof typeof variants> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h3",
  5: "label",
  6: "label",
};

type HeadingProps = ComponentPropsWithoutRef<"h2"> & {
  /** Semantic level for the document outline. */
  level?: Level;
  /** Visual role, independent of level. Defaults to match the level. */
  variant?: keyof typeof variants;
};

export function Heading({
  level = 2,
  variant,
  className,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(variants[variant ?? defaultVariant[level]], className)}
      {...props}
    />
  );
}
