import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The calendar day of the build. Prerendered pages show anything date-based as
// of this day, and the client's first render uses it too, so hydration finds
// the same markup (see src/lib/hydration.ts). It's a whole day because the
// prerender pass loads this config again a few seconds after the client build.
const built = new Date();

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_DATE__: JSON.stringify([built.getFullYear(), built.getMonth(), built.getDate()]),
  },
});
