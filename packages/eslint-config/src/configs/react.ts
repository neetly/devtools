import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config({
  plugins: {
    "react-hooks": eslintPluginReactHooks,
  },
  rules: {
    // FIXME: https://github.com/facebook/react/issues/28313
    ...eslintPluginReactHooks.configs.recommended.rules,
  },
});
