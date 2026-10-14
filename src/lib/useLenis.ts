import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./prefersReducedMotion";

// Shared handle so route changes can drive the same Lenis
// instance instead of fighting it with raw window.scrollTo calls.
export const lenisRef: { current: Lenis | null } = { current: null };

export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) {
      // reduced motion: browsers jump "#top" links to the top natively
      return;
    }

    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
    lenisRef.current = lenis;

    // Smooth-scrolls the footer's "Back to top" link instead of jumping.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (!(event.target as HTMLElement).closest('a[href="#top"]')) return;

      event.preventDefault();
      // lerp matches the manual wheel feel and scales with distance
      lenis.scrollTo(0, { lerp: 0.1 });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);
}
