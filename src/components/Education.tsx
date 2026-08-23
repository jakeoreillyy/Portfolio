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
              <p className="font-mono text-[15px] font-medium text-foreground">
                BSc Computer Science{" "}
                <span className="text-accent">@ Technological University Dublin</span>
              </p>
              <p className="shrink-0 font-mono text-xs text-faint">2024 - 2028</p>
            </div>

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
