// Runs after `vite build`. Renders each route to static HTML in Node via
// react-dom/server (see src/entry-server.tsx), then bakes that markup and the
// route's metadata into the built index.html — so crawlers that don't execute
// JS (and AI crawlers that don't wait for it) still see the real page content.
//
// The client bundle still loads and re-renders on top afterwards (main.tsx
// uses createRoot, not hydrateRoot), so this only changes what's in the
// initial HTML, not how the site behaves for visitors.
import { createServer } from "vite";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve(import.meta.dirname, "..", "dist");
const ROOT_DIV = '<div id="root"></div>';

// The Vite-built index.html, used as the shell for every route. Read once up
// front so overwriting dist/index.html (the "/" route) doesn't affect it.
const template = await readFile(path.join(distDir, "index.html"), "utf8");

// A previous run's output already has markup in the root div, so it can't act
// as the shell. Check up front, since the alternative is a confusing failure
// on the root-div replacement after the render work is done.
if (!template.includes(ROOT_DIV)) {
  throw new Error("prerender: dist/index.html is already prerendered, run `vite build` first");
}

// Every substitution goes through here so a template change that breaks a
// pattern fails the build, instead of silently shipping the empty shell or
// the home page's metadata.
function mustReplace(html, pattern, replacer) {
  if (!html.match(pattern)) throw new Error(`prerender: template has no match for ${pattern}`);
  return html.replace(pattern, replacer);
}

// Everything substituted below lands in element text or inside a double-quoted
// attribute, so a stray quote or ampersand in a description would otherwise
// truncate the tag or be read as an entity.
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

// Replace the content="" of the <meta> carrying the given attribute (e.g.
// name="description" or property="og:url"). [^>]* also spans newlines, so it
// matches whether or not the build kept the tag on one line.
function setMetaContent(html, attr, value) {
  const re = new RegExp(`(<meta[^>]*${attr}[^>]*content=")[^"]*(")`);
  return mustReplace(html, re, (_m, before, after) => before + escapeHtml(value) + after);
}

function applyRoute(html, body, meta, url) {
  html = mustReplace(
    html,
    /<title>[^<]*<\/title>/,
    () => `<title>${escapeHtml(meta.title)}</title>`,
  );
  html = setMetaContent(html, 'name="description"', meta.description);
  html = setMetaContent(html, 'property="og:title"', meta.ogTitle);
  html = setMetaContent(html, 'property="og:description"', meta.ogDescription);
  html = setMetaContent(html, 'property="og:url"', url);
  html = mustReplace(
    html,
    /(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/,
    (_m, before, after) => before + escapeHtml(url) + after,
  );
  // The template's robots meta applies to every page. A noindex page (the 404)
  // adds noindex in front of it rather than a second robots tag.
  if (meta.noindex) {
    html = mustReplace(
      html,
      /(<meta[^>]*name="robots"[^>]*content=")/,
      (_m, before) => `${before}noindex, `,
    );
  }
  return mustReplace(html, ROOT_DIV, () => `<div id="root">${body}</div>`);
}

const vite = await createServer({
  appType: "custom",
  // Its own cache dir, so building doesn't invalidate the dev server's
  // optimized deps (and noDiscovery skips a client-side dep scan this pass
  // has no use for: nothing here is served to a browser).
  cacheDir: "node_modules/.vite-prerender",
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});

try {
  const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
  // Taking the route list from where the route metadata lives means a new
  // route can't be added to the site and silently miss being prerendered.
  const { ROUTES, SITE } = await vite.ssrLoadModule("/src/lib/routeMeta.ts");

  // No route matches this path, so it renders the app's NotFound page. That
  // goes to the root 404.html, which Vercel serves with a real 404 status for
  // any path no file or rewrite matches. Its canonical and og:url come out as
  // /404, which is itself a 404, so they can't point crawlers at a real page.
  const NOT_FOUND_ROUTE = "/404";

  for (const route of [...ROUTES, NOT_FOUND_ROUTE]) {
    const { html: body, meta, url } = render(route);

    // Rendering goes through Vite's dev loader, which resolves asset imports
    // to dev-only URLs (/src/…, /@fs/…) that 404 in the built output. Nothing
    // imports assets today (images all come from public/); fail the build if
    // that changes rather than baking dead URLs into the static HTML.
    if (/\/(?:src|@fs|@vite)\//.test(body)) {
      throw new Error(`prerender: ${route} markup has dev URLs, not built asset paths`);
    }

    const doc = applyRoute(template, body, meta, url);

    const outPath =
      route === "/"
        ? path.join(distDir, "index.html")
        : route === NOT_FOUND_ROUTE
          ? path.join(distDir, "404.html")
          : path.join(distDir, route, "index.html");
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, doc);
    console.log(`Prerendered ${route} -> ${path.relative(distDir, outPath)}`);
  }

  // Built from ROUTES so a new page is listed without a hand edit. Every deploy
  // rebuilds every page, so the build date stands in as lastmod.
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = ROUTES.map(
    (route) =>
      `  <url>\n    <loc>${SITE}${route}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
  );
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
  await writeFile(path.join(distDir, "sitemap.xml"), sitemap);
  console.log("Wrote sitemap.xml");
} finally {
  await vite.close();
}
