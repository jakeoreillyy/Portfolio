// TODO(jake): confirm the Startup Ranker summary/tags and swap generated
// previews for real screenshots where you have them.

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
      "A forum API with OAuth2 auth and a Dockerised CI/CD pipeline that gates every deploy on a 20+ case test suite.",
    tags: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    href: "https://github.com/jakeoreillyy/threadbase",
    link: { label: "View repo", kind: "repo" },
    preview: "threadbase",
  },
  {
    id: "hushpath",
    title: "HushPath",
    eyebrow: "3rd place · Workday",
    description:
      "A sensory-friendly journey planner scoring Dublin on an 80m grid, routing around noise instead of the shortest path.",
    tags: ["Python", "Overpass API", "Google Maps"],
    preview: "hushpath",
  },
  {
    id: "startup-ranker",
    title: "Startup Ranker",
    eyebrow: "Web app",
    description: "Scores and ranks startups by traction signals into a single live leaderboard.",
    tags: ["TypeScript", "React", "Supabase"],
    href: "https://github.com/jakeoreillyy/Startup-Idea-Ranker",
    link: { label: "View repo", kind: "repo" },
    preview: "startupRanker",
  },
  {
    id: "reservr",
    title: "Reservr",
    eyebrow: "Web app",
    description:
      "A multi-user library booking system with role-scoped access and validation that blocks duplicate, conflicting bookings.",
    tags: ["PHP", "MySQL"],
    href: "https://github.com/jakeoreillyy/reservr",
    link: { label: "View repo", kind: "repo" },
    preview: "reservr",
  },
];
