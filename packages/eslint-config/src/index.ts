import fs from "node:fs/promises";
import path from "node:path";

import * as gitignore from "@neetly/gitignore";
import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import tseslint from "typescript-eslint";

import { createBaseConfig } from "./configs/base.js";
import { createNodeConfig } from "./configs/node.js";
import { createReactConfig } from "./configs/react.js";

export const createConfig = async ({
  rootDir,
}: {
  rootDir: string;
}): Promise<FlatConfig.ConfigArray> => {
  let ignores: readonly string[];
  try {
    ignores = gitignore.parse(
      await fs.readFile(path.join(rootDir, ".gitignore"), {
        encoding: "utf8",
      }),
    ).patterns;
  } catch {
    ignores = [];
  }

  return tseslint.config(
    {
      ignores: ignores.slice(),
    },

    ...createBaseConfig(),
    ...createNodeConfig(),
    ...createReactConfig(),
  );
};
