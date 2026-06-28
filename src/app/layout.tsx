import type { Metadata, Viewport } from "next";
import { Inter, Sora, Archivo } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeScript } from "@/components/providers/theme-script";
import { ToastProvider } from "@/components/ui";

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

// Kept configured but unused — flip --font-sans / --font-display in globals.css
// to var(--font-archivo) to try it. Google Fonts has no standalone "Archivo
// Condensed"; Archivo is a variable font with a width (wdth) axis instead.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b101d" },
    { media: "(prefers-color-scheme: light)", color: "#f8f9fb" },
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
      className={`${inter.variable} ${sora.variable} ${archivo.variable}`}
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
