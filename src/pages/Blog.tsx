// Placeholder until the first post lands, in the same shell as the contact
// page. The heading is screen-reader only, so the page still has an h1.
export default function Blog() {
  return (
    <section className="px-6 pt-32 pb-24 sm:pt-40">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="sr-only">Blog</h1>
        <p className="font-mono text-sm text-muted">No posts yet. Check back soon.</p>
      </div>
    </section>
  );
}
