export const parse = (content: string): { patterns: readonly string[] } => {
  const patterns = content

    // Remove BOM
    .replace(/^\uFEFF/, "")

    // Split by LF or CRLF
    .split(/\r?\n/)

    // Remove comments
    .filter((pattern) => !pattern.startsWith("#"))
    .map((pattern) => pattern.replace(/^\\#/, "#"))

    // Remove trailing spaces
    .map((pattern) => pattern.replace(/(?<!\\) +$/, "").replace(/\\ $/, " "))

    // Remove empty patterns
    .filter((pattern) => pattern !== "")

    // Remove non-sense patterns
    .filter((pattern) => !/^!?\/?$/.test(pattern))

    // Normalize slashes ("/") and two consecutive asterisks ("**")
    .map((pattern) => {
      const isNegative = pattern.startsWith("!");
      const isDirectory = pattern.endsWith("/");
      let path = pattern.replace(/^!/, "").replace(/\/$/, "");
      if (!path.includes("/")) {
        path = "**/" + path;
      }
      path = path.replace(/^\//, "");
      path = path.replace(/(?<=^|\/)\*\*$/, "**/*");
      return (isNegative ? "!" : "") + path + (isDirectory ? "/" : "");
    })

    // Escape special characters
    .map((pattern) => pattern.replace(/[(){}\\]/g, "\\$&"));

  return { patterns };
};
