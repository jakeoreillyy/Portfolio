import { DesertScene } from "../components/DesertScene";

// Placeholder until the first post lands: a one-line note and a tumbleweed
// rolling through the empty page. The heading is screen-reader only, so the
// page still has an h1.
export default function Blog() {
  return (
    <section className="[--scene-h:min(42svh,300px)] relative min-h-svh px-6 pt-32 pb-(--scene-h) sm:pt-40">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="sr-only">Blog</h1>
        <p className="font-mono text-sm text-muted">No posts yet. Check back soon.</p>
      </div>
      {/* Pinned to the bottom of the first screen, full width, and scaled with
          the screen's height. It sits in the section's bottom padding, which
          is the same height, so on a screen too short for both the page grows
          rather than letting the drawing run into the note. */}
      <DesertScene className="absolute inset-x-0 bottom-0 h-(--scene-h) w-full" />
    </section>
  );
}
