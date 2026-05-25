import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const SIZE_PX = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 } as const;

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: keyof typeof SIZE_PX;
  /** Aria label, only set when the spinner stands alone with no surrounding text. */
  label?: string;
};

/**
 * `<Spinner>` — silent loader. A 360° rotation on `<svg>` only.
 * Rotation is the one motion exception in Tier 0: it's not "movement",
 * it's the universal language for "we're working" (DESIGN_LANGUAGE §3.5).
 */
export function Spinner({
  size = "md",
  label,
  className,
  ...rest
}: SpinnerProps) {
  const px = SIZE_PX[size];
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-flex shrink-0 text-current", className)}
      {...rest}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin motion-reduce:animate-none"
        aria-hidden
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={2.5}
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
