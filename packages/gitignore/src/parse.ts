export const parse = (content: string): { patterns: readonly string[] } => {
  const patterns = content

    // Remove BOM
    .replace(/^\uFEFF/, "")

    // Split by LF and CRLF
    .split(/\r?\n/)

    // Remove comments
    .filter((pattern) => !pattern.startsWith("#"))
    .map((pattern) => pattern.replace(/^\\#/, "#"))

    // Remove trailing spaces
    .map((pattern) => {
      return pattern.replace(/(\\*) +$/, (_, backslashes: string) => {
        return backslashes.length % 2 === 0
          ? backslashes + ""
          : backslashes.slice(0, -1) + " ";
      });
    })

    // Remove empty and non-sense patterns
    .filter((pattern) => !/^!?\/?$/.test(pattern))

    // Normalize slashes ("/") and two consecutive asterisks ("**")
    .map((pattern) => {
      const isNegative = pattern.startsWith("!");
      const isDirectory = pattern.endsWith("/");
      let path = pattern.replace(/^!/, "").replace(/\/$/, "");
      if (path !== "**" && !path.includes("/")) {
        path = "**/" + path;
      }
      path = path.replace(/^\//, "");
      path = path.replace(/(?<=^|\/)\*\*$/, "**/*");
      return (isNegative ? "!" : "") + path + (isDirectory ? "/" : "");
    })

    // Escape special characters
    .map((pattern) => pattern.replace(/[(){}]/g, "\\$&"))

    // Remove invalid patterns
    .filter((pattern) => {
      const result = /\\+$/.exec(pattern);
      if (result && result[0].length % 2 !== 0) {
        return false;
      }
      return true;
    });

  return { patterns };
};
