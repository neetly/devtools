import eslintPluginUnicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

export default tseslint.config({
  plugins: {
    unicorn: eslintPluginUnicorn,
  },
  rules: {
    "unicorn/prefer-node-protocol": "error",
    "unicorn/text-encoding-identifier-case": "error",
  },
});
