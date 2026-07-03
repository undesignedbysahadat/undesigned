const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const htmlFiles = ['index.html', 'projects.html'].filter(file => fs.existsSync(path.join(root, file)));

const imageTags = htmlFiles.flatMap(file => {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  return [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
});

const htmlSrcs = imageTags
  .map(tag => tag.match(/\bsrc="([^"]*)"/)?.[1])
  .filter(src => src && !src.startsWith('http') && !src.startsWith('data') && !src.includes('${'));

const projectsPath = path.join(root, 'content', 'projects.json');
const projectSrcs = fs.existsSync(projectsPath)
  ? JSON.parse(fs.readFileSync(projectsPath, 'utf8')).map(project => project.cover).filter(Boolean)
  : [];

const srcs = [...new Set([...htmlSrcs, ...projectSrcs])];
const missing = srcs.filter(src => !fs.existsSync(path.join(root, src)));
const webp = srcs.filter(src => src.endsWith('.webp')).length;
const lazy = imageTags.filter(tag => /\bloading="lazy"/.test(tag)).length;

console.log(JSON.stringify({
  htmlFiles,
  totalImages: srcs.length,
  webpImages: webp,
  lazyImages: lazy,
  missing,
}, null, 2));

if (missing.length > 0) {
  process.exit(1);
}
