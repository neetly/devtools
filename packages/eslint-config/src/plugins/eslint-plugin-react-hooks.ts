import type { Linter } from "eslint";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";

// FIXME: https://github.com/facebook/react/pull/29770
const plugin: typeof eslintPluginReactHooks & {
  configs: {
    "flat/recommended": Linter.FlatConfig;
  };
} = {
  ...eslintPluginReactHooks,
  configs: {
    ...eslintPluginReactHooks.configs,
    "flat/recommended": {
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
