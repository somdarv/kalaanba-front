import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type IconButtonVariant = "primary" | "secondary" | "ghost";
type IconButtonSize = "sm" | "md" | "lg";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
};

const variantClasses: Record<IconButtonVariant, string> = {
  primary: "border-primary bg-primary text-on-primary hover:border-accent-blue",
  secondary: "border-border bg-surface text-fg-muted hover:border-primary hover:text-fg",
  ghost: "border-transparent bg-transparent text-fg-muted hover:bg-surface-2 hover:text-fg",
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-button border outline-none",
        "transition-[background-color,border-color,color,transform] duration-200 ease-alive",
        "active:scale-[0.965] focus-visible:border-primary focus-visible:bg-surface-2",
        "disabled:pointer-events-none disabled:text-fg-muted",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

IconButton.displayName = "IconButton";