// Read the user's reduced-motion preference. Guarded so it can be called
// during render, including in the Node prerender pass where `window` is
// undefined. There it reports false, so the static markup is the animated
// starting state; the client then renders from scratch with the real value.
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
