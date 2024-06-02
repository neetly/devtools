import process from "node:process";

import { createConfig } from "@neetly/eslint-config";

export default createConfig({
  rootDir:
    import.meta.dirname ??
    // FIXME: https://github.com/microsoft/vscode-eslint/issues/1851
    process.cwd(),
});
