import { describe, expect, test } from "@jest/globals";
import { Minimatch } from "minimatch";

import { parse } from "./parse.js";

const createTester = (content: string) => {
  const { patterns } = parse(content);
  const minimatches = patterns.map((pattern) => {
    return new Minimatch(pattern, { dot: true });
  });

  const matches = (path: string) => {
    let isMatched = false;
    for (const minimatch of minimatches) {
      if (minimatch.negate) {
        isMatched &&= minimatch.match(path);
      } else {
        isMatched ||= minimatch.match(path);
      }
    }
    return isMatched;
  };

  return {
    patterns,

    ignores: (path: string) => {
      const components = path.split("/");
      for (let index = 0; index < components.length; index++) {
        const directory = components.slice(0, index).join("/") + "/";
        if (matches(directory)) {
          return true;
        }
      }
      return matches(path);
    },
  };
};

describe("parse", () => {
  test.each([
    // BOM
    ["\uFEFFfile", { file: true }],

    // LF and CRLF
    ["file\ndir/file", { file: true, "dir/file": true }],
    ["file\r\ndir/file", { file: true, "dir/file": true }],

    // comments
    ["#file", { "#file": false }],
    ["\\#file", { "#file": true }],

    // spaces
    ["  ", { " ": false, "  ": false }],
    [" \\ ", { " ": false, "  ": true }],
    ["\\  ", { " ": true, "  ": false }],
    ["  file", { file: false, " file": false, "  file": true }],
    ["fi  le", { file: false, "fi le": false, "fi  le": true }],
    ["file  ", { file: true, "file ": false, "file  ": false }],
    ["file\\  ", { file: false, "file ": true, "file  ": false }],
    ["file \\ ", { file: false, "file ": false, "file  ": true }],

    // empty and non-sense patterns
    ["", { file: false }],
    ["!", { file: false }],
    ["/", { file: false }],
    ["!/", { file: false }],

    // negative patterns
    ["!file", { file: false, "!file": false }],
    ["\\!file", { file: false, "!file": true }],

    // slashes ("/") and two consecutive asterisks ("**")
    ["file", { file: true, "sub/file": true }],
    ["/file", { file: true, "sub/file": false }],
    ["**/file", { file: true, "sub/file": true }],

    ["dir/file", { "dir/file": true, "sub/dir/file": false }],
    ["/dir/file", { "dir/file": true, "sub/dir/file": false }],
    ["**/dir/file", { "dir/file": true, "sub/dir/file": true }],

    ["dir", { "dir/file": true, "sub/dir/file": true }],
    ["/dir", { "dir/file": true, "sub/dir/file": false }],
    ["**/dir", { "dir/file": true, "sub/dir/file": true }],

    ["dir/", { "dir/file": true, "sub/dir/file": true }],
    ["/dir/", { "dir/file": true, "sub/dir/file": false }],
    ["**/dir/", { "dir/file": true, "sub/dir/file": true }],

    ["**", { file: true, "sub/file": true, "sub/sub/file": true }],
    ["/**", { file: true, "sub/file": true, "sub/sub/file": true }],
    ["**/", { file: false, "sub/file": true, "sub/sub/file": true }],
    ["/**/", { file: false, "sub/file": true, "sub/sub/file": true }],

    ["/dir/**", { "dir/file": true, "dir/sub/file": true }],
    ["/dir/**/", { "dir/file": false, "dir/sub/file": true }],
    ["/dir/**/file", { "dir/file": true, "dir/sub/file": true }],

    [["/dir/**", "!/dir/file"], { "dir/file": false }],
    [["/dir/**", "!/dir/sub/file"], { "dir/sub/file": true }],
    [["/dir/**", "!/dir/sub", "!/dir/sub/file"], { "dir/sub/file": false }],
    [["/dir/**", "!/dir/sub/", "!/dir/sub/file"], { "dir/sub/file": false }],

    [["/dir/**/", "!/dir/sub"], { "dir/sub/file": false }],
    [["/dir/**/", "!/dir/sub/"], { "dir/sub/file": false }],
    [["/dir/**/", "!/dir/sub/file"], { "dir/sub/file": true }],

    // globs
    ["a*", { a: true, ab: true, abc: true }],
    ["*c", { c: true, bc: true, abc: true }],
    ["a*c", { ac: true, abc: true, abbc: true, "a/c": false }],
    [
      "a/*/c",
      { "a/c": false, "a/b/c": true, "a/bb/c": true, "a/b/b/c": false },
    ],
    ["[abc]", { a: true, b: true, c: true, "[abc]": false }],
    ["[a-c]", { a: true, b: true, c: true, "[a-c]": false }],
    ["[[]", { "[": true, "[[]": false }],
    ["[]]", { "]": true, "[]]": false }],
    ["[[]]", { "[": false, "]": false, "[]": true, "[[]]": false }],
    ["[[\\]]", { "[": true, "]": true, "[]": false, "[[]]": false }],
    ["[{}()]", { "{": true, "}": true, "(": true, ")": true, "[{}()]": false }],
    ["{a,b,c}", { a: false, b: false, c: false, "{a,b,c}": true }],
    ["?(a|b|c)", { a: false, b: false, c: false, "?(a|b|c)": true }],
    ["*(a|b|c)", { a: false, b: false, c: false, "*(a|b|c)": true }],
    ["+(a|b|c)", { a: false, b: false, c: false, "+(a|b|c)": true }],
    ["@(a|b|c)", { a: false, b: false, c: false, "@(a|b|c)": true }],
    ["\\!(a|b|c)", { x: false, "!(a|b|c)": true }],
    ["x/!(a|b|c)", { "x/x": false, "x/!(a|b|c)": true }],

    // backslashes
    ["a\\bc", { abc: true, "a\\bc": false }],
    ["a\\\\bc", { abc: false, "a\\bc": true }],
    ["a\\*", { a: false, ab: false, abc: false, "a*": true }],
    ["\\*c", { c: false, bc: false, abc: false, "*c": true }],
    ["a\\*c", { ac: false, abc: false, abbc: false, "a*c": true }],
    ["a/\\*/c", { "a/b/c": false, "a/bb/c": false, "a/*/c": true }],
    ["\\[", { "[": true }],
    ["\\[]", { "[]": true }],
    ["\\[\\]", { "[]": true }],
    ["\\[abc", { "[abc": true }],
    ["\\[abc]", { a: false, b: false, c: false, "[abc]": true }],
    ["\\[abc\\]", { a: false, b: false, c: false, "[abc]": true }],
    ["[a\\bc]", { a: true, b: true, c: true, "\\": false }],
    ["[a\\\\bc]", { a: true, b: true, c: true, "\\": true }],
    ["[a\\-c]", { a: true, b: false, c: true, "-": true }],
  ])("pattern %j", (content, files) => {
    const { patterns, ignores } = createTester([content].flat().join("\n"));
    expect(patterns).toMatchSnapshot();
    for (const [file, isIgnored] of Object.entries(files)) {
      expect([file, ignores(file)]).toStrictEqual([file, isIgnored]);
    }
  });

  // invalid patterns
  // test.each(["[]", "[", "[abc", "[\\]", "[\\["])(
  //   "invalid pattern %j",
  //   (content) => {
  //     const { patterns } = parse(content);
  //     expect(patterns).toStrictEqual([]);
  //   },
  // );
});
