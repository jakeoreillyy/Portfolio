import { Fragment } from "react";
import { Reveal } from "./Reveal";

const facts: [string, string | string[]][] = [
  ["role", "Software Engineer @ Speed-Deed"],
  ["education", "Computer Science @ TUD"],
  ["location", "Dublin, Ireland"],
  ["focus", ["SWE", "AI", "Startups"]],
];

export function About() {
  return (
    <section id="about" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-sm text-faint">// who I am</p>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">About</h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,1fr)_1.1fr] md:gap-14">
          <Reveal className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                <span className="size-2 rounded-full bg-accent" />
                <span className="font-mono text-xs text-muted">about.ts</span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
                <span className="text-faint italic">// a quick snapshot</span>
                {"\n"}
                <span className="text-muted">const</span>{" "}
                <span className="text-foreground">jake</span> <span className="text-faint">=</span>{" "}
                <span className="text-faint">{"{"}</span>
                {"\n"}
                {facts.map(([key, value]) => (
                  <Fragment key={key}>
                    {"  "}
                    <span className="text-muted">{key}</span>
                    <span className="text-faint">: </span>
                    {Array.isArray(value) ? (
                      <>
                        <span className="text-faint">[</span>
                        {value.map((item, i) => (
                          <Fragment key={item}>
                            <span className="text-accent">"{item}"</span>
                            {i < value.length - 1 && <span className="text-faint">, </span>}
                          </Fragment>
                        ))}
                        <span className="text-faint">]</span>
                      </>
                    ) : (
                      <span className="text-accent">"{value}"</span>
                    )}
                    <span className="text-faint">,</span>
                    {"\n"}
                  </Fragment>
                ))}
                <span className="text-faint">{"};"}</span>
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
      </div>
    </section>
  );
}
