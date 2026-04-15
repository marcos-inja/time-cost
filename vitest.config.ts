import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/__tests__/**",
        "src/vite-env.d.ts",
        // Entry points — Chrome API glue with no testable business logic
        "src/popup/main.tsx",
        "src/popup/index.html",
        "src/content/index.ts",
        "src/background/serviceWorker.ts",
        // React UI layer — requires React Testing Library setup (not yet configured)
        "src/popup/App.tsx",
        "src/popup/components/**",
        "src/popup/hooks/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
