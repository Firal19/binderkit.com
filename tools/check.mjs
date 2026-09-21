// check.mjs — what has to be true of the built site before it ships. Run
// after build.mjs; it reads dist/ rather than the source, so it checks what a
// browser will actually receive. Every page in dist/ is checked, not just the
// front one, and the product's feature manifest is checked against the bytes.
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
const DIST = process.env.DIST ? path.resolve(process.env.DIST) : path.join(ROOT, 'dist');
const fail = [];
const warn = [];
const note = (list, msg) => list.push(msg);

if (!fs.existsSync(DIST)) { console.error('  dist/ is not there — run node build.mjs first'); process.exit(1); }

const files = [];
(function walk(d, base = '') {
  for (const f of fs.readdirSync(d)) {
    const full = path.join(d, f);
    if (fs.statSync(full).isDirectory()) walk(full, `${base}/${f}`);
    else files.push(`${base}/${f}`);
  }
}(DIST));
const pages = files.filter((f) => f.endsWith('.html') && f !== '/404.html');
const pageBytes = Object.fromEntries(pages.map((f) => [f, fs.readFileSync(path.join(DIST, f), 'utf8')]));
const home = pageBytes['/index.html'] || '';
const routeOf = (f) => f.replace(/\/index\.html$/, '') || '/';

const cssFile = (home.match(/href="(\/assets\/site\.[a-z0-9]+\.css)"/) || [])[1];
const jsFile = (home.match(/src="(\/assets\/site\.[a-z0-9]+\.js)"/) || [])[1];
const css = cssFile ? fs.readFileSync(path.join(DIST, cssFile), 'utf8') : '';
const js = jsFile ? fs.readFileSync(path.join(DIST, jsFile), 'utf8') : '';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'ellipse', 'use', 'stop']);

/* Every topic a contact form offers must be one api/contact.js will accept.
   aidepost renders “I’m a caregiver”; the API's allow-list did not contain it, so
   thatselection was silently rewritten to “Question” and the routing signal was
   lost with no error anywhere. This catches the next divergence at build time. */
{
  const api = fs.readFileSync(path.join(ROOT, 'api', 'contact.js'), 'utf8');
  const m = api.match(/const TOPICS = new Set\(\[([^\]]*)\]\)/);
  const allowed = new Set((m ? m[1] : '').split(',').map((t) => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean));
  for (const [file, html] of Object.entries(pageBytes)) {
    const sel = html.match(/<select[^>]*name="topic"[^>]*>([\s\S]*?)<\/select>/);
    if (!sel) continue;
    for (const o of sel[1].matchAll(/<option[^>]*>([^<]*)<\/option>/g)) {
      const t = o[1].trim().replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
      if (t && !allowed.has(t)) note(fail, `${routeOf(file)}: the topic “${t}” is offered but api/contact.js will not accept it — it would be silently rewritten`);
    }
  }
}

