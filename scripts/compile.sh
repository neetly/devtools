#!/bin/bash
set -eo pipefail

yarn run --top-level babel \
  --presets @neetly/babel-preset \
  --extensions .js,.mjs,.cjs,.ts,.tsx,.mts,.cts \
  --ignore "**/*.d.ts,**/*.d.mts,**/*.d.cts" \
  ./src --out-dir ./lib --copy-files
