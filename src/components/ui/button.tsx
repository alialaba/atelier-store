import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  inverse: "btn-inverse",
  text: "btn-text",
} as const;

const sizes = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
  icon: "btn-icon",
} as const;

export type ButtonStyleProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Stretch to the container width (typical for mobile and checkout CTAs). */
  fullWidth?: boolean;
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: ButtonStyleProps = {}) {
  return cn("btn", variants[variant], sizes[size], fullWidth && "w-full");
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & ButtonStyleProps;

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClassName({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> &
  ButtonStyleProps;

/** A navigation link styled as a button. */
export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonClassName({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}
