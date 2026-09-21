// gate.mjs — the mobile standard, measured. Exit 0 = clean.
//
//   node gate.mjs cohort|binderkit|aidepost|careshop|board|all [--json] [--widths 390,360,320]
//
// Rules are split: CHROME rules (real UI the thumb touches) exclude the
// interiors of product mockups (.phone/.browser/.paper/.wk/.board-mock),
// because those are pictures of an app and are meant to read small.
// OVERFLOW rules apply to everything — a 1280px browser mock on a 390px
// screen is a real bug no matter what it depicts.

import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http'; import { fileURLToPath } from 'node:url';
const PW = ['file:///Users/hazor/Projects/Careshop.app/node_modules/playwright/index.mjs', 'playwright', 'playwright-core'];
let chromium = null;
for (const cand of PW) { try { ({ chromium } = await import(cand)); break; } catch {} }
if (!chromium) { console.error('mobile.mjs needs playwright. Install it, or point PW at a checkout that has it.'); process.exit(2); }

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');            // tools/ lives inside the site
const DIST = path.resolve(process.env.DIST || path.join(SITE, 'dist'));
const args = process.argv.slice(2);
const JSONOUT = args.includes('--json');
const wi = args.indexOf('--widths');
const WIDTHS = (wi >= 0 ? args[wi+1] : '390,360,320').split(',').map(Number);

const TYPE = { '.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json','.webmanifest':'application/manifest+json','.ico':'image/x-icon' };

function discoverRoutes(dist) {
  const out = [];
  const walk = (d, pre) => {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) { if (f === 'assets' || f.startsWith('.')) continue; walk(p, pre + '/' + f); }
      else if (f === 'index.html') out.push(pre || '/');
      else if (f.endsWith('.html') && f !== '404.html') out.push((pre || '') + '/' + f.replace(/\.html$/, ''));
    }
  };
  walk(dist, '');
  return [...new Set(out)].sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
}

