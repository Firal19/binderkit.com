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

const FONTS = path.join(ROOT, 'src', 'assets', 'fonts');
const og = CONFIG.og;
const fontFace = `
@font-face { font-family: '${og.display}'; font-weight: 300 800; src: url("file://${FONTS}/${og.displayFile}") format('woff2'); }
@font-face { font-family: '${og.body}'; font-weight: 300 800; src: url("file://${FONTS}/${og.bodyFile}") format('woff2'); }`;

/* ── the app icon: the mark on its tile, at three sizes ───────────────── */
const iconHtml = (size) => `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;width:${size}px;height:${size}px}svg{display:block;width:${size}px;height:${size}px}</style>
${markLiteral(p.id, og.tile, og.glyph, size)}`;

/* ── the social card ──────────────────────────────────────────────────
   1200 × 630 in the page's own materials: its ground, its display face, its
   accent as one rule, the mark, the headline, the domain. */
const ogHtml = `<!doctype html><meta charset="utf-8">
<style>
${fontFace}
* { margin:0; box-sizing:border-box; }
html,body { width:1200px; height:630px; }
body {
  background:${og.bg}; color:${og.ink};
  font-family:'${og.body}',system-ui,sans-serif;
  padding:74px 80px; display:flex; flex-direction:column; justify-content:space-between;
  position:relative; overflow:hidden;
}
.rule { position:absolute; left:0; right:0; top:0; height:10px; background:${og.accent}; }
.brand { display:flex; align-items:center; gap:16px; }
.brand svg { width:56px; height:56px; display:block; border-radius:14px; }
.brand b { font-size:30px; font-weight:700; letter-spacing:-.02em; }
h1 {
  font-family:'${og.display}',Georgia,serif; font-weight:${og.weight}; font-size:76px; line-height:1.02;
  letter-spacing:-.03em; max-width:19ch; font-variation-settings:'opsz' 96;
}
.desc { margin-top:24px; font-size:26px; line-height:1.4; opacity:.75; max-width:34ch; }
.foot { display:flex; align-items:baseline; justify-content:space-between; gap:24px;
  border-top:1px solid color-mix(in srgb, ${og.ink} 14%, transparent); padding-top:22px; }
.dom { font-size:19px; letter-spacing:.02em; font-weight:700; }
.by { font-size:19px; opacity:.6; }
</style>
<div class="rule"></div>
<div class="brand">${markLiteral(p.id, og.tile, og.glyph, 56)}<b>${p.name}</b></div>
<div>
  <h1>${p.headline.text}</h1>
  <p class="desc">${p.descriptor}.</p>
</div>
<div class="foot"><span class="dom">${CONFIG.domain}</span><span class="by">By Providerhub Oregon</span></div>`;

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
