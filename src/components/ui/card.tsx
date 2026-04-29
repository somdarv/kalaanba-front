import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardTone = "surface" | "secondary" | "flat";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
  interactive?: boolean;
};

const toneClasses: Record<CardTone, string> = {
  surface: "border-border bg-surface",
  secondary: "border-border bg-surface-2",
  flat: "border-border bg-transparent",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, tone = "surface", interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-card border text-fg",
        interactive &&
          "transition-[background-color,border-color] duration-300 ease-alive hover:border-primary",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  ),
);

Card.displayName = "Card";

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start justify-between gap-4", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("font-display text-xl font-800 leading-tight tracking-normal text-fg", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-2 text-sm leading-6 text-fg-muted", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5 flex flex-wrap items-center gap-3", className)} {...props} />;
}