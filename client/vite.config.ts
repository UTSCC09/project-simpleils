import { defineConfig } from "vite";
import pluginChecker from "vite-plugin-checker";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [pluginChecker({ typescript: { buildMode: true } }), react()]
});
