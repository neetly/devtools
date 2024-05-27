const { defineConfig } = require("@yarnpkg/types");
const constraints = require("@neetly/yarn-constraints");

module.exports = defineConfig({
  constraints: async ({ Yarn }) => {
    for (const workspace of Yarn.workspaces()) {
      workspace.set("type", "module");

      if (workspace.cwd !== ".") {
        workspace.set("homepage", "https://github.com/neetly/devtools");
        workspace.set("repository", {
          type: "git",
          url: "https://github.com/neetly/devtools.git",
          directory: workspace.cwd,
        });
        workspace.set("license", "MIT");
      }
    }

    constraints.recommended({ Yarn });
  },
});
