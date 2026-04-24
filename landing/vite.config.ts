import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from "vite-imagetools";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), imagetools()],
  server: { port: 5555 },
  resolve: {
    alias: {
      "#cascade": path.resolve(
        import.meta.dirname!,
        mode === "production"
          ? "src/cascade-icons.prod.tsx"
          : "src/cascade-icons.dev.tsx",
      ),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        "ai-writes": "ai-writes.html",
        "data-sources": "data-sources.html",
        "data-sources-carousel": "data-sources-carousel.html",
        cascade: "cascade.html",
        "banner-explore": "banner-explore.html",
      },
    },
  },
}));
