import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useLenis, lenisRef } from "./lib/useLenis";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";

// Start each page at the top when switching routes, or jump to the
// hashed section if the destination URL carries one (e.g. /#projects).
function ScrollReset() {
  const { pathname, hash } = useLocation();

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

export default function App() {
  useLenis();

  return (
    <BrowserRouter>
      <ScrollReset />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </BrowserRouter>
  );
}
