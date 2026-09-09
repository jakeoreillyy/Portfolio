type Project = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  tags: string[];
  href?: string;
  link?: { label: string; kind: "repo" | "external" };
  image: { src: string; alt: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    id: "hushpath",
    title: "HushPath",
    eyebrow: "3rd place · Workday",
    description:
      "A sensory-friendly journey planner that scores Dublin city centre across 80m grid cells, using POI density from the Overpass and Nominatim APIs as a noise proxy. A custom waypoint algorithm then routes between any two points via the Google Maps API, favouring the quieter cells over the shortest path.",
    tags: ["Python", "Overpass API", "Nominatim API", "Google Maps", "REST API"],
    image: {
      src: "/hushpath.webp",
      alt: "HushPath, a route planner scoring a calm path across Dublin by POI density",
      width: 1615,
      height: 974,
    },
  },
  {
    id: "threadbase",
    title: "ThreadBase",
    eyebrow: "REST API",
    description:
      "A RESTful forum API with OAuth2 password-flow, JWT auth, and bcrypt-hashed credentials over a normalised 3-table Postgres schema. A GitHub Actions pipeline runs a 20+ case Pytest suite against a Dockerised Postgres container and only deploys once it passes.",
    tags: ["FastAPI", "Docker", "CI/CD", "PostgreSQL", "REST API"],
    href: "https://github.com/jakeoreillyy/threadbase",
    link: { label: "View repo", kind: "repo" },
    image: {
      src: "/threadbase.webp",
      alt: "ThreadBase, forum threads flowing into a Postgres database",
      width: 1535,
      height: 1024,
    },
  },
  {
    id: "startup-ranker",
    title: "Startup Ranker",
    eyebrow: "Web app",
    description:
      "A leaderboard that ranks startup ideas with an LLM as the judge rather than a fixed scoring formula, calling the Claude API through a FastAPI backend. New submissions are scored and folded into a single live ranking.",
    tags: ["LLM", "Anthropic", "FastAPI", "Python", "REST API"],
    href: "https://github.com/jakeoreillyy/Startup-Idea-Ranker",
    link: { label: "View repo", kind: "repo" },
    image: {
      src: "/ranker.webp",
      alt: "Startup Ranker, a scored startup leaderboard judged by an LLM",
      width: 1534,
      height: 1150,
    },
  },
  {
    id: "reservr",
    title: "Reservr",
    eyebrow: "Web app",
    description:
      "A multi-user library reservation system in PHP and MySQL, built on a normalised 4-table schema with strict server-side validation that blocks duplicate or conflicting bookings. Role-scoped access control and session auth keep concurrent reservations consistent.",
    tags: ["PHP", "MySQL", "MariaDB", "Full-stack", "Web app"],
    href: "https://github.com/jakeoreillyy/reservr",
    link: { label: "View repo", kind: "repo" },
    image: {
      src: "/reservr.webp",
      alt: "Reservr, a library booking system for reserving books",
      width: 1260,
      height: 610,
    },
  },
];
