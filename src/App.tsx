import { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigationType,
} from "react-router-dom";
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

// Keep the title, description, Open Graph and canonical tags in step with the
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

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;
  }, [pathname]);

  return null;
}

// Start each page at the top. Keyed on the location key rather than the path:
// every navigation gets a new key, and a link to the page already open is a
// replace navigation, so Home and name links scroll up there too.
function ScrollReset() {
  const { key, pathname } = useLocation();
  const navigationType = useNavigationType();
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    const page = normalizePath(pathname);
    const samePage = page === lastPage.current;
    lastPage.current = page;
    const lenis = lenisRef.current;

    if (samePage) {
      // Back and forward within a page keep the browser's own scroll position.
      if (navigationType === "POP") return;
      if (lenis) lenis.scrollTo(0, { lerp: 0.1 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (lenis) {
      // The outgoing page's dimensions are still cached until Lenis's
      // resize observer catches up, so refresh them before scrolling.
      lenis.resize();
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [key, pathname, navigationType]);

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
