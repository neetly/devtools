// FIXME: https://github.com/facebook/react/issues/28313
// FIXME: https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/69745
declare module "eslint-plugin-react-hooks" {
  import type { ESLint } from "eslint";
  const plugin: ESLint.Plugin & {
    configs: {
      recommended: ESLint.ConfigData;
    };
  };
  export default plugin;
}
