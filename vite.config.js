import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relatif : le site fonctionne à la racine (Vercel, Netlify)
// et dans un sous-dossier (GitHub Pages) sans changer la config.
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: true,
    port: 5173,
  },
});
