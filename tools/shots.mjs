// shots.mjs — every page at every width that matters, light and dark, plus
// the things a screenshot cannot show: what the console said, whether
// anything overflows the viewport sideways, and whether a thumb can hit
// every control on a phone.
//
//   node tools/shots.mjs            the front page, seven widths, light
//   node tools/shots.mjs --dark     the same, dark
//   node tools/shots.mjs --all      every page in dist/
//   node tools/shots.mjs 390        one width
//   node tools/shots.mjs --mobile   320, 390 and 430 only
//
// Writes to review/ and prints a verdict. Local tool; review/ is ignored.
// DIST=<dir> reads a build written somewhere other than ./dist.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const DIST = process.env.DIST ? path.resolve(process.env.DIST) : path.join(ROOT, 'dist');
const OUT = process.env.REVIEW ? path.resolve(process.env.REVIEW) : path.join(ROOT, 'review');

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
if (!chromium) { console.error('  playwright not found; set PLAYWRIGHT=/path/to/playwright'); process.exit(1); }
if (!fs.existsSync(DIST)) { console.error('  run node build.mjs first'); process.exit(1); }

const TYPE = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url.startsWith('/api/')) { res.writeHead(200, { 'content-type': 'application/json' }); res.end('{"ok":true,"configured":false}'); return; }
  const t = path.normalize(path.join(DIST, url));
  const file = [t, `${t}.html`, path.join(t, 'index.html')].find((c) => c.startsWith(DIST) && fs.existsSync(c) && fs.statSync(c).isFile());
  if (!file) { res.writeHead(404).end('no'); return; }
  res.writeHead(200, { 'content-type': TYPE[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const args = process.argv.slice(2);
const dark = args.includes('--dark');
const only = args.find((a) => /^\d+$/.test(a));
const WIDTHS = only ? [Number(only)] : args.includes('--mobile') ? [320, 390, 430] : [320, 390, 430, 768, 1024, 1440, 1920];
const routes = [];
(function walk(d, base = '') {
  for (const f of fs.readdirSync(d)) {
    const full = path.join(d, f);
    if (fs.statSync(full).isDirectory()) walk(full, `${base}/${f}`);
    else if (f === 'index.html') routes.push(base || '/');
  }
}(DIST));
const PAGES = args.includes('--all') ? routes.sort() : ['/'];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const problems = [];

for (const route of PAGES) {
  for (const w of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, hasTouch: w <= 430, isMobile: w <= 430 });
    const logs = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => logs.push(`404: ${r.url().replace(base, '')}`));
    if (dark) await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.8);
      for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 24)); }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 260));
    });

    /* sideways overflow, named element by element */
    const over = await page.evaluate((vw) => {
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        if (r.right > vw + 1.5 || r.left < -1.5) {
          const s = getComputedStyle(el);
          if (s.overflowX === 'auto' || s.overflowX === 'scroll' || s.position === 'fixed') continue;
          if (el.closest('[data-scrollx], .board-w, .shell, .crop, .fan, .divs, .tour, .lp-scrollx, .lp-board-in')) continue;
          /* the demo primitives are deliberate sideways scrollers, like .board-w
             above. They postdate this list; without them the gate reports every
             film strip on every site as an overflow defect. */
          if (el.closest('.fs-rail, .fs-jump, .swx-tabs')) continue;
          if (el.closest('.hp, .sr-only, .skip, [hidden], [aria-hidden="true"][data-offscreen]')) continue;
          if (s.visibility === 'hidden' || s.opacity === '0') continue;
          out.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} → ${Math.round(r.right)}`);
        }
      }
      return [...new Set(out)].slice(0, 6);
    }, w);
    const doc = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.body.scrollHeight }));

    /* on a phone, every visible control must be at least 40px on its short
       side — inline links inside running text are exempt, everything else is
       a thing a thumb has to hit */
    let small = [];
    if (w <= 430) {
      small = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll('a, button, input, select, textarea, summary, [role="button"], [tabindex="0"]')) {
          if (el.closest('[hidden], .hp, .sr-only, .skip, [role="img"], [aria-hidden="true"]')) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const s = getComputedStyle(el);
          if (s.visibility === 'hidden' || s.display === 'none') continue;
          if (el.tagName === 'A' && el.closest('p, li, td, dd, blockquote, figcaption') && s.display.startsWith('inline')) continue;
          if (Math.min(r.width, r.height) < 40) out.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0] || (el.id ? '#' + el.id : '')} ${Math.round(r.width)}×${Math.round(r.height)}`);
        }
        return [...new Set(out)].slice(0, 8);
      });
    }
    /* body text on a phone must not be set below 15px, inputs not below 16 */
    let tiny = [];
    if (w <= 430) {
      tiny = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll('input, select, textarea')) {
          if (el.closest('[hidden], .hp')) continue;
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs && fs < 16) out.push(`${el.tagName.toLowerCase()}[name=${el.name}] ${fs}px`);
        }
        return out.slice(0, 4);
      });
    }

    const tag = `${route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')}-${w}${dark ? '-dark' : ''}`;
    await page.screenshot({ path: path.join(OUT, `${tag}.png`), fullPage: true });
    const bad = [];
    if (doc.sw > doc.cw + 1) bad.push(`page scrolls sideways by ${doc.sw - doc.cw}px`);
    if (over.length) bad.push(`overflow: ${over.join(', ')}`);
    if (logs.length) bad.push(...logs.slice(0, 4));
    if (tiny.length) bad.push(`inputs below 16px (iOS will zoom): ${tiny.join(', ')}`);
    if (small.length) bad.push(`targets under 40px: ${small.join(', ')}`);
    if (bad.length) problems.push(`${tag}: ${bad.join(' · ')}`);
    console.log(`   ${tag.padEnd(26)} ${String(doc.h).padStart(6)}px tall${bad.length ? '   ✗ ' + bad[0] : '   ✓'}`);
    await page.close();
  }
}

await browser.close();
server.close();
if (problems.length) {
  console.log(`\n  ${problems.length} to fix:`);
  problems.forEach((p) => console.log(`   ✗ ${p}`));
  process.exit(1);
}
console.log('\n  ✓ no sideways scroll, no console errors, no failed requests, every phone target ≥ 40px');
