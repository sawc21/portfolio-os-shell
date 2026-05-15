import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "../Portfolio/wwwroot/dist"),
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      input: resolve(__dirname, "src/homeHub.js"),
      output: {
        entryFileNames: "homeHub.js",
        chunkFileNames: "homeHub-[hash].js",
        assetFileNames: "homeHub-[name][extname]"
      }
    }
  }
});
