import type { ReactElement } from "react";
import { Reveal } from "./Reveal";
import { projects } from "../data/projects";
import type { Project } from "../data/projects";

function GithubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

function ThreadBasePreview() {
  const threads = [
    { votes: 42, title: "Structuring FastAPI dependencies", meta: "jake · 12 replies" },
    { votes: 17, title: "Alembic vs. raw migrations?", meta: "ada · 5 replies" },
    { votes: 8, title: "JWT blacklist on logout", meta: "sam · 3 replies" },
  ];
  return (
    <div className="h-full bg-surface">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="font-mono text-[11px] font-medium text-accent">ThreadBase</span>
        <span className="rounded border border-line bg-background px-2 py-0.5 font-mono text-[8.5px] text-faint">
          search…
        </span>
      </div>
      <div className="flex flex-col gap-2.5 px-3 py-2.5">
        {threads.map((thread) => (
          <div key={thread.title} className="flex items-center gap-2.5">
            <div className="w-6 shrink-0 text-center">
              <div className="text-[8px] leading-none text-faint">▲</div>
              <div className="font-mono text-[11px] text-accent">{thread.votes}</div>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10.5px] text-foreground">{thread.title}</p>
              <p className="mt-px font-mono text-[8px] text-faint">{thread.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HushPathPreview() {
  return (
    <div className="h-full bg-background">
      <div className="flex items-center gap-1.5 border-b border-line px-2.5 py-[7px]">
        <span className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[8.5px] text-muted">
          Trinity
        </span>
        <span className="font-mono text-[9px] text-faint">→</span>
        <span className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[8.5px] text-muted">
          IFSC
        </span>
        <span className="ml-auto font-mono text-[8.5px] text-accent">12 min · quiet</span>
      </div>
      <svg viewBox="0 0 320 113" className="block h-[113px] w-full">
        <defs>
          <pattern id="hushpath-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#1c1c22" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="320" height="113" fill="url(#hushpath-grid)" />
        <rect x="176" y="10" width="48" height="48" fill="#e9cc5a" opacity="0.06" />
        <rect x="44" y="66" width="48" height="34" fill="#e9cc5a" opacity="0.06" />
        <polyline
          points="42,88 96,80 122,50 198,32 268,24"
          fill="none"
          stroke="#e9cc5a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="42" cy="88" r="5" fill="#0b0b0e" stroke="#5c5c66" strokeWidth="2" />
        <circle cx="268" cy="24" r="5" fill="#e9cc5a" />
      </svg>
    </div>
  );
}

function StartupRankerPreview() {
  const rows = [
    { rank: "1", name: "Acme", width: "92%", score: "92", fill: "bg-accent", dim: false },
    { rank: "2", name: "Nova", width: "74%", score: "78", fill: "bg-accent opacity-75", dim: false },
    { rank: "3", name: "Flux", width: "56%", score: "61", fill: "bg-accent opacity-[.55]", dim: false },
    { rank: "4", name: "Orbit", width: "40%", score: "44", fill: "bg-accent opacity-40", dim: true },
  ];
  return (
    <div className="h-full bg-surface">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="font-mono text-[10.5px] font-medium text-foreground">Leaderboard</span>
        <span className="font-mono text-[8.5px] text-faint">Q2 · 128 tracked</span>
      </div>
      <div className="flex flex-col gap-2.5 px-3 py-2.5">
        {rows.map((row) => (
          <div key={row.name} className="flex items-center gap-2.5">
            <span className={`w-3 font-mono text-[11px] ${row.dim ? "text-faint" : "text-accent"}`}>
              {row.rank}
            </span>
            <span className="w-11 font-mono text-[10px] text-muted">{row.name}</span>
            <span className="h-[7px] flex-1 overflow-hidden rounded bg-line">
              <span className={`block h-full ${row.fill}`} style={{ width: row.width }} />
            </span>
            <span
              className={`w-[18px] text-right font-mono text-[9.5px] ${
                row.dim ? "text-faint" : row.rank === "1" ? "text-accent" : "text-muted"
              }`}
            >
              {row.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReservrPreview() {
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const slots = [
    false, true, false, false, true,
    true, false, false, true, false,
    false, false, true, false, false,
  ];
  return (
    <div className="h-full bg-surface">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="font-mono text-[10.5px] font-medium text-foreground">Study rooms</span>
        <span className="rounded bg-accent px-2 py-0.5 font-mono text-[8.5px] text-background">Book</span>
      </div>
      <div className="px-3 py-2.5">
        <div className="mb-2 flex gap-[7px]">
          {days.map((day) => (
            <span key={day} className="w-full text-center font-mono text-[8px] text-faint">
              {day}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-[7px]">
          {slots.map((booked, i) => (
            <span
              key={i}
              className={`h-[19px] rounded ${booked ? "bg-accent/85" : "border border-line"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const previews = {
  threadbase: ThreadBasePreview,
  hushpath: HushPathPreview,
  startupRanker: StartupRankerPreview,
  reservr: ReservrPreview,
} satisfies Record<Project["preview"], () => ReactElement>;

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-sm text-faint">// things I've built</p>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">Projects</h2>
        </Reveal>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2">
          {projects.map((project, i) => {
            const Preview = previews[project.preview];
            return (
              <Reveal key={project.id} delay={i * 90}>
                <article>
                  <div className="h-[150px] overflow-hidden rounded-[10px] border border-line">
                    <Preview />
                  </div>

                  <p className="mt-4 font-mono text-[10.5px] tracking-[0.14em] text-accent uppercase">
                    {project.eyebrow}
                  </p>

                  <div className="mt-1.5 flex items-center justify-between gap-3">
                    <h3 className="font-mono text-lg font-medium text-foreground">{project.title}</h3>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} — ${project.link.label}`}
                      className="flex size-[34px] shrink-0 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      {project.link.kind === "repo" ? <GithubIcon /> : <ArrowUpRightIcon />}
                    </a>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>

                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-accent/40 px-3.5 py-1.5 font-mono text-[13px] text-accent transition-colors hover:border-accent hover:bg-accent hover:text-background"
                  >
                    {project.link.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
