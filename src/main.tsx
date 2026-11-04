import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/archivo/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/jetbrains-mono/400.css";
import "lenis/dist/lenis.css";
import "./index.css";
import App from "./App";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Built pages arrive with their markup already in the root, tagged with the
// route it was rendered for (scripts/prerender.mjs). React takes that over in
// place instead of deleting it and building it again, so anything typed into
// the contact form before this script loaded survives. Otherwise it renders
// from scratch: the dev server sends an empty root, and a path without a page
// of its own is sent the home page's markup, which isn't its to hydrate.
if (root.dataset.route === location.pathname) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
