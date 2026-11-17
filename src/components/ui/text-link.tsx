import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

const variants = {
  /** Underlined at rest; for links inside running copy. */
  inline: "link",
  /** Underline draws in on hover; for navigation and footers. */
  nav: "link-reveal",
} as const;

type TextLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: keyof typeof variants;
};

export function TextLink({
  variant = "inline",
  className,
  ...props
}: TextLinkProps) {
  return <Link className={cn(variants[variant], className)} {...props} />;
}
