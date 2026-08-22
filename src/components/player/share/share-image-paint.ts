"use client";

/**
 * Canvas primitives for the share graphic.
 *
 * **Why the share image is drawn rather than screenshotted.** The card on
 * screen is built from `mask-image`, `mix-blend-mode`, `color-mix()` and OKLCH
 * — the four things every DOM-to-image library gets wrong, because none of them
 * is a browser. Rasterising the node would hand a player a broken version of
 * their own card to send to a club.
 *
 * Drawing it also lets the share image be its own object rather than a picture
 * of a web page: 4:5 at poster scale, no controls, no scrollbar, and a foot
 * that says where it came from. That is what a share graphic is for, and it is
 * what §15 asks for when it names "static share images for WhatsApp" and "a
 * live URL that stays current" as two different things.
 *
 * This file knows how to paint. It holds no opinion about the card's layout —
 * that lives in `share-image.ts`.
 */

/**
 * Turn any CSS colour the app can express into one canvas accepts.
 *
 * Canvas `fillStyle` silently keeps its previous value when handed something
 * it cannot parse, so an unsupported `oklch()` would not throw — it would paint
 * the last colour used and look like a layout bug. Letting the browser's own
 * style engine resolve it first removes the guess: whatever `getComputedStyle`
 * returns is `rgb()` or `rgba()`, which every canvas has understood forever.
 */
export function resolveColor(value: string): string {
  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.color = value.trim();
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || "#000";
}

/** Read a design token off `:root` and resolve it to `rgb()`. */
export function tokenColor(name: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  return resolveColor(raw || "#000");
}

/**
 * The family list behind a font token.
 *
 * `next/font` writes the generated family names into these variables, so this
 * returns something like `'__Sora_1a2b3c', '__Sora_Fallback_1a2b3c'` — usable
 * verbatim in the canvas `font` shorthand. Falls back to a stack rather than to
 * nothing: a share image in the wrong font still reads.
 */
export function tokenFont(name: string, fallback: string): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return raw ? `${raw}, ${fallback}` : fallback;
}

/**
 * Mix two resolved colours. Canvas has no `color-mix()`, and the card's
 * gradients are built on it.
 */
export function mixColors(from: string, to: string, amount: number): string {
  const a = parseRgb(from);
  const b = parseRgb(to);
  const at = Math.min(1, Math.max(0, amount));
  const channel = (x: number, y: number) => Math.round(x + (y - x) * at);
  return `rgb(${channel(a[0], b[0])}, ${channel(a[1], b[1])}, ${channel(a[2], b[2])})`;
}

/** `rgba()` from a resolved colour plus an alpha. */
export function withAlpha(color: string, alpha: number): string {
  const [r, g, b] = parseRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function parseRgb(color: string): [number, number, number] {
  const parts = color.match(/-?\d*\.?\d+/g);
  if (!parts || parts.length < 3) return [0, 0, 0];
  return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
}

/**
 * Load an image for compositing.
 *
 * `crossOrigin` is not optional here. A canvas that has drawn an image from
 * another origin without CORS headers is tainted, and a tainted canvas throws
 * on `toBlob` — the share would fail at the last step, after the work, with an
 * error that names none of this. Requesting CORS up front turns that into a
 * clean load failure the caller can fall back from.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (!src.startsWith("data:")) image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });
}

/** Paint an alpha-master PNG (the wordmark) in a flat colour. */
export function paintMask(
  image: HTMLImageElement,
  width: number,
  height: number,
  color: string,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const context = canvas.getContext("2d");
  if (context) {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "source-in";
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  return canvas;
}

/** Draw an image cropped to fill a circle, the way `object-cover` would. */
export function drawCircularImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  centreX: number,
  centreY: number,
  radius: number,
): void {
  const edge = Math.min(image.width, image.height);
  const sourceX = (image.width - edge) / 2;
  const sourceY = (image.height - edge) / 2;

  context.save();
  context.beginPath();
  context.arc(centreX, centreY, radius, 0, Math.PI * 2);
  context.clip();
  context.drawImage(
    image,
    sourceX,
    sourceY,
    edge,
    edge,
    centreX - radius,
    centreY - radius,
    radius * 2,
    radius * 2,
  );
  context.restore();
}

export function roundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

/**
 * Shorten text until it fits, ending in an ellipsis.
 *
 * The ONE place the product is allowed one: copy rule 6 bans the ellipsis from
 * things we write, and this is not a thing we wrote — it is the universal mark
 * for a name the frame could not hold. A stage name cut off mid-letter with no
 * mark reads as a rendering fault.
 */
export function fitText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (context.measureText(text).width <= maxWidth) return text;

  let clipped = text;
  while (clipped.length > 1) {
    clipped = clipped.slice(0, -1);
    if (context.measureText(`${clipped}…`).width <= maxWidth) {
      return `${clipped}…`;
    }
  }
  return clipped;
}

/**
 * A grain layer, so the ground reads as a material rather than a swatch —
 * the same job `CARD_GRAIN` does on screen.
 *
 * Generated once per render into a small tile and repeated. Per-pixel noise
 * across 1080x1350 is over a million random calls; a 96px tile is nine
 * thousand, and at this opacity the repeat is invisible.
 */
export function grainPattern(
  context: CanvasRenderingContext2D,
  tile = 96,
): CanvasPattern | null {
  const canvas = document.createElement("canvas");
  canvas.width = tile;
  canvas.height = tile;

  const tileContext = canvas.getContext("2d");
  if (!tileContext) return null;

  const data = tileContext.createImageData(tile, tile);
  for (let index = 0; index < data.data.length; index += 4) {
    const value = 120 + Math.floor(Math.random() * 136);
    data.data[index] = value;
    data.data[index + 1] = value;
    data.data[index + 2] = value;
    data.data[index + 3] = 255;
  }
  tileContext.putImageData(data, 0, 0);

  return context.createPattern(canvas, "repeat");
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not encode the card image."));
    }, "image/png");
  });
}
