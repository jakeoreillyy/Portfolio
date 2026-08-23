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
              I'm Jake, a computer science student at TU Dublin with an interest in full stack
              development and AI. I enjoy building software that solves real problems, especially
              when I can take an idea from a rough concept to something people genuinely enjoy
              using.
            </p>
            <p>
              I like working across the whole stack because I enjoy understanding how everything
              fits together. Whether I'm designing an interface, building APIs, or improving
              performance behind the scenes, I like thinking about both the technical details and
              the experience for the person using it.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
