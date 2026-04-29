import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "quiet";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-primary bg-primary text-on-primary hover:border-accent-blue",
  secondary:
    "border-border bg-surface text-fg hover:border-primary hover:bg-surface-2",
  ghost:
    "border-transparent bg-transparent text-fg-muted hover:bg-surface-2 hover:text-fg",
  quiet:
    "border-border bg-surface-2 text-fg hover:border-primary hover:bg-surface",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 gap-2 px-4 text-sm",
  md: "h-12 gap-2.5 px-5 text-sm",
  lg: "h-14 gap-3 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      leadingIcon,
      trailingIcon,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-button border font-display font-700 tracking-tight outline-none",
        "transition-[background-color,border-color,color,transform] duration-200 ease-alive",
        "active:scale-[0.985] focus-visible:border-primary focus-visible:bg-surface-2",
        "disabled:pointer-events-none disabled:scale-100 disabled:text-fg-muted",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-surface" /> : leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </button>
  ),
);

Button.displayName = "Button";