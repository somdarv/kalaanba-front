import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { themeBootstrapScript } from "@/components/providers/theme-provider";

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

export const metadata: Metadata = {
  title: "Kalaanba — your game, on the record.",
  description:
    "Kalaanba runs grassroots football in Ghana — leagues, tournaments, and a verified record of every player's career.",
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
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-bg text-fg">
        <Script
          id="kalaanba-theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
