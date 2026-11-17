import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

const tones = {
  default: "border-line",
  faint: "border-line-faint",
  strong: "border-line-strong",
} as const;

type DividerProps = ComponentPropsWithoutRef<"hr"> & {
  tone?: keyof typeof tones;
};

export function Divider({
  tone = "default",
  className,
  ...props
}: DividerProps) {
  return (
    <hr
      className={cn("border-0 border-t", tones[tone], className)}
      {...props}
    />
  );
}
