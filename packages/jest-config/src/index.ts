import * as babelUtils from "@neetly/babel-utils";
import type { Config } from "jest";

export const createConfig = async (): Promise<Config> => {
  return {
    injectGlobals: false,

    roots: ["<rootDir>/src/"],

    testMatch: ["<rootDir>/src/**/*.spec.{js,mjs,cjs,ts,tsx,mts,cts}"],

    resolver: import.meta.resolve("@neetly/jest-resolver"),

    // FIXME: https://github.com/jestjs/jest/issues/12800
    extensionsToTreatAsEsm: [".ts", ".tsx", ".mts"],

    transform: {
      "\\.(?:js|mjs|cjs|ts|tsx|mts|cts)$": [
        import.meta.resolve("babel-jest"),
        {
          excludeJestPreset: true,
          ...(await babelUtils.createOptions({
            defaultPresets: [import.meta.resolve("@neetly/babel-preset")],
          })),
        },
      ],
    },
  };
};
