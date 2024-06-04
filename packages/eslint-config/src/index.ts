import fs from "node:fs/promises";
import path from "node:path";

import * as gitignore from "@neetly/gitignore";
import tseslint from "typescript-eslint";

import base from "./configs/base.js";
import node from "./configs/node.js";
import react from "./configs/react.js";

export const createConfig = async ({ rootDir }: { rootDir: string }) => {
  let ignores: string[];
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
      ignores,
    },

    ...base,
    ...node,
    ...react,
  );
};
