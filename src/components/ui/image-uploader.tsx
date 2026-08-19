"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { ImageSquare, Trash, UploadSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

/**
 * ImageUploader — single-image preview uploader.
 *
 * Optimized for avatar / banner / club-crest workflows. When a file is
 * selected, the dropzone is replaced by a preview tile with a Trash
 * action overlaid in the corner.
 *
 * Variants:
 *  - `shape="square"` (default) — rounded-card preview, good for crests.
 *  - `shape="circle"` — circular preview, good for avatars.
 *  - `shape="banner"` — 16:5 banner tile.
 *
 * Consumers control the `value: File | null`. Preview is generated via
 * `URL.createObjectURL` and revoked on change/unmount.
 */

export type ImageUploaderProps = {
  value: File | null;
  onChange: (next: File | null) => void;
  label?: string;
  hint?: string;
  error?: string;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  shape?: "square" | "circle" | "banner";
  /** Visual size of the preview tile in CSS-friendly units (e.g. "10rem"). */
  size?: string;
  name?: string;
};

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function ImageUploader({
  value,
  onChange,
  label,
  hint,
  error,
  accept = "image/*",
  maxSize,
  disabled,
  shape = "square",
  size = "10rem",
  name,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fieldId = useId();
  const msgId = `${fieldId}-msg`;
  const shownError = error ?? internalError;
  const hasError = Boolean(shownError);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const accept1 = useCallback(
    (file: File | null) => {
      setInternalError(null);
      if (!file) {
        onChange(null);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setInternalError("Only images are allowed.");
        return;
      }
      if (maxSize && file.size > maxSize) {
        setInternalError(`Image exceeds ${formatBytes(maxSize)}.`);
        return;
      }
      onChange(file);
    },
    [maxSize, onChange],
  );

  const handlePick = (e: ChangeEvent<HTMLInputElement>) => {
    accept1(e.target.files?.[0] ?? null);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    accept1(e.dataTransfer.files?.[0] ?? null);
  };

  const shapeClass =
    shape === "circle"
      ? "rounded-pill aspect-square"
      : shape === "banner"
        ? "rounded-card aspect-[16/5] w-full"
        : "rounded-card aspect-square";

  const tileStyle =
    shape === "banner" ? undefined : ({ width: size, height: size } as const);

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={fieldId}
          className={cn(
            "mb-1.5 block text-sm font-medium",
            hasError ? "text-danger-ink" : "text-fg",
          )}
        >
          {label}
        </label>
      ) : null}

      {value && previewUrl ? (
        <div
          style={tileStyle}
          className={cn(
            "relative overflow-hidden bg-surface-elev",
            "border-[0.5px] border-border-strong",
            shapeClass,
          )}
        >
          <img
            src={previewUrl}
            alt={value.name}
            className="size-full object-cover"
          />
          <button
            type="button"
            aria-label="Remove image"
            disabled={disabled}
            onClick={() => onChange(null)}
            className={cn(
              "absolute right-2 top-2 grid size-9 place-items-center rounded-pill",
              "bg-surface-elev text-fg shadow-sm",
              "border-[0.5px] border-border",
              "transition-colors duration-quick ease-out",
              "hover:bg-surface hover:text-danger-ink",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <Trash size={16} weight="bold" />
          </button>
        </div>
      ) : (
        <div
          style={tileStyle}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          data-error={hasError || undefined}
          data-dragging={dragging || undefined}
          data-disabled={disabled || undefined}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2",
            "border-[1.5px] border-dashed border-border-strong bg-surface-elev text-center",
            "transition-[background-color,border-color,box-shadow] duration-quick ease-out",
            "hover:border-fg-muted hover:bg-(--hover-overlay)",
            "data-dragging:border-primary-ink data-dragging:bg-surface-elev data-dragging:shadow-sm",
            "data-error:border-danger-ink",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring",
            "data-disabled:cursor-not-allowed data-disabled:opacity-50",
            !disabled && "cursor-pointer",
            shapeClass,
          )}
        >
          <span
            aria-hidden
            className="grid size-10 place-items-center rounded-pill bg-surface-elev text-fg-muted"
          >
            {shape === "banner" ? (
              <UploadSimple size={18} weight="bold" />
            ) : (
              <ImageSquare size={18} weight="bold" />
            )}
          </span>
          <p className="text-xs font-medium text-fg-muted">
            {shape === "banner" ? "Upload banner" : "Upload image"}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        id={fieldId}
        name={name}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handlePick}
        className="sr-only"
      />

      {shownError || hint ? (
        <p
          id={msgId}
          className={cn(
            "mt-1.5 text-xs",
            hasError ? "text-danger-ink" : "text-fg-muted",
          )}
        >
          {shownError ?? hint}
        </p>
      ) : null}
    </div>
  );
}
