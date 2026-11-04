import { Section } from "./Section";
import { START, END, TOTAL_YEARS, at, yearOfStudy } from "../lib/studyProgress";

// Calendar-year checkpoints after the start. September sits about three
// quarters of the way through 2024, so the first gap is visibly the short one.
const YEARS = Array.from(
  { length: END.getFullYear() - START.getFullYear() },
  (_, i) => START.getFullYear() + 1 + i,
);

const modules = [
  "Data Structures & Algorithms",
  "Generative AI Programming",
  "Databases",
  "Object-Oriented Programming",
  "Data Analysis",
];

export function Education() {
  const now = new Date();
  const progress = at(now);
  const currentYear = now.getFullYear();

  return (
    <Section
      title="Education"
      srDetail="Computer science education of Jake O'Reilly, software engineer in Dublin, Ireland"
    >
      <div className="mt-10">
        <p className="font-display text-[clamp(1.3rem,2.3vw,1.7rem)] leading-[1.15] tracking-[-0.03em] text-foreground">
          BSc Computer Science
        </p>
        <p className="mt-1.5 text-sm text-muted">
          Technological University Dublin
          <span className="text-faint"> · </span>
          <span className="font-mono text-xs text-faint tabular-nums">3.5 GPA</span>
        </p>
      </div>

      <div>
        <div className="mt-9">
          <div className="relative mb-2 h-4 font-mono text-[11px] tabular-nums">
            <span className="absolute left-0 whitespace-nowrap text-muted">Sep 2024</span>
            <span className="absolute right-0 whitespace-nowrap text-muted">May 2028</span>
          </div>

          <div className="relative h-px bg-line">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 bg-accent"
              style={{ width: `${progress * 100}%` }}
            />
            <span
              aria-hidden
              className="absolute top-1/2 left-0 size-[7px] -translate-y-1/2 rounded-full bg-accent"
            />
            {YEARS.map((year) => (
              <span
                key={year}
                aria-hidden
                className={`absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  year <= currentYear ? "bg-accent" : "border border-faint bg-background"
                }`}
                style={{ left: `${at(new Date(year, 0, 1)) * 100}%` }}
              />
            ))}
            <span
              aria-hidden
              className="absolute top-1/2 right-0 size-[7px] -translate-y-1/2 rounded-full border border-faint bg-background"
            />
          </div>

          <div className="relative mt-3 h-4 font-mono text-[11px] tabular-nums">
            {YEARS.map((year) => (
              <span
                key={year}
                className={`absolute hidden -translate-x-1/2 sm:inline ${
                  year === currentYear ? "text-muted" : "text-faint"
                }`}
                style={{ left: `${at(new Date(year, 0, 1)) * 100}%` }}
              >
                {year}
              </span>
            ))}
          </div>

          <p className="mt-3 font-mono text-[11px] text-faint">
            Year {yearOfStudy(now)} of {TOTAL_YEARS}
          </p>
        </div>
      </div>

      <p className="mt-8 font-mono text-xs leading-loose text-faint">
        <span className="text-muted">Relevant coursework:</span> {modules.join(" · ")}
      </p>
    </Section>
  );
}
