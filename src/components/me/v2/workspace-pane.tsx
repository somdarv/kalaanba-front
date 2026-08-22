"use client";

import type { ElementType, ReactNode } from "react";

import { Divider, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * The panel the `/me/v2` workspace is built out of.
 *
 * v2 borrows a desktop-app shape: a small number of distinct panels sitting on
 * the ground rather than a stack of cards inside a page. That reads as one
 * built object instead of a list of boxes, which is DESIGN_LANGUAGE §1.1
 * ("weight, depth, and intention in every surface ... no floating").
 *
 * Composes an `.elev-*` recipe rather than re-deriving it (§2.4: "compose the
 * class; do not re-derive the recipe"). It is not `<Card>` because a pane owns
 * its own scrolling and wants the padding INSIDE the scroller, so a padded box
 * with the scroll on the outside would clip its own heading against the
 * rounded corner.
 *
 * On `.elev-soft` while WP-20260822-me-soft-cards runs, so both `/me` shapes
 * are judged under the same surface treatment. Comparing two layouts across
 * two card recipes answers neither question.
 *
 * `--radius-panel` on purpose. §2.3 puts hero and feature panels on the
 * generous end of the shape scale and cards on the tight end; these are the
 * page's structure, and the one true card inside them keeps 20px so it still
 * reads as an object sitting in a panel.
 *
 * The scroll bar is hidden (`kx-scroll-none`) for the reason the v1 columns
 * hid theirs: three bars side by side inside a composed surface read as a
 * rendering fault, and every pane's scrollability is already evident from its
 * content clipping at the fold.
 */

export type WorkspacePaneProps = {
  children: ReactNode;
  /** Landmark element. `nav` for the rail, `section` for content panes. */
  as?: Extract<ElementType, "div" | "section" | "aside" | "nav">;
  /** Names the landmark for screen readers. */
  label?: string;
  className?: string;
  /** Classes for the inner scroller (padding, gap, layout). */
  contentClassName?: string;
};

export function WorkspacePane({
  children,
  as: Tag = "section",
  label,
  className,
  contentClassName,
}: WorkspacePaneProps) {
  return (
    <Tag
      aria-label={label}
      className={cn(
        "elev-soft rounded-panel flex flex-col",
        // The pane only becomes its own scroll context once the workspace
        // stops the document scrolling, which is `lg` and up.
        "lg:min-h-0 lg:overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "kx-scroll-none flex flex-col p-4 sm:p-5",
          "lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain",
          contentClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}

/**
 * A hairline with its label sitting in the middle of it.
 *
 * The divider that names what comes next, rather than one that only separates.
 * Used once per pane, above the thing the pane exists for, so the reader gets
 * a beat before the object arrives.
 */
export function PaneLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Divider className="flex-1" />
      <Eyebrow tone="subtle">{children}</Eyebrow>
      <Divider className="flex-1" />
    </div>
  );
}
