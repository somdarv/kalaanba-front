"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import { File as FileIcon, Trash, UploadSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

/**
 * FileUpload — drag/drop or click-to-pick dropzone for arbitrary
 * files. Stateless w.r.t. the upload itself: consumer drives `value`
 * (an array of `File` objects) and decides what to do on upload.
 *
 * Visual recipe: rounded-card dashed border on `bg-surface-2`, with a
 * brand-tinted state when files are dragged over it. Selected files
 * list as a vertical stack of rows with size + remove button.
 *
 * Mobile: the underlying `<input>` accepts taps so the native picker
 * (camera roll, files app) opens on iOS/Android automatically.
 */

export type FileUploadProps = {
  value: File[];
  onChange: (next: File[]) => void;
  label?: string;
  hint?: string;
  error?: string;
  accept?: string;
  /** Max files; 1 = single. Defaults to many. */
  maxFiles?: number;
  /** Max size per file in bytes. Rejected files surface as `error`. */
  maxSize?: number;
  disabled?: boolean;
  name?: string;
  /** Override the dropzone copy. */
  prompt?: ReactNode;
  /** Optional sub-line under the prompt. */
  subPrompt?: ReactNode;
};

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function FileUpload({
  value,
  onChange,
  label,
  hint,
  error,
  accept,
  maxFiles = Infinity,
  maxSize,
  disabled,
  name,
  prompt,
  subPrompt,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const fieldId = useId();
  const msgId = `${fieldId}-msg`;
  const shownError = error ?? internalError;
  const hasError = Boolean(shownError);

  const ingest = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setInternalError(null);
      const next: File[] = [...value];
      const errors: string[] = [];
      Array.from(files).forEach((f) => {
        if (maxSize && f.size > maxSize) {
          errors.push(`${f.name} exceeds ${formatBytes(maxSize)}.`);
          return;
        }
        if (next.length >= maxFiles) {
          errors.push(`Maximum ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`);
          return;
        }
        next.push(f);
      });
      onChange(next);
      if (errors.length && errors[0]) setInternalError(errors[0]);
    },
    [maxFiles, maxSize, onChange, value],
  );

  const handlePick = (e: ChangeEvent<HTMLInputElement>) => {
    ingest(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    ingest(e.dataTransfer.files);
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={fieldId}
          className={cn(
            "mb-1.5 block text-sm font-medium",
            hasError ? "text-danger" : "text-fg",
          )}
        >
          {label}
        </label>
      ) : null}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        data-error={hasError || undefined}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-card px-6 py-10",
          "border-[1.5px] border-dashed border-border-strong bg-surface-2 text-center",
          "transition-[background-color,border-color,box-shadow] duration-quick ease-out",
          "hover:border-fg-muted hover:bg-(--hover-overlay)",
          "data-dragging:border-primary data-dragging:bg-surface-elev data-dragging:shadow-sm",
          "data-error:border-danger",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        )}
      >
        <span
          aria-hidden
          className="grid size-12 place-items-center rounded-full bg-surface-elev text-fg-muted"
        >
          <UploadSimple size={22} weight="bold" />
        </span>
        <div className="text-sm text-fg">
          {prompt ?? (
            <>
              <button
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                className={cn(
                  "font-semibold text-primary",
                  "transition-opacity duration-quick ease-out hover:opacity-80",
                  "focus-visible:outline-none focus-visible:underline",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                Click to upload
              </button>{" "}
              <span className="text-fg-muted">or drag &amp; drop</span>
            </>
          )}
        </div>
        {subPrompt ?? (
          <p className="text-xs text-fg-muted">
            {accept ? `Accepted: ${accept}` : "Any file type"}
            {maxSize ? ` · up to ${formatBytes(maxSize)} each` : null}
          </p>
        )}

        <input
          ref={inputRef}
          id={fieldId}
          name={name}
          type="file"
          accept={accept}
          multiple={maxFiles !== 1}
          disabled={disabled}
          onChange={handlePick}
          className="sr-only"
        />
      </div>

      {value.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {value.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className={cn(
                "flex items-center gap-3 rounded-card border-[0.5px] border-border bg-surface-2 px-3 py-2",
              )}
            >
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-card bg-surface-elev text-fg-muted"
              >
                <FileIcon size={18} weight="bold" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{f.name}</p>
                <p className="text-xs text-fg-muted">{formatBytes(f.size)}</p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                disabled={disabled}
                onClick={() => remove(i)}
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full text-fg-muted",
                  "transition-colors duration-quick ease-out",
                  "hover:bg-(--hover-overlay) hover:text-danger",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                  "disabled:cursor-not-allowed",
                )}
              >
                <Trash size={16} weight="bold" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {shownError || hint ? (
        <p
          id={msgId}
          className={cn(
            "mt-1.5 text-xs",
            hasError ? "text-danger" : "text-fg-muted",
          )}
        >
          {shownError ?? hint}
        </p>
      ) : null}
    </div>
  );
}
