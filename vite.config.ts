import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173, // Explicit port for frontend
    proxy: {
      // Route wireframe generation to simple-server
      "/api/generate-wireframe": {
        target: "http://localhost:5001", // Simple server with wireframe capabilities
        changeOrigin: true,
        secure: false,
      },
      "/api/generate-html-wireframe": {
        target: "http://localhost:5001", // Simple server
        changeOrigin: true,
        secure: false,
      },
      "/api/generate-react-wireframe": {
        target: "http://localhost:5001", // Simple server
        changeOrigin: true,
        secure: false,
      },
      "/api/generate-enhanced-wireframe": {
        target: "http://localhost:5001", // Simple server
        changeOrigin: true,
        secure: false,
      },
      // All other API calls go to Azure Functions
      "/api": {
        target: "http://localhost:7071", // Point to Azure Functions backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
      // Copy staticwebapp.config.json to output
      external: [],
    },
    // Ensure config file is copied to output
    copyPublicDir: true,
    // Configure CSS minification to be less strict
    minify: "esbuild",
    target: "es2015",
  },
  publicDir: "public",
});
