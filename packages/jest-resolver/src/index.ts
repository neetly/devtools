import fs from "node:fs";
import { fileURLToPath } from "node:url";

import enhancedResolve from "enhanced-resolve";
import type { ResolverOptions } from "jest-resolve";

const fileSystem = new enhancedResolve.CachedInputFileSystem(fs, 1000);

const options = {
  extensionAlias: {
    ".js": [".ts", ".tsx", ".js"],
    ".mjs": [".mts", ".mjs"],
    ".cjs": [".cts", ".cjs"],
  },
} satisfies Partial<enhancedResolve.ResolveOptions>;

const resolverCache = new Map<string, enhancedResolve.Resolver>();

const getResolver = ({
  mode,
  conditions,
}: {
  mode: "sync" | "async";
  conditions: readonly string[];
}) => {
  const key = JSON.stringify([mode, conditions]);
  let resolver = resolverCache.get(key);
  if (!resolver) {
    resolver = enhancedResolve.ResolverFactory.createResolver({
      fileSystem,
      useSyncFileSystemCalls: mode === "sync",
      ...options,
      conditionNames: conditions.slice(),
    });
    resolverCache.set(key, resolver);
  }
  return resolver;
};

const normalizeRequest = (request: string) => {
  if (request.startsWith("file:")) {
    return fileURLToPath(request);
  }
  return request;
};

export const sync = (
  path: string,
  { basedir, conditions = [] }: ResolverOptions,
): string => {
  const resolver = getResolver({ mode: "sync", conditions });
  const context = {};
  const result = resolver.resolveSync(context, basedir, normalizeRequest(path));
  return result as string;
};

export const async = async (
  path: string,
  { basedir, conditions = [] }: ResolverOptions,
): Promise<string> => {
  const resolver = getResolver({ mode: "async", conditions });
  const context = {};
  const resolveContext = {};
  return await new Promise((resolve, reject) => {
    resolver.resolve(
      context,
      basedir,
      normalizeRequest(path),
      resolveContext,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result as string);
        }
      },
    );
  });
};
