#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

const pkg = require('../package.json');
const app = require('../app.json');

if (pkg.version !== app.expo.version) {
  console.error(
    `\x1b[31m✖\x1b[0m   Project version mismatch: package.json=${pkg.version}; app.json=${app.expo.version}`,
  );
  process.exit(1);
}
