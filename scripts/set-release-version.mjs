#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Usage: node ./scripts/set-release-version.mjs <x.y.z>');
  process.exit(1);
}

const rootDirectory = process.cwd();
const packageJsonPath = path.join(rootDirectory, 'package.json');
const appJsonPath = path.join(rootDirectory, 'app.json');
const versionCode = toVersionCode(version);

updateJson(packageJsonPath, (current) => ({
  ...current,
  version,
}));

updateJson(appJsonPath, (current) => ({
  ...current,
  expo: {
    ...current.expo,
    version,
    android: {
      ...current.expo.android,
      versionCode,
    },
  },
}));

console.log(`Configured release version ${version} (versionCode ${versionCode}).`);

function updateJson(filePath, transform) {
  const current = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const next = transform(current);
  fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`);
}

function toVersionCode(input) {
  const [major, minor, patch] = input.split('.').map((value) => Number.parseInt(value, 10));
  return major * 10000 + minor * 100 + patch;
}
