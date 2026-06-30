import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];
const title = process.argv[3] || "新的旅行攻略";

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: npm run new -- city-slug \"攻略标题\"");
  console.error("Slug can contain lowercase letters, numbers, and hyphens.");
  process.exit(1);
}

const root = process.cwd();
const source = path.join(root, "guides", "_template");
const target = path.join(root, "guides", slug);

if (fs.existsSync(target)) {
  console.error(`Guide already exists: guides/${slug}`);
  process.exit(1);
}

fs.cpSync(source, target, { recursive: true });

const configPath = path.join(target, "guide.config.js");
let config = fs.readFileSync(configPath, "utf8");
config = config
  .replaceAll("城市名｜旅行攻略", title)
  .replaceAll("城市名", slug)
  .replaceAll("旅行攻略模板", title);
fs.writeFileSync(configPath, config);

for (const htmlName of ["index.html", "vertical.html"]) {
  const htmlPath = path.join(target, htmlName);
  let html = fs.readFileSync(htmlPath, "utf8");
  html = html.replaceAll("旅行攻略模板", title);
  fs.writeFileSync(htmlPath, html);
}

console.log(`Created guides/${slug}`);
console.log(`Next: add maps/photos/web assets and edit guides/${slug}/guide.config.js`);
