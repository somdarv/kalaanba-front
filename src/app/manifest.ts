import type { MetadataRoute } from "next";

/**
 * PWA web app manifest (served at /manifest.webmanifest, auto-linked by Next).
 *
 * To make the app installable, add the brand icon set at `public/icons/`
 * (192, 512, and a 512 maskable) and re-add the `icons` array below:
 *
 *   icons: [
 *     { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
 *     { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
 *     { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
 *   ]
 *
 * Left out for now so the manifest references no missing assets (no 404s).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kalaanba — Seeds of Play",
    short_name: "Kalaanba",
    description:
      "Grassroots football in Ghana — leagues, tournaments, and a verified record of every player's career.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b101d",
    theme_color: "#0b101d",
    categories: ["sports", "social"],
  };
}
