import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
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
      className={`${inter.variable} ${sora.variable}`}
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
      <body className="min-h-dvh bg-bg text-fg">
        <ThemeProvider>
          <AppProviders>
            <ToastProvider>{children}</ToastProvider>
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
