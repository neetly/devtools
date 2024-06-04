import eslintPluginReact from "@neetly-eslint-react/eslint-plugin";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [eslintPluginReact.configs.recommended],
  },

  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [eslintPluginReact.configs["recommended-type-checked"]],
  },

  {
    plugins: {
      "react-hooks": eslintPluginReactHooks,
    },
    rules: {
      // FIXME: https://github.com/facebook/react/issues/28313
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
  },
);
