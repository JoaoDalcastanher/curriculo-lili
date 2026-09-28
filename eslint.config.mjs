import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "frontend/dist/**",
      "playwright.config.ts",
      "e2e/**",
      "frontend/src/routeTree.gen.ts",
      "eslint.config.mjs",
      "*.config.js",
      "frontend/vite.config.ts",
      "tsconfig*.json",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["frontend/src/**/*.{ts,tsx}", "frontend/config/**/*.ts", "frontend/server.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // Loads the nearest tsconfig.json (path aliases + types) per file so typed rules resolve.
        projectService: true,
        // import.meta.dirname is undefined on Node 18 (added in 20.11); compute portably.
        tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // Imports sorted alphabetically (side-effect imports kept in place).
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Strong-typing comparisons: reject `if (variable)` truthiness checks and loose
      // comparisons for objects/strings/numbers. Real (and nullable) booleans are allowed.
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: false,
          allowNullableBoolean: true,
          allowNullableString: false,
          allowNullableNumber: false,
          allowAny: false,
        },
      ],

      // Correctness.
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": [
        "error",
        { functions: false, classes: true, variables: true, typedefs: false },
      ],
      // TypeScript + tsc already catch undefined variables; the base rule misfires on TS globals.
      "no-undef": "off",

      // React hooks.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Must be last — disables all formatting-related ESLint rules so Prettier owns formatting.
  prettier,
);
