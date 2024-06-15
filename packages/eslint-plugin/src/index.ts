import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import noDuplicateImports from "./rules/no-duplicate-imports.js";

export const plugin: FlatConfig.Plugin = {
  rules: {
    "no-duplicate-imports": noDuplicateImports,
  },
};

export const configs = {
  recommended: {
    plugins: {
      "@neetly": plugin,
    },
    rules: {
      "@neetly/no-duplicate-imports": "error",
    },
  },
} satisfies Record<string, FlatConfig.Config>;
