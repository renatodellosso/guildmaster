import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@/lib": path.resolve(__dirname, "lib"),
    },
  },
  test: {
    watch: false,
    passWithNoTests: true,
  },
});
