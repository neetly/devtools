import type { ResolverOptions } from "jest-resolve";

const resolver = (path: string, options: ResolverOptions): string => {
  return options.defaultResolver(path, options);
};

export default resolver;
