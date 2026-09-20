// measure.mjs — the numbers the round-two standard is judged by.
//
//   DIST=/path/to/dist node measure.mjs            → JSON on stdout
//   DIST=… node measure.mjs --route /features       one page (default /)
//
// For 1440, 1920 and 390: every section's content box against the viewport,
// how many items it carries, the header lockup height, the footer's mark,
// and every product screen rendered at 320px or more.

import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http';
const { chromium } = await import('file:///Users/hazor/Projects/Careshop.app/node_modules/playwright/index.mjs');
const DIST = path.resolve(process.env.DIST || 'dist');
const args = process.argv.slice(2); const ri = args.indexOf('--route'); const ROUTE = ri >= 0 ? args[ri + 1] : '/';
const TYPE = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => { const url = decodeURIComponent((req.url || '/').split('?')[0]); if (url.startsWith('/api/')) { res.writeHead(200, { 'content-type': 'application/json' }); res.end('{"ok":true}'); return; } const t = path.normalize(path.join(DIST, url)); const f = [t, `${t}.html`, path.join(t, 'index.html')].find((c) => c.startsWith(DIST) && fs.existsSync(c) && fs.statSync(c).isFile()); if (!f) { res.writeHead(404).end(); return; } res.writeHead(200, { 'content-type': TYPE[path.extname(f)] || 'application/octet-stream' }); res.end(fs.readFileSync(f)); });
await new Promise((r) => server.listen(0, r)); const base = `http://localhost:${server.address().port}`;
const browser = await chromium.launch();
const out = { route: ROUTE, viewports: {} };
for (const w of [1440, 1920, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 1000 }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
  await page.goto(base + ROUTE, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => { document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')); const step = Math.round(window.innerHeight * 0.9); for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 20)); } window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 300)); });
  out.viewports[w] = await page.evaluate((vw) => {
    const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity) > 0.05; };
    const leaf = (el) => el.children.length === 0 || el.matches('svg, img, .phone, .browser, .paper, .paper-sheet, .wk, table');
    const contentBox = (root) => { let l = Infinity, r = -Infinity, n = 0; for (const el of root.querySelectorAll('*')) { if (!vis(el) || !leaf(el)) continue; if (el.closest('[hidden], .hp, .sr-only, .skip')) continue; const b = el.getBoundingClientRect(); if (b.width < 2) continue; l = Math.min(l, b.left); r = Math.max(r, b.right); n++; } return n ? { left: Math.max(0, l), right: Math.min(vw, r), leaves: n } : null; };
    const items = (root) => { let best = 0; for (const c of root.querySelectorAll('*')) { const s = getComputedStyle(c); if ((s.display === 'grid' || s.display === 'flex' || s.display === 'inline-grid') && c.children.length >= 3 && vis(c)) best = Math.max(best, [...c.children].filter(vis).length); } return best; };
    const screens = [...document.querySelectorAll('.phone, .browser, .paper, .paper-sheet, .wk, .board')].filter(vis).map((el) => { const b = el.getBoundingClientRect(); return { kind: el.className.toString().split(' ')[0], width: Math.round(b.width), height: Math.round(b.height), inside: (el.closest('section, header, footer') || {}).id || '' }; });
    const sections = [...document.querySelectorAll('main section, main .hero')].filter(vis).filter((s) => !s.closest('[role="img"], .phone, .browser')).map((s) => { const b = s.getBoundingClientRect(); const cb = contentBox(s); return { id: s.id || s.getAttribute('aria-label') || s.className.toString().slice(0, 30), top: Math.round(b.top + window.scrollY), height: Math.round(b.height), fullBleed: b.width >= vw - 2, contentPct: cb ? Math.round(((cb.right - cb.left) / vw) * 100) : 0, emptyLeftPct: cb ? Math.round((cb.left / vw) * 100) : 0, emptyRightPct: cb ? Math.round(((vw - cb.right) / vw) * 100) : 0, hasH1: Boolean(s.querySelector('h1')), items: items(s), screens: [...s.querySelectorAll('.phone, .browser, .paper, .paper-sheet, .wk, .board')].filter(vis).filter((e) => e.getBoundingClientRect().width >= 320).length }; });
    const header = document.querySelector('header'); const brand = header && (header.querySelector('.lockup, [data-lockup], a[href="/"]')); const bh = brand ? Math.round(brand.getBoundingClientRect().height) : 0;
    const footer = document.querySelector('footer'); let fm = 0, fcols = 0, flinks = 0; if (footer) { for (const svg of footer.querySelectorAll('svg')) { const r = svg.getBoundingClientRect(); fm = Math.max(fm, Math.round(Math.min(r.width, r.height))); } for (const c of footer.querySelectorAll('*')) { const s = getComputedStyle(c); if ((s.display === 'grid' || s.display === 'flex') && c.children.length >= 4 && vis(c)) fcols = Math.max(fcols, [...c.children].filter(vis).length); } flinks = [...footer.querySelectorAll('a')].filter(vis).length; }
    const h1 = document.querySelector('h1'); const h1px = h1 ? Math.round(parseFloat(getComputedStyle(h1).fontSize)) : 0;
    const maxVar = getComputedStyle(document.documentElement).getPropertyValue('--max').trim();
    return { vw, maxVar, h1px, headerLockupHeight: bh, footer: { markPx: fm, columns: fcols, links: flinks, fullBleed: footer ? footer.getBoundingClientRect().width >= vw - 2 : false }, screensOver320: screens.filter((s) => s.width >= 320).length, screens, sections, pageHeight: document.body.scrollHeight };
  }, w);
  await page.close();
}
await browser.close(); server.close();
/* the verdicts the standard asks for */
const v = out.viewports;
const flags = [];
for (const w of [1440, 1920]) { const lim = w === 1440 ? 8 : 12; for (const s of v[w].sections) { if (!s.fullBleed && (s.emptyLeftPct > lim || s.emptyRightPct > lim)) flags.push(`${w}: section ${s.id} leaves ${s.emptyLeftPct}% / ${s.emptyRightPct}% empty (limit ${lim}%)`); if (s.contentPct < 55 && s.screens === 0) flags.push(`${w}: section ${s.id} content spans only ${s.contentPct}% of the viewport`); if (s.items < 6 && s.screens === 0 && !s.hasH1) flags.push(`${w}: section ${s.id} carries ${s.items} items and no full-size screen`); } }
if (v[1440].headerLockupHeight < 40) flags.push(`1440: header lockup is ${v[1440].headerLockupHeight}px tall (standard 40–48)`);
if (v[1440].footer.markPx < 72) flags.push(`1440: footer mark is ${v[1440].footer.markPx}px (standard 72–96)`);
if (v[1440].footer.columns < 5) flags.push(`1440: footer has ${v[1440].footer.columns} columns (standard 5–6)`);
if (ROUTE === '/' && v[1440].screensOver320 < 3) flags.push(`1440: only ${v[1440].screensOver320} screens rendered at ≥ 320px (standard ≥ 3 showcases)`);
if (v[1440].h1px < 56) flags.push(`1440: h1 is ${v[1440].h1px}px (standard ≥ 56)`);
out.flags = flags;
console.log(JSON.stringify(out, null, 1));
