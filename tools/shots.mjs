// shots.mjs — the page at every width that matters, light and dark, plus the
// two things a screenshot cannot show: what the console said, and whether
// anything overflows the viewport sideways.
//
//   node tools/shots.mjs            six widths, light
//   node tools/shots.mjs --dark     the same, dark
//   node tools/shots.mjs 390        one width
//
// Writes to review/ and prints a verdict. Local tool; review/ is ignored.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'review');

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
const WIDTHS = only ? [Number(only)] : [320, 390, 430, 768, 1024, 1440, 1920];
const PAGES = args.includes('--all') ? ['/', '/privacy'] : ['/'];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const problems = [];

for (const route of PAGES) {
  for (const w of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const logs = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => logs.push(`404: ${r.url().replace(base, '')}`));
    if (dark) await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      // walk the page so every reveal fires, then come back to the top
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
          if (el.closest('.board-w, .shell, .crop, .fan, .divs, .tour')) continue;   // scrolls or clips inside its own box
          if (el.closest('.hp, .sr-only, .skip')) continue;   // parked off-screen on purpose
          out.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} → ${Math.round(r.right)}`);
        }
      }
      return [...new Set(out)].slice(0, 6);
    }, w);
    const doc = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.body.scrollHeight }));

    const tag = `${route === '/' ? 'home' : route.replace(/\//g, '')}-${w}${dark ? '-dark' : ''}`;
    await page.screenshot({ path: path.join(OUT, `${tag}.png`), fullPage: true });
    const bad = [];
    if (doc.sw > doc.cw + 1) bad.push(`page scrolls sideways by ${doc.sw - doc.cw}px`);
    if (over.length) bad.push(`overflow: ${over.join(', ')}`);
    if (logs.length) bad.push(...logs.slice(0, 4));
    if (bad.length) problems.push(`${tag}: ${bad.join(' · ')}`);
    console.log(`   ${tag.padEnd(22)} ${String(doc.h).padStart(6)}px tall${bad.length ? '   ✗ ' + bad[0] : '   ✓'}`);
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
console.log('\n  ✓ no sideways scroll, no console errors, no failed requests');
