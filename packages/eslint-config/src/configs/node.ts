import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

export const createNodeConfig = (): FlatConfig.ConfigArray => {
  return tseslint.config({
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      "unicorn/prefer-node-protocol": "error",
      "unicorn/text-encoding-identifier-case": "error",
    },
  });
};
