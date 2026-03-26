#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function resolveVueStyleguidistCli() {
  let dir = path.dirname(require.resolve("vue-styleguidist"));
  for (;;) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = require(pkgPath);
      const bin = pkg.bin && pkg.bin["vue-styleguidist"];
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
    'Could not find vue-styleguidist CLI (install dependency "vue-styleguidist").'
  );
}

const cli = resolveVueStyleguidistCli();
const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
  windowsHide: true,
});

if (result.error) {
  throw result.error;
}
process.exit(result.status === null ? 1 : result.status);
