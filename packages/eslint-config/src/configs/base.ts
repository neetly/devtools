import eslint from "@eslint/js";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    extends: [eslint.configs.recommended],
    plugins: {
      "simple-import-sort": eslintPluginSimpleImportSort,
    },
    rules: {
      eqeqeq: "error",
      "object-shorthand": "error",
      "no-useless-rename": "error",

      // imports & exports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [...tseslint.configs.strict, ...tseslint.configs.stylistic],
  },

  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      // promises
      "@typescript-eslint/promise-function-async": "error",

      // imports & exports
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },

  {
    files: ["**/*.{cjs,cts}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
