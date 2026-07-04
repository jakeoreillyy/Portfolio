import { Reveal } from "./Reveal";

const modules = [
  "Data Structures & Algorithms",
  "Generative AI Programming",
  "Databases",
  "Object-Oriented Programming",
  "Data Analysis",
];

function CapIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}

export function Education() {
  return (
    <section id="education" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-sm text-faint">// the foundation</p>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">Education</h2>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <div className="flex items-start gap-5 rounded-xl border border-line bg-surface p-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-line bg-accent/10 text-accent">
              <CapIcon />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-mono text-[15px] font-medium text-foreground">
                  BSc Computer Science{" "}
                  <span className="text-accent">@ Technological University Dublin</span>
                </p>
                <p className="shrink-0 font-mono text-xs text-faint">2024 — 2028</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[11px] text-accent">
                  3.5 GPA
                </span>
                {modules.map((module) => (
                  <span
                    key={module}
                    className="rounded border border-line px-2 py-0.5 font-mono text-[11.5px] text-muted"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
