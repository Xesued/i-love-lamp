import react from "@vitejs/plugin-react-swc"
import path from "path"
import { defineConfig } from "vite"

const enginePath = process.env.DOCKER_BUILD
  ? path.join(__dirname, "build/engine")
  : path.join(__dirname, "..", "engine")

// https://vitejs.dev/config/
export default defineConfig({
  // server: { https: true },
  plugins: [react()],
  resolve: {
    alias: {
      engine: enginePath,
    },
  },
})
