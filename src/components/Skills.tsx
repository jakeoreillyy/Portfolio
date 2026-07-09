import { Fragment } from "react";
import type { ReactNode } from "react";
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

// Minimal JSX syntax-highlight tokens.
const P = ({ children }: { children: ReactNode }) => <span className="text-faint">{children}</span>;
const Tag = ({ children }: { children: ReactNode }) => (
  <span style={{ color: "#6f9ceb" }}>{children}</span>
);
const Attr = ({ children }: { children: ReactNode }) => (
  <span style={{ color: "#b98cd9" }}>{children}</span>
);
const Str = ({ children }: { children: ReactNode }) => (
  <span className="text-accent">{children}</span>
);

type Line =
  | { kind: "code"; indent: number; content: ReactNode }
  | { kind: "tokens"; indent: number; skills: Skill[] };

const lines: Line[] = [
  { kind: "code", indent: 0, content: <><P>&lt;</P><Tag>Skills</Tag><P>&gt;</P></> },
  ...groups.flatMap((g): Line[] => [
    {
      kind: "code",
      indent: 1,
      content: (
        <>
          <P>&lt;</P>
          <Tag>Category</Tag> <Attr>name</Attr>
          <P>=</P>
          <Str>"{g.label}"</Str>
          <P>&gt;</P>
        </>
      ),
    },
    { kind: "tokens", indent: 2, skills: g.skills },
    { kind: "code", indent: 1, content: <><P>&lt;/</P><Tag>Category</Tag><P>&gt;</P></> },
  ]),
  { kind: "code", indent: 0, content: <><P>&lt;/</P><Tag>Skills</Tag><P>&gt;</P></> },
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

function FileCodeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-accent"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  );
}

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-sm text-faint">// what I build with</p>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">Skills</h2>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="flex items-center gap-2 border-b border-line bg-white/[0.02] px-4 py-2.5">
              <FileCodeIcon />
              <span className="font-mono text-xs text-muted">Skills.tsx</span>
            </div>

            <div className="overflow-x-auto px-3 py-4 font-mono text-[13px] leading-[1.9] sm:px-5">
              <div className="grid grid-cols-[auto_1fr] gap-x-4">
                {lines.map((line, i) => (
                  <Fragment key={i}>
                    <span className="select-none pt-1 text-right text-faint/70 tabular-nums">
                      {i + 1}
                    </span>
                    <div style={{ paddingLeft: `${line.indent * 2}ch` }}>
                      {line.kind === "code" ? (
                        <span className="leading-[2.1]">{line.content}</span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 py-1">
                          {line.skills.map((skill) => (
                            <Token key={skill.name} skill={skill} />
                          ))}
                        </div>
                      )}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
