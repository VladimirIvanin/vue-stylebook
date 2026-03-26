#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function resolveEngineCli() {
  let dir = path.dirname(require.resolve("@ivaninvladimir/vue-stylebook-engine"));
  for (;;) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = require(pkgPath);
      const bin = pkg.bin && pkg.bin["vue-stylebook-engine"];
      if (typeof bin === "string") {
        const cli = path.join(dir, bin);
        if (fs.existsSync(cli)) {
          return cli;
        }
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error(
    "Could not find the component stylebook engine CLI. Reinstall dependencies."
  );
}

const cli = resolveEngineCli();
const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
  windowsHide: true,
});

if (result.error) {
  throw result.error;
}
process.exit(result.status === null ? 1 : result.status);