for (const [file, html] of Object.entries(pageBytes)) {
  const at = routeOf(file);
  const where = (msg) => `${at}: ${msg}`;

  /* 1 · nothing leaked */
  for (const bad of ['undefined', 'NaN', '[object Object]', 'null null']) {
    const q = bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const n = (html.match(new RegExp(`>\\s*${q}|"${q}"|\\s${q}\\s`, 'g')) || []).length;
    if (n) note(fail, where(`“${bad}” appears ${n}× in the rendered page`));
  }

  /* 2 · one h1, every section labelled */
  const h1 = html.match(/<h1[\s>]/g) || [];
  if (h1.length !== 1) note(fail, where(`the page has ${h1.length} <h1> elements; it must have exactly one`));
  const sections = (html.match(/<section\b[^>]*>/g) || []).filter((s) => /class="(sec|hero)\b/.test(s));
  for (const s of sections) {
    if (!/aria-label(ledby)?=/.test(s)) note(fail, where(`a <section> carries no accessible name: ${s.slice(0, 90)}`));
  }
  if (!/<main\b[^>]*id="main"/.test(html)) note(fail, where('no <main id="main">'));
  if (!/class="skip"|class="lp-skip"/.test(html)) note(warn, where('no skip link'));

  /* 3 · every in-page link lands somewhere */
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(m[1])) note(fail, where(`href="#${m[1]}" points at an id the page does not have`));
  }
  /* 3b · every same-site page link exists */
  for (const m of html.matchAll(/href="(\/[a-z0-9\-/]*)(?:#[^"]*)?"/g)) {
    const rel = m[1].replace(/\/$/, '') || '/';
    if (rel === '/' || rel.startsWith('/api/') || rel.startsWith('/assets/')) continue;
    if ((CONFIG.appPaths || []).includes(rel)) continue;
    if (!files.includes(`${rel}/index.html`) && !files.includes(`${rel}.html`) && !files.includes(rel)) note(fail, where(`links to ${rel}, which is not in dist/`));
  }

  /* 4 · every asset the page asks for is in dist/ */
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]+)"/g)) {
    const rel = m[1];
    if (rel.endsWith('/')) continue;
    if ((CONFIG.appPaths || []).includes(rel)) continue;
    if (rel.startsWith('/api/')) continue;
    if (!files.includes(rel) && !files.includes(`${rel}/index.html`) && !files.includes(`${rel}.html`)) note(fail, where(`asks for ${rel}, which is not in dist/`));
  }

  /* 6 · images and icons carry names, or are explicitly hidden */
  for (const m of html.matchAll(/<svg\b[^>]*>/g)) {
    const t = m[0];
    if (!/aria-hidden="true"/.test(t) && !/aria-label=/.test(t) && !/role="img"/.test(t)) note(fail, where(`an <svg> is neither hidden nor named: ${t.slice(0, 80)}`));
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=/.test(m[0])) note(fail, where(`an <img> has no alt: ${m[0].slice(0, 80)}`));
  }
  /* 6b · every button has a name */
  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    const attrs = m[1]; const inner = m[2].replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim();
    if (!inner && !/aria-label=/.test(attrs) && !/aria-labelledby=/.test(attrs)) note(fail, where(`a <button> has no name: <button${attrs.slice(0, 60)}>`));
  }

  /* 8 · the head says who this is */
  for (const need of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:image"', 'name="twitter:card"', 'name="viewport"']) {
    if (!html.includes(need)) note(fail, where(`the head is missing ${need}`));
  }
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  if (title.length > 65) note(warn, where(`the title is ${title.length} characters; search results cut at about 60`));
  const desc = (html.match(/name="description" content="([^"]*)"/) || [])[1] || '';
  if (desc.length > 170) note(warn, where(`the description is ${desc.length} characters; search results cut at about 160`));

  /* 9 · tags balance */
  const stack = [];
  for (const m of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g)) {
    const [, close, name, attrs] = m;
    const n = name.toLowerCase();
    if (VOID.has(n) || attrs.endsWith('/')) continue;
    if (n === 'script' || n === 'style') { if (!close) stack.push(n); else if (stack[stack.length - 1] === n) stack.pop(); continue; }
    if (!close) stack.push(n);
    else if (stack[stack.length - 1] === n) stack.pop();
    else note(fail, where(`</${n}> closes ${stack[stack.length - 1] || 'nothing'}`));
  }
  if (stack.length) note(fail, where(`unclosed: ${[...new Set(stack)].join(', ')}`));

  /* 10 · the forms are forms */
  if (html.includes('id="joinform"')) {
    if (!/<form[^>]+id="joinform"[^>]+action="\/api\/waitlist"/.test(html) && !/<form[^>]+action="\/api\/waitlist"[^>]+id="joinform"/.test(html)) note(fail, where('the waitlist form has no action — it would not work with JS off'));
    if (!/name="company"/.test(html)) note(fail, where('the honeypot field is gone'));
  }
  if (html.includes('id="contactform"')) {
    if (!/action="\/api\/contact"/.test(html)) note(fail, where('the contact form has no action'));
    if (!/<textarea[^>]+name="message"/.test(html)) note(fail, where('the contact form has no message field'));
  }
}

