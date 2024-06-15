const { defineConfig } = require("@yarnpkg/types");

module.exports = defineConfig({
  constraints: async ({ Yarn }) => {
    require("./index.cjs").recommended({ Yarn });
  },
});
