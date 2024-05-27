import fs from "node:fs/promises";
import path from "node:path";

import eslint from "@eslint/js";
import * as gitignore from "@neetly/gitignore";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
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
      files: ["**/*.{ts,tsx,mts,cts}"],
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
      extends: [
        eslint.configs.recommended,
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
      ],
    },

    {
      plugins: {
        "simple-import-sort": eslintPluginSimpleImportSort,
      },
      rules: {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
      },
    },
  );
};
