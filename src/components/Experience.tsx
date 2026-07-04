import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

type Job = {
  role: string;
  org: string;
  date: string;
  badge?: string;
  description: string;
  tags: string[];
};

const jobs: Job[] = [
  {
    role: "Software Engineer Intern",
    org: "Speed-Deed",
    date: "Jun 2026 — Present",
    description:
      "Instrumented product analytics with PostHog on a React SPA and built an internal insights dashboard in Recharts to surface pipeline bottlenecks.",
    tags: ["React", "TypeScript", "PostHog", "Recharts"],
  },
  {
    role: "Founder Programme",
    org: "Hatch105",
    date: "May 2026",
    badge: "Top 1.5%",
    description:
      "Selected 1 of 27 from 1,700+ applicants. Built ClearStep, an AI tool turning raw Shopify data into prioritised actions via a Claude API pipeline.",
    tags: ["TypeScript", "Claude API", "AI"],
  },
  {
    role: "SWE Insight Programme",
    org: "Bank of America",
    date: "Apr 2026",
    badge: "1st place",
    description:
      "Placed 1st of 4 teams. Patched auth vulnerabilities with bcrypt and a JWT blacklist, and shipped a Savings Goals feature across 5 REST endpoints.",
    tags: ["Node.js", "PostgreSQL", "Zod", "Drizzle"],
  },
  {
    role: "Hackathon",
    org: "Workday",
    date: "Apr 2026",
    badge: "3rd place",
    description:
      "Built HushPath, a sensory-friendly journey planner scoring Dublin across 80m grids and generating noise-aware routes with the Google Maps API.",
    tags: ["Python", "REST APIs", "Google Maps"],
  },
];

export function Experience() {
  const railRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [fill, setFill] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    // Reduced motion: skip the scroll-linked animation, show it complete.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFill(rail.getBoundingClientRect().height);
      setActiveCount(jobs.length);
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = rail.getBoundingClientRect();
      // The rail fills down to a trigger line ~60% down the viewport.
      const trigger = window.innerHeight * 0.6;
      setFill(Math.max(0, Math.min(trigger - rect.top, rect.height)));

      let count = 0;
      for (const dot of dotRefs.current) {
        if (dot && dot.getBoundingClientRect().top <= trigger) count += 1;
      }
      setActiveCount(count);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="experience" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-sm text-faint">// where I've been</p>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">Experience</h2>
        </Reveal>

        <div ref={railRef} className="relative mt-10">
          {/* rail track + scroll-linked progress fill */}
          <span
            aria-hidden
            className="absolute bottom-0 left-[7px] top-0 w-0.5 -translate-x-1/2 rounded-full bg-line"
          />
          <span
            aria-hidden
            className="absolute left-[7px] top-0 w-0.5 -translate-x-1/2 rounded-full bg-accent"
            style={{ height: fill }}
          />

          {jobs.map((job, i) => (
            <Reveal key={job.org} delay={i * 90} className="relative pb-10 pl-8 last:pb-0">
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                aria-hidden
                className={`absolute left-[7px] top-1 size-[13px] -translate-x-1/2 rounded-full border-2 transition-colors duration-500 ${
                  i < activeCount ? "border-accent bg-accent" : "border-line bg-background"
                }`}
              />

              <div className="flex items-baseline justify-between gap-4">
                <p className="font-mono text-[15px] font-medium text-foreground">
                  {job.role} <span className="text-accent">@ {job.org}</span>
                  {job.badge && (
                    <span className="ml-2 rounded border border-accent/30 bg-accent/10 px-1.5 py-px align-[1px] font-mono text-[11px] text-accent">
                      {job.badge}
                    </span>
                  )}
                </p>
                <p className="shrink-0 font-mono text-xs text-faint">{job.date}</p>
              </div>

              <p className="mb-3 mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-line px-2 py-0.5 font-mono text-[11.5px] text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
