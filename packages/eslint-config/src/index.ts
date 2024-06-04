import fs from "node:fs/promises";
import path from "node:path";

import * as gitignore from "@neetly/gitignore";
import tseslint from "typescript-eslint";

import base from "./configs/base.js";
import node from "./configs/node.js";
import react from "./configs/react.js";

export const createConfig = async ({ rootDir }: { rootDir: string }) => {
  return tseslint.config(
    {
      ignores: gitignore.parse(
        await fs.readFile(path.join(rootDir, ".gitignore"), {
          encoding: "utf8",
        }),
      ).patterns,
    },

    ...base,
    ...node,
    ...react,
  );
};
