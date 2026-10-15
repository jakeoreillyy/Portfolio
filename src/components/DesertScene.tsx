import { useEffect, useRef } from "react";

// The blog's empty-state scene. Its drawing code loads only once this mounts,
// keeping it out of the main bundle; the prerendered HTML carries just this
// empty, decorative <svg>, which also holds the space so nothing shifts when
// the drawing appears.
export function DesertScene({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;
    // Only decoration, so if the chunk fails to load (offline, or a tab left
    // open across a deploy) the page just goes without it.
    import("../lib/desertScene").then(
      ({ mountDesertScene }) => {
        if (!cancelled) cleanup = mountDesertScene(svg);
      },
      () => {},
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`pointer-events-none ${className}`}
    />
  );
}