const PROBE = (vw) => {
  /* `.face` was in this list and it sits on <main class="page face canvas"> — the
     page's OWN main. So every CHROME rule below (tap-target, tiny-text,
     cramped-grid) skipped 63-81% of the page and the gate reported CLEAN while
     measuring the header and the footer. The mock classes are what this is for;
     .face is a theming hook, not a mock. Measured 2026-09-20: cohort 374/596
     elements exempt, binderkit 66%, careshop 76%, aidepost 81%. */
  const MOCK = '.phone, .browser, .paper, .paper-sheet, .wk, .board-mock, .ph, .screen, [data-mock]';
  const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity) > 0.05; };
  const sel = el => { let s = el.tagName.toLowerCase(); if (el.id) return s + '#' + el.id; const c = el.className && el.className.toString && el.className.toString().trim().split(/\s+/).filter(Boolean).slice(0,2).join('.'); return c ? s + '.' + c : s; };
  const where = el => { const s = el.closest('section, header, footer, main'); return s ? (s.id || sel(s)) : ''; };
  const offscreen = el => { const b = el.getBoundingClientRect(); return b.right < -100 || b.left > vw + 2000 || b.bottom < -100; };
  const inMock = el => Boolean(el.closest(MOCK));
  const hidden = el => Boolean(el.closest('[hidden], [aria-hidden="true"], .hp, .sr-only, .skip, .visually-hidden'));
  const scrollerAncestor = el => { let p = el.parentElement; while (p && p !== document.body) { const ox = getComputedStyle(p).overflowX; if (ox === 'auto' || ox === 'scroll') return sel(p); p = p.parentElement; } return null; };

  const issues = [];
  const add = (rule, detail, node, extra) => issues.push(Object.assign({ rule, detail, node: node ? sel(node) : '', at: node ? where(node) : '' }, extra || {}));

  // ---- OVERFLOW (applies to mockups too) ----
  const docW = document.documentElement.scrollWidth;
  if (docW > vw + 1) add('doc-overflow', `page scrolls ${Math.round(docW - vw)}px horizontally`, document.body, { px: Math.round(docW - vw) });
  const bleed = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el) || hidden(el) || offscreen(el)) continue;
    const b = el.getBoundingClientRect();
    if (b.right <= vw + 1.5) continue;
    const sc = scrollerAncestor(el);
    if (sc) continue;                       // inside a deliberate horizontal scroller
    if (getComputedStyle(el).position === 'fixed') continue;
    bleed.push({ el, over: Math.round(b.right - vw), w: Math.round(b.width) });
  }
  // keep only the outermost bleeder in each chain
  const bleedEls = new Set(bleed.map(b => b.el));
  for (const b of bleed) { let p = b.el.parentElement, nested = false; while (p) { if (bleedEls.has(p)) { nested = true; break; } p = p.parentElement; } if (!nested) add('bleed', `extends ${b.over}px past the right edge (element is ${b.w}px wide)`, b.el, { px: b.over, width: b.w, mock: inMock(b.el) || b.el.matches(MOCK) }); }

  // ---- CHROME rules (skip mockup interiors) ----
  for (const el of document.querySelectorAll('a,button,input,select,textarea,summary,[role="button"],[role="tab"],[role="switch"]')) {
    if (!vis(el) || hidden(el) || inMock(el) || offscreen(el)) continue;
    const b = el.getBoundingClientRect();
    const inProse = el.tagName === 'A' && el.closest('p, li, dd, blockquote') && getComputedStyle(el).display.includes('inline');
    if (inProse) continue;                  // inline prose links are not buttons
    if (b.height < 44 || b.width < 44) add('tap-target', `${Math.round(b.width)}×${Math.round(b.height)}px (min 44×44)`, el, { w: Math.round(b.width), h: Math.round(b.height), text: (el.textContent||'').trim().slice(0,30) });
  }
  // Two tiers: prose must be comfortably readable; incidental labels may be small
  // but never microscopic. A 12px legal line is a design decision; 10px is a bug.
  const PROSE_MIN = 15, META_MIN = 12;
  const tinyBuckets = {};
  for (const el of document.querySelectorAll('body *')) {
    /* Was `el.children.length ||` — which skipped any block whose text sits
       beside even one inline child, i.e. most real prose. Read this element’s
       OWN text nodes instead, so a <p> with a link in it is still measured. */
    if (!vis(el) || hidden(el) || inMock(el) || offscreen(el)) continue;
    /* This element's OWN text, not its descendants' — measuring a parent's
       textContent at the parent's font-size is how you manufacture failures
       for text that is actually set larger inside a child. */
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    if (own.length < 4) continue;
    const t = own;
    const px = parseFloat(getComputedStyle(el).fontSize);
    const isProse = t.length > 60 || Boolean(el.closest('p, li, dd, blockquote'));
    const min = isProse ? PROSE_MIN : META_MIN;
    if (px >= min) continue;
    const k = sel(el) + ' @' + (Math.round(px*10)/10) + 'px';
    (tinyBuckets[k] = tinyBuckets[k] || { rule:'tiny-text', node: sel(el), px: Math.round(px*10)/10, min, kind: isProse ? 'prose' : 'label', count: 0, sample: t.slice(0,40), at: where(el) }).count++;
  }
  for (const b of Object.values(tinyBuckets)) add('tiny-text', `${b.count}x ${b.kind} at ${b.px}px (min ${b.min}px for ${b.kind}) e.g. "${b.sample}"`, null, { node: b.node, at: b.at, px: b.px, count: b.count });
  // gutters
  let gl = Infinity, gr = Infinity, glEl = null, grEl = null;
  for (const el of document.querySelectorAll('p,h1,h2,h3,h4,li,dt,dd,td,th,label')) {
    if (!vis(el) || hidden(el) || inMock(el) || offscreen(el)) continue;
    /* A gutter is the distance from the VIEWPORT edge, which only means anything
       for content the viewport lays out. Inside a horizontal scroller the content
       is meant to run past the edge — that is the affordance. cramped-grid below
       already excludes scrollers via scrollerAncestor(); the gutter rule was the
       one place it was not applied, and it flagged aidepost's week board, which
       scrolls by design (.board-w: overflow-x auto, scroll-snap-type x). */
    if (scrollerAncestor(el)) continue;
    const t = (el.textContent||'').trim(); if (t.length < 6) continue;
    const b = el.getBoundingClientRect(); if (b.width < 10 || b.width > vw) continue;
    if (b.left < gl) { gl = b.left; glEl = el; }
    if (vw - b.right < gr) { gr = vw - b.right; grEl = el; }
  }
  if (gl < 14) add('gutter', `text starts ${Math.round(gl)}px from the left edge (min 14px)`, glEl, { px: Math.round(gl) });
  if (gr < 14) add('gutter', `text ends ${Math.round(gr)}px from the right edge (min 14px)`, grEl, { px: Math.round(gr) });

  // content grids still multi-column
  for (const c of document.querySelectorAll('body *')) {
    if (!vis(c) || hidden(c) || inMock(c) || offscreen(c)) continue;
    const s = getComputedStyle(c);
    if (s.display !== 'grid' && s.display !== 'inline-grid') continue;
    const cols = s.gridTemplateColumns.split(/\s+/).filter(x => x && x !== 'none').length;
    if (cols < 2) continue;
    if (scrollerAncestor(c) || s.overflowX === 'auto' || s.overflowX === 'scroll') continue;
    const kids = [...c.children].filter(vis);
    if (kids.length < 2) continue;
    const widest = Math.max(...kids.map(k => k.getBoundingClientRect().width));
    const hasText = kids.some(k => (k.textContent||'').trim().length > 24);
    if (widest < 150 && hasText) add('cramped-grid', `${cols} columns, widest child ${Math.round(widest)}px (min 150px for text)`, c, { cols, childW: Math.round(widest) });
  }

  // type scale
  const h1 = document.querySelector('h1');
  if (h1 && vis(h1)) { const px = parseFloat(getComputedStyle(h1).fontSize); const cap = vw <= 360 ? 34 : 40; if (px > cap) add('h1-size', `h1 is ${Math.round(px)}px at ${vw}px wide (max ${cap}px)`, h1, { px: Math.round(px) }); }
  const header = document.querySelector('header');
  if (header && vis(header)) { const h = header.getBoundingClientRect().height; if (h > 68) add('header-height', `header is ${Math.round(h)}px tall (max 68px)`, header, { px: Math.round(h) }); }


  // ---- oversized mockups: a picture of an app that does not fit the frame ----
  const bigMocks = [];
  for (const el of document.querySelectorAll(MOCK)) {
    if (!vis(el) || offscreen(el)) continue;
    if (el.closest('[hidden], .hp, .sr-only, .skip')) continue;
    const b = el.getBoundingClientRect();
    if (b.width > vw * 1.25) bigMocks.push({ el, w: Math.round(b.width) });
  }
  const bigSet = new Set(bigMocks.map(m => m.el));
  for (const m of bigMocks) {
    let a = m.el.parentElement, nested = false;
    while (a) { if (bigSet.has(a)) { nested = true; break; } a = a.parentElement; }
    if (nested) continue;
    add('oversized-mock', `mockup renders ${m.w}px wide on a ${vw}px screen (max ${Math.round(vw*1.25)}px) — it is clipped, so most of it is never seen`, m.el, { width: m.w });
  }
  // ---- page length: a phone page that never ends is the crammed complaint in its other form ----
  const screens = document.body.scrollHeight / 844;
  const budget = (location.pathname === '/' || location.pathname === '') ? 15 : 12;
  if (screens > budget) add('page-length', `page is ${Math.round(screens*10)/10} phone screens tall (budget ${budget}) — the desktop page linearised instead of being edited for a phone`, document.body, { screens: Math.round(screens*10)/10, budget });
  return { issues, pageH: document.body.scrollHeight, docW };
};

