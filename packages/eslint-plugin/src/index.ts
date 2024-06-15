import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

export const plugin: FlatConfig.Plugin = {
  rules: {
    // TODO
  },
};

export const configs = {
  recommended: {
    plugins: {
      "@neetly": plugin,
    },
    rules: {
      // TODO
    },
  },
} satisfies Record<string, FlatConfig.Config>;
