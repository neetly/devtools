import eslint from "@eslint/js";
import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export const createBaseConfig = (): FlatConfig.ConfigArray => {
  return tseslint.config(
    {
      extends: [
        eslint.configs.recommended,
        ...tseslint.configs.strict,
        ...tseslint.configs.stylistic,
      ],
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
        "@typescript-eslint/explicit-module-boundary-types": "error",

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
      languageOptions: {
        sourceType: "commonjs",
      },
      rules: {
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  );
};
