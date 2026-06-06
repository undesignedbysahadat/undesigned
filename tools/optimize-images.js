const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const pythonCandidates = [
  process.env.PYTHON,
  path.join(process.env.USERPROFILE || '', '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'python', 'python.exe'),
  'python',
  'python3',
].filter(Boolean);

const images = [
  ['otheri imgs/sahadat.png', 'otheri imgs/sahadat.webp', 900, 82],
  ['otheri imgs/profile horizontal.png', 'otheri imgs/profile horizontal.webp', 1800, 80],
  ['brewbite images/BrewBite Brand Assets.png', 'brewbite images/BrewBite Brand Assets.webp', 1600, 82],
  ['brewbite images/BrewBite Icon.png', 'brewbite images/BrewBite Icon.webp', 600, 86],
  ['brewbite images/BrewBite Logo Black.png', 'brewbite images/BrewBite Logo Black.webp', 900, 86],
  ['brewbite images/BrewBite Logo Primary.png', 'brewbite images/BrewBite Logo Primary.webp', 900, 86],
  ['brewbite images/BrewBite Logo White.png', 'brewbite images/BrewBite Logo White.webp', 900, 86],
  ['brewbite images/BrewBite Menu Mockup.png', 'brewbite images/BrewBite Menu Mockup.webp', 1400, 80],
  ['brewbite images/BrewBite Poster Mockup.png', 'brewbite images/BrewBite Poster Mockup.webp', 1400, 80],
  ['brewbite images/BrewBite SM ProductFocus.png', 'brewbite images/BrewBite SM ProductFocus.webp', 1200, 80],
  ["logofolio/Dream girl's wear shop logo.jpeg", "logofolio/Dream girl's wear shop logo.webp", 900, 84],
  ['sheetomatic/Diwali Post.jpg', 'sheetomatic/Diwali Post.webp', 900, 84],
  ['sheetomatic/Christmas Post.jpg', 'sheetomatic/Christmas Post.webp', 900, 84],
  ['sheetomatic/New Year Post.jpg', 'sheetomatic/New Year Post.webp', 900, 84],
  ['sheetomatic/Holi post.png', 'sheetomatic/Holi post.webp', 900, 82],
  ['sheetomatic/Carousel Attendance.png', 'sheetomatic/Carousel Attendance.webp', 1600, 80],
  ['sheetomatic/automation carousel horizontal.png', 'sheetomatic/automation carousel horizontal.webp', 1600, 80],
  ['sheetomatic/automate data entry thumbnail.png', 'sheetomatic/automate data entry thumbnail.webp', 1200, 80],
  ['sheetomatic/own task manager thumbnail.png', 'sheetomatic/own task manager thumbnail.webp', 1200, 80],
  ['sheetomatic/Text & Weeknum thumbnail.png', 'sheetomatic/Text & Weeknum thumbnail.webp', 1200, 80],
];

const pythonCode = String.raw`
import json
import os
import sys
from PIL import Image

root = sys.argv[1]
items = json.loads(sys.argv[2])

for src_rel, out_rel, max_width, quality in items:
    src = os.path.join(root, src_rel)
    out = os.path.join(root, out_rel)

    if not os.path.exists(src):
        print(f"skip missing: {src_rel}")
        continue

    os.makedirs(os.path.dirname(out), exist_ok=True)

    with Image.open(src) as image:
        image.load()
        original_width, original_height = image.size

        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

        if original_width > max_width:
            ratio = max_width / original_width
            new_size = (max_width, max(1, round(original_height * ratio)))
            image = image.resize(new_size, Image.Resampling.LANCZOS)

        image.save(out, "WEBP", quality=quality, method=6)

    old_size = os.path.getsize(src)
    new_size = os.path.getsize(out)
    saved = 100 - ((new_size / old_size) * 100)
    print(f"{src_rel} -> {out_rel} ({old_size/1024:.1f} KB to {new_size/1024:.1f} KB, {saved:.1f}% smaller)")
`;

function findPython() {
  for (const candidate of pythonCandidates) {
    const result = spawnSync(candidate, ['-c', 'from PIL import Image, features; raise SystemExit(0 if features.check("webp") else 1)'], {
      encoding: 'utf8',
      shell: false,
    });

    if (result.status === 0) return candidate;
  }

  return null;
}

const python = findPython();

if (!python) {
  console.error('No Python runtime with Pillow WebP support found. Set PYTHON to a compatible Python executable and retry.');
  process.exit(1);
}

const result = spawnSync(python, ['-c', pythonCode, root, JSON.stringify(images)], {
  encoding: 'utf8',
  shell: false,
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(result.status || 0);
