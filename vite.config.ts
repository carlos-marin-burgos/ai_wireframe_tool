import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173, // Explicit port for frontend
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
      // Copy staticwebapp.config.json to output
      external: [],
    },
    // Ensure config file is copied to output
    copyPublicDir: true,
    // Configure CSS minification to be less strict
    minify: 'esbuild',
    target: 'es2015',
  },
  publicDir: 'public',
});
