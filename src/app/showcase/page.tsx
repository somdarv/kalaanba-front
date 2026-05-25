import type { Metadata } from "next";
import { ShowcaseClient } from "./showcase-client";

export const metadata: Metadata = {
  title: "Showcase · Kalaanba Design System",
  description:
    "Live gallery of every Kalaanba component in every variant and state.",
};

export default function ShowcasePage() {
  return <ShowcaseClient />;
}
