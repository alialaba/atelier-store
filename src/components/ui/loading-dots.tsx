import { cn } from "@/lib/cn";

const delays = ["0ms", "160ms", "320ms"];

/** Three pulsing dots in the current text colour. Announces `label` to screen readers. */
export function LoadingDots({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-1", className)}>
      {delays.map((delay) => (
        <span
          key={delay}
          aria-hidden="true"
          className="size-1.5 animate-dot-pulse rounded-full bg-current motion-reduce:animate-none"
          style={{ animationDelay: delay }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
}
