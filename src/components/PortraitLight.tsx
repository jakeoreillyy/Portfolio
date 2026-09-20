import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/prefersReducedMotion";

// Glyphs from sparse to dense: a cell under the light climbs this ramp.
const RAMP = " .:-=+*#%@";

// Target cell width in CSS px. The source art's own glyphs are too small to read
// at hero size, so the light redraws them a size up, where they read as text.
const CELL = 6.2;

// Halo spread as a fraction of the portrait's width. The lift is part flat, so
// the dark ground glows a little, and part scaled by the cell's own brightness,
// so the face stays the brightest thing under the light rather than washing out.
const SPREAD = 0.13;
const LIFT_FLAT = 0.35;
const LIFT_SCALED = 0.6;

// Time constants in ms: the fade settles in about 400ms either way, and the
// halo trails the cursor just enough to feel soft rather than stuck to it.
const FADE_MS = 130;
const TRAIL_MS = 45;

// Gaussian falloff at 0, 1, 1.5, 2 and 3 sigma, for the mask gradient.
const MASK_STOPS: [offset: number, alpha: number][] = [
  [0, 1],
  [1 / 3, Math.exp(-0.5)],
  [1 / 2, Math.exp(-1.125)],
  [2 / 3, Math.exp(-2)],
  [1, 0],
];

// Deterministic per-cell grain, re-rolled a few times a second while lit.
function shimmer(col: number, row: number, tick: number) {
  const n = Math.sin(col * 12.9898 + row * 78.233 + tick * 0.613) * 43758.5453;
  return (n - Math.floor(n)) * 0.06;
}

// Laid over the hero portrait: redraws it as characters around the cursor, as
// if a light were held up to it. The canvas stays empty until the pointer
// arrives, so the image underneath (still the LCP element, with its alt text
// and prerendered markup) looks exactly as it did. Listens on its parent, which
// is the portrait circle.
export function PortraitLight({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    // Touch has no hover to light anything with, and reduced motion opts out
    // the same way the typewriter and smooth scroll do.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (prefersReducedMotion() || !finePointer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ink =
      getComputedStyle(document.documentElement).getPropertyValue("--color-foreground").trim() ||
      "#f2f2f2";

    let size = 0;
    let cols = 0;
    let rows = 0;
    let cw = CELL;
    let ch = CELL * 1.6;
    let grid: Float32Array | null = null;

    let raf = 0;
    let last = 0;
    let strength = 0;
    let target = 0;
    let px = 0;
    let py = 0;
    let hx = 0;
    let hy = 0;

    // Same file the <img> already loaded, so this comes straight from cache.
    const img = new Image();

    // Downsample the portrait into one brightness value per cell.
    const sample = () => {
      if (!img.complete || !img.naturalWidth || !cols) return;
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d");
      if (!o) return;
      // The default "low" quality point-samples a ~20x shrink, so each cell
      // lands on a stroke or a gap at random instead of averaging its area.
      o.imageSmoothingQuality = "high";
      o.drawImage(img, 0, 0, cols, rows);
      const data = o.getImageData(0, 0, cols, rows).data;
      grid = new Float32Array(cols * rows);
      for (let i = 0; i < grid.length; i++) {
        const lum = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) / 255;
        grid[i] = Math.min(1, Math.pow(lum, 0.72) * 1.75);
      }
    };

    // Cells are sized to divide the circle exactly, so the redrawn grid sits in
    // register with the image beneath it.
    const resize = () => {
      size = canvas.clientWidth;
      if (!size) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.round(size / CELL);
      cw = size / cols;
      rows = Math.round(size / (cw * 1.6));
      ch = size / rows;
      sample();
    };

    const draw = (now: number) => {
      if (!grid) return;
      const sigma = size * SPREAD;
      const reach = sigma * 3;

      // Mask the fine texture under the light so the two glyph grids don't
      // stack. Black is the image's own ground, not a theme colour.
      const mask = ctx.createRadialGradient(hx, hy, 0, hx, hy, reach);
      for (const [offset, alpha] of MASK_STOPS) {
        mask.addColorStop(offset, `rgba(0, 0, 0, ${alpha * strength})`);
      }
      ctx.fillStyle = mask;
      ctx.fillRect(hx - reach, hy - reach, reach * 2, reach * 2);

      ctx.font = `${ch}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";
      ctx.fillStyle = ink;

      // Only the cells the halo can reach.
      const c0 = Math.max(0, Math.floor((hx - reach) / cw));
      const c1 = Math.min(cols - 1, Math.ceil((hx + reach) / cw));
      const r0 = Math.max(0, Math.floor((hy - reach) / ch));
      const r1 = Math.min(rows - 1, Math.ceil((hy + reach) / ch));
      const tick = Math.floor(now / 160);
      const twoSigmaSq = 2 * sigma * sigma;

      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const dx = (c + 0.5) * cw - hx;
          const dy = (r + 0.5) * ch - hy;
          const fall = Math.exp(-(dx * dx + dy * dy) / twoSigmaSq);
          const a = fall * strength;
          if (a < 0.02) continue;
          const base = grid[r * cols + c];
          const d = Math.min(
            1,
            base + fall * (LIFT_FLAT + LIFT_SCALED * base) + shimmer(c, r, tick),
          );
          const glyph = RAMP[Math.round(d * (RAMP.length - 1))];
          if (glyph === " ") continue;
          ctx.globalAlpha = a * (0.2 + d * 0.8);
          ctx.fillText(glyph, c * cw, r * ch);
        }
      }
      ctx.globalAlpha = 1;
    };

    // Runs only while the light is on or fading out; idle costs nothing.
    const frame = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      strength += (target - strength) * (1 - Math.exp(-dt / FADE_MS));
      const trail = 1 - Math.exp(-dt / TRAIL_MS);
      hx += (px - hx) * trail;
      hy += (py - hy) * trail;

      ctx.clearRect(0, 0, size, size);
      if (target === 0 && strength < 0.004) {
        strength = 0;
        raf = 0;
        last = 0;
        return;
      }
      draw(now);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      px = event.clientX - rect.left;
      py = event.clientY - rect.top;
      // Start the halo where the cursor came in, not where it last left.
      if (event.type === "pointerenter") {
        hx = px;
        hy = py;
      }
      target = 1;
      start();
    };

    const onLeave = () => {
      target = 0;
      start();
    };

    img.addEventListener("load", sample);
    img.src = src;

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    host.addEventListener("pointerenter", onPointer);
    host.addEventListener("pointermove", onPointer);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      img.removeEventListener("load", sample);
      host.removeEventListener("pointerenter", onPointer);
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
