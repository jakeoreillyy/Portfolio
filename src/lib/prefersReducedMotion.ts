// Read the user's reduced-motion preference. Guarded so it reports false in the
// Node prerender pass, where `window` is undefined. Don't read it during render
// before hydration is done (see useHydrated in ./hydration): the client's first
// render has to match the prerendered markup, which assumed motion.
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
