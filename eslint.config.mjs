import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

/**
 * The project's own content, token, and spacing rules are enforced as TESTS
 * rather than custom ESLint plugins. See tests/content/rules.spec.ts and
 * tests/tokens/parity.spec.ts.
 *
 * That is a deliberate choice: a vitest assertion over the file tree is easier
 * to read, easier to extend, and gives a better failure message than a bespoke
 * AST rule, and it fails the build in exactly the same way. The rules covered
 * are: no em dashes, no emoji, no colour literal outside tokens.css, no spacing
 * value off the 4px scale, and locale key parity.
 */
export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "node_modules/**", "out/**", "coverage/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
