import eslintPluginReact from "@eslint-react/eslint-plugin";
import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import tseslint from "typescript-eslint";

import eslintPluginReactHooks from "../plugins/eslint-plugin-react-hooks.js";

export const createReactConfig = (): FlatConfig.ConfigArray => {
  return tseslint.config(
    {
      extends: [
        eslintPluginReact.configs.recommended,
        eslintPluginReactHooks.configs["flat/recommended"],
      ],
    },

    {
      files: ["**/*.{ts,tsx,mts,cts}"],
      extends: [eslintPluginReact.configs["recommended-type-checked"]],
    },
  );
};
