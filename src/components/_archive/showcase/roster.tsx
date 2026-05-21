"use client";

/* =====================================================================
   KX TRACK 5 · PLAYER & CLUB
     - KxClubCrest      (badge with image or initials fallback)
     - KxAvatarStack    (overlapping avatars with +N overflow)
     - KxPlayerCard     (verified player tile with stats)
   All scoped under .kx-root. Token-driven for light + dark.
   ===================================================================== */

import type { ReactNode } from "react";
import Image from "next/image";
import { SealCheck, MapPin, SoccerBall, TShirt } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* --------------------------- KxClubCrest --------------------------- */

export type CrestTone = "pink" | "blue" | "neutral";

export function KxClubCrest({
  name,
  src,
  tone = "neutral",
  size = "md",
  className,
}: {
  /** Used for initials fallback + a11y label. */
  name: string;
  src?: string;
  tone?: CrestTone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim = size === "sm" ? 28 : size === "lg" ? 56 : 40;
  const text = size === "sm" ? "text-[10px]" : size === "lg" ? "text-[16px]" : "text-[12px]";
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const bg =
    tone === "pink"
      ? "color-mix(in oklab, var(--kx-pink) 18%, transparent)"
      : tone === "blue"
        ? "color-mix(in oklab, var(--kx-blue) 18%, transparent)"
        : "var(--kx-card-2)";
  const fg =
    tone === "pink" ? "var(--kx-pink)" : tone === "blue" ? "var(--kx-blue)" : "var(--kx-fg)";

  return (
    <span
      role="img"
      aria-label={`${name} crest`}
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--kx-border)] font-extrabold",
        text,
        className,
      )}
      style={{ width: dim, height: dim, background: bg, color: fg }}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          width={dim}
          height={dim}
          className="h-full w-full object-cover"
          unoptimized
        />
      ) : (
        <span aria-hidden>{initials || "•"}</span>
      )}
    </span>
  );
}

/* --------------------------- KxAvatarStack --------------------------- */

export type StackPerson = {
  name: string;
  src?: string;
  tone?: CrestTone;
};

