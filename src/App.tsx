import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useLenis, lenisRef } from "./lib/useLenis";
import { SITE, metaForPath, normalizePath } from "./lib/routeMeta";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";

function setMetaContent(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
}

// Start each page at the top when switching routes, or jump to the
// hashed section if the destination URL carries one (e.g. /#projects).
function ScrollReset() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const meta = metaForPath(pathname);
    const url = `${SITE}${normalizePath(pathname)}`;
    document.title = meta.title;
    setMetaContent('meta[name="description"]', meta.description);
    setMetaContent('meta[property="og:title"]', meta.ogTitle);
    setMetaContent('meta[property="og:description"]', meta.ogDescription);
    setMetaContent('meta[property="og:url"]', url);

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;
  }, [pathname]);

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    const lenis = lenisRef.current;

    if (lenis) {
      // The outgoing page's dimensions are still cached until Lenis's
      // resize observer catches up, which clamps scrollTo before then.
      lenis.resize();
      lenis.scrollTo(target ?? 0, { immediate: true });
    } else if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

// The app's content, independent of which router wraps it: BrowserRouter on
// the client (below), StaticRouter in the prerender pass (entry-server.tsx).
export function AppRoutes() {
  useLenis();

  return (
    <>
      <ScrollReset />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
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
