import { Fragment } from "react";
import { WindowBar } from "./WindowBar";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

// Values are always lists; a single-element one prints unbracketed.
const facts: [key: string, values: string[]][] = [
  ["role", ["SWE Intern @ Speed-Deed"]],
  ["education", ["Computer Science @ TUD"]],
  ["location", ["Dublin, Ireland"]],
  ["focus", ["SWE", "AI", "Startups"]],
];

export function About() {
  return (
    <Section id="about" title="About">
      <div className="mt-10 grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,1fr)_1.1fr] md:gap-14">
        <Reveal className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <WindowBar filename="about.ts" />
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
              <span className="text-code-punct italic">// tl;dr</span>
              {"\n"}
              <span className="text-code-keyword">const</span>{" "}
              <span className="text-code-text">jake</span>{" "}
              <span className="text-code-punct">=</span>{" "}
              <span className="text-code-punct">{"{"}</span>
              {"\n"}
              {facts.map(([key, values]) => (
                <Fragment key={key}>
                  {"  "}
                  <span className="text-code-key">{key}</span>
                  <span className="text-code-punct">: {values.length > 1 && "["}</span>
                  {values.map((value, i) => (
                    <Fragment key={value}>
                      {i > 0 && <span className="text-code-punct">, </span>}
                      <span className="text-code-string">"{value}"</span>
                    </Fragment>
                  ))}
                  <span className="text-code-punct">{values.length > 1 && "]"},</span>
                  {"\n"}
                </Fragment>
              ))}
              <span className="text-code-punct">{"};"}</span>
            </pre>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="space-y-4 text-[15px] leading-relaxed text-muted">
            <p>
              I'm Jake, a computer science student at TU Dublin. I work across the whole stack
              because I want to understand how the pieces fit together. The part I enjoy most is
              taking something from a rough idea to a working product, then finding out what I got
              wrong along the way.
            </p>
            <p>
              In practice that means designing interfaces, building APIs, and hunting down the
              queries that make a dashboard slow. I care as much about how something feels to use as
              whether it holds up technically, and most of the time those turn out to be the same
              problem.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
