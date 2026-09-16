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
  const { ROUTES } = await vite.ssrLoadModule("/src/lib/routeMeta.ts");

  for (const route of ROUTES) {
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
      route === "/" ? path.join(distDir, "index.html") : path.join(distDir, route, "index.html");
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, doc);
    console.log(`Prerendered ${route} -> ${path.relative(distDir, outPath)}`);
  }
} finally {
  await vite.close();
}
