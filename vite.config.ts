import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // e2e/ holds the Playwright specs (npm run test:e2e), which Vitest can't run.
  test: { exclude: [...configDefaults.exclude, "e2e/**"] },
});
