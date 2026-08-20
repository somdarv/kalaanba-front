import Image from "next/image";
import {
  ShieldCheck,
  Trophy,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

import { Wordmark } from "@/components/ui/wordmark";
import { cn } from "@/lib/cn";

/**
 * Hero art, portrait cut (941x1672) -- for the near-square desktop inset.
 * Next/image optimises + serves webp/avif from this source. Set to `null` to
 * fall back to the animated brand mesh.
 */
export const AUTH_HERO_SRC: string | null = "/images/auth/hero.png";

/**
 * The same artwork, wide cut (1672x941) -- for the mobile band, which is a
 * short full-width strip. Art direction, not a duplicate: a 0.56:1 portrait
 * centre-cropped into a ~1.4:1 strip loses the composition, and a 1.78:1
 * landscape cropped into the square desktop slot loses the outer players.
 */
export const AUTH_HERO_WIDE_SRC = "/images/auth/hero-landscape.png";

/**
 * The three things the record actually gives you. This is the honest local
 * answer to the reference layout's "partner logos" strip: Kalaanba has no
 * partners to show yet, and inventing them on the login screen would be a
 * fabricated claim. Product promises are not domain truth (Constitution
 * Law 3), so they are safe to render statically — but they stay props so
 * copy can move without touching layout.
 */
export type AuthProofPoint = { icon: "verified" | "ranked" | "squads"; label: string };

const PROOF_ICONS = {
  verified: ShieldCheck,
  ranked: Trophy,
  squads: UsersThree,
} as const;

const DEFAULT_PROOF_POINTS: readonly AuthProofPoint[] = [
  { icon: "verified", label: "Verified results" },
  { icon: "ranked", label: "Ranked clubs" },
  { icon: "squads", label: "Real squads" },
];

export type AuthHeroProps = {
  /** Photographic hero art. Falls back to the animated brand mesh when null. */
  imageSrc?: string | null;
  /** Wide cut, used for the mobile band. */
  wideImageSrc?: string;
  imageAlt?: string;
  /** Short line under the wordmark — the emotional hook. */
  tagline?: string;
  /** Desktop-only proof strip at the foot of the art. */
  proofPoints?: readonly AuthProofPoint[];
  className?: string;
};

/**
 * `<AuthHero>` — the full-bleed visual half of the auth screen.
 *
 * Per DESIGN_LANGUAGE.md §1.3 (Premium — deliberate "wow") and §7 the rich
 * aurora vocabulary is opt-in; this is one of the sanctioned places for it.
 * The drifting blobs carry `kx-alive`, the explicit opt-out of the global
 * reduced-motion blanket (§3.6), because the ambient brand drift IS the brand.
 * Motion is on decorative `aria-hidden` spans only — never on content (§3.4).
 *
 * Layout follows the reference split-screen: wordmark centred at the head of
 * the art, tagline + proof strip anchored at its foot. Both ends are scrimmed
 * because photography cannot be relied on for contrast (§6).
 */
export function AuthHero({
  imageSrc = AUTH_HERO_SRC,
  wideImageSrc = AUTH_HERO_WIDE_SRC,
  imageAlt = "A club squad lined up for a team photo under floodlights",
  tagline = "Your game, on the record.",
  proofPoints = DEFAULT_PROOF_POINTS,
  className,
}: AuthHeroProps) {
  return (
    <div
      className={cn(
        // `absolute inset-0`, NOT `size-full`. `size-full` is `height: 100%`,
        // a percentage — and a percentage height only resolves against a
        // parent with a *definite* height. The mobile slot is now a flex item
        // that takes its height from `flex-1`, which is indefinite at the
        // moment the child is sized, so `h-100%` collapsed to 0, this div
        // went to zero, and `next/image fill` inside it reported "height
        // value of 0" and rendered nothing. Absolute insets resolve against
        // the positioned parent's used height instead, definite or not.
        //
        // Contract: the parent must be positioned (`relative`) and clip
        // (`overflow-hidden`). `<AuthShell>` gives it both.
        "kx-chrome absolute inset-0 isolate overflow-hidden bg-primary text-white",
        className,
      )}
    >
      {imageSrc ? (
        <>
          {/* Two cuts of the same artwork, one per slot shape. Both stay lazy
              on purpose: a lazy image inside `display: none` is never fetched,
              so each breakpoint downloads exactly one. Marking either `eager`
              would pull both on every device (~2.3MB wasted on a phone), and
              Next 16 deprecated `priority` anyway. */}
          <Image
            src={wideImageSrc}
            alt={imageAlt}
            fill
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center lg:hidden"
          />
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            fetchPriority="high"
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="hidden object-cover object-center lg:block"
          />
        </>
      ) : (
        <BrandMesh />
      )}

      {/* Legibility scrim. Black rather than a token on purpose: this darkens a
          photograph, and a photograph does not change with the theme. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-black/45 via-black/10 to-black/55"
      />

      {/* Wordmark — centred at the head of the art, clear of system chrome.
          No colour prop: <Wordmark> masks `currentColor`, and this surface
          sets `text-white`, so the mark comes through white over the art.
          Literal white, not `--on-primary`, even though that token is white
          again as of the 2026-08-19 label flip. `--on-primary` means "label
          on a brand fill" and answers to whatever that fill becomes; this
          type sits on a photograph under a black scrim, so it is white for a
          reason that has nothing to do with the brand and must not follow it
          the next time the token moves. */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center px-6 pt-[max(1.25rem,env(safe-area-inset-top))] lg:pt-8">
        <Wordmark size="md" className="lg:h-8" />
      </div>

      {/* Tagline + proof strip. Desktop only — on mobile the sheet covers this
          edge of the art and the headline in the form carries the message. */}
      <div className="absolute inset-x-0 bottom-0 z-10 hidden px-8 pb-8 lg:block">
        <p className="font-display text-3xl leading-tight font-bold tracking-tight text-balance">
          {tagline}
        </p>

        <div aria-hidden className="mt-6 h-px w-full bg-white/25" />

        {/* No eyebrow over this strip. "What the record gives you" announced a
            list that announces itself — three plain claims read faster than a
            label plus three claims, and §1.3 (Premium — restraint) says the
            calmer of two equally clear options wins. Tagline, rule, proof. */}
        <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          {proofPoints.map((point) => {
            const Icon = PROOF_ICONS[point.icon];
            return (
              <li
                key={point.label}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/90"
              >
                <Icon size={18} weight="bold" aria-hidden />
                {point.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Animated brand mesh — pink → purple (pink×blue) → amber sunset drift. */
function BrandMesh() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(155deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 55%, var(--accent)) 52%, color-mix(in oklab, var(--accent) 70%, var(--warning)) 100%)",
      }}
    >
      <span
        className="kx-alive absolute -left-1/4 -top-1/4 h-[80%] w-[80%] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--warning) 60%, transparent), transparent 70%)",
          animation: "kx-aurora-a 16s ease-in-out infinite alternate",
          willChange: "transform",
        }}
      />
      <span
        className="kx-alive absolute -bottom-1/4 -right-1/5 h-[85%] w-[75%] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 55%, transparent), transparent 70%)",
          animation: "kx-aurora-b 20s ease-in-out infinite alternate",
          willChange: "transform",
        }}
      />
    </div>
  );
}
