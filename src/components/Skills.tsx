import { Reveal } from "./Reveal";

type Skill = { name: string; logo: string };
type Group = { label: string; skills: Skill[] };

const s = (name: string, logo: string): Skill => ({ name, logo });

const groups: Group[] = [
  {
    label: "Languages",
    skills: [
      s("Python", "python"),
      s("SQL", "sql"),
      s("TypeScript", "typescript"),
      s("JavaScript", "javascript"),
      s("Java", "java"),
      s("PHP", "php"),
      s("C", "c"),
      s("HTML5", "html5"),
      s("CSS3", "css3"),
    ],
  },
  {
    label: "Frameworks & Libraries",
    skills: [
      s("FastAPI", "fastapi"),
      s("Node.js", "nodejs"),
      s("React", "react"),
      s("SQLAlchemy", "sqlalchemy"),
      s("Pytest", "pytest"),
      s("Tailwind CSS", "tailwindcss"),
    ],
  },
  {
    label: "Databases",
    skills: [s("PostgreSQL", "postgresql"), s("MySQL", "mysql"), s("Supabase", "supabase")],
  },
  {
    label: "Developer Tools & Platforms",
    skills: [
      s("Git", "git"),
      s("GitHub Actions", "githubactions"),
      s("Docker", "docker"),
      s("AWS", "aws"),
      s("Google Cloud", "googlecloud"),
      s("Linux", "linux"),
      s("Vercel", "vercel"),
      s("Heroku", "heroku"),
    ],
  },
];

function Token({ skill }: { skill: Skill }) {
  return (
    <span className="group inline-flex items-center gap-2 rounded-md border border-line bg-white/[0.03] px-2.5 py-1.5 align-middle transition-colors hover:border-accent/50 hover:bg-white/[0.05]">
      <img
        src={`/logos/${skill.logo}.svg`}
        alt=""
        aria-hidden
        loading="lazy"
        className="h-[18px] w-[18px] object-contain"
      />
      <span className="text-[13px] text-muted transition-colors group-hover:text-foreground">
        {skill.name}
      </span>
    </span>
  );
}

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">Skills</h2>
        </Reveal>

        <div className="mt-10 space-y-7">
          {groups.map((group, i) => (
            <Reveal key={group.label} delay={i * 90}>
              {/* Label, then a hairline running out to the section edge. */}
              <div className="flex items-center gap-3.5">
                <h3 className="font-mono text-[11px] tracking-[0.17em] text-muted uppercase">
                  {group.label}
                </h3>
                <span aria-hidden className="h-px flex-1 bg-line" />
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                {group.skills.map((skill) => (
                  <Token key={skill.name} skill={skill} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
