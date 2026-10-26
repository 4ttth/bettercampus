// Bundles src/ into:
//   dist/extension/           → load unpacked in Chrome/Edge/Firefox, or convert for Safari
//   dist/bettercampus.user.js → install with Tampermonkey / the iOS "Userscripts" app
//   site/ → docs/             → the public install page (GitHub Pages serves docs/ on main),
//                               with the userscript and its update-check .meta.js beside it
//
// Usage: node build.mjs [--watch]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const docs = path.join(root, 'docs');

const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const listDir = (dir, ext) =>
  fs.existsSync(path.join(src, dir))
    ? fs.readdirSync(path.join(src, dir)).filter((f) => f.endsWith(ext)).sort().map((f) => `src/${dir}/${f}`)
    : [];

function build() {
  const pkg = JSON.parse(read('package.json'));
  const fill = (s) =>
    s.replaceAll('__VERSION__', pkg.version)
      .replaceAll('__HOMEPAGE__', pkg.homepage)
      .replaceAll('__REPO__', pkg.repository.url)
      .replaceAll('__DESCRIPTION__', pkg.description);

  // Order matters: core defines BC, data/app/views build on it, pages register, main runs last.
  const jsFiles = [
    'src/core.js',
    ...listDir('data', '.js'),
    ...listDir('app', '.js'),
    ...listDir('app/views', '.js'),
    ...listDir('pages', '.js'),
    'src/router.js',
    'src/main.js',
  ];
  const cssFiles = ['src/styles/base.css', ...listDir('styles', '.css').filter((f) => !f.endsWith('/base.css'))];

  const css = cssFiles.map((f) => `/* ${f} */\n${read(f)}`).join('\n');
  const js = jsFiles.map((f) => `// ${f}\n${read(f)}`).join('\n');
  const consts = [
    `const BC_CSS = ${JSON.stringify(css)};`,
    `const BC_VERSION = ${JSON.stringify(pkg.version)};`,
    `const BC_HOMEPAGE = ${JSON.stringify(pkg.homepage)};`,
  ].join('\n');
  const bundle = `(function () {\n'use strict';\n${consts}\n\n${js}\n})();\n`;

  // Overwrite in place rather than deleting dist/: on Windows a folder that's in use can't be removed.
  fs.mkdirSync(path.join(dist, 'extension'), { recursive: true });
  fs.writeFileSync(path.join(dist, 'extension', 'manifest.json'), fill(read('wrappers/extension/manifest.json')));
  fs.writeFileSync(path.join(dist, 'extension', 'content.js'), bundle);

  const header = fill(read('wrappers/userscript/header.txt'));
  const userscript = `${header}\n${bundle}`;
  fs.writeFileSync(path.join(dist, 'bettercampus.user.js'), userscript);

  // Public site. Script managers poll the small .meta.js for @version, then fetch .user.js.
  fs.mkdirSync(docs, { recursive: true });
  fs.writeFileSync(path.join(docs, 'bettercampus.user.js'), userscript);
  fs.writeFileSync(path.join(docs, 'bettercampus.meta.js'), header);
  fs.writeFileSync(path.join(docs, 'index.html'), fill(read('site/index.html')));
  fs.writeFileSync(path.join(docs, '.nojekyll'), '');

  console.log(`[${new Date().toLocaleTimeString()}] built v${pkg.version}: ${jsFiles.length} js, ${cssFiles.length} css`);
}

build();

if (process.argv.includes('--watch')) {
  let timer;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { build(); } catch (e) { console.error(e.message); }
    }, 100);
  };
  fs.watch(src, { recursive: true }, rebuild);
  fs.watch(path.join(root, 'site'), { recursive: true }, rebuild);
  console.log('watching src/ and site/ …');
}