const server = (dist) => { const s = http.createServer((req, res) => { const url = decodeURIComponent((req.url||'/').split('?')[0]); if (url.startsWith('/api/')) { res.writeHead(200,{'content-type':'application/json'}); res.end('{"ok":true}'); return; } const t = path.normalize(path.join(dist, url)); const f = [t, `${t}.html`, path.join(t,'index.html')].find(c => c.startsWith(dist) && fs.existsSync(c) && fs.statSync(c).isFile()); if (!f) { res.writeHead(404).end(); return; } res.writeHead(200,{'content-type': TYPE[path.extname(f)] || 'application/octet-stream'}); res.end(fs.readFileSync(f)); }); return s; };

const report = {};
const browser = await chromium.launch();
{
  const key = path.basename(SITE);
  if (!fs.existsSync(DIST)) { console.error(`no dist at ${DIST} — run node build.mjs first`); process.exit(2); }
  const routes = discoverRoutes(DIST);
  const srv = server(DIST); await new Promise(r => srv.listen(0, r));
  const base = `http://localhost:${srv.address().port}`;
  report[key] = {};
  for (const w of WIDTHS) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      const jsErrors = []; page.on('pageerror', e => jsErrors.push(String(e).slice(0, 160)));
      try {
        await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 });
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => { document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in')); const step = Math.round(window.innerHeight*0.9); for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo({top:y,behavior:'instant'}); await new Promise(r=>setTimeout(r,15)); } window.scrollTo({top:0,behavior:'instant'}); await new Promise(r=>setTimeout(r,250)); });
        const r = await page.evaluate(PROBE, w);
        if (jsErrors.length) r.issues.push({ rule:'js-error', detail: jsErrors[0], node:'', at:'' });
        report[key][`${w}${route}`] = r.issues;
      } catch (e) { report[key][`${w}${route}`] = [{ rule:'load-error', detail: String(e).slice(0,200), node:'', at:'' }]; }
      await page.close();
    }
  }
  srv.close();
}
await browser.close();

if (JSONOUT) { console.log(JSON.stringify(report, null, 1)); process.exit(0); }
let total = 0;
for (const [key, pages] of Object.entries(report)) {
  const byRule = {}; let n = 0;
  for (const issues of Object.values(pages)) for (const i of issues) { byRule[i.rule] = (byRule[i.rule]||0)+1; n++; }
  total += n;
  console.log(`\n${key.toUpperCase()}  ${n === 0 ? 'CLEAN' : n + ' issues'}  ${Object.entries(byRule).map(([r,c])=>`${r}:${c}`).join(' ')}`);
  for (const [pg, issues] of Object.entries(pages)) {
    if (!issues.length) continue;
    console.log(`  ${pg}`);
    const shown = issues.slice(0, 12);
    for (const i of shown) console.log(`    [${i.rule}] ${i.node}${i.at ? ` in ${i.at}` : ''} — ${i.detail}`);
    if (issues.length > shown.length) console.log(`    … ${issues.length - shown.length} more`);
  }
}
console.log(`\nTOTAL ${total}`);
process.exit(total === 0 ? 0 : 1);
