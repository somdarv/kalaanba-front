"use client";

/* =====================================================================
   KX TRACK 2 · SURFACES & NAVIGATION
     - KxTabsUnderline    (sliding pink underline tabs)
     - KxDrawer           (right side-sheet, esc/backdrop close)
     - KxCommandPalette   (⌘K palette over a backdrop)
     - KxEmptyState       (branded empty surface w/ tinted wash)
   All scoped under .kx-root. No portals — fixed positioning + z-index.
   ===================================================================== */

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* --------------------------- KxTabsUnderline --------------------------- */

export function KxTabsUnderline<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (next: T) => void;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [bar, setBar] = useState<{ x: number; w: number }>({ x: 0, w: 0 });

  useLayoutEffect(() => {
    const node = btnRefs.current[value];
    const track = trackRef.current;
    if (!node || !track) return;
    const tBox = track.getBoundingClientRect();
    const nBox = node.getBoundingClientRect();
    setBar({ x: nBox.left - tBox.left, w: nBox.width });
  }, [value, items]);

  return (
    <div
      ref={trackRef}
      role="tablist"
      className={cn(
        "relative inline-flex items-center gap-1 border-b border-[var(--kx-border)]",
        className,
      )}
    >
      {items.map((it) => {
        const active = value === it.value;
        return (
          <button
            key={it.value}
            ref={(el) => {
              btnRefs.current[it.value] = el;
            }}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.value)}
            className={cn(
              "relative inline-flex h-10 items-center gap-2 px-3 text-[13px] font-semibold cursor-pointer outline-none",
              "transition-colors duration-200 ease-[var(--kx-ease)]",
              active ? "text-[var(--kx-fg)]" : "text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)]",
              "focus-visible:shadow-[0_0_0_3px_var(--kx-ring)] rounded-md",
            )}
          >
            {it.icon}
            <span>{it.label}</span>
          </button>
        );
      })}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-px h-[2px] rounded-full bg-[var(--kx-pink)] shadow-[0_0_12px_var(--kx-ring)]"
        style={{
          width: `${bar.w}px`,
          transform: `translateX(${bar.x}px)`,
          transition: "transform 320ms var(--kx-ease-out), width 320ms var(--kx-ease-out)",
        }}
      />
    </div>
  );
}

/* --------------------------- KxDrawer --------------------------- */
/* Right-side sheet on >sm, bottom sheet on <sm. Closes on Escape and
   on backdrop click. Composes its own header w/ title + close. */

export function KxDrawer({
  open,
  onClose,
  title,
  children,
  footer,
  width = 420,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[80] flex items-end justify-end sm:items-stretch",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <button
        aria-label="Close drawer"
        onClick={onClose}
        className={cn(
          "absolute inset-0 cursor-default bg-[color-mix(in_oklab,black_42%,transparent)] backdrop-blur-[3px] transition-opacity duration-300 ease-[var(--kx-ease)]",
          open ? "opacity-100" : "opacity-0",
        )}
        tabIndex={open ? 0 : -1}
      />
      {/* Sheet */}
      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative ml-auto flex h-[88vh] w-full flex-col overflow-hidden rounded-t-[var(--kx-r-card)] bg-[var(--kx-card)]",
          "sm:h-full sm:rounded-l-[var(--kx-r-card)] sm:rounded-tr-none sm:rounded-br-none",
          "border border-[var(--kx-border)] shadow-[var(--kx-shadow-lg)]",
          "transition-transform duration-300 ease-[var(--kx-ease-out)]",
          open
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-y-0 sm:translate-x-full",
        )}
        style={{ maxWidth: `${width}px` }}
      >
        {/* Gradient hairline (matches modal language) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] sm:left-0 sm:top-0 sm:h-full sm:w-[2px] sm:bg-gradient-to-b sm:from-[var(--kx-pink)] sm:via-transparent sm:to-[var(--kx-blue)]"
          style={{
            background:
              "linear-gradient(90deg, var(--kx-pink), transparent 50%, var(--kx-blue))",
          }}
        />
        {/* Mobile grab handle */}
        <span
          aria-hidden
          className="mx-auto mt-2 block h-1.5 w-10 rounded-full bg-[var(--kx-card-2)] sm:hidden"
        />
        <header className="flex items-center justify-between gap-3 px-6 pt-5 pb-3">
          <h3 className="[font-family:var(--kx-font-display)] text-[18px] font-extrabold tracking-tight text-[var(--kx-fg)]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-grid h-8 w-8 place-items-center rounded-full text-[var(--kx-fg-muted)] hover:bg-[var(--kx-card-2)] hover:text-[var(--kx-fg)] transition-colors cursor-pointer"
          >
            <X size={16} weight="bold" />
          </button>
        </header>
        <div className="kx-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-4">{children}</div>
        {footer ? (
          <footer className="border-t border-[var(--kx-border)] bg-[var(--kx-card-2)] px-6 py-4">
            {footer}
          </footer>
        ) : null}
      </aside>
    </div>
  );
}

