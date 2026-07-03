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
  ['assets/brand/sahadat.png', 'assets/brand/sahadat.webp', 900, 82],
  ['content/projects/eletech/profile horizontal.png', 'content/projects/eletech/profile horizontal.webp', 1800, 80],
  ['content/projects/brewbite/BrewBite Brand Assets.png', 'content/projects/brewbite/BrewBite Brand Assets.webp', 1600, 82],
  ['content/projects/brewbite/BrewBite Icon.png', 'content/projects/brewbite/BrewBite Icon.webp', 600, 86],
  ['content/projects/brewbite/BrewBite Logo Black.png', 'content/projects/brewbite/BrewBite Logo Black.webp', 900, 86],
  ['content/projects/brewbite/BrewBite Logo Primary.png', 'content/projects/brewbite/BrewBite Logo Primary.webp', 900, 86],
  ['content/projects/brewbite/BrewBite Logo White.png', 'content/projects/brewbite/BrewBite Logo White.webp', 900, 86],
  ['content/projects/brewbite/BrewBite Menu Mockup.png', 'content/projects/brewbite/BrewBite Menu Mockup.webp', 1400, 80],
  ['content/projects/brewbite/BrewBite Poster Mockup.png', 'content/projects/brewbite/BrewBite Poster Mockup.webp', 1400, 80],
  ['content/projects/brewbite/BrewBite SM ProductFocus.png', 'content/projects/brewbite/BrewBite SM ProductFocus.webp', 1200, 80],
  ["content/logos/Dream girl's wear shop logo.jpeg", "content/logos/Dream girl's wear shop logo.webp", 900, 84],
  ['content/projects/sheetomatic/Diwali Post.jpg', 'content/projects/sheetomatic/Diwali Post.webp', 900, 84],
  ['content/projects/sheetomatic/Christmas Post.jpg', 'content/projects/sheetomatic/Christmas Post.webp', 900, 84],
  ['content/projects/sheetomatic/New Year Post.jpg', 'content/projects/sheetomatic/New Year Post.webp', 900, 84],
  ['content/projects/sheetomatic/Holi post.png', 'content/projects/sheetomatic/Holi post.webp', 900, 82],
  ['content/projects/sheetomatic/Carousel Attendance.png', 'content/projects/sheetomatic/Carousel Attendance.webp', 1600, 80],
  ['content/projects/sheetomatic/automation carousel horizontal.png', 'content/projects/sheetomatic/automation carousel horizontal.webp', 1600, 80],
  ['content/projects/sheetomatic/automate data entry thumbnail.png', 'content/projects/sheetomatic/automate data entry thumbnail.webp', 1200, 80],
  ['content/projects/sheetomatic/own task manager thumbnail.png', 'content/projects/sheetomatic/own task manager thumbnail.webp', 1200, 80],
  ['content/projects/sheetomatic/Text & Weeknum thumbnail.png', 'content/projects/sheetomatic/Text & Weeknum thumbnail.webp', 1200, 80],
  ['content/projects/glowera/cover.png', 'content/projects/glowera/cover.webp', 900, 84],
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
