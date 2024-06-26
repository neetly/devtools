const { defineConfig } = require("@yarnpkg/types");

module.exports = defineConfig({
  constraints: async ({ Yarn }) => {
    for (const workspace of Yarn.workspaces()) {
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

    require("@neetly/yarn-constraints").recommended({ Yarn });
  },
});
