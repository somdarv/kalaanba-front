"use client";

import { Card, Eyebrow, StatValue } from "@/components/ui";

/**
 * Live token specimens for the v3 (OKLCH) layer — ADR-0006.
 *
 * The swatches below are authored as literal `oklch()` values rather than
 * token references on purpose: this page has to show what the token *is*,
 * including the ones it is replacing. Everything else on the page uses tokens.
 *
 * `"use client"` is load-bearing, not habit: `Card` is a compound component
 * (`Card.Header`, `Card.Content`), and dot-notation statics do not survive the
 * server/client boundary — the proxy resolves them to `undefined` and the
 * prerender fails. `/showcase` is client-side for the same reason.
 */

type Ramp = { name: string; value: string; note?: string };

const GROUND: Ramp[] = [
  { name: "--bg", value: "oklch(0.165 0.018 264)", note: "canvas" },
  { name: "--surface", value: "oklch(0.205 0.020 264)", note: "ΔL +0.040" },
  { name: "--surface-elev", value: "oklch(0.245 0.022 264)", note: "ΔL +0.040" },
  { name: "--surface-overlay", value: "oklch(0.285 0.024 264)", note: "ΔL +0.040" },
];

const OLD_GROUND: Ramp[] = [
  { name: "--bg", value: "#0b101d", note: "L .175" },
  { name: "--surface", value: "#161b26", note: "ΔL +0.047" },
  { name: "--surface-elev", value: "#1a202d", note: "ΔL +0.022 ←" },
  { name: "--surface-overlay", value: "#232a39", note: "ΔL +0.041" },
];

const FILLS: Ramp[] = [
  { name: "--primary", value: "oklch(0.560 0.210 350)", note: "5.23:1" },
  { name: "--danger", value: "oklch(0.555 0.200 30)", note: "5.25:1" },
  { name: "--success", value: "oklch(0.520 0.130 150)", note: "5.18:1" },
  { name: "--accent", value: "oklch(0.530 0.120 245)", note: "5.23:1" },
];

const OLD_FILLS: Ramp[] = [
  { name: "--primary", value: "#f55694", note: "3.16:1" },
  { name: "--danger", value: "#ef4444", note: "3.76:1" },
  { name: "--success", value: "#16a34a", note: "3.30:1" },
  { name: "--accent", value: "#56b7f5", note: "2.21:1" },
];

const INKS: Ramp[] = [
  { name: "--primary-ink", value: "oklch(0.760 0.170 350)", note: "7.71:1" },
  { name: "--danger-ink", value: "oklch(0.760 0.140 30)", note: "7.88:1" },
  { name: "--success-ink", value: "oklch(0.760 0.200 150)", note: "9.06:1" },
  { name: "--live", value: "oklch(0.840 0.140 195)", note: "11.57:1" },
];

function RampStrip({ steps, label }: { steps: Ramp[]; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Eyebrow>{label}</Eyebrow>
      <div className="border-border overflow-hidden rounded-row border">
        {steps.map((s) => (
          <div
            key={s.name + s.value}
            className="flex h-12 items-center justify-between px-3"
            style={{ background: s.value }}
          >
            <span className="text-[0.7rem] font-medium text-white/70">
              {s.name}
            </span>
            <span className="kx-numeric text-[0.7rem] text-white/55">
              {s.note}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SwatchGrid({ steps, labelOn }: { steps: Ramp[]; labelOn: "fill" | "ink" }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {steps.map((s) => (
        <div
          key={s.name + s.value}
          className="border-border flex flex-col overflow-hidden rounded-row border"
        >
          <div
            className="flex h-14 items-center justify-center text-xs font-semibold"
            style={
              labelOn === "fill"
                ? { background: s.value, color: "#fff" }
                : { background: "oklch(0.205 0.020 264)", color: s.value }
            }
          >
            {s.note}
          </div>
          <div className="bg-surface px-2 py-1.5">
            <span className="text-fg-subtle text-[0.65rem]">{s.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TokenSpecimens() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-1.5">
          <Eyebrow tone="primary">Ground</Eyebrow>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Uniform lightness steps
          </h2>
          <p className="text-fg-muted max-w-prose text-sm">
            Hue locked to 264, every step ΔL 0.040. The old ramp&apos;s raised tier
            was half-size, which is the whole reason <code>Card</code> could
            collapse three tiers into one without anyone noticing.
          </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <RampStrip steps={OLD_GROUND} label="v2 — uneven" />
          <RampStrip steps={GROUND} label="v3 — uniform" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-1.5">
          <Eyebrow tone="primary">Fills</Eyebrow>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Every label now clears AA
          </h2>
          <p className="text-fg-muted max-w-prose text-sm">
            Same white label on both rows. The number in each swatch is the
            measured contrast ratio against it.
          </p>
        </header>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Eyebrow>v2 — four of five failed</Eyebrow>
            <SwatchGrid steps={OLD_FILLS} labelOn="fill" />
          </div>
          <div className="flex flex-col gap-2">
            <Eyebrow>v3 — all pass</Eyebrow>
            <SwatchGrid steps={FILLS} labelOn="fill" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-1.5">
          <Eyebrow tone="primary">Ink</Eyebrow>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            The same hues, tuned for text
          </h2>
          <p className="text-fg-muted max-w-prose text-sm">
            A colour that carries a white label is too dark to read as text on a
            dark surface. Splitting the roles is the single change that fixed the
            contrast findings without touching the brand hue.
          </p>
        </header>
        <SwatchGrid steps={INKS} labelOn="ink" />
      </section>

      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-1.5">
          <Eyebrow tone="primary">Elevation</Eyebrow>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Three tiers that actually differ
          </h2>
        </header>
        <div className="grid gap-3 sm:grid-cols-3">
          {(["flat", "raised", "floating"] as const).map((tone) => (
            <Card key={tone} tone={tone}>
              <Card.Header>
                <h3 className="capitalize">{tone}</h3>
              </Card.Header>
              <Card.Content>
                {tone === "flat" && "Inline regions, list rows."}
                {tone === "raised" && "Cards, panels. Inset top highlight."}
                {tone === "floating" && "Modals, popovers. Blur + strong line."}
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-1.5">
          <Eyebrow tone="primary">Shape</Eyebrow>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            A tight end, at last
          </h2>
          <p className="text-fg-muted max-w-prose text-sm">
            v2 had only pills and 25–32px. Dense football data had nothing to sit
            in that didn&apos;t read as a soft consumer card.
          </p>
        </header>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            ["row", "10px", "rounded-row"],
            ["control", "12px", "rounded-control"],
            ["card", "20px", "rounded-card"],
            ["panel", "28px", "rounded-panel"],
            ["pill", "999px", "rounded-pill"],
          ].map(([name, px, cls]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className={`bg-surface-elev border-border-strong h-16 w-full border ${cls}`}
              />
              <div className="flex flex-col items-center">
                <span className="text-fg text-xs font-semibold">{name}</span>
                <StatValue size="sm" tone="muted">
                  {px}
                </StatValue>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
