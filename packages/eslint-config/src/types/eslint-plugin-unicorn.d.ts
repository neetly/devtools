// FIXME: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2324
declare module "eslint-plugin-unicorn" {
  import type { ESLint } from "eslint";
  const plugin: ESLint.Plugin;
  export default plugin;
}
