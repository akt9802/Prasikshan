import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/question": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      // "/alltest": {
      //   target: "http://localhost:3000",
      //   changeOrigin: true,
      //   secure: false,
      // },
      "/support": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
