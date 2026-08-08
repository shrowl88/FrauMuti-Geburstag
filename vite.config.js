import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // <--- INI YG DIGANTI. DARI "./" JADI "/"
});
