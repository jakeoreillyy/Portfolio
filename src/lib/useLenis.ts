import { useEffect } from "react";
import Lenis from "lenis";

export function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // reduced motion: let native anchor jumps (with scroll-margin-top) handle it
      return;
    }

    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 });

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;

      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      // "#top" scrolls to 0 even on pages without a #top element (e.g. /contact)
      const target = document.querySelector(hash);
      if (hash !== "#top" && !target) return;

      event.preventDefault();
      // lerp matches the manual wheel feel and scales with distance;
      // header clearance comes from each section's scroll-mt (respected by Lenis)
      lenis.scrollTo(hash === "#top" ? 0 : (target as HTMLElement), { lerp: 0.1 });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);
}
