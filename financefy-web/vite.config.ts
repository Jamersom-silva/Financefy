import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Configuração moderna do Vite + React + TS
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // pode ajustar se desejar
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