export function KxAvatarStack({
  people,
  max = 4,
  size = "md",
  className,
}: {
  people: StackPerson[];
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const visible = people.slice(0, max);
  const extra = Math.max(0, people.length - visible.length);
  const dim = size === "sm" ? 24 : size === "lg" ? 40 : 32;
  const text = size === "sm" ? "text-[9.5px]" : size === "lg" ? "text-[13px]" : "text-[11px]";

  return (
    <div className={cn("flex items-center", className)}>
      {visible.map((p, i) => {
        const initials = p.name
          .split(/\s+/)
          .map((w) => w[0])
          .filter(Boolean)
          .slice(0, 2)
          .join("")
          .toUpperCase();
        const bg =
          p.tone === "pink"
            ? "color-mix(in oklab, var(--kx-pink) 18%, transparent)"
            : p.tone === "blue"
              ? "color-mix(in oklab, var(--kx-blue) 18%, transparent)"
              : "var(--kx-card-2)";
        const fg =
          p.tone === "pink"
            ? "var(--kx-pink)"
            : p.tone === "blue"
              ? "var(--kx-blue)"
              : "var(--kx-fg)";
        return (
          <span
            key={`${p.name}-${i}`}
            title={p.name}
            className={cn(
              "relative grid place-items-center overflow-hidden rounded-full border-2 border-[var(--kx-card)] font-bold",
              text,
              i > 0 && (size === "sm" ? "-ml-2" : size === "lg" ? "-ml-3" : "-ml-2.5"),
            )}
            style={{ width: dim, height: dim, background: bg, color: fg, zIndex: visible.length - i }}
          >
            {p.src ? (
              <Image
                src={p.src}
                alt={p.name}
                width={dim}
                height={dim}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <span aria-hidden>{initials || "•"}</span>
            )}
          </span>
        );
      })}
      {extra > 0 ? (
        <span
          className={cn(
            "relative grid place-items-center rounded-full border-2 border-[var(--kx-card)] bg-[var(--kx-pink)] font-extrabold text-[var(--kx-on-pink)]",
            text,
            size === "sm" ? "-ml-2" : size === "lg" ? "-ml-3" : "-ml-2.5",
          )}
          style={{ width: dim, height: dim, zIndex: 0 }}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  );
}

/* --------------------------- KxPlayerCard --------------------------- */

export type PlayerCardProps = {
  name: string;
  position: string; // "Forward", "GK", etc.
  jersey?: number;
  clubName: string;
  clubCrest?: ReactNode; // pass a <KxClubCrest /> in
  city?: string;
  verified?: boolean;
  /** Tiny stat row at bottom. */
  stats?: { apps?: number; goals?: number; assists?: number };
  /** Optional avatar image of the player. */
  avatarSrc?: string;
  className?: string;
};

export function KxPlayerCard({
  name,
  position,
  jersey,
  clubName,
  clubCrest,
  city,
  verified = true,
  stats,
  avatarSrc,
  className,
}: PlayerCardProps) {
  return (
    <article
      className={cn(
        "relative flex w-full max-w-sm flex-col gap-4 overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)] bg-[var(--kx-card)] p-4",
        className,
      )}
    >
      {/* tinted-wash header */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--kx-pink) 14%, transparent) 0%, transparent 70%), radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, var(--kx-blue) 12%, transparent) 0%, transparent 70%)",
        }}
      />
      {/* gradient hairline */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--kx-pink) 50%, transparent 100%)",
        }}
      />

      <header className="relative flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <span
            className="grid h-16 w-16 place-items-center overflow-hidden rounded-full border border-[var(--kx-border)] bg-[var(--kx-card-2)] [font-family:var(--kx-font-display)] text-2xl font-extrabold text-[var(--kx-fg-muted)]"
            aria-hidden
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt=""
                width={64}
                height={64}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              name
                .split(/\s+/)
                .map((w) => w[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase()
            )}
          </span>
          {typeof jersey === "number" ? (
            <span
              aria-label={`Jersey number ${jersey}`}
              className="absolute -bottom-1 -right-1 grid h-7 min-w-[28px] place-items-center rounded-full bg-[var(--kx-pink)] px-1.5 text-[11px] font-extrabold tabular-nums text-[var(--kx-on-pink)] shadow-[var(--kx-shadow-pink)]"
            >
              <TShirt size={10} weight="bold" className="opacity-70" />
              <span className="ml-0.5">{jersey}</span>
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate [font-family:var(--kx-font-display)] text-lg font-extrabold leading-tight text-[var(--kx-fg)]">
              {name}
            </h3>
            {verified ? (
              <span
                aria-label="Verified player"
                title="Verified"
                className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-[var(--kx-blue)]"
              >
                <SealCheck size={16} weight="fill" />
              </span>
            ) : null}
          </div>
          <p className="mt-1 flex items-center gap-2 text-[12.5px] text-[var(--kx-fg-muted)]">
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--kx-border)] bg-[var(--kx-card-2)] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--kx-fg)]">
              {position}
            </span>
            {city ? (
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} weight="bold" />
                {city}
              </span>
            ) : null}
          </p>
        </div>
      </header>

      <div className="relative flex items-center gap-2.5 text-[12.5px] text-[var(--kx-fg-muted)]">
        {clubCrest}
        <span className="truncate font-semibold text-[var(--kx-fg)]">{clubName}</span>
      </div>

      {stats ? (
        <div className="relative grid grid-cols-3 gap-2">
          <Stat label="Apps" value={stats.apps ?? 0} />
          <Stat label="Goals" value={stats.goals ?? 0} accent />
          <Stat label="Assists" value={stats.assists ?? 0} />
        </div>
      ) : null}
    </article>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-[var(--kx-border)] bg-[var(--kx-card-2)]/60 px-3 py-2 text-center">
      <p
        className={cn(
          "[font-family:var(--kx-font-display)] text-xl font-extrabold tabular-nums",
          accent ? "text-[var(--kx-pink)]" : "text-[var(--kx-fg)]",
        )}
      >
        {value}
        {accent ? <SoccerBall size={12} weight="bold" className="ml-1 inline opacity-60" /> : null}
      </p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
        {label}
      </p>
    </div>
  );
}
