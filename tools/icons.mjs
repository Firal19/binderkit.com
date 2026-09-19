// icons.mjs — rasterise the mark and draw the social card.
//
//   node tools/icons.mjs
//
// A local tool, not a build step: the PNGs it writes land in
// src/assets/raster/ and are committed, so a deploy never needs a browser.
// Re-run it when the mark or the headline changes.
//
// Playwright is not a dependency of this repo. Point PLAYWRIGHT at an
// installation if it is not in one of the usual places.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { markLiteral, productOf } from '../src/kit.js';
import { CONFIG } from '../src/config.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const OUT = path.join(ROOT, 'src', 'assets', 'raster');

const CANDIDATES = [
  process.env.PLAYWRIGHT,
  path.join(ROOT, 'node_modules', 'playwright'),
  path.join(process.env.HOME || '', 'Projects', 'Careshop.app', 'node_modules', 'playwright'),
  'playwright',
].filter(Boolean);

let chromium = null;
for (const c of CANDIDATES) {
  try { ({ chromium } = await import(c.startsWith('/') ? `file://${c}/index.mjs` : c)); break; } catch { /* next */ }
}
if (!chromium) {
  console.error('  playwright not found. npm i -D playwright, or set PLAYWRIGHT=/path/to/playwright');
  process.exit(1);
}

const p = productOf(CONFIG.product);
fs.mkdirSync(OUT, { recursive: true });

const FONTS = path.join(ROOT, 'src', 'assets');
const fontFace = fs.readFileSync(path.join(FONTS, 'fonts.css'), 'utf8')
  .replace(/url\("fonts\//g, `url("file://${FONTS}/fonts/`);

/* ── the app icon: the mark on its tile, at three sizes ───────────────── */
const iconHtml = (size) => `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;width:${size}px;height:${size}px}svg{display:block;width:${size}px;height:${size}px}</style>
${markLiteral(p.id, '#0F5C5A', '#F7F3EC', size)}`;

/* ── the social card ──────────────────────────────────────────────────
   1200 × 630, the family's own materials: the mark, the headline in
   Fraunces, the descriptor, and the domain. Nothing decorative. */
const ogHtml = `<!doctype html><meta charset="utf-8">
<style>
${fontFace}
:root { --ink:#17201F; --ivory:#F7F3EC; --teal:#0F5C5A; --soft:#5B6663; --body:#2B3432; --line:rgba(23,32,31,.12); }
* { margin:0; box-sizing:border-box; }
html,body { width:1200px; height:630px; }
body {
  background:var(--ivory); color:var(--ink);
  font-family:'Instrument Sans',system-ui,sans-serif;
  padding:74px 80px; display:flex; flex-direction:column; justify-content:space-between;
  position:relative; overflow:hidden;
}
.rule { position:absolute; left:0; right:0; top:0; height:8px; background:var(--teal); }
.brand { display:flex; align-items:center; gap:16px; }
.brand svg { width:56px; height:56px; display:block; border-radius:14px; }
.brand b { font-size:30px; font-weight:600; letter-spacing:-.02em; }
h1 {
  font-family:'Fraunces',Georgia,serif; font-weight:500; font-size:76px; line-height:1.02;
  letter-spacing:-.03em; max-width:19ch; font-variation-settings:'opsz' 144;
}
.desc { margin-top:24px; font-size:26px; line-height:1.4; color:var(--body); max-width:34ch; }
.foot { display:flex; align-items:baseline; justify-content:space-between; gap:24px;
  border-top:1px solid var(--line); padding-top:22px; }
.dom { font-family:'IBM Plex Mono',monospace; font-size:19px; letter-spacing:.14em;
  text-transform:uppercase; color:var(--teal); font-weight:500; }
.by { font-size:19px; color:var(--soft); }
</style>
<div class="rule"></div>
<div class="brand">${markLiteral(p.id, '#0F5C5A', '#F7F3EC', 56)}<b>${p.name}</b></div>
<div>
  <h1>${p.headline.text}</h1>
  <p class="desc">${p.descriptor}.</p>
</div>
<div class="foot"><span class="dom">${CONFIG.domain}</span><span class="by">by Provider Hub Oregon</span></div>`;

const browser = await chromium.launch();
const shoot = async (html, w, h, file, scale = 1) => {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, file), type: 'png' });
  await page.close();
  console.log(`   ${file}  ${(fs.statSync(path.join(OUT, file)).size / 1024).toFixed(1)} kB`);
};

console.log(`  ${p.name} icons →  src/assets/raster/`);
for (const s of [180, 192, 512]) await shoot(iconHtml(s), s, s, `icon-${s}.png`);
await shoot(ogHtml, 1200, 630, 'og.png');
await browser.close();