/* 5 · the fonts the stylesheet names are all present */
if (!cssFile) note(fail, 'the front page links no stylesheet');
else {
  for (const m of css.matchAll(/url\("?(\/assets\/fonts\/[^")]+)"?\)/g)) {
    if (!files.includes(m[1])) note(fail, `the stylesheet names ${m[1]}, which is not in dist/`);
  }
  for (const m of css.matchAll(/url\("fonts\//g)) note(fail, 'a font url is still relative — it will 404 from /privacy');
  if (/\/\*/.test(css)) note(warn, 'comments survived the squeeze');
}

/* 7 · the front page has what the brief requires */
if (!home.includes('id="joinform"') && !/href="(\/signup|https?:)/.test(home)) note(fail, 'the front page has neither a waitlist nor a signup — its primary button goes nowhere');
const socHome = (home.match(/class="soc-i"/g) || []).length;
if (socHome < 8) note(fail, `the front page shows ${socHome} social links; all eight platforms must be there`);
if (!Object.values(pageBytes).some((h) => h.includes('id="contactform"'))) note(fail, 'no page carries the contact form');
if (!home.includes('mailto:hello@')) note(fail, 'the front page never prints its hello@ address');
if (!/application\/ld\+json/.test(home)) note(fail, 'the head is missing application/ld+json');
if (!home.includes('"sameAs"')) note(fail, 'the structured data carries no sameAs');
if (!/<header\b/.test(home) || !/<footer\b/.test(home)) note(fail, 'the front page has no <header> or no <footer>');
if (!/<nav\b/.test(home)) note(fail, 'the front page has no <nav>');

/* 11 · the feature manifest, checked against the bytes ───────────────── */
const manifest = path.join(ROOT, 'src', 'features', `${CONFIG.product}.js`);
let featureCount = 0;
if (!fs.existsSync(manifest)) note(fail, `no feature manifest at src/features/${CONFIG.product}.js`);
else {
  const { FEATURES } = await import(manifest);
  const seen = new Set();
  const allHtml = Object.values(pageBytes).join('\n');
  if (!Array.isArray(FEATURES) || FEATURES.length < 25) note(fail, `the manifest lists ${Array.isArray(FEATURES) ? FEATURES.length : 0} features; the floor is 25`);
  for (const f of FEATURES || []) {
    if (!f.id || seen.has(f.id)) note(fail, `feature id ${f.id || '(none)'} is missing or repeated`);
    seen.add(f.id);
    if (!f.name || !f.kind || !f.probe) { note(fail, `feature ${f.id} lacks name, kind or probe`); continue; }
    const probes = [].concat(f.probe);
    for (const pr of probes) {
      let ok = false;
      if (pr.html) ok = allHtml.includes(pr.html);
      else if (pr.home) ok = home.includes(pr.home);
      else if (pr.css) ok = css.includes(pr.css);
      else if (pr.js) ok = js.includes(pr.js);
      else if (pr.route) ok = files.includes(`/${pr.route.replace(/^\/|\/$/g, '')}/index.html`);
      else if (pr.file) ok = files.includes(pr.file);
      else if (pr.re) ok = new RegExp(pr.re).test(allHtml);
      if (!ok) note(fail, `feature ${f.id} “${f.name}”: the probe ${JSON.stringify(pr)} is not in the built bytes`);
    }
    featureCount += 1;
  }
}

/* 12 · budgets */
const size = (f) => fs.statSync(path.join(DIST, f)).size;
const pageKb = size('/index.html'.slice(1)) / 1024;
if (pageKb > 160) note(warn, `index.html is ${pageKb.toFixed(0)} kB of HTML`);
/* The heaviest instruments now live on their own routes precisely because only
   index.html was measured. Measure the biggest of those too, or the next
   runaway page ships unseen. */
const other = pages.filter((f) => f !== '/index.html').map((f) => [routeOf(f), size(f) / 1024]).sort((a, b) => b[1] - a[1])[0];
if (other && other[1] > 220) note(warn, `${other[0]} is ${other[1].toFixed(0)} kB of HTML — the heaviest route after /`);
const fontKb = files.filter((f) => f.endsWith('.woff2')).reduce((a, f) => a + size(f.slice(1)), 0) / 1024;
if (fontKb > 340) note(warn, `${fontKb.toFixed(0)} kB of fonts on disk`);
const jsKb = js.length / 1024;
if (jsKb > 60) note(warn, `the script is ${jsKb.toFixed(0)} kB`);

/* ── the verdict ──────────────────────────────────────────────────────── */
for (const w of warn) console.log(`  · ${w}`);
if (fail.length) {
  console.error(`\n  ${fail.length} problem${fail.length > 1 ? 's' : ''}:\n`);
  fail.forEach((f) => console.error(`   ✗ ${f}`));
  process.exit(1);
}
console.log(`  ✓ ${files.length} files, ${pages.length} pages, ${featureCount} features verified, ${pageKb.toFixed(0)} kB of HTML, ${warn.length} note${warn.length === 1 ? '' : 's'}`);
