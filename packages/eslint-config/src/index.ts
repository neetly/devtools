import fs from "node:fs/promises";
import path from "node:path";

import eslint from "@eslint/js";
import * as gitignore from "@neetly/gitignore";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

export const createConfig = async ({ rootDir }: { rootDir: string }) => {
  return tseslint.config(
    {
      ignores: gitignore.parse(
        await fs.readFile(path.join(rootDir, ".gitignore"), {
          encoding: "utf8",
        }),
      ).patterns,
    },

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
      files: ["**/*.cjs"],
      rules: {
        "@typescript-eslint/no-require-imports": "off",
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

    // Node.js
    {
      plugins: {
        unicorn: eslintPluginUnicorn,
      },
      rules: {
        "unicorn/prefer-node-protocol": "error",
        "unicorn/text-encoding-identifier-case": "error",
      },
    },
  );
};
