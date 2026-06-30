import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import os from "node:os";

const bundledPython = path.join(
  os.homedir(),
  ".cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3"
);
const python = process.env.CODEX_PYTHON || (fs.existsSync(bundledPython) ? bundledPython : "python3");

const [input, output] = process.argv.slice(2);

if (!input || !output) {
  console.error("Usage: node scripts/remove-sticker-chroma.mjs <input> <output>");
  process.exit(1);
}

fs.mkdirSync(path.dirname(output), { recursive: true });

const code = String.raw`
import sys
from PIL import Image
import numpy as np

input_path, output_path = sys.argv[1], sys.argv[2]
img = Image.open(input_path).convert("RGBA")
arr = np.asarray(img).astype(np.float32)
rgb = arr[:, :, :3]

border = np.concatenate([
    rgb[:8, :, :].reshape(-1, 3),
    rgb[-8:, :, :].reshape(-1, 3),
    rgb[:, :8, :].reshape(-1, 3),
    rgb[:, -8:, :].reshape(-1, 3),
], axis=0)
key = np.median(border, axis=0)
dist = np.linalg.norm(rgb - key, axis=2)

transparent = 42.0
opaque = 152.0
alpha = np.clip((dist - transparent) / (opaque - transparent), 0, 1)
alpha = alpha ** 0.72
alpha[dist < 58.0] = 0

key_norm = key / 255.0
rgb_norm = rgb / 255.0
near_edge = (alpha > 0.03) & (alpha < 0.98)
spill = np.maximum(0, key_norm - rgb_norm)
rgb_norm[near_edge] = np.clip(rgb_norm[near_edge] + spill[near_edge] * 0.18, 0, 1)

out = np.zeros_like(arr)
out[:, :, :3] = rgb_norm * 255.0
out[:, :, 3] = alpha * 255.0
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA").save(output_path)
`;

const result = spawnSync(python, ["-c", code, input, output], {
  stdio: "inherit"
});

process.exit(result.status ?? 1);
