import { Reveal } from "./Reveal";
import { Section } from "./Section";

const START = new Date(2024, 8, 1); // September 2024
const END = new Date(2028, 4, 31); // May 2028
const SPAN = END.getTime() - START.getTime();
const TOTAL_YEARS = 4;

const at = (date: Date) => Math.min(Math.max((date.getTime() - START.getTime()) / SPAN, 0), 1);

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

function yearOfStudy(now: Date) {
  const months =
    (now.getFullYear() - START.getFullYear()) * 12 + (now.getMonth() - START.getMonth());
  return Math.min(Math.max(Math.floor(months / 12) + 1, 1), TOTAL_YEARS);
}

export function Education() {
  const now = new Date();
  const progress = at(now);
  const currentYear = now.getFullYear();

  return (
    <Section id="education" title="Education">
      <Reveal delay={120} className="mt-10">
        <p className="font-display text-[clamp(1.3rem,2.3vw,1.7rem)] leading-[1.15] tracking-[-0.03em] text-foreground">
          BSc Computer Science
        </p>
        <p className="mt-1.5 text-sm text-muted">
          Technological University Dublin
          <span className="text-faint"> · </span>
          <span className="font-mono text-xs text-faint tabular-nums">3.5 GPA</span>
        </p>

        <div className="mt-9">
          <div className="relative h-px bg-line">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 bg-foreground"
              style={{ width: `${progress * 100}%` }}
            />
            <span
              aria-hidden
              className="absolute top-1/2 left-0 size-[7px] -translate-y-1/2 rounded-full bg-foreground"
            />
            {YEARS.map((year) => (
              <span
                key={year}
                aria-hidden
                className={`absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  year <= currentYear ? "bg-foreground" : "border border-faint bg-background"
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
            <span className="absolute left-0 whitespace-nowrap text-muted">Sep 2024</span>
            {YEARS.map((year) => (
              <span
                key={year}
                className={`absolute hidden -translate-x-1/2 sm:inline ${
                  year === currentYear ? "text-foreground" : "text-faint"
                }`}
                style={{ left: `${at(new Date(year, 0, 1)) * 100}%` }}
              >
                {year}
              </span>
            ))}
            <span className="absolute right-0 whitespace-nowrap text-muted">May 2028</span>
          </div>

          <p className="mt-3 font-mono text-[11px] text-faint">
            Year {yearOfStudy(now)} of {TOTAL_YEARS}
          </p>
        </div>

        <p className="mt-8 font-mono text-xs leading-loose text-faint">
          <span className="text-muted">Relevant coursework:</span> {modules.join(" · ")}
        </p>
      </Reveal>
    </Section>
  );
}
