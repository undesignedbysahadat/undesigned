const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
const srcs = imageTags
  .map(tag => tag.match(/\bsrc="([^"]*)"/)?.[1])
  .filter(src => src && !src.startsWith('http') && !src.startsWith('data'));

const missing = srcs.filter(src => !fs.existsSync(path.join(root, src)));
const webp = srcs.filter(src => src.endsWith('.webp')).length;
const lazy = imageTags.filter(tag => /\bloading="lazy"/.test(tag)).length;

console.log(JSON.stringify({
  totalImages: srcs.length,
  webpImages: webp,
  lazyImages: lazy,
  missing,
}, null, 2));

if (missing.length > 0) {
  process.exit(1);
}
