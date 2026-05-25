import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type DividerProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

/**
 * `<Divider>` — hairline separator. Uses the `--divider` token so it
 * tracks theme automatically. Never use a `<hr>` for layout.
 */
export function Divider({
  orientation = "horizontal",
  className,
  ...rest
}: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-divider",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...rest}
    />
  );
}
