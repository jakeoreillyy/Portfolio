import { defineConfig, devices } from "@playwright/test";

// vite preview's default port.
const baseURL = "http://localhost:4173";

// Smoke tests run against the production build, prerendered pages included.
// Each run builds and serves it fresh, and fails if the port is already taken
// rather than testing whatever is running there.
export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  use: { baseURL },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run preview -- --strictPort",
    url: baseURL,
    // Build without reCAPTCHA even when a local .env has a site key, so the
    // tests never load Google's script.
    env: { VITE_RECAPTCHA_SITE_KEY: "" },
  },
});
