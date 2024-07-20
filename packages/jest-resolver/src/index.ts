import type { ResolverOptions } from "jest-resolve";

export const sync = (path: string, options: ResolverOptions): string => {
  return options.defaultResolver(path, options);
};

export const async = (path: string, options: ResolverOptions): string => {
  return options.defaultResolver(path, options);
};
