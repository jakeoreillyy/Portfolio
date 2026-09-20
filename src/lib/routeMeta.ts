export const SITE = "https://www.jakeoreilly.dev";

// Per-route metadata: the <title> and description search engines index, plus
// the Open Graph title and description shown on shared link previews. Keeping
// them distinct stops crawlers from seeing duplicate metadata across the
// indexed URLs. The client updates these on navigation; the prerender step
// bakes the right set into each route's static HTML.
export type RouteMeta = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
};

export const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: "Jake O'Reilly | Software Engineer in Dublin, Ireland",
    description:
      "Jake O'Reilly, software engineer based in Dublin, Ireland. Explore projects, work experience, education, and skills, or get in touch directly.",
    ogTitle: "Jake O'Reilly, Software Engineer",
    ogDescription:
      "Computer science student and software engineer in Dublin. Projects, experience, and how to get in touch.",
  },
  "/contact": {
    title: "Contact | Jake O'Reilly, Software Engineer in Dublin",
    description:
      "Get in touch with Jake O'Reilly, a software engineer based in Dublin, Ireland, by message, email, LinkedIn, GitHub, or X.",
    ogTitle: "Contact Jake O'Reilly",
    ogDescription:
      "Get in touch with Jake O'Reilly, a software engineer based in Dublin, Ireland, by message, email, LinkedIn, GitHub, or X.",
  },
};

// The routes the build prerenders, so that list stays tied to the metadata
// rather than being repeated in scripts/prerender.mjs. A route added to App
// still needs an entry above, but it then gets prerendered for free.
export const ROUTES = Object.keys(ROUTE_META);

// React Router matches "/contact/" as "/contact", so metadata and canonical
// URLs are keyed on the path without trailing slashes.
export function normalizePath(pathname: string) {
  return pathname.replace(/(.)\/+$/, "$1");
}

// Unknown paths fall back to the home metadata (the client redirects them to /).
export function metaForPath(pathname: string): RouteMeta {
  return ROUTE_META[normalizePath(pathname)] ?? ROUTE_META["/"];
}
