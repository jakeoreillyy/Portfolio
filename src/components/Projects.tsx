import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowUpRightIcon, GitHubIcon } from "./icons";
import { projects } from "../data/projects";
import { Section } from "./Section";
import { accentButton } from "../lib/styles";

const tabId = (id: string) => `project-tab-${id}`;
const panelId = (id: string) => `project-panel-${id}`;

// The section reads as an index: the list on the left is every project at a
// glance, and selecting a row swaps the single preview on the right. The frame
// is a fixed height so nothing shifts between projects, and the screenshot is
// contained rather than cropped so no edge is lost.
export function Projects() {
  const [active, setActive] = useState(0);
  const project = projects[active];
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Vertical tabs with automatic activation: the arrow keys (wrapping at the
  // ends), Home and End move focus, and the focused tab is the selected one.
  // Moving focus too means Enter or Space can't jump back to a stale tab.
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const count = projects.length;
    let next: number;
    if (e.key === "ArrowDown") next = (i + 1) % count;
    else if (e.key === "ArrowUp") next = (i - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section
      title="Projects"
      srDetail="Software engineering projects built by Jake O'Reilly"
    >
      {/* Only the active project's description renders visibly (see below) —
          this lists all of them for crawlers, since clicking through the
          index isn't something a crawler does. Hidden from assistive tech so
          screen-reader users don't hear the active project described twice. */}
      <div className="sr-only" aria-hidden="true">
        {projects.map((p) => (
          <p key={`${p.id}-sr`}>
            <strong>{p.title}</strong>: {p.description}
          </p>
        ))}
      </div>

      <div className="mt-12 grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <div
          role="tablist"
          aria-label="Projects"
          aria-orientation="vertical"
          className="flex flex-col self-start"
        >
          {projects.map((p, i) => {
            const on = i === active;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={tabId(p.id)}
                aria-selected={on}
                aria-controls={panelId(p.id)}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className="flex w-full cursor-pointer items-baseline gap-3 border-b border-line py-4 text-left first:pt-0"
              >
                <span
                  className={`font-mono text-[11px] tabular-nums transition-colors ${
                    on ? "text-foreground" : "text-faint"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-display text-lg leading-tight tracking-[-0.02em] transition-colors ${
                    on ? "text-foreground" : "text-faint"
                  }`}
                >
                  {p.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Focusable itself because its first content (the screenshot and
            heading) isn't, so Tab from the list lands on the panel. */}
        <div
          role="tabpanel"
          id={panelId(project.id)}
          aria-labelledby={tabId(project.id)}
          tabIndex={0}
          className="grid gap-8 xl:h-[24rem] xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]"
        >
          <div key={project.id} className="swap-in relative h-56 overflow-hidden xl:h-full">
            {project.image && (
              <img
                src={project.image.src}
                alt={project.image.alt}
                width={project.image.width}
                height={project.image.height}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-contain"
              />
            )}
          </div>

          <div key={`${project.id}-text`} className="swap-in flex flex-col gap-4">
            <h3 className="font-display text-[clamp(1.6rem,3.4vw,2.2rem)] leading-[1.05] tracking-[-0.035em] text-foreground">
              {project.title}
            </h3>
            <p className="max-w-[52ch] text-sm leading-relaxed text-muted">{project.description}</p>
            {project.href && project.link && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${accentButton} mt-2 self-start`}
              >
                {project.link.kind === "repo" ? (
                  <GitHubIcon size={15} />
                ) : (
                  <ArrowUpRightIcon size={14} />
                )}
                {project.link.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
