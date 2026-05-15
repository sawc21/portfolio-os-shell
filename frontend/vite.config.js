import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, "../Portfolio/wwwroot/dist"),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: resolve(__dirname, "src/main.tsx"),
      output: {
        entryFileNames: "portfolio-os.js",
        chunkFileNames: "portfolio-os-[name].js",
        assetFileNames: "portfolio-os[extname]"
      }
    }
  }
});
