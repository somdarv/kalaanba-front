"use client";

import { KxBadge } from "@/components/showcase/primitives";
import { cn } from "@/lib/utils";

/**
 * Player Profile copy block — matches the reference screenshot:
 * - Pink eyebrow label ("Player Profile")
 * - Large display name
 * - Muted body copy
 */
export function KxPlayerProfileBlock({
  eyebrow = "Player Profile",
  name,
  bio,
  className,
}: {
  eyebrow?: string;
  name: string;
  bio: string;
  className?: string;
}) {
  return (
    <div
      className={cn("max-w-md", className)}
      style={{ animation: "kx-rise 0.6s var(--kx-ease-out) both" }}
    >
      <div className="text-[15px] font-semibold tracking-tight text-[var(--kx-pink)]">
        {eyebrow}
      </div>
      <h3 className="mt-3 [font-family:var(--kx-font-display)] text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--kx-fg)] sm:text-5xl">
        {name}
      </h3>
      <p className="mt-5 text-[15px] leading-7 text-[var(--kx-fg-muted)]">{bio}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <KxBadge tone="primary" withDot>Verified</KxBadge>
        <KxBadge tone="blue">Forward</KxBadge>
        <KxBadge tone="neutral">Tamale Premier</KxBadge>
      </div>
    </div>
  );
}
