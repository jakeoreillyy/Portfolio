import { Reveal } from "./Reveal";
import { CapIcon } from "./icons";

const modules = [
  "Data Structures & Algorithms",
  "Generative AI Programming",
  "Databases",
  "Object-Oriented Programming",
  "Data Analysis",
];

export function Education() {
  return (
    <section id="education" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">Education</h2>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <div className="flex items-start gap-5 rounded-xl border border-line bg-surface p-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-line bg-accent/10 text-accent">
              <CapIcon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-mono text-[15px] font-medium text-foreground">
                  BSc Computer Science{" "}
                  <span className="text-accent">@ Technological University Dublin</span>
                </p>
                <p className="shrink-0 font-mono text-xs text-faint">2024 - 2028</p>
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
