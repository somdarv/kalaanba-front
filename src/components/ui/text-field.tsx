import { type InputHTMLAttributes, type ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type TextFieldSize = "md" | "lg";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  inputSize?: TextFieldSize;
};

const sizeClasses: Record<TextFieldSize, string> = {
  md: "h-12",
  lg: "h-14",
};

export function TextField({
  className,
  label,
  hint,
  error,
  leftIcon,
  rightSlot,
  inputSize = "md",
  id,
  name,
  disabled,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? name;
  const messageId = fieldId ? `${fieldId}-message` : undefined;

  return (
    <label className={cn("block text-sm", disabled && "text-fg-muted", className)} htmlFor={fieldId}>
      {label ? <span className="mb-2 block font-display text-xs font-800 uppercase tracking-[0.12em] text-fg-muted">{label}</span> : null}
      <span
        className={cn(
          "group flex items-center gap-3 rounded-control border bg-surface px-4 text-fg",
          "transition-[background-color,border-color] duration-200 ease-alive",
          "focus-within:border-primary focus-within:bg-surface-2",
          error ? "border-primary" : "border-border hover:border-primary",
          sizeClasses[inputSize],
        )}
      >
        {leftIcon ? <span className="text-fg-muted transition-colors group-focus-within:text-primary">{leftIcon}</span> : null}
        <input
          id={fieldId}
          name={name}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted disabled:cursor-not-allowed"
          {...props}
        />
        {rightSlot ? <span className="shrink-0 text-fg-muted">{rightSlot}</span> : null}
      </span>
      {hint || error ? (
        <span id={messageId} className={cn("mt-2 block text-xs", error ? "text-primary" : "text-fg-muted")}>
          {error ?? hint}
        </span>
      ) : null}
    </label>
  );
}

export function SearchField(props: Omit<TextFieldProps, "leftIcon" | "type">) {
  return <TextField type="search" leftIcon={<Search className="h-4 w-4" />} {...props} />;
}