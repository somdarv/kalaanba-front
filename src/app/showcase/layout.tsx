import type { ReactNode } from "react";
import "./showcase.css";
import { KxThemeProvider } from "@/components/showcase/theme-provider";

// Inline script: applies the persisted theme class before paint to prevent FOUC.
const themeBootstrap = `
(function () {
  try {
    var stored = localStorage.getItem('kx-theme');
    var mode = stored === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.kxTheme = mode;
  } catch (e) {}
})();
`;

export const metadata = {
  title: "Kalaanba — UI Foundation",
  description: "Isolated component showcase for Kalaanba.",
};

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      <KxThemeProvider>{children}</KxThemeProvider>
    </>
  );
}
