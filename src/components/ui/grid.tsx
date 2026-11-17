import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/cn";

// Full class strings so Tailwind can detect them.
const columns = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
} as const;

const gaps = {
  /** 1px hairline gutters, edge to edge: product listings. */
  hairline: "gap-x-(--grid-gap) gap-y-8",
  /** Roomy gutters: editorial tiles, content cards. */
  loose: "gap-x-4 gap-y-10 md:gap-x-6",
  none: "gap-0",
} as const;

type GridProps<T extends ElementType> = {
  as?: T;
  /** Column count at the widest breakpoint; steps down responsively to 2. */
  cols?: keyof typeof columns;
  gap?: keyof typeof gaps;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function Grid<T extends ElementType = "ul">({
  as,
  cols = 4,
  gap = "hairline",
  className,
  ...props
}: GridProps<T>) {
  const Component: ElementType = as ?? "ul";
  return (
    <Component
      className={cn("grid", columns[cols], gaps[gap], className)}
      {...props}
    />
  );
}
