import { Link } from "react-router-dom";
import { accentButton } from "../lib/styles";

// Rendered for any path no route matches. It uses the same frame and heading
// as the contact page.
export default function NotFound() {
  return (
    <section className="px-6 pt-32 pb-24 sm:pt-40">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.98] tracking-[-0.04em] text-balance">
          Page not found.
        </h1>
        <p className="mt-8 font-mono text-sm text-muted">
          There's nothing at this address. The page may have moved, or the link may be mistyped.
        </p>
        <Link to="/" className={`${accentButton} mt-8`}>
          Go to the home page
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
