"use client";

import { Component, type ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Renders `fallback` instead of crashing when an image fails to render.
 *
 * **Why this exists.** `next/image` THROWS during render when its `src` points
 * at a host absent from `images.remotePatterns`. It does not fire `onError` and
 * it cannot be caught with a try — it takes down the whole route. One stale URL
 * in one row is therefore enough to make `/me` unreachable for that player,
 * which is what happened when a stored photo outlived a change of media host.
 *
 * That failure mode is wrong for this content. A player photo is decoration on
 * a surface whose job is reporting a record; the record should still be
 * readable when the face will not load. Initials are a complete fallback.
 *
 * **It degrades, it does not hide.** An unconfigured host is a real
 * misconfiguration and a silent fallback would let it ship unnoticed, so the
 * error goes to Sentry with the `src` attached. The UI recovers; the signal
 * survives. Do not "simplify" this by dropping the capture.
 *
 * A class because React error boundaries have no hook equivalent.
 */

export type ImageBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  /** Attached to the Sentry report so a bad host is identifiable from it. */
  src?: string | null;
};

type State = { hasFailed: boolean };

export class ImageBoundary extends Component<ImageBoundaryProps, State> {
  override state: State = { hasFailed: false };

  static getDerivedStateFromError(): State {
    return { hasFailed: true };
  }

  override componentDidCatch(error: Error): void {
    Sentry.captureException(error, {
      tags: { area: "image-render" },
      extra: { src: this.props.src ?? null },
    });
  }

  /**
   * A changed `src` clears the failure.
   *
   * Without this the boundary latches: a player whose stored photo was
   * unreachable would keep seeing initials after uploading a working one,
   * because the component never re-attempts a render it has already failed.
   */
  override componentDidUpdate(previous: ImageBoundaryProps): void {
    if (previous.src !== this.props.src && this.state.hasFailed) {
      this.setState({ hasFailed: false });
    }
  }

  override render(): ReactNode {
    return this.state.hasFailed ? this.props.fallback : this.props.children;
  }
}