/* --------------------------- KxCommandPalette --------------------------- */
/* Quick palette. Pass a flat list of items, optionally grouped by `group`.
   Filters by `label` (case-insensitive substring). Arrow keys navigate;
   Enter selects; Escape closes. */

export type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  icon?: ReactNode;
};

export function KxCommandPalette({
  open,
  onClose,
  items,
  onSelect,
  placeholder = "Search teams, players, fixtures…",
}: {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  onSelect: (item: CommandItem) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((i) => i.label.toLowerCase().includes(needle));
  }, [q, items]);

  // group preserving order of first occurrence
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const it of filtered) {
      const g = it.group ?? "Results";
      const arr = map.get(g) ?? [];
      arr.push(it);
      map.set(g, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // flat index of current active for keyboard nav
  const flat = filtered;

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = flat[active];
      if (pick) {
        onSelect(pick);
        onClose();
      }
    }
  }

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <button
        aria-label="Close palette"
        onClick={onClose}
        className={cn(
          "absolute inset-0 cursor-default bg-[color-mix(in_oklab,black_42%,transparent)] backdrop-blur-[3px] transition-opacity duration-300 ease-[var(--kx-ease)]",
          open ? "opacity-100" : "opacity-0",
        )}
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-xl overflow-hidden rounded-[var(--kx-r-card)] bg-[var(--kx-card)] shadow-[var(--kx-shadow-lg)]",
          "transition-[opacity,transform] duration-300 ease-[var(--kx-ease-out)]",
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
          style={{
            WebkitMaskImage:
              "linear-gradient(180deg, #000 0%, transparent 70%)",
            maskImage:
              "linear-gradient(180deg, #000 0%, transparent 70%)",
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-[inherit]"
            style={{
              padding: "1px",
              background:
                "linear-gradient(90deg, var(--kx-pink), transparent 50%, var(--kx-blue))",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              maskComposite: "exclude",
            }}
          />
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[var(--kx-border)]"
          style={{
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, #000 70%)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, #000 70%)",
          }}
        />
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--kx-border)]">
          <MagnifyingGlass size={18} weight="bold" className="text-[var(--kx-fg-muted)]" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKey}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-[14px] text-[var(--kx-fg)] outline-none placeholder:text-[var(--kx-fg-muted)]"
          />
          <span className="hidden rounded-md border border-[var(--kx-border)] bg-[var(--kx-card-2)] px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-[var(--kx-fg-muted)] sm:inline">
            ESC
          </span>
        </div>

        <div className="kx-scroll max-h-[50vh] overflow-y-auto py-2">
          {flat.length === 0 ? (
            <div className="px-5 py-10 text-center text-[13px] text-[var(--kx-fg-muted)]">
              Nothing matches “{q}”.
            </div>
          ) : (
            grouped.map(([group, list]) => (
              <div key={group} className="px-2 py-1">
                <div className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--kx-fg-muted)]">
                  {group}
                </div>
                {list.map((it) => {
                  const flatIdx = flat.indexOf(it);
                  const isActive = flatIdx === active;
                  return (
                    <button
                      key={it.id}
                      onMouseEnter={() => setActive(flatIdx)}
                      onClick={() => {
                        onSelect(it);
                        onClose();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[var(--kx-r-tile)] px-3 py-2 text-left cursor-pointer",
                        isActive ? "bg-[var(--kx-card-2)]" : "bg-transparent",
                      )}
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--kx-card-2)] text-[var(--kx-fg-muted)]">
                        {it.icon ?? <MagnifyingGlass size={12} weight="bold" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-[var(--kx-fg)]">
                          {it.label}
                        </span>
                        {it.hint ? (
                          <span className="block truncate text-[11.5px] text-[var(--kx-fg-muted)]">
                            {it.hint}
                          </span>
                        ) : null}
                      </span>
                      {isActive ? (
                        <span className="rounded-md border border-[var(--kx-border)] bg-[var(--kx-card)] px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-[var(--kx-fg-muted)]">
                          ↵
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- KxEmptyState --------------------------- */

export function KxEmptyState({
  icon,
  title,
  description,
  action,
  tone = "pink",
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "pink" | "blue";
  className?: string;
}) {
  const accent = tone === "blue" ? "var(--kx-blue)" : "var(--kx-pink)";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
        "bg-[var(--kx-card)] p-8 text-center shadow-[var(--kx-shadow-md)]",
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, ${accent} 14%, transparent) 0%, transparent 60%)`,
      }}
    >
      {icon ? (
        <div
          className="mx-auto grid h-12 w-12 place-items-center rounded-full"
          style={{
            background: `color-mix(in oklab, ${accent} 18%, transparent)`,
            color: accent,
          }}
        >
          {icon}
        </div>
      ) : null}
      <h3 className="mt-4 [font-family:var(--kx-font-display)] text-[18px] font-extrabold tracking-tight text-[var(--kx-fg)]">
        {title}
      </h3>
      {description ? (
        <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-[var(--kx-fg-muted)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5 inline-flex justify-center">{action}</div> : null}
    </div>
  );
}
