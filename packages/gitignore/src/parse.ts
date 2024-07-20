export const parse = (content: string): { patterns: readonly string[] } => {
  const patterns = content
    .split(/\r?\n/)

    // Remove comments
    .filter((pattern) => !pattern.startsWith("#"))
    .map((pattern) => pattern.replace(/^\\#/, "#"))

    // Remove trailing spaces and empty lines
    .map((pattern) => pattern.replace(/(?<!\\) +$/, "").replace(/\\ $/, " "))
    .filter((pattern) => pattern !== "")

    // Remove non-sense patterns
    .filter((pattern) => !/^!?\/?$/.test(pattern))

    // Normalize slashes
    .map((pattern) => {
      const isNegative = pattern.startsWith("!");
      let path = pattern.replace(/^!/, "");
      if (!/^\/|\/(?!$)/.test(path)) {
        path = "**/" + path;
      }
      path = path.replace(/^\//, "");
      return (isNegative ? "!" : "") + path;
    })

    // Escape special characters
    .map((pattern) => pattern.replace(/[(){}\\]/g, "\\$&"));

  return { patterns };
};
