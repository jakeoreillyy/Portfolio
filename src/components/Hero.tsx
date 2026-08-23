import { Typewriter } from "./Typewriter";
import { GitHubIcon, LinkedInIcon } from "./icons";

const GITHUB_URL = "https://github.com/jakeoreillyy";
const LINKEDIN_URL = "https://www.linkedin.com/in/jake-o-reilly";

export function Hero() {
  return (
    <section id="top" className="flex min-h-screen items-center px-6 pt-16">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div className="text-center lg:text-left">
          <h1 className="fade-up font-display text-[clamp(2.75rem,7.5vw,6rem)] leading-[0.95] font-normal tracking-[-0.04em]">
            Jake O'Reilly
          </h1>
          {/* Typewriter carries its own sr-only description of the rotating roles. */}
          <p
            className="fade-up mt-5 text-[12px] sm:text-lg md:text-xl"
            style={{ animationDelay: "200ms" }}
          >
            <Typewriter />
          </p>
          <div
            className="fade-up mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            style={{ animationDelay: "300ms" }}
          >
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-bright"
            >
              <GitHubIcon size={16} />
              GitHub
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <LinkedInIcon size={16} />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="fade-up order-first lg:order-last" style={{ animationDelay: "150ms" }}>
          <div className="relative mx-auto aspect-square w-52 overflow-hidden rounded-full border border-line-strong ring-1 ring-accent/20 ring-offset-4 ring-offset-background sm:w-60 md:w-72">
            <div className="absolute inset-0 flex items-center justify-center bg-surface font-mono text-4xl text-faint">
              JO
            </div>
            <img
              src="/linkedin-pfp.webp"
              alt="Jake O'Reilly"
              width={600}
              height={600}
              fetchPriority="high"
              className="relative h-full w-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
