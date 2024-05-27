import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import * as gitignore from "@neetly/gitignore";
import fs from "node:fs/promises";

export default tseslint.config(
  {
    ignores: gitignore.parse(
      await fs.readFile("./.gitignore", { encoding: "utf8" }),
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
);
