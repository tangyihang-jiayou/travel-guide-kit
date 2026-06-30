#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: node scripts/import-latest-sticker.mjs <slug>");
  process.exit(1);
}

const generatedRoot = path.join(os.homedir(), ".codex", "generated_images");
const generatedDir =
  process.env.CODEX_GENERATED_IMAGES_DIR ||
  fs
    .readdirSync(generatedRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const file = path.join(generatedRoot, entry.name);
      return { file, mtime: fs.statSync(file).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime)[0]?.file;

if (!generatedDir) {
  console.error(`No generated image directories found in ${generatedRoot}`);
  process.exit(1);
}
const rawDir = path.join("guides", "paris", "assets", "stickers", "gpt-image", "raw");
const finalDir = path.join("guides", "paris", "assets", "stickers", "gpt-image", "final");

const pngs = fs
  .readdirSync(generatedDir)
  .filter((name) => name.toLowerCase().endsWith(".png"))
  .map((name) => {
    const file = path.join(generatedDir, name);
    return { name, file, mtime: fs.statSync(file).mtimeMs };
  })
  .sort((a, b) => b.mtime - a.mtime);

if (!pngs.length) {
  console.error(`No PNG files found in ${generatedDir}`);
  process.exit(1);
}

fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(finalDir, { recursive: true });

const rawPath = path.join(rawDir, `${slug}-raw.png`);
const finalPath = path.join(finalDir, `${slug}.png`);

fs.copyFileSync(pngs[0].file, rawPath);

const result = spawnSync(
  process.execPath,
  ["scripts/remove-sticker-chroma.mjs", rawPath, finalPath],
  { stdio: "inherit" }
);

if (result.status !== 0) {
  process.exit(result.status || 1);
}

console.log(finalPath);
