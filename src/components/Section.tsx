import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Every home-page section shares this shell, so the width, rhythm, heading
// style and scroll offset are set once rather than copied per section.
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">{title}</h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

// Small metadata pill: neutral for tech tags, accent for awards and results.
export function Tag({ accent, children }: { accent?: boolean; children: ReactNode }) {
  return (
    <span
      className={`rounded border px-2 py-0.5 font-mono text-[11.5px] ${
        accent ? "border-accent/30 bg-accent/10 text-accent" : "border-line text-muted"
      }`}
    >
      {children}
    </span>
  );
}
