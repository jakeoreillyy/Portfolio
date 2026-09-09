import { Reveal } from "./Reveal";
import { Section } from "./Section";

// Logo filenames in /public/logos are the skill name lowercased with every
// separator stripped ("Node.js" -> nodejs, "GitHub Actions" -> githubactions).
const groups: Record<string, string[]> = {
  Languages: ["Python", "SQL", "TypeScript", "JavaScript", "Java", "PHP", "C", "HTML5", "CSS3"],
  "Frameworks & Libraries": ["FastAPI", "Node.js", "React", "SQLAlchemy", "Pytest", "Tailwind CSS"],
  Databases: ["PostgreSQL", "MySQL", "Supabase"],
  "Developer Tools & Platforms": [
    "Git",
    "GitHub Actions",
    "Docker",
    "Amazon Web Services",
    "Google Cloud",
    "Cloudflare",
    "Linux",
    "Vercel",
    "Heroku",
  ],
};

const logoFor = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="mt-10 space-y-8">
        {Object.entries(groups).map(([label, skills], i) => (
          <Reveal key={label} delay={i * 90}>
            {/* Label, then a hairline running out to the section edge. */}
            <div className="flex items-center gap-3.5">
              <h3 className="font-display text-[1.05rem] tracking-[-0.02em] text-foreground">
                {label}
              </h3>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>

            {/* Logo board: the mark carries each entry, name sits underneath. */}
            <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-x-3 gap-y-6">
              {skills.map((name) => (
                <span key={name} className="group flex flex-col items-center gap-2.5 text-center">
                  <span className="grid size-[34px] place-items-center">
                    <img
                      src={`/logos/${logoFor(name)}.svg`}
                      alt=""
                      aria-hidden
                      width={34}
                      height={34}
                      loading="lazy"
                      className="size-full object-contain"
                    />
                  </span>
                  <span className="text-[11px] leading-tight text-muted transition-colors group-hover:text-foreground">
                    {name}
                  </span>
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
