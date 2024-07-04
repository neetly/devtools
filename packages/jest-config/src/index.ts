import { fileURLToPath } from "node:url";

import * as babelUtils from "@neetly/babel-utils";
import type { Config } from "jest";

export const createConfig = async (): Promise<Config> => {
  return {
    injectGlobals: false,

    testMatch: ["**/*.spec.{js,mjs,cjs,ts,tsx,mts,cts}"],

    // FIXME: https://github.com/jestjs/jest/issues/12800
    extensionsToTreatAsEsm: [".ts", ".tsx", ".mts"],

    transform: {
      "\\.(?:js|mjs|cjs|ts|tsx|mts|cts)$": [
        // FIXME: https://github.com/jestjs/jest/pull/15154
        fileURLToPath(import.meta.resolve("babel-jest")),
        await babelUtils.createOptions({
          defaultPresets: [import.meta.resolve("@neetly/babel-preset")],
        }),
      ],
    },
  };
};
