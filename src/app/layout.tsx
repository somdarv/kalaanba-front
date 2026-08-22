import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeScript } from "@/components/providers/theme-script";
import { ToastProvider } from "@/components/ui";
import { FORCED_THEME } from "@/lib/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * The signature on a player card (ADR-0016).
 *
 * One weight, read by exactly one component. A third typeface is a real cost on
 * a phone paying by the megabyte, so the bargain is that it earns its place by
 * doing something the other two cannot: a signature is handwriting, and Sora
 * set at an angle is just Sora at an angle.
 *
 * **Chic Budapest, supplied rather than chosen from Google.** It is a licensed
 * face the team brought to the project, self-hosted through `next/font/local`
 * so it is subsetted, preloaded and served from our own origin like the other
 * two. Google's script faces are still rendered side by side on the design page
 * for comparison; the constraint that ruled most of them out is that the
 * signature sits at roughly 60% opacity on a saturated card ground, where
 * hairline calligraphy disappears.
 *
 * **It ships as TTF, not WOFF2**, because that is the format it arrived in.
 * That is roughly double the bytes a WOFF2 of the same face would cost. Worth
 * converting before this reaches production.
 *
 * The CSS variable is named for the ROLE, not the family, so swapping the face
 * is one line here rather than a change in `globals.css` as well.
 */
const signature = localFont({
  src: "./fonts/Chic-Budapest.ttf",
  variable: "--font-signature-face",
  weight: "400",
  style: "normal",
  display: "swap",
  // The name is already on the card twice as real text; if this face fails the
  // signature should still look like handwriting rather than like body copy.
  fallback: ["Segoe Script", "Snell Roundhand", "cursive"],
});

// Archivo was configured here "to try it" and never referenced — no CSS ever
// read --font-archivo, but next/font still emitted the @font-face and shipped
// a variable font with a wdth axis on every route. Removed in
// WP-20260812-oklch-token-migration; re-add it the day something uses it.

const THEME_COLOR_DARK = "#0a0e16";
const THEME_COLOR_LIGHT = "#ffffff";

export const metadata: Metadata = {
  title: "Kalaanba — your game, on the record.",
  description:
    "Kalaanba runs grassroots football in Ghana — leagues, tournaments, and a verified record of every player's career.",
  applicationName: "Kalaanba",
  appleWebApp: {
    capable: true,
    title: "Kalaanba",
    statusBarStyle: "black-translucent",
  },
  // Phone numbers are entered deliberately in auth flows — stop iOS from
  // auto-linking digits elsewhere.
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Lets sticky CTAs (KeyboardFooter) ride above the on-screen keyboard
  // instead of being overlaid by it (DESIGN_LANGUAGE.md §9.2).
  interactiveWidget: "resizes-content",
  // Must track --bg or the iOS status bar and Android system bar drift away
  // from the app (DESIGN_LANGUAGE §9.4). Hex, not oklch: theme-color parsing
  // is inconsistent across mobile browsers. These are the sRGB renderings of
  // oklch(0.165 0.018 264) and oklch(1.000 0.000 264).
  //
  // Under the theme lock the pair collapses to a single unconditional colour.
  // A `prefers-color-scheme: dark` entry would hand a dark-set phone a dark
  // status bar over a light app — exactly the drift §9.4 exists to stop.
  // Clear FORCED_THEME and the pair comes back.
  themeColor: FORCED_THEME
    ? [
        {
          color:
            FORCED_THEME === "light" ? THEME_COLOR_LIGHT : THEME_COLOR_DARK,
        },
      ]
    : [
        { media: "(prefers-color-scheme: dark)", color: THEME_COLOR_DARK },
        { media: "(prefers-color-scheme: light)", color: THEME_COLOR_LIGHT },
      ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${signature.variable}`}
      // Stamped server-side so the locked theme is already right in the first
      // byte of HTML — no flash, nothing to resolve on the client. Both go
      // `undefined` when the lock lifts, and <ThemeScript> takes the job back.
      data-theme={FORCED_THEME ?? undefined}
      data-theme-choice={FORCED_THEME ? "locked" : undefined}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-bg text-fg min-h-dvh">
        <ThemeProvider>
          <AppProviders>
            <ToastProvider>{children}</ToastProvider>
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
