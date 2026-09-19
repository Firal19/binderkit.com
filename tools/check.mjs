// check.mjs — what has to be true of the built page before it ships. Run
// after build.mjs; it reads dist/ rather than the source, so it checks what a
// browser will actually receive.
//
//   node tools/check.mjs
//
// Nothing here is a taste judgement. Every check is a thing that is either
// true of the bytes or is not.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONFIG } from '../src/config.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const fail = [];
const warn = [];
const note = (list, msg) => list.push(msg);

if (!fs.existsSync(DIST)) { console.error('  dist/ is not there — run node build.mjs first'); process.exit(1); }

const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const files = [];
(function walk(d, base = '') {
  for (const f of fs.readdirSync(d)) {
    const full = path.join(d, f);
    if (fs.statSync(full).isDirectory()) walk(full, `${base}/${f}`);
    else files.push(`${base}/${f}`);
  }
}(DIST));

/* 1 · nothing leaked ─────────────────────────────────────────────────── */
for (const bad of ['undefined', 'NaN', '[object Object]', 'null null']) {
  const q = bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const n = (html.match(new RegExp(`>\\s*${q}|"${q}"|\\s${q}\\s`, 'g')) || []).length;
  if (n) note(fail, `“${bad}” appears ${n}× in the rendered page`);
}

/* 2 · one h1, headings in order, every section labelled ──────────────── */
const h1 = html.match(/<h1[\s>]/g) || [];
if (h1.length !== 1) note(fail, `the page has ${h1.length} <h1> elements; it must have exactly one`);
// Only the page's own sections. A <section> inside an instrument sits under
// role="img", so its subtree is presentational and naming it would be noise.
const sections = (html.match(/<section\b[^>]*>/g) || []).filter((s) => /class="(sec|hero)\b/.test(s));
for (const s of sections) {
  if (!/aria-label(ledby)?=/.test(s)) note(fail, `a <section> carries no accessible name: ${s.slice(0, 90)}`);
}

/* 3 · every in-page link lands somewhere ─────────────────────────────── */
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const m of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(m[1])) note(fail, `href="#${m[1]}" points at an id the page does not have`);
}

/* 4 · every asset the page asks for is in dist/ ──────────────────────── */
for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]+)"/g)) {
  const rel = m[1];
  if (rel.endsWith('/')) continue;
  if ((CONFIG.appPaths || []).includes(rel)) continue;   // another application answers this
  if (!files.includes(rel) && !files.includes(`${rel}/index.html`) && !files.includes(`${rel}.html`)) {
    note(fail, `the page asks for ${rel}, which is not in dist/`);
  }
}

/* 5 · the fonts the stylesheet names are all present ─────────────────── */
const cssFile = (html.match(/href="(\/assets\/site\.[a-z0-9]+\.css)"/) || [])[1];
if (!cssFile) note(fail, 'the page links no stylesheet');
else {
  const css = fs.readFileSync(path.join(DIST, cssFile), 'utf8');
  for (const m of css.matchAll(/url\("?(\/assets\/fonts\/[^")]+)"?\)/g)) {
    if (!files.includes(m[1])) note(fail, `the stylesheet names ${m[1]}, which is not in dist/`);
  }
  for (const m of css.matchAll(/url\("fonts\//g)) note(fail, 'a font url is still relative — it will 404 from /privacy');
  if (/\/\*/.test(css)) note(warn, 'comments survived the squeeze');
}

/* 6 · images and icons carry names, or are explicitly hidden ─────────── */
for (const m of html.matchAll(/<svg\b[^>]*>/g)) {
  const t = m[0];
  if (!/aria-hidden="true"/.test(t) && !/aria-label=/.test(t) && !/role="img"/.test(t)) {
    note(fail, `an <svg> is neither hidden nor named: ${t.slice(0, 80)}`);
  }
}
for (const m of html.matchAll(/<img\b[^>]*>/g)) {
  if (!/\salt=/.test(m[0])) note(fail, `an <img> has no alt: ${m[0].slice(0, 80)}`);
}

/* 7 · the form is a form ─────────────────────────────────────────────── */
if (html.includes('id="join"')) {
  if (!/<form[^>]+action="\/api\/waitlist"/.test(html)) note(fail, 'the waitlist form has no action — it would not work with JS off');
  if (!/<label class="field/.test(html)) note(fail, 'a form field is not inside a label');
  if (!/name="company"/.test(html)) note(fail, 'the honeypot field is gone');
} else if (!/href="(\/signup|https?:)/.test(html)) {
  note(fail, 'the page has neither a waitlist nor a signup — its primary button goes nowhere');
}

/* 8 · the head says who this is ──────────────────────────────────────── */
for (const need of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:image"', 'name="twitter:card"', 'application/ld+json']) {
  if (!html.includes(need)) note(fail, `the head is missing ${need}`);
}
const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
if (title.length > 65) note(warn, `the title is ${title.length} characters; search results cut at about 60`);
const desc = (html.match(/name="description" content="([^"]*)"/) || [])[1] || '';
if (desc.length > 170) note(warn, `the description is ${desc.length} characters; search results cut at about 160`);

/* 9 · tags balance ───────────────────────────────────────────────────── */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'ellipse', 'use', 'stop']);
const stack = [];
for (const m of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g)) {
  const [, close, name, attrs] = m;
  const n = name.toLowerCase();
  if (VOID.has(n) || attrs.endsWith('/')) continue;
  if (n === 'script' || n === 'style') { if (!close) stack.push(n); else if (stack[stack.length - 1] === n) stack.pop(); continue; }
  if (!close) stack.push(n);
  else if (stack[stack.length - 1] === n) stack.pop();
  else note(fail, `</${n}> closes ${stack[stack.length - 1] || 'nothing'}`);
}
if (stack.length) note(fail, `unclosed: ${[...new Set(stack)].join(', ')}`);

/* 10 · budgets ───────────────────────────────────────────────────────── */
const size = (f) => fs.statSync(path.join(DIST, f)).size;
const pageKb = size('/index.html'.slice(1)) / 1024;
if (pageKb > 120) note(warn, `index.html is ${pageKb.toFixed(0)} kB of HTML`);
const fontKb = files.filter((f) => f.endsWith('.woff2')).reduce((a, f) => a + size(f.slice(1)), 0) / 1024;
if (fontKb > 300) note(warn, `${fontKb.toFixed(0)} kB of fonts on disk`);

/* ── the verdict ──────────────────────────────────────────────────────── */
for (const w of warn) console.log(`  · ${w}`);
if (fail.length) {
  console.error(`\n  ${fail.length} problem${fail.length > 1 ? 's' : ''}:\n`);
  fail.forEach((f) => console.error(`   ✗ ${f}`));
  process.exit(1);
}
console.log(`  ✓ ${files.length} files, ${pageKb.toFixed(0)} kB of HTML, ${warn.length} note${warn.length === 1 ? '' : 's'}`);
