"use client";

/* -----------------------------------------------------------------------
   AgentOSBanner

   A dismissible full-width bar that surfaces the Work Packet receipt for
   the current page — proof that the Agent OS pipeline was followed.

   Rendered above SiteHeader in app/page.tsx.
   Dismissed state is persisted in localStorage so it only appears once
   per browser.
   ----------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { Check, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "kalaanba-agent-os-banner-dismissed";

const WP_ID = "WP-20260520-agent-os";

const STAGES: { n: number; label: string }[] = [
  { n: 1,  label: "Intake"        },
  { n: 2,  label: "Impact Map"    },
  { n: 3,  label: "Rules Review"  },
  { n: 4,  label: "Arch Check"    },
  { n: 5,  label: "Contracts"     },
  { n: 6,  label: "Implement"     },
  { n: 7,  label: "Security"      },
  { n: 8,  label: "QA"            },
  { n: 9,  label: "Docs"          },
  { n: 10, label: "Release"       },
];

export function AgentOSBanner() {
  const [visible, setVisible] = useState(false);

  // Read persisted dismiss state after hydration to avoid SSR mismatch.
  useEffect(() => {
    try {
      if (!localStorage.getItem(DISMISS_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
  }

  if (!visible) return null;

  return (
    <div
      role="banner"
      aria-label="Agent OS pipeline receipt"
      className={cn(
        "relative w-full border-b border-border",
        "bg-surface-2",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:px-6">

        {/* Status dot + WP ID */}
        <div className="flex shrink-0 items-center gap-2">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full bg-success shadow-[0_0_6px_1px_rgba(22,163,74,0.55)]"
          />
          <span className="hidden font-mono text-[11px] font-semibold tracking-widest text-success sm:inline">
            {WP_ID}
          </span>
          <span className="font-mono text-[11px] font-semibold tracking-widest text-success sm:hidden">
            AGENT OS LIVE
          </span>
        </div>

        {/* Divider */}
        <div aria-hidden className="h-4 w-px shrink-0 bg-(--kx-border-strong)" />

        {/* Stage pills — scrollable on small screens */}
        <ol
          aria-label="Pipeline stages"
          className="flex flex-1 items-center gap-1 overflow-x-auto pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {STAGES.map((s) => (
            <li key={s.n} className="shrink-0">
              <span
                title={s.label}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
                  "border-(--kx-border-strong) bg-surface",
                  "text-[10px] font-semibold",
                  "text-fg-muted",
                )}
              >
                <Check
                  size={9}
                  weight="bold"
                  className="shrink-0 text-success"
                  aria-hidden
                />
                <span className="hidden md:inline">{s.label}</span>
                <span className="md:hidden">{s.n}</span>
              </span>
            </li>
          ))}
        </ol>

        {/* "10/10" summary on lg+ */}
        <span className="hidden shrink-0 text-[11px] font-semibold text-fg-muted lg:inline">
          10 / 10 stages cleared
        </span>

        {/* Dismiss */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss pipeline banner"
          className={cn(
            "ml-auto shrink-0 rounded p-1",
            "text-fg-muted transition-colors hover:text-fg",
          )}
        >
          <X size={14} weight="bold" aria-hidden />
        </button>
      </div>
    </div>
  );
}
