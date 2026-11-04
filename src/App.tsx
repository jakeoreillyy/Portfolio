import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useLenis, lenisRef } from "./lib/useLenis";
import { SITE, metaForPath, normalizePath } from "./lib/routeMeta";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function setMetaContent(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
}

// Keep the title, description, robots, Open Graph and canonical tags in step with the
// current route (the prerender pass bakes the same set into each static page).
function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaForPath(pathname);
    const url = `${SITE}${normalizePath(pathname)}`;
    document.title = meta.title;
    setMetaContent('meta[name="description"]', meta.description);
    setMetaContent('meta[property="og:title"]', meta.ogTitle);
    setMetaContent('meta[property="og:description"]', meta.ogDescription);
    setMetaContent('meta[property="og:url"]', url);

    // The 404 page adds noindex in front of the robots directives index.html
    // gives every page. Other pages drop it again, since a visit can start on
    // the 404 page and navigate from there.
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (robots) {
      const rest = robots.content.replace(/^noindex, /, "");
      robots.content = meta.noindex ? `noindex, ${rest}` : rest;
    }

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;
  }, [pathname]);

  return null;
}

// Start each page at the top when switching routes.
function ScrollReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = lenisRef.current;

    if (lenis) {
      // The outgoing page's dimensions are still cached until Lenis's
      // resize observer catches up, so refresh them before scrolling.
      lenis.resize();
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

// The app's content, independent of which router wraps it: BrowserRouter on
// the client (below), StaticRouter in the prerender pass (entry-server.tsx).
export function AppRoutes() {
  useLenis();

  return (
    <>
      <RouteMeta />
      <ScrollReset />
      <Nav />
      {/* At least a full screen tall, so on short pages the footer waits
          below the fold instead of riding up into view. */}
      <main className="min-h-svh">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
