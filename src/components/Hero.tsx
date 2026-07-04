import { Typewriter } from "./Typewriter";

const GITHUB_URL = "https://github.com/jakeoreillyy";
const LINKEDIN_URL = "https://www.linkedin.com/in/jake-o-reilly";

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.35 9.35 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function Hero() {
  return (
    <section id="top" className="flex min-h-screen items-center px-6 pt-16">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div className="text-center lg:text-left">
          <h1 className="fade-up font-mono text-5xl font-bold tracking-tight sm:text-6xl">
            Jake O'Reilly
          </h1>
          <p
            className="fade-up mt-5 text-[12px] sm:text-lg md:text-xl"
            style={{ animationDelay: "200ms" }}
            aria-label="Computer science student, software engineer, and AI engineer"
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
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-champagne"
            >
              <GitHubIcon />
              GitHub
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <LinkedInIcon />
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
              src="/profile.jpg"
              alt="Jake O'Reilly"
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
