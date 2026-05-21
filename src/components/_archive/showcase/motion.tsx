"use client";

/* =====================================================================
   KX TRACK 3 · LIVE / MOTION
     - KxTicker         (pause-on-hover marquee)
     - KxOdometer       (per-digit flip on value change)
     - KxToastQueue     (provider + useKxToast + KxToastHost)
     - KxMomentumBar    (left/right shifting xG-style strip)
   All ambient layers tagged .kx-alive so prefers-reduced-motion still
   keeps brand motion alive (per the existing showcase.css carve-out).
   ===================================================================== */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle, Info, WarningCircle, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* --------------------------- KxTicker --------------------------- */
/* Renders children twice in a row and translates the track from
   0% → -50%. CSS keyframe `kx-ticker` is appended via a <style> block on
   first mount so this component is fully self-contained. */

export function KxTicker({
  children,
  speed = 40,
  className,
}: {
  children: ReactNode;
  speed?: number; // seconds per full loop
  className?: string;
}) {
  return (
    <>
      <TickerStyleOnce />
      <div
        className={cn(
          "group relative w-full overflow-hidden rounded-[var(--kx-r-tile)] border border-[var(--kx-border)] bg-[var(--kx-card)]",
          className,
        )}
      >
        {/* edge fades */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10"
          style={{
            background:
              "linear-gradient(90deg, var(--kx-card) 0%, transparent 100%)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10"
          style={{
            background:
              "linear-gradient(270deg, var(--kx-card) 0%, transparent 100%)",
          }}
        />
        <div
          className="kx-alive flex w-max items-center gap-8 py-2.5 group-hover:[animation-play-state:paused]"
          style={{
            animation: `kx-ticker ${speed}s linear infinite`,
            willChange: "transform",
          }}
        >
          <div className="flex shrink-0 items-center gap-8 px-4">{children}</div>
          <div aria-hidden className="flex shrink-0 items-center gap-8 px-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

let tickerStyleInjected = false;
function TickerStyleOnce() {
  useEffect(() => {
    if (tickerStyleInjected || typeof document === "undefined") return;
    const tag = document.createElement("style");
    tag.dataset.kx = "ticker";
    tag.textContent = `
      @keyframes kx-ticker {
        from { transform: translate3d(0, 0, 0); }
        to   { transform: translate3d(-50%, 0, 0); }
      }
    `;
    document.head.appendChild(tag);
    tickerStyleInjected = true;
  }, []);
  return null;
}

/* --------------------------- KxOdometer --------------------------- */
/* Per-character flip. When value changes, each digit column slides
   from its old digit to the new one. Letters/symbols swap without flip. */

export function KxOdometer({
  value,
  className,
}: {
  value: number | string;
  className?: string;
}) {
  const str = String(value);
  return (
    <span
      className={cn(
        "inline-flex items-baseline tabular-nums [font-family:var(--kx-font-display)]",
        className,
      )}
      aria-label={String(value)}
    >
      {str.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <DigitColumn key={`${i}-${ch}`} digit={ch} />
        ) : (
          <span key={`${i}-${ch}`} className="px-[1px]">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

function DigitColumn({ digit }: { digit: string }) {
  const target = parseInt(digit, 10);
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translateY(-${target * 10}%)`;
  }, [target]);
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-baseline">
      {/* invisible placeholder so width matches a single digit */}
      <span aria-hidden className="invisible">
        0
      </span>
      <span
        ref={ref}
        aria-hidden
        className="absolute left-0 top-0 flex w-full flex-col leading-[1]"
        style={{
          transform: `translateY(-${target * 10}%)`,
          transition: "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <span key={n} className="block h-[1em] leading-[1]">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

/* --------------------------- KxToastQueue --------------------------- */
/* Provider + hook + host. Toasts auto-dismiss with a thin progress bar.
   Stacks newest-first in the bottom-right (sm+) / bottom (mobile). */

export type ToastTone = "primary" | "blue" | "success" | "warning" | "danger";

export type ToastDescriptor = {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number; // ms
};

type State = ToastDescriptor[];
type Action =
  | { type: "push"; toast: ToastDescriptor }
  | { type: "dismiss"; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "push":
      return [action.toast, ...state].slice(0, 5);
    case "dismiss":
      return state.filter((t) => t.id !== action.id);
  }
}

type Ctx = {
  push: (t: Omit<ToastDescriptor, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
  toasts: State;
};

const ToastCtx = createContext<Ctx | null>(null);

export function KxToastQueueProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);
  const push = useCallback<Ctx["push"]>((t) => {
    const id = t.id ?? `t-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    dispatch({ type: "push", toast: { duration: 4200, tone: "primary", ...t, id } });
    return id;
  }, []);
  const dismiss = useCallback((id: string) => dispatch({ type: "dismiss", id }), []);
  const value = useMemo(() => ({ push, dismiss, toasts }), [push, dismiss, toasts]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <KxToastHost />
    </ToastCtx.Provider>
  );
}

export function useKxToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useKxToast must be used inside KxToastQueueProvider");
  return ctx;
}

function KxToastHost() {
  const ctx = useContext(ToastCtx);
  if (!ctx) return null;
  const { toasts, dismiss } = ctx;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-3 z-[100] flex flex-col items-center gap-2 px-3 sm:bottom-4 sm:right-4 sm:left-auto sm:items-end sm:px-0"
    >
      {toasts.map((t) => (
        <QueuedToast key={t.id} toast={t} onClose={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function QueuedToast({
  toast,
  onClose,
}: {
  toast: ToastDescriptor;
  onClose: () => void;
}) {
  const tone = toast.tone ?? "primary";
  const accentBg =
    tone === "primary"
      ? "var(--kx-pink)"
      : tone === "blue"
        ? "var(--kx-blue)"
        : tone === "success"
          ? "var(--kx-success)"
          : tone === "warning"
            ? "var(--kx-warning)"
            : "var(--kx-danger)";
  const accentFg =
    tone === "primary"
      ? "var(--kx-on-pink)"
      : tone === "blue"
        ? "var(--kx-on-blue)"
        : "white";

  const icon =
    tone === "success" ? <CheckCircle size={18} weight="bold" />
    : tone === "warning" ? <WarningCircle size={18} weight="bold" />
    : tone === "danger" ? <WarningCircle size={18} weight="bold" />
    : <Info size={18} weight="bold" />;

  const duration = toast.duration ?? 4200;
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [paused, duration, onClose]);

  return (
    <div
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)] bg-[var(--kx-card)] p-4 shadow-[var(--kx-shadow-lg)]"
      style={{ animation: "kx-toast-in 0.32s var(--kx-ease-out) both" }}
    >
      <div
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
        style={{ background: accentBg, color: accentFg }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-[var(--kx-fg)]">{toast.title}</div>
        {toast.description ? (
          <div className="mt-0.5 text-[12.5px] leading-snug text-[var(--kx-fg-muted)]">
            {toast.description}
          </div>
        ) : null}
      </div>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="grid h-7 w-7 place-items-center rounded-full text-[var(--kx-fg-muted)] hover:bg-[var(--kx-card-2)] hover:text-[var(--kx-fg)] transition-colors cursor-pointer"
      >
        <X size={14} weight="bold" />
      </button>
      {/* progress */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
        style={{
          background: accentBg,
          transform: paused ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: paused ? "none" : `transform ${duration}ms linear`,
          // start the animation on next frame
          animation: paused ? undefined : "none",
        }}
        ref={(el) => {
          if (!el || paused) return;
          // force layout, then set scaleX(1) to trigger transition from 0 to 1.
          requestAnimationFrame(() => {
            el.style.transform = "scaleX(1)";
          });
        }}
      />
    </div>
  );
}

/* --------------------------- KxMomentumBar --------------------------- */
/* xG / momentum strip. `value` ranges from -1 (fully home) to +1 (fully
   away). Renders a thin track with a pink half (home) and blue half
   (away). The "indicator" sits at the centerline and the fill widths
   transition smoothly. */

export function KxMomentumBar({
  value,
  homeLabel = "Home",
  awayLabel = "Away",
  className,
}: {
  value: number; // -1..1
  homeLabel?: string;
  awayLabel?: string;
  className?: string;
}) {
  const v = Math.max(-1, Math.min(1, value));
  const homePct = ((1 - v) / 2) * 100; // when v = -1 → 100; v = +1 → 0
  const awayPct = 100 - homePct;
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-center justify-between text-[10.5px] font-bold uppercase tracking-[0.16em]">
        <span className="text-[var(--kx-pink)]">{homeLabel}</span>
        <span className="text-[var(--kx-fg-muted)] tabular-nums">
          {v > 0 ? "+" : ""}
          {(v * 100).toFixed(0)}%
        </span>
        <span className="text-[var(--kx-blue)]">{awayLabel}</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--kx-card-2)]">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 rounded-l-full"
          style={{
            width: `${homePct}%`,
            background: "var(--kx-pink)",
            transition: "width 600ms var(--kx-ease-out)",
          }}
        />
        <span
          aria-hidden
          className="absolute inset-y-0 right-0 rounded-r-full"
          style={{
            width: `${awayPct}%`,
            background: "var(--kx-blue)",
            transition: "width 600ms var(--kx-ease-out)",
          }}
        />
        {/* center hairline */}
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 h-3 w-[1.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--kx-card)]"
        />
      </div>
    </div>
  );
}
