/** @import { Yarn } from "@yarnpkg/types" */

/** @param {Yarn.Constraints.Context} context */
exports.recommended = ({ Yarn }) => {
  exports.enforceMetadata({ Yarn });
  exports.enforceTypeModule({ Yarn });
  exports.enforceProperExports({ Yarn });
  exports.enforceConsistentDependencies({ Yarn });
};

/** @param {Yarn.Constraints.Context} context */
exports.enforceMetadata = ({ Yarn }) => {
  const rootWorkspace = Yarn.workspace({ cwd: "." });
  if (rootWorkspace) {
    const { homepage, repository, license } = rootWorkspace.manifest;
    for (const workspace of Yarn.workspaces()) {
      if (workspace.cwd !== ".") {
        if (homepage) {
          workspace.set("homepage", homepage);
        }
        if (repository) {
          workspace.set("repository", {
            ...repository,
            directory: workspace.cwd,
          });
        }
        if (license) {
          workspace.set("license", license);
        }
      }
    }
  }
};

/** @param {Yarn.Constraints.Context} context */
exports.enforceTypeModule = ({ Yarn }) => {
  for (const workspace of Yarn.workspaces()) {
    workspace.set("type", "module");
  }
};

/** @param {Yarn.Constraints.Context} context */
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

/** @param {Yarn.Constraints.Context} context */
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
      !dependency.range.includes(":") &&
      dependency.resolution?.version
    ) {
      dependency.update(dependency.resolution.version);
    }
  }

  for (const dependency of Yarn.dependencies()) {
    if (!Yarn.workspace({ ident: dependency.ident })) {
      for (const otherDependency of Yarn.dependencies({
        ident: dependency.ident,
      })) {
        if (
          (dependency.type !== "peerDependencies" &&
            otherDependency.type !== "peerDependencies") ||
          (dependency.type === "peerDependencies" &&
            otherDependency.type === "peerDependencies")
        ) {
          otherDependency.update(dependency.range);
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
    const otherDependency =
      Yarn.dependency({
        workspace: dependency.workspace,
        ident: dependency.ident,
        type: "dependencies",
      }) ??
      Yarn.dependency({
        workspace: dependency.workspace,
        ident: dependency.ident,
        type: "devDependencies",
      });
    if (!otherDependency) {
      dependency.error(
        `yarn workspace ${dependency.workspace.ident} add [--dev] --exact ${dependency.ident}`,
      );
    }
  }
};
