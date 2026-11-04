import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "warn",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ...jsxA11y.flatConfigs.recommended,
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // Safari drops the list semantics of a list with no markers, and
      // Tailwind's reset removes them, so role="list" on one isn't redundant.
      "jsx-a11y/no-redundant-roles": ["error", { nav: ["navigation"], ol: ["list"], ul: ["list"] }],
    },
  },
  {
    files: ["api/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
);
