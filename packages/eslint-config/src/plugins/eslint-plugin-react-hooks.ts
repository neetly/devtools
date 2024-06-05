import type { ESLint, Linter } from "eslint";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";

// FIXME: https://github.com/facebook/react/issues/28313
const plugin: ESLint.Plugin & {
  configs: {
    recommended: Linter.FlatConfig;
  };
} = {
  ...eslintPluginReactHooks,
  configs: {
    recommended: {
      plugins: {
        "react-hooks": eslintPluginReactHooks,
      },
      rules: {
        ...eslintPluginReactHooks.configs.recommended.rules,
      },
    },
  },
};

export default plugin;
