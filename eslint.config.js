import path from "node:path";
import { fileURLToPath } from "node:url";

import { createConfig } from "@neetly/eslint-config";

export default createConfig({
  rootDir:
    import.meta.dirname ??
    // FIXME: https://github.com/microsoft/vscode-eslint/issues/1851
    path.dirname(fileURLToPath(import.meta.url)),
});
