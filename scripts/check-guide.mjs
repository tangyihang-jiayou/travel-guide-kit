import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const guideDir = process.argv[2] || "guides/paris";
const root = process.cwd();
const absoluteGuideDir = path.resolve(root, guideDir);
const configPath = path.join(absoluteGuideDir, "guide.config.js");

function fail(message) {
  console.error(`Guide check failed: ${message}`);
  process.exitCode = 1;
}

function resolveAsset(assetsBase, src) {
  if (!src) return null;
  if (/^(https?:|data:|file:|\/)/.test(src)) return null;
  return path.resolve(absoluteGuideDir, assetsBase || "./assets/", src);
}

if (!fs.existsSync(configPath)) {
  fail(`missing ${path.relative(root, configPath)}`);
  process.exit();
}

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(configPath, "utf8"), context, { filename: configPath });

const guide = context.window.TRAVEL_GUIDE;
if (!guide) fail("guide.config.js must set window.TRAVEL_GUIDE");
if (!Array.isArray(guide?.slides) || guide.slides.length === 0) fail("slides must be a non-empty array");

let missingAssets = 0;
let missingFields = 0;

guide.slides?.forEach((slide, index) => {
  const label = `slide ${index + 1}`;
  if (!slide.section) {
    console.error(`${label}: missing section`);
    missingFields += 1;
  }
  if (!slide.title) {
    console.error(`${label}: missing title`);
    missingFields += 1;
  }
  if (!slide.src) {
    console.error(`${label}: missing src`);
    missingFields += 1;
    return;
  }

  const assetPath = resolveAsset(guide.assetsBase, slide.src);
  if (assetPath && !fs.existsSync(assetPath)) {
    console.error(`${label}: missing asset ${path.relative(root, assetPath)}`);
    missingAssets += 1;
  }
});

if (missingFields || missingAssets) {
  fail(`${missingFields} missing fields, ${missingAssets} missing assets`);
} else {
  console.log(`Guide OK: ${guideDir} (${guide.slides.length} slides)`);
}
