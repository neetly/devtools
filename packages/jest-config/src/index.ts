import type { Config } from "jest";

export const createConfig = (): Config => {
  return {
    injectGlobals: false,

    testMatch: ["**/*.spec.{js,mjs,cjs,ts,tsx,mts,cts}"],

    // FIXME: https://github.com/jestjs/jest/issues/12800
    extensionsToTreatAsEsm: [".ts", ".tsx", ".mts"],

    transform: {
      // TODO
    },
  };
};
