import { CapIcon } from "./icons";
import { Reveal } from "./Reveal";
import { Section, Tag } from "./Section";

const modules = [
  "Data Structures & Algorithms",
  "Generative AI Programming",
  "Databases",
  "Object-Oriented Programming",
  "Data Analysis",
];

export function Education() {
  return (
    <Section id="education" title="Education">
      <Reveal delay={120} className="mt-10">
        <div className="flex items-start gap-5 rounded-xl border border-line bg-surface p-6">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-line bg-accent/10 text-accent">
            <CapIcon size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-display text-[clamp(1.3rem,2.3vw,1.7rem)] leading-[1.15] tracking-[-0.03em] text-foreground">
                BSc Computer Science
              </p>
              <p className="shrink-0 font-mono text-xs text-faint">2024 - 2028</p>
            </div>
            <p className="mt-1.5 text-sm text-muted">Technological University Dublin</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <Tag accent>3.5 GPA</Tag>
              {modules.map((module) => (
                <Tag key={module}>{module}</Tag>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
