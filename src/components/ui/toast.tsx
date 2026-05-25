"use client";

import {
  CheckCircle,
  Info,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/cn";

/**
 * `<Toast>` + `<ToastProvider>` + `useToast()`.
 *
 * Port of the legacy `KxToast` + `KxToastQueue` (kalaanba-front/src/components/
 * _archive/showcase/{primitives,motion}.tsx).
 *
 * Recipe:
 *   card:     rounded-card  bg-surface  shadow-lg  border border-border
 *   icon:     h-9 w-9 round; tone-coloured background
 *   progress: 2px bar across the bottom, animated scaleX 0 → 1 over `duration`
 *
 * Per the design language, the entrance is **opacity-only** (no translate).
 * The bottom progress bar uses `scaleX`, which is permitted — it's a single
 * decoration, not a position change.
 *
 * Tones map onto the same intent vocabulary as Badge:
 *   primary | blue | success | warning | danger
 */

export type ToastTone = "primary" | "blue" | "success" | "warning" | "danger";

export type ToastProps = {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Override the auto-picked icon. */
  icon?: ReactNode;
  /** Show a dismiss button. Wires up `onClose`. */
  onClose?: () => void;
  /** When provided, draws the progress bar across the bottom. */
  duration?: number;
  /** Pause the progress bar (used by the queue when hovered). */
  paused?: boolean;
  className?: string;
};

const TONE_ACCENT: Record<ToastTone, string> = {
  primary: "bg-primary text-on-pink",
  blue: "bg-accent text-on-blue",
  success: "bg-success text-on-success",
  warning: "bg-warning text-on-warning",
  danger: "bg-danger text-on-danger",
};

const TONE_BAR: Record<ToastTone, string> = {
  primary: "bg-primary",
  blue: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

function defaultIcon(tone: ToastTone) {
  if (tone === "success") return <CheckCircle size={18} weight="bold" />;
  if (tone === "warning") return <WarningCircle size={18} weight="bold" />;
  if (tone === "danger") return <WarningCircle size={18} weight="bold" />;
  return <Info size={18} weight="bold" />;
}

/**
 * Presentational toast — render as-is for static demos, or let the queue do
 * it for you via `useToast().push(...)`.
 */
export function Toast({
  title,
  description,
  tone = "primary",
  icon,
  onClose,
  duration,
  paused,
  className,
}: ToastProps) {
  // Opacity-only entrance: start at 0, fade to 1 on the next frame.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Progress bar: animate scaleX 0 → 1 over `duration`. Pause by holding at
  // the current state (CSS transition naturally pauses on toggle).
  const barRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!duration || !barRef.current) return;
    const el = barRef.current;
    el.style.transform = "scaleX(0)";
    el.style.transition = "none";
    // Force layout, then animate.
    void el.offsetWidth;
    el.style.transition = `transform ${duration}ms linear`;
    el.style.transform = paused ? "scaleX(0)" : "scaleX(1)";
  }, [duration, paused]);

  return (
    <div
      role="status"
      className={cn(
        "relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-card border border-border bg-surface p-4 shadow-lg",
        "transition-opacity duration-300 ease-out",
        shown ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <div
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full",
          TONE_ACCENT[tone],
        )}
        aria-hidden
      >
        {icon ?? defaultIcon(tone)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-fg">{title}</div>
        {description ? (
          <div className="mt-0.5 text-[12.5px] leading-snug text-fg-muted">
            {description}
          </div>
        ) : null}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <X size={14} weight="bold" />
        </button>
      ) : null}

      {duration ? (
        <span
          ref={barRef}
          aria-hidden
          className={cn(
            "absolute inset-x-0 bottom-0 h-0.5 origin-left",
            TONE_BAR[tone],
          )}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------ Queue ------------------------------ */

export type ToastDescriptor = {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
};

type ToastInput = Omit<ToastDescriptor, "id"> & { id?: string };

type State = ToastDescriptor[];

type Action =
  | { type: "push"; toast: ToastDescriptor }
  | { type: "dismiss"; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "push":
      // Newest first; cap at 5 so the stack never grows unbounded.
      return [action.toast, ...state].slice(0, 5);
    case "dismiss":
      return state.filter((t) => t.id !== action.id);
  }
}

type ToastCtx = {
  push: (t: ToastInput) => string;
  dismiss: (id: string) => void;
  toasts: State;
};

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);
  const push = useCallback<ToastCtx["push"]>((t) => {
    const id =
      t.id ?? `t-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    dispatch({
      type: "push",
      toast: { duration: 4200, tone: "primary", ...t, id },
    });
    return id;
  }, []);
  const dismiss = useCallback(
    (id: string) => dispatch({ type: "dismiss", id }),
    [],
  );
  const value = useMemo(
    () => ({ push, dismiss, toasts }),
    [push, dismiss, toasts],
  );
  return (
    <Ctx.Provider value={value}>
      {children}
      <ToastHost />
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

function ToastHost() {
  const ctx = useContext(Ctx);
  if (!ctx) return null;
  const { toasts, dismiss } = ctx;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-3 z-100 flex flex-col items-center gap-2 px-3 sm:left-auto sm:right-4 sm:bottom-4 sm:items-end sm:px-0"
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
  const [paused, setPaused] = useState(false);
  const duration = toast.duration ?? 4200;

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(t);
  }, [paused, duration, onClose]);

  return (
    <div
      className="pointer-events-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Toast
        title={toast.title}
        description={toast.description}
        tone={toast.tone}
        duration={duration}
        paused={paused}
        onClose={onClose}
      />
    </div>
  );
}
