/** @import { Yarn } from "@yarnpkg/types" */

const { defineConfig } = require("@yarnpkg/types");

/** @type {Yarn.Config} */
module.exports = defineConfig({
  constraints: async ({ Yarn }) => {
    require("./index.cjs").recommended({ Yarn });
  },
});
