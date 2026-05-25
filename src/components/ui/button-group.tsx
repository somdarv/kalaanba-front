import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** Segmented vs spaced layout. */
  attached?: boolean;
};

/**
 * `<ButtonGroup>` — clusters buttons. `attached` joins them into a single
 * segmented control; otherwise it just sets a consistent gap.
 *
 * Note: when `attached`, the buttons themselves should override their
 * radii via `[&>button:not(:first-child):not(:last-child)]:rounded-none`
 * etc. We do that here so individual `<Button>`s stay unaware.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup({ attached, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex",
          attached
            ? cn(
                "isolate",
                "[&>*:not(:first-child)]:rounded-l-none",
                "[&>*:not(:last-child)]:rounded-r-none",
                "[&>*:not(:last-child)]:-mr-px",
              )
            : "gap-2",
          className,
        )}
        {...rest}
      />
    );
  },
);
