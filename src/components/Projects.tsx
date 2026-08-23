import { ArrowUpRightIcon, GitHubIcon } from "./icons";
import { projects } from "../data/projects";
import { Reveal } from "./Reveal";
import { Section, Tag } from "./Section";
import { accentButton } from "../lib/styles";

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="mt-12 flex flex-wrap gap-6">
        {projects.map((project, i) => (
          <Reveal
            key={project.id}
            delay={i * 90}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <article className="flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-surface transition-[border-color,box-shadow] duration-300 ease-out hover:border-accent/40 hover:shadow-[0_0_28px_-10px_rgba(47,144,224,0.35)]">
              <div className="h-[150px] border-b border-line bg-background">
                <img
                  src={project.image.src}
                  alt={project.image.alt}
                  width={project.image.width}
                  height={project.image.height}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[10.5px] tracking-[0.14em] text-accent uppercase">
                  {project.eyebrow}
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <h3 className="font-display text-[1.5rem] leading-[1.15] tracking-[-0.03em] text-foreground">
                    {project.title}
                  </h3>
                  {project.href && project.link && (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title}, ${project.link.label}`}
                      className="flex size-[34px] shrink-0 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      {project.link.kind === "repo" ? (
                        <GitHubIcon size={16} />
                      ) : (
                        <ArrowUpRightIcon size={15} />
                      )}
                    </a>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>

                <p className="mt-3 mb-5 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                {project.href && project.link && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${accentButton} mt-auto self-start`}
                  >
                    {project.link.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
