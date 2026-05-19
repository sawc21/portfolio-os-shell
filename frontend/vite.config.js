import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  base: "/dist/",
  build: {
    outDir: resolve(__dirname, "../Portfolio/wwwroot/dist"),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: resolve(__dirname, "src/main.tsx"),
      output: {
        entryFileNames: "portfolio-os.js",
        chunkFileNames: "portfolio-os-[name].js",
        assetFileNames: (assetInfo) =>
          assetInfo.names?.some((name) => name.endsWith(".css"))
            ? "portfolio-os.css"
            : "assets/[name][extname]"
      }
    }
  }
});
