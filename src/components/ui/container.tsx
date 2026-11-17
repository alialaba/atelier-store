import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/cn";

const sizes = {
  page: "container-page",
  prose: "container-prose",
  bleed: "container-bleed",
} as const;

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: keyof typeof sizes;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/** Horizontal layout bound: `page` for content, `prose` for copy and forms, `bleed` for edge-to-edge media. */
export function Container<T extends ElementType = "div">({
  as,
  size = "page",
  className,
  ...props
}: ContainerProps<T>) {
  const Component: ElementType = as ?? "div";
  return <Component className={cn(sizes[size], className)} {...props} />;
}
