import type { ReactNode } from "react";

// Every home-page section shares this shell, so the width, rhythm and heading
// style are set once rather than copied per section.
// The label stays deliberately small: the entries below it carry the display
// type, so the eye lands on the company or project, not on the category.
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-mono text-[11px] tracking-[0.22em] text-faint uppercase">{title}</h2>
        {children}
      </div>
    </section>
  );
}
