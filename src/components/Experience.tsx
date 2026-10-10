import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/prefersReducedMotion";
import { Section } from "./Section";

type Job = {
  role: string;
  org: string;
  date: string;
  description: string;
};

const jobs: Job[] = [
  {
    role: "Software Development Engineer Intern",
    org: "Amazon Web Services",
    date: "Incoming Feb 2027",
    description: "Serverless cloud computing and infrastructure on the AWS Lambda team.",
  },
  {
    role: "Software Engineer Intern",
    org: "Speed-Deed",
    date: "Jun 2026 - Present",
    description: "Building a pre-sale property and conveyancing platform for the Irish market.",
  },
  {
    role: "Algorithms Workshop Participant",
    org: "Google",
    date: "Jul 2026 - Aug 2026",
    description: "Technical programme on algorithmic problem-solving.",
  },
  {
    role: "Founder Programme Participant",
    org: "Hatch105",
    date: "May 2026",
    description: "Founder accelerator turning technical ideas into viable products.",
  },
  {
    role: "SWE Insight Programme",
    org: "Bank of America",
    date: "Apr 2026",
    description: "Building secure financial applications.",
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
    if (prefersReducedMotion()) {
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
    <Section
      id="experience"
      title="Experience"
      srDetail="Software engineering work experience of Jake O'Reilly"
    >
      <div ref={railRef} className="relative mt-10">
        {/* rail track + scroll-linked progress fill */}
        <span
          aria-hidden
          className="absolute bottom-0 left-[7px] top-0 w-px -translate-x-1/2 bg-line"
        />
        <span
          aria-hidden
          className="absolute left-[7px] top-0 w-px -translate-x-1/2 bg-accent"
          style={{ height: fill }}
        />

        {jobs.map((job, i) => (
          <div key={`${job.org} ${job.date}`} className="relative pb-20 pl-10 last:pb-0">
            <span
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              aria-hidden
              className={`absolute left-[7px] top-[14px] size-[13px] -translate-x-1/2 rounded-full border-2 transition-colors duration-500 ${
                i < activeCount ? "border-accent bg-accent" : "border-line bg-background"
              }`}
            />

            <div className="grid gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_9rem] md:items-baseline md:gap-x-6 lg:gap-x-10 md:gap-y-0">
              <div>
                <p className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.05] tracking-[-0.035em] text-foreground">
                  {job.org}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-faint">{job.role}</p>
              </div>

              <p className="max-w-[60ch] text-base leading-relaxed text-muted md:text-[17px]">
                {job.description}
              </p>

              <p className="order-first font-mono text-[11px] uppercase leading-relaxed tracking-[0.04em] text-faint md:order-none md:text-right">
                {job.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
