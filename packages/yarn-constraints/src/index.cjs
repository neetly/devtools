/**
 * @param {import("@yarnpkg/types").Yarn.Constraints.Context} context
 */
exports.recommended = ({ Yarn }) => {
  exports.enforceProperExports({ Yarn });
  exports.enforceConsistentDependencies({ Yarn });
};

/**
 * @param {import("@yarnpkg/types").Yarn.Constraints.Context} context
 */
exports.enforceProperExports = ({ Yarn }) => {
  for (const workspace of Yarn.workspaces()) {
    if (!workspace.manifest.private) {
      if (!workspace.manifest.exports) {
        workspace.set("exports", {
          "./package.json": "./package.json",
        });
      } else if (
        typeof workspace.manifest.exports === "string" ||
        Object.keys(workspace.manifest.exports).some(
          (key) => !key.startsWith("."),
        )
      ) {
        workspace.set("exports", {
          ".": workspace.manifest.exports,
          "./package.json": "./package.json",
        });
      } else {
        workspace.set("exports", {
          ...workspace.manifest.exports,
          "./package.json": "./package.json",
        });
      }
    }
  }
};

/**
 * @param {import("@yarnpkg/types").Yarn.Constraints.Context} context
 */
exports.enforceConsistentDependencies = ({ Yarn }) => {
  for (const dependency of Yarn.dependencies()) {
    if (Yarn.workspace({ ident: dependency.ident })) {
      if (dependency.type !== "peerDependencies") {
        dependency.update("workspace:*");
      } else {
        dependency.update("workspace:^");
      }
    }
  }

  for (const dependency of Yarn.dependencies()) {
    if (
      !Yarn.workspace({ ident: dependency.ident }) &&
      dependency.type !== "peerDependencies" &&
      !/(?<!^npm):/.test(dependency.range) &&
      dependency.resolution?.version
    ) {
      dependency.update(dependency.resolution.version);
    }
  }

  for (const dependency of Yarn.dependencies()) {
    if (dependency.type !== "peerDependencies") {
      for (const otherDependency of Yarn.dependencies({
        ident: dependency.ident,
      })) {
        if (otherDependency.type !== "peerDependencies") {
          dependency.update(otherDependency.range);
        }
      }
    }
  }

  for (const dependency of Yarn.dependencies({ type: "dependencies" })) {
    const otherDependency = Yarn.dependency({
      workspace: dependency.workspace,
      ident: dependency.ident,
      type: "devDependencies",
    });
    if (otherDependency) {
      otherDependency.delete();
    }
  }

  for (const dependency of Yarn.dependencies({ type: "peerDependencies" })) {
    const otherDependency = Yarn.dependency({
      workspace: dependency.workspace,
      ident: dependency.ident,
      type: "devDependencies",
    });
    if (!otherDependency) {
      dependency.error(
        `yarn workspace ${dependency.workspace.ident} add --dev --exact ${dependency.ident}`,
      );
    }
  }
};
