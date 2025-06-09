import { defineConfig } from "vite";
import {viteSingleFile} from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  // So the build can be served from an arbitrary path
  base: "./",
  plugins: [viteSingleFile()],
  build: {
    target: "esnext",
    sourcemap: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      }
    }
  },
  
});
