import { forwardRef, type SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * `<Icon>` — minimal SVG wrapper that enforces the design system's
 * sizing scale and `aria-hidden` default. Pass `children` (a `<path>` etc.)
 * or wrap a `lucide-react` icon directly via the `as` slot.
 *
 * Sizes track the type scale (DESIGN_LANGUAGE §4):
 *   xs 12 · sm 16 · md 20 · lg 24 · xl 32
 */

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export type IconProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  size?: IconSize;
  /** Mark decorative (default) or interactive. Decorative icons hide from AT. */
  decorative?: boolean;
  label?: string;
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { size = "md", decorative = true, label, className, children, ...rest },
  ref,
) {
  const px = SIZE_PX[size];
  return (
    <svg
      ref={ref}
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      className={cn("shrink-0", className)}
      {...rest}
    >
      {children}
    </svg>
  );
});
