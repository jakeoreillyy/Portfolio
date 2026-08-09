import { Reveal } from "./Reveal";
import { ArrowUpRightIcon, GitHubIcon } from "./icons";
import { projects } from "../data/projects";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">Projects</h2>
        </Reveal>

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
                    <h3 className="font-mono text-lg font-medium text-foreground">
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
                      <span
                        key={tag}
                        className="rounded border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-muted"
                      >
                        {tag}
                      </span>
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
                      className="mt-auto inline-flex items-center gap-1.5 self-start rounded-lg border border-accent/40 px-3.5 py-1.5 font-mono text-[13px] text-accent transition-colors hover:border-accent hover:bg-accent hover:text-background"
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
      </div>
    </section>
  );
}
