"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import {
  CaretLeft,
  CaretRight,
  CheckCircle,
  DotsThree,
  Info,
  WarningCircle,
  WarningOctagon,
  X,
} from "@phosphor-icons/react";

/* =====================================================================
   KX EXTRAS — Modal, Menu, Table, FixtureCard, Alert, Pagination, Chips
   Premium-but-quiet. All scoped under .kx-root. Light & dark via tokens.
   ===================================================================== */

/* --------------------------- KxAlert --------------------------- */
/* Distinct silhouette: full-height accent rail on the left, soft tinted
   plate on the right. No bordered-box cliché. */

type AlertTone = "info" | "success" | "warning" | "danger";

const ALERT_VAR: Record<AlertTone, string> = {
  info:    "var(--kx-blue)",
  success: "var(--kx-success)",
  warning: "var(--kx-warning)",
  danger:  "var(--kx-danger)",
};
const ALERT_ICON: Record<AlertTone, ReactNode> = {
  info:    <Info          size={18} weight="bold" />,
  success: <CheckCircle   size={18} weight="bold" />,
  warning: <WarningCircle size={18} weight="bold" />,
  danger:  <WarningOctagon size={18} weight="bold" />,
};

export function KxAlert({
  tone = "info",
  title,
  children,
  onDismiss,
  className,
  action,
}: {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
  onDismiss?: () => void;
  className?: string;
  action?: ReactNode;
}) {
  const c = ALERT_VAR[tone];
  return (
    <div
      role="status"
      className={cn(
        "relative flex items-stretch gap-3 overflow-hidden rounded-[var(--kx-r-btn)]",
        "bg-[var(--kx-card)] border border-[var(--kx-border)] shadow-[var(--kx-shadow-sm)]",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(110deg, color-mix(in oklab, ${c} 16%, transparent) 0%, color-mix(in oklab, ${c} 6%, transparent) 35%, transparent 75%)`,
      }}
    >
      <div className="flex flex-1 items-start gap-3 px-3 py-3">
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
          style={{
            background: `color-mix(in oklab, ${c} 22%, transparent)`,
            color: c,
          }}
        >
          {ALERT_ICON[tone]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold leading-snug text-[var(--kx-fg)]">
            {title}
          </div>
          {children ? (
            <div className="mt-0.5 text-[12.5px] leading-snug text-[var(--kx-fg-muted)]">
              {children}
            </div>
          ) : null}
        </div>
        {action ? <div className="shrink-0 self-center">{action}</div> : null}
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--kx-fg-muted)] hover:bg-[var(--kx-card-2)] hover:text-[var(--kx-fg)] transition-colors"
          >
            <X size={14} weight="bold" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* --------------------------- KxChipGroup --------------------------- */

type Chip<T extends string> = { value: T; label: string; count?: number };

export function KxChipGroup<T extends string>({
  options,
  value,
  onChange,
  multi = false,
  removable = false,
  className,
}: {
  options: Chip<T>[];
  value: T | T[];
  onChange: (next: T | T[]) => void;
  multi?: boolean;
  removable?: boolean;
  className?: string;
}) {
  const isActive = (v: T) =>
    Array.isArray(value) ? value.includes(v) : value === v;

  const toggle = (v: T) => {
    if (multi && Array.isArray(value)) {
      onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onChange(v);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((opt) => {
        const active = isActive(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              "group inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium",
              "border transition-[background-color,border-color,color,box-shadow] duration-200 ease-[var(--kx-ease)]",
              active
                ? "bg-[var(--kx-pink)] text-[var(--kx-on-pink)] border-[var(--kx-pink)] shadow-[0_0_0_3px_var(--kx-ring)]"
                : "bg-[var(--kx-card-2)] text-[var(--kx-fg)] border-transparent hover:border-[var(--kx-border-strong)]",
            )}
          >
            <span>{opt.label}</span>
            {typeof opt.count === "number" ? (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] tabular-nums leading-none py-0.5",
                  active
                    ? "bg-[color-mix(in_oklab,var(--kx-on-pink)_22%,transparent)] text-[var(--kx-on-pink)]"
                    : "bg-[var(--kx-card)] text-[var(--kx-fg-muted)]",
                )}
              >
                {opt.count}
              </span>
            ) : null}
            {removable && active ? (
              <span
                aria-hidden
                className="grid h-4 w-4 place-items-center rounded-full bg-[color-mix(in_oklab,var(--kx-on-pink)_22%,transparent)]"
              >
                <X size={10} weight="bold" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------- KxPagination --------------------------- */
/* Standard pagination — fixed slot widths, the active pink "thumb"
   slides smoothly to the active page index. Numbers do not move. */

const PAG_SLOT = 32; // px per page slot (must match h-8 w-8)
const PAG_GAP = 2;   // px gap between slots (matches gap-0.5)

export function KxPagination({
  page,
  total,
  onChange,
  siblings = 1,
  className,
}: {
  page: number;
  total: number;
  onChange: (next: number) => void;
  siblings?: number;
  className?: string;
}) {
  if (total <= 1) return null;

  const items = buildPageRange(page, total, siblings);
  // index of the current page within the items array (skipping ellipses)
  const activeIdx = items.findIndex((p) => p === page);
  const showThumb = activeIdx !== -1;

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[var(--kx-card-2)] p-1",
        className,
      )}
    >
      <PagBtn
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <CaretLeft size={14} weight="bold" />
      </PagBtn>

      <div
        className="relative flex items-center"
        style={{ gap: `${PAG_GAP}px` }}
      >
        {/* sliding thumb */}
        {showThumb ? (
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 h-8 w-8 rounded-full bg-[var(--kx-pink)] shadow-[var(--kx-shadow-pink)]"
            style={{
              transform: `translateX(${activeIdx * (PAG_SLOT + PAG_GAP)}px)`,
              transition:
                "transform 320ms var(--kx-ease-out), opacity 200ms var(--kx-ease)",
            }}
          />
        ) : null}

        {items.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              className="inline-grid h-8 w-8 place-items-center text-[12px] text-[var(--kx-fg-muted)] select-none"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === page ? "page" : undefined}
              onClick={() => onChange(p)}
              className={cn(
                "relative z-10 inline-grid h-8 w-8 place-items-center rounded-full text-[12px] font-semibold tabular-nums",
                "transition-colors duration-200 ease-[var(--kx-ease)]",
                p === page
                  ? "text-[var(--kx-on-pink)]"
                  : "text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)]",
              )}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <PagBtn
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page >= total}
        aria-label="Next page"
      >
        <CaretRight size={14} weight="bold" />
      </PagBtn>
    </nav>
  );
}

function PagBtn(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, disabled, ...rest } = props;
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "inline-grid h-8 w-8 place-items-center rounded-full text-[var(--kx-fg-muted)]",
        "transition-[background-color,color] duration-200 ease-[var(--kx-ease)]",
        "hover:bg-[var(--kx-card)] hover:text-[var(--kx-fg)] disabled:opacity-40 disabled:hover:bg-transparent",
        className,
      )}
      {...rest}
    />
  );
}

function buildPageRange(page: number, total: number, siblings: number): (number | "…")[] {
  const range: (number | "…")[] = [];
  const start = Math.max(2, page - siblings);
  const end = Math.min(total - 1, page + siblings);
  range.push(1);
  if (start > 2) range.push("…");
  for (let i = start; i <= end; i++) range.push(i);
  if (end < total - 1) range.push("…");
  if (total > 1) range.push(total);
  return range;
}

/* --------------------------- KxMenu (Popover anchored) --------------------------- */
/* Click-to-open dropdown menu. Anchored beneath its trigger. */

export type MenuItem = {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
};

export function KxMenu({
  trigger,
  items,
  align = "start",
  className,
}: {
  trigger: ReactNode;
  items: (MenuItem | "separator")[];
  align?: "start" | "end";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={cn("relative inline-block", className)}>
      <span
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
      >
        {trigger}
      </span>
      {open ? (
        <div
          id={id}
          role="menu"
          className={cn(
            "absolute z-30 mt-2 min-w-[220px] rounded-[var(--kx-r-btn)]",
            "bg-[var(--kx-card)] border border-[var(--kx-border-strong)] shadow-[var(--kx-shadow-lg)]",
            "p-1.5",
            align === "end" ? "right-0" : "left-0",
          )}
          style={{ animation: "kx-popover 0.18s var(--kx-ease-out) both" }}
        >
          {items.map((it, i) =>
            it === "separator" ? (
              <div
                key={`sep-${i}`}
                role="separator"
                className="my-1 h-px bg-[var(--kx-border-strong)]"
              />
            ) : (
              <button
                key={`${it.label}-${i}`}
                role="menuitem"
                disabled={it.disabled}
                aria-disabled={it.disabled}
                onClick={() => {
                  if (it.disabled) return;
                  it.onSelect?.();
                  setOpen(false);
                }}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-[calc(var(--kx-r-btn)-0.5rem)] px-2.5 py-2 text-left text-[13px]",
                  "transition-[background-color,color] duration-150 ease-[var(--kx-ease)]",
                  it.danger
                    ? "text-[var(--kx-danger)] hover:bg-[color-mix(in_oklab,var(--kx-danger)_12%,transparent)]"
                    : "text-[var(--kx-fg)] hover:bg-[var(--kx-card-2)]",
                  it.disabled && "opacity-40 pointer-events-none",
                )}
              >
                {it.icon ? (
                  <span className="grid h-6 w-6 shrink-0 place-items-center text-[var(--kx-fg-muted)] group-hover:text-current">
                    {it.icon}
                  </span>
                ) : (
                  <span className="w-6" aria-hidden />
                )}
                <span className="flex-1">{it.label}</span>
                {it.shortcut ? (
                  <span className="text-[11px] tracking-wider text-[var(--kx-fg-muted)]">
                    {it.shortcut}
                  </span>
                ) : null}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------- KxModal --------------------------- */
/* Premium feel: blurred backdrop, subtle pink-to-blue hairline at the
   top of the dialog, sticky header + footer, scrollable body. */

export function KxModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const widths = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 grid place-items-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{
          background:
            "color-mix(in oklab, var(--kx-bg) 60%, transparent)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          animation: "kx-popover 0.2s var(--kx-ease-out) both",
        }}
      />
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[var(--kx-r-card-lg)]",
          "bg-[var(--kx-card)] border border-[var(--kx-border-strong)] shadow-[var(--kx-shadow-lg)]",
          widths[size],
        )}
        style={{ animation: "kx-pop-in 0.28s var(--kx-ease-out) both" }}
      >
        {/* hairline */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--kx-pink), var(--kx-blue), transparent)",
          }}
        />
        <div className="flex items-start justify-between gap-4 p-7 pb-4">
          <div className="min-w-0">
            <h3 className="[font-family:var(--kx-font-display)] text-[17px] font-bold tracking-tight text-[var(--kx-fg)]">
              {title}
            </h3>
            {description ? (
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--kx-fg-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--kx-fg-muted)] hover:bg-[var(--kx-card-2)] hover:text-[var(--kx-fg)] transition-colors"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
        {children ? (
          <div className="kx-scroll max-h-[60vh] overflow-y-auto px-7 py-2 text-[13.5px] leading-relaxed text-[var(--kx-fg)]">
            {children}
          </div>
        ) : null}
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-[var(--kx-border)] bg-[var(--kx-card-2)] px-7 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* --------------------------- KxTable --------------------------- */
/* Dense, hairline-separated rows. Pill row hover. Sortable headers
   collapse a caret in/out smoothly. Sticky header. */

export type Column<R> = {
  key: keyof R & string;
  label: string;
  align?: "left" | "right" | "center";
  width?: string;
  sortable?: boolean;
  render?: (row: R) => ReactNode;
};

export function KxTable<R extends { id: string | number }>({
  columns,
  rows,
  caption,
  className,
  onRowClick,
}: {
  columns: Column<R>[];
  rows: R[];
  caption?: string;
  className?: string;
  onRowClick?: (row: R) => void;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = sortKey
    ? [...rows].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey];
        const bv = (b as Record<string, unknown>)[sortKey];
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av === bv) return 0;
        const dir = sortDir === "asc" ? 1 : -1;
        return av > bv ? dir : -dir;
      })
    : rows;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
        "bg-[var(--kx-card)]",
        className,
      )}
    >
      {caption ? (
        <div className="flex items-center justify-between gap-3 border-b border-[var(--kx-border)] px-4 py-3">
          <div className="[font-family:var(--kx-font-display)] text-[13px] font-semibold tracking-tight text-[var(--kx-fg)]">
            {caption}
          </div>
        </div>
      ) : null}
      <div className="kx-scroll overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr>
              {columns.map((c) => {
                const active = sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    style={{ width: c.width }}
                    className={cn(
                      "sticky top-0 z-10 select-none bg-[var(--kx-card-2)] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--kx-fg-muted)]",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      "first:pl-4 last:pr-4",
                    )}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (sortKey === c.key) {
                            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                          } else {
                            setSortKey(c.key);
                            setSortDir("asc");
                          }
                        }}
                        className={cn(
                          "flex w-full items-center gap-1.5 hover:text-[var(--kx-fg)] transition-colors",
                          c.align === "right" && "justify-end",
                          c.align === "center" && "justify-center",
                          active && "text-[var(--kx-fg)]",
                        )}
                      >
                        {c.label}
                        <span
                          aria-hidden
                          className={cn(
                            "inline-block transition-transform duration-200 ease-[var(--kx-ease)]",
                            active && sortDir === "desc" && "rotate-180",
                            !active && "opacity-30",
                          )}
                        >
                          <CaretRight size={10} weight="bold" style={{ transform: "rotate(90deg)" }} />
                        </span>
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "group transition-colors",
                  onRowClick && "cursor-pointer",
                )}
              >
                {columns.map((c, i) => {
                  const value = (row as Record<string, unknown>)[c.key] as ReactNode;
                  return (
                    <td
                      key={c.key}
                      className={cn(
                        "border-t border-[var(--kx-border)] bg-transparent px-3 py-2.5 text-[var(--kx-fg)]",
                        "group-hover:bg-[var(--kx-card-2)]",
                        c.align === "right" && "text-right",
                        c.align === "center" && "text-center",
                        i === 0 && "pl-4",
                        i === columns.length - 1 && "pr-4",
                      )}
                    >
                      {c.render ? c.render(row) : (value ?? "—")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --------------------------- KxFixtureCard --------------------------- */
/* Brand piece. Two team blocks split by a center "vs" / score chip.
   Top row: kickoff time + status pill. Bottom: venue + competition.
   The score chip lifts off the surface with a soft pink shadow when LIVE. */

type FixtureStatus = "scheduled" | "live" | "ft";

export type FixtureTeam = {
  name: string;
  short?: string; // 3-letter code
  crestColor?: string; // hex / css color
};

export function KxFixtureCard({
  home,
  away,
  status = "scheduled",
  scoreHome,
  scoreAway,
  kickoff,
  venue,
  competition,
  className,
}: {
  home: FixtureTeam;
  away: FixtureTeam;
  status?: FixtureStatus;
  scoreHome?: number;
  scoreAway?: number;
  kickoff: string; // pre-formatted, e.g. "Sat · 19:30"
  venue?: string;
  competition?: string;
  className?: string;
}) {
  const live = status === "live";
  const ended = status === "ft";
  const showScore = live || ended;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
        "bg-[var(--kx-card)] shadow-[var(--kx-shadow-md)]",
        className,
      )}
      style={
        live
          ? {
              backgroundImage:
                "radial-gradient(120% 70% at 100% 0%, color-mix(in oklab, var(--kx-pink) 14%, transparent) 0%, transparent 55%)",
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
          {kickoff}
        </span>
        <FixturePill status={status} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-4">
        <TeamBlock team={home} side="home" />
        <ScoreChip
          show={showScore}
          home={scoreHome}
          away={scoreAway}
          live={live}
        />
        <TeamBlock team={away} side="away" />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[var(--kx-border)] bg-[var(--kx-card-2)] px-4 py-2.5">
        <span className="truncate text-[12px] text-[var(--kx-fg-muted)]">
          {venue ?? "Venue TBD"}
        </span>
        {competition ? (
          <span className="shrink-0 rounded-full bg-[var(--kx-card)] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[var(--kx-fg)]">
            {competition}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function TeamBlock({ team, side }: { team: FixtureTeam; side: "home" | "away" }) {
  const color = team.crestColor ?? "var(--kx-fg-muted)";
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3",
        side === "away" && "flex-row-reverse text-right",
      )}
    >
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[var(--kx-on-pink)] [font-family:var(--kx-font-display)]"
        style={{
          background: color,
          boxShadow: "inset 0 0 0 2px color-mix(in oklab, white 18%, transparent)",
        }}
      >
        {team.short ?? team.name.slice(0, 3)}
      </span>
      <div className="min-w-0">
        <div className="truncate [font-family:var(--kx-font-display)] text-[13.5px] font-bold tracking-tight text-[var(--kx-fg)]">
          {team.name}
        </div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
          {side === "home" ? "Home" : "Away"}
        </div>
      </div>
    </div>
  );
}

function ScoreChip({
  show,
  home,
  away,
  live,
}: {
  show: boolean;
  home?: number;
  away?: number;
  live: boolean;
}) {
  if (!show) {
    return (
      <div
        className="grid h-10 w-10 place-items-center rounded-full bg-[var(--kx-card-2)] text-[11px] font-bold uppercase tracking-wider text-[var(--kx-fg-muted)]"
        aria-hidden
      >
        vs
      </div>
    );
  }
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_auto_auto] items-center gap-2 rounded-full px-3 py-1.5",
        "bg-[var(--kx-card-2)] [font-family:var(--kx-font-display)] text-[18px] font-extrabold tabular-nums tracking-tight text-[var(--kx-fg)]",
        live && "shadow-[0_0_0_3px_var(--kx-ring)]",
      )}
    >
      <span>{home ?? 0}</span>
      <span className="text-[11px] font-semibold text-[var(--kx-fg-muted)]">–</span>
      <span>{away ?? 0}</span>
    </div>
  );
}

function FixturePill({ status }: { status: FixtureStatus }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--kx-pink)_15%,transparent)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--kx-pink)]">
        <span className="relative grid h-1.5 w-1.5 place-items-center">
          <span
            className="absolute inline-flex h-1.5 w-1.5 rounded-full bg-[var(--kx-pink)]"
            style={{ animation: "kx-pulse-ring 1.6s ease-out infinite" }}
          />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--kx-pink)]" />
        </span>
        Live
      </span>
    );
  }
  if (status === "ft") {
    return (
      <span className="inline-flex rounded-full bg-[var(--kx-card-2)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--kx-fg-muted)]">
        FT
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-[color-mix(in_oklab,var(--kx-blue)_14%,transparent)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--kx-blue)]">
      Soon
    </span>
  );
}

/* --------------------------- KxKebabButton (helper for menu demo) --------------------------- */

export const KxKebabButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function KxKebabButton({ className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label="More options"
        className={cn(
          "inline-grid h-8 w-8 place-items-center rounded-full text-[var(--kx-fg-muted)]",
          "hover:bg-[var(--kx-card-2)] hover:text-[var(--kx-fg)] transition-colors",
          className,
        )}
        {...props}
      >
        <DotsThree size={18} weight="bold" />
      </button>
    );
  },
);

/* placate unused import linter if any consumer drops icons */
export type _KxExtrasIcons = HTMLAttributes<HTMLDivElement>;
