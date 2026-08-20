import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

/**
 * Contract tests for the v3 (OKLCH) token layer — ADR-0006.
 *
 * The v2 layer shipped four filled buttons that failed WCAG AA against their
 * own labels, an elevation step half the size of its neighbour, and a focus
 * ring at 1.00:1 against the control it marked. None of it was caught, because
 * nothing could measure a colour relationship. These tests are that measure.
 *
 * They parse the real `globals.css`, so they fail if someone edits a token to
 * a value that breaks the guarantees the design language makes.
 */

const CSS = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

// ---- colour maths (Ottosson oklab, D65) ----

type Oklch = { L: number; C: number; H: number };

function oklchToLinearSrgb({ L, C, H }: Oklch): [number, number, number] {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const isInGamut = (c: Oklch) =>
  oklchToLinearSrgb(c).every((v) => v >= -0.001 && v <= 1.001);

/** WCAG 2.1 relative luminance from linear-light sRGB. */
function relativeLuminance(c: Oklch): number {
  const [r, g, b] = oklchToLinearSrgb(c).map((v) => Math.min(Math.max(v, 0), 1));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrastRatio(a: Oklch, b: Oklch): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (hi! + 0.05) / (lo! + 0.05);
}

const WHITE: Oklch = { L: 1, C: 0, H: 0 };

/** Read a token's `oklch(L C H)` value out of the `:root` block. */
function token(name: string): Oklch {
  const match = new RegExp(
    `${name}:\\s*oklch\\(\\s*([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\s*\\)`,
  ).exec(CSS);
  if (!match) throw new Error(`token ${name} not found as a literal oklch()`);
  return { L: +match[1]!, C: +match[2]!, H: +match[3]! };
}

/**
 * The light block redefines a subset of tokens under `[data-theme="light"]`.
 * Scoping the search to that block yields the light value; tokens light does
 * not override are absent there and will throw rather than silently return
 * the dark value.
 */
const LIGHT_BLOCK = CSS.slice(CSS.indexOf('[data-theme="light"]'));

function lightToken(name: string): Oklch {
  const match = new RegExp(
    `${name}:\\s*oklch\\(\\s*([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\s*\\)`,
  ).exec(LIGHT_BLOCK);
  if (!match) throw new Error(`light token ${name} not found`);
  return { L: +match[1]!, C: +match[2]!, H: +match[3]! };
}

// ---- the guarantees ----

const FILLS = [
  "--primary",
  "--primary-hover",
  "--primary-pressed",
  "--accent",
  "--accent-hover",
  "--accent-pressed",
  "--success",
  "--success-hover",
  "--success-pressed",
  "--danger",
  "--danger-hover",
  "--danger-pressed",
] as const;

const INKS = [
  "--fg",
  "--fg-muted",
  "--primary-ink",
  "--accent-ink",
  "--success-ink",
  "--warning-ink",
  "--danger-ink",
  "--live",
] as const;

/**
 * ADR-0012 accepted a deviation here, so this assertion changed shape rather
 * than disappearing.
 *
 * DESIGN_LANGUAGE §2.2 asks a filled control to clear 4.5:1 against its own
 * label in every state. The shipped fills do not: white measures 2.80 to 3.89 (2.7967 at the worst,
 * `--accent-hover`) across the twelve brand and state fills, with HOVER the
 * worst case because it lightens the fill by L +0.030. Measured, written into
 * ADR-0012, and accepted for brand reasons by the product owner.
 *
 * Deleting the test would have been the easy move and the wrong one. It now
 * pins the floor at the level actually shipped, so the fills cannot drift any
 * further down without failing, and the gap to 4.5 stays visible to anyone
 * reading the file. Raise this number, never lower it.
 */
const ACCEPTED_FILL_CONTRAST_FLOOR = 2.75;

describe("design tokens — WCAG contrast", () => {
  it.each(FILLS)(
    "%s holds its white label at the ADR-0012 floor, below the §2.2 4.5:1",
    (name) => {
      const ratio = contrastRatio(token(name), WHITE);
      expect(ratio).toBeGreaterThanOrEqual(ACCEPTED_FILL_CONTRAST_FLOOR);
      // If this ever passes, the deviation is over: restore the 4.5 floor
      // above and close ADR-0012.
      expect(ratio).toBeLessThan(4.5);
    },
  );

  it.each(INKS)("%s reads on --surface at >= 4.5:1", (name) => {
    expect(
      contrastRatio(token(name), token("--surface")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("--warning carries its dark label at >= 4.5:1", () => {
    expect(
      contrastRatio(token("--warning"), token("--on-warning")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("the focus ring clears 3:1 against every ground it lands on (WCAG 1.4.11)", () => {
    const ring = token("--ring");
    for (const ground of ["--bg", "--surface", "--surface-elev"] as const) {
      expect(contrastRatio(ring, token(ground))).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("design tokens — ground ramp", () => {
  const RAMP = [
    "--bg",
    "--surface",
    "--surface-elev",
    "--surface-overlay",
  ] as const;

  it("steps by a uniform ΔL (the v2 ramp's raised tier was half-size)", () => {
    const steps = RAMP.map(token);
    const deltas = steps
      .slice(1)
      .map((s, i) => +(s.L - steps[i]!.L).toFixed(3));
    for (const d of deltas) expect(d).toBeCloseTo(0.04, 3);
  });

  it("locks every neutral to one hue (v2's --fg-muted was a C=0 orphan)", () => {
    for (const name of [...RAMP, "--fg", "--fg-muted", "--fg-subtle"] as const) {
      const t = token(name);
      expect(t.H).toBe(264);
      expect(t.C).toBeGreaterThan(0);
    }
  });
});

describe("design tokens — semantic separation", () => {
  it("keeps adjacent semantic hues >= 40 degrees apart (v2's minimum was 25)", () => {
    const hues = (
      [
        "--primary",
        "--danger",
        "--warning",
        "--success",
        "--live",
        "--accent",
      ] as const
    ).map((n) => token(n).H);

    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) {
        const raw = Math.abs(hues[i]! - hues[j]!);
        const separation = Math.min(raw, 360 - raw);
        expect(separation).toBeGreaterThanOrEqual(40);
      }
    }
  });
});

describe("design tokens — sRGB gamut", () => {
  it.each([...FILLS, ...INKS])("%s renders as specified in sRGB", (name) => {
    expect(isInGamut(token(name))).toBe(true);
  });
});

/**
 * Light theme. The dark ramp ascends toward light because `--bg` sits at
 * L 0.165 and has headroom; paper has none, so these guarantees are stated
 * separately rather than reusing the dark ramp's uniform-ΔL rule.
 */
describe("design tokens — light theme ground", () => {
  it("paper is pure white, not a slate tint", () => {
    const bg = lightToken("--bg");
    expect(bg.L).toBe(1);
    expect(bg.C).toBe(0);
  });

  it("raised and floating stay on paper (their tier is border + shadow)", () => {
    for (const name of ["--surface-elev", "--surface-overlay"] as const) {
      expect(lightToken(name).L).toBe(1);
    }
  });

  it("--surface recedes from paper so flat regions still read as a region", () => {
    expect(lightToken("--surface").L).toBeLessThan(lightToken("--bg").L);
  });

  it("body text clears 4.5:1 on paper", () => {
    expect(
      contrastRatio(lightToken("--fg"), lightToken("--bg")),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(lightToken("--fg-muted"), lightToken("--bg")),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

/**
 * WCAG 1.4.11 wants a control to be distinguishable from its surroundings.
 * A filled field satisfies that with the fill itself, which is why
 * `--control-border` is allowed to be a whisper rather than a 3:1 line.
 * If the fill ever flattens into the ground, the border has to carry the
 * job again — these tests fail first and say so.
 */
describe("design tokens — control surface identifies the field", () => {
  /**
   * 2026-08-19 â this used to require the fill to sit >= 0.020 below paper,
   * on the rule that a field is identified by its FILL. Product took the fill
   * to #FCFCFC (delta 0.009) because the heavier tint read as slate. The fill
   * no longer identifies the field, so the job moved to the hairline, and the
   * assertion moved with it. Both halves still have to hold: the fill stays
   * below paper, and the line stays strong enough to draw the box on its own.
   */
  it("the light field is carried by its hairline, not its fill", () => {
    const fill = lightToken("--control-surface");
    const bg = lightToken("--bg");
    const line = lightToken("--control-border");
    expect(fill.L).toBeLessThan(bg.L);
    expect(bg.L - line.L).toBeGreaterThanOrEqual(0.08);
  });

  it("the dark control fill lifts off the dark ground", () => {
    expect(token("--surface-elev").L).toBeGreaterThan(token("--bg").L + 0.05);
  });

  it("the control hairline is the strongest line in the light theme", () => {
    // Inverted 2026-08-19 with the assertion above. While the fill carried the
    // field the line could recede toward paper; now that the fill is nearly
    // paper itself, the line is the only thing drawing the control and has to
    // be at least as present as --border-strong. Dark is unchanged: there the
    // fill still lifts off the ground, so the line recedes toward it.
    expect(lightToken("--control-border").L).toBeLessThanOrEqual(
      lightToken("--border-strong").L,
    );
    expect(token("--control-border").L).toBeLessThan(
      token("--border-strong").L,
    );
  });
});
