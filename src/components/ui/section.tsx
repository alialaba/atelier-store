import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

const spacings = {
  default: "section-y",
  /** For a section that follows another padded section directly. */
  bottom: "pb-(--section-space)",
  none: "",
} as const;

const tones = {
  canvas: "bg-canvas text-ink",
  surface: "bg-surface text-ink",
  ink: "bg-ink text-white",
} as const;

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  spacing?: keyof typeof spacings;
  tone?: keyof typeof tones;
};

/** Vertical rhythm block. Put a Container inside for horizontal bounds. */
export function Section({
  spacing = "default",
  tone = "canvas",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(spacings[spacing], tones[tone], className)}
      {...props}
    />
  );
}
