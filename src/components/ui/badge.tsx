import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "primary" | "accent" | "neutral" | "live";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  withDot?: boolean;
};

const toneClasses: Record<BadgeTone, string> = {
  primary: "border-primary bg-surface text-primary",
  accent: "border-accent-blue bg-surface text-accent-blue",
  neutral: "border-border bg-surface-2 text-fg-muted",
  live: "border-primary bg-surface text-primary",
};

export function Badge({ className, tone = "neutral", withDot, children, ...props }: BadgeProps) {
  const showDot = withDot ?? tone === "live";

  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full border px-3 font-display text-[11px] font-800 uppercase tracking-[0.12em]",
        "transition-[background-color,border-color,color] duration-200 ease-alive hover:bg-surface-2",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {showDot ? (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="relative inline-flex h-2 w-2 animate-live-pulse rounded-full bg-current" />
        </span>
      ) : null}
      {children}
    </span>
  );
}