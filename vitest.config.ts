import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@/": "/",
    },
  },
  test: {
    watch: false,
    passWithNoTests: true,
  },
});
