import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppRoutes } from "./App";
import { SITE, metaForPath, normalizePath, type RouteMeta } from "./lib/routeMeta";

// Renders a route to static HTML in Node (no browser). The prerender script
// injects the returned markup and metadata into the built index.html so
// crawlers that don't run JS still see the real page. Effects don't run under
// renderToString, so the third-party scripts they inject (Analytics,
// reCAPTCHA) never appear in this output and need no stripping.
export function render(route: string): { html: string; meta: RouteMeta; url: string } {
  const html = renderToString(
    <StaticRouter location={route}>
      <AppRoutes />
    </StaticRouter>,
  );

  return { html, meta: metaForPath(route), url: `${SITE}${normalizePath(route)}` };
}
