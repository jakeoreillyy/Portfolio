export type ProjectPreview = "threadbase" | "hushpath" | "startupRanker" | "reservr";

export type Project = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  tags: string[];
  href?: string;
  link?: { label: string; kind: "repo" | "external" };
  preview: ProjectPreview;
};

export const projects: Project[] = [
  {
    id: "threadbase",
    title: "ThreadBase",
    eyebrow: "REST API",
    description:
      "A forum API secured with OAuth2 password-flow, JWT, and bcrypt over a normalised 3-table Postgres schema, with a Dockerised CI/CD pipeline that gates every deploy on a 20+ case Pytest suite.",
    tags: ["FastAPI", "Docker", "CI/CD", "PostgreSQL", "REST API"],
    href: "https://github.com/jakeoreillyy/threadbase",
    link: { label: "View repo", kind: "repo" },
    preview: "threadbase",
  },
  {
    id: "hushpath",
    title: "HushPath",
    eyebrow: "3rd place · Workday",
    description:
      "A sensory-friendly journey planner that scores Dublin across 80m grids via the Overpass and Nominatim APIs, then generates noise-aware routes favouring calmer cells over the shortest path.",
    tags: ["Python", "Overpass API", "Nominatim API", "Google Maps", "REST API"],
    preview: "hushpath",
  },
  {
    id: "startup-ranker",
    title: "Startup Ranker",
    eyebrow: "Web app",
    description:
      "An LLM-judged leaderboard that scores and ranks startup ideas by traction signals into a single live ranking.",
    tags: ["LLM", "Anthropic", "FastAPI", "Python", "REST API"],
    href: "https://github.com/jakeoreillyy/Startup-Idea-Ranker",
    link: { label: "View repo", kind: "repo" },
    preview: "startupRanker",
  },
  {
    id: "reservr",
    title: "Reservr",
    eyebrow: "Web app",
    description:
      "A multi-user library reservation system over a normalised 4-table MySQL schema, using role-scoped access control and strict server-side validation to block duplicate, conflicting bookings.",
    tags: ["PHP", "MySQL", "MariaDB", "Full-stack", "Web app"],
    href: "https://github.com/jakeoreillyy/reservr",
    link: { label: "View repo", kind: "repo" },
    preview: "reservr",
  },
];
