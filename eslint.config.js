import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // Content script uses console.log intentionally for debugging
    files: ["src/content/index.ts"],
    rules: { "no-console": "off" },
  },
  {
    // Background service worker may log lifecycle events
    files: ["src/background/**"],
    rules: { "no-console": "off" },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "vite.config.ts",
      "vitest.config.ts",
      "eslint.config.js",
    ],
  },
);
