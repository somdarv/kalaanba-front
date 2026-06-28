import Image from "next/image";
import { SoccerBall } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/cn";

/**
 * Street-football hero art (portrait ~2:3). Next/image optimises + serves
 * webp/avif from this source. Set to `null` to fall back to the animated
 * brand mesh.
 */
export const AUTH_HERO_SRC: string | null = "/images/auth/hero.png";

export type AuthHeroProps = {
  /** Photographic hero art. Falls back to the animated brand mesh when null. */
  imageSrc?: string | null;
  imageAlt?: string;
  /** Short line under the wordmark — the emotional hook. */
  tagline?: string;
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
 */
export function AuthHero({
  imageSrc = AUTH_HERO_SRC,
  imageAlt = "Street football at golden hour",
  tagline = "Your game, on the record.",
  className,
}: AuthHeroProps) {
  return (
    <div
      className={cn(
        "relative isolate size-full overflow-hidden bg-primary text-on-primary select-none",
        className,
      )}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-center"
        />
      ) : (
        <BrandMesh />
      )}

      {/* Legibility scrim — darkens the top (wordmark) and the seam edge. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/15 lg:bg-linear-to-l"
      />

      {/* Brand wordmark — floats top-left, thumb-safe away from system chrome. */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-2.5 px-6 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <span className="grid size-9 place-items-center rounded-full bg-on-primary/15 backdrop-blur-sm">
          <SoccerBall size={20} weight="fill" aria-hidden />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">
          Kalaanba
        </span>
      </div>

      {/* Tagline anchored bottom-left on the hero (desktop only — on mobile the
          form sheet carries the headline so the image stays clean). */}
      <p className="absolute bottom-8 left-6 right-6 z-10 hidden font-display text-3xl font-bold leading-tight tracking-tight lg:block">
        {tagline}
      </p>
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
