import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import mkcert from "vite-plugin-mkcert"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  // server: { https: true },
  plugins: [react()],
  resolve: {
    alias: {
      engine: path.join(__dirname, "..", "engine"),
    },
  },
})
