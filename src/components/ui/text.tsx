import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/cn";

const variants = {
  body: "type-body",
  small: "type-body-sm",
  caption: "type-caption",
  label: "type-label",
} as const;

const tones = {
  default: "text-ink",
  muted: "text-ink-muted",
  subtle: "text-ink-subtle",
  inverse: "text-white",
  danger: "text-danger",
  success: "text-success",
} as const;

type TextProps<T extends ElementType> = {
  as?: T;
  variant?: keyof typeof variants;
  tone?: keyof typeof tones;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function Text<T extends ElementType = "p">({
  as,
  variant = "body",
  tone = "default",
  className,
  ...props
}: TextProps<T>) {
  const Component: ElementType = as ?? "p";
  return (
    <Component
      className={cn(variants[variant], tones[tone], className)}
      {...props}
    />
  );
}
