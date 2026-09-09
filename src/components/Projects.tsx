import { useState } from "react";
import { ArrowUpRightIcon, GitHubIcon } from "./icons";
import { projects } from "../data/projects";
import { Reveal } from "./Reveal";
import { Section, Tag } from "./Section";
import { accentButton } from "../lib/styles";

// The section reads as an index: the list on the left is every project at a
// glance, and selecting a row swaps the single preview on the right. The frame
// is a fixed height so nothing shifts between projects, and the screenshot is
// contained rather than cropped so no edge is lost.
export function Projects() {
  const [active, setActive] = useState(0);
  const project = projects[active];

  const step = (delta: number) =>
    setActive((i) => (i + delta + projects.length) % projects.length);

  return (
    <Section id="projects" title="Projects">
      <Reveal className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-[minmax(0,18rem)_1fr]">
        <div
          className="flex flex-col self-start"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              step(1);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              step(-1);
            }
          }}
        >
          {projects.map((p, i) => {
            const on = i === active;
            return (
              <button
                key={p.id}
                type="button"
                aria-current={on}
                onClick={() => setActive(i)}
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

        <div className="grid gap-8 md:h-[24rem] md:grid-cols-[minmax(0,24rem)_1fr]">
          <div key={project.id} className="swap-in relative h-56 overflow-hidden md:h-full">
            <img
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>

          <div key={`${project.id}-text`} className="swap-in flex flex-col gap-4">
            <h3 className="font-display text-[clamp(1.6rem,3.4vw,2.2rem)] leading-[1.05] tracking-[-0.035em] text-foreground">
              {project.title}
            </h3>
            <p className="max-w-[52ch] text-sm leading-relaxed text-muted">
              {project.description}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
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
      </Reveal>
    </Section>
  );
}
