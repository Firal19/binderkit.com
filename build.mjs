// build.mjs — one file in, one directory out. No bundler, no dependencies,
// no framework: node build.mjs writes dist/ and dist/ is the site.
//
//   dist/index.html      the page, rendered whole — it reads with JS off
//   dist/privacy/        what the product holds, in plain words
//   dist/404.html
//   dist/assets/…        one stylesheet, one script, the fonts, the icons
//   dist/robots.txt, sitemap.xml, site.webmanifest
//
// Everything is deterministic: the same source always produces the same
// bytes, so a diff on dist/ is a diff on the design.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage, spineViolations, calloutFaults } from './src/render/page.js';
import { privacyPage } from './src/render/privacy.js';
import { productOf, markLiteral } from './src/kit.js';
import { CONFIG } from './src/config.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, 'src');
const OUT = path.join(HERE, 'dist');
const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const write = (rel, body) => {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, body);
  return Buffer.byteLength(body);
};

const p = productOf(CONFIG.product);
const origin = `https://${CONFIG.domain}`;

/* ── the stylesheet ──────────────────────────────────────────────────────
   Six files, one request, in the order the cascade needs: the faces last of
   the token layers so a face wins its fallback, and site.css last of all so
   a shipped page can move something the board could not. */
const SHEETS = ['assets/fonts.css', 'css/canvas.css', 'css/shells.css', 'css/faces.css', 'css/sections.css', 'css/site.css'];

/* A deliberately small squeeze: comments and the whitespace around the eight
   characters that can never be significant. No selector rewriting, no
   property reordering — the stylesheet has to stay greppable in devtools. */
function squeeze(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s*([{};:,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function squeezeJs(js) {
  return js
    .split('\n')
    .map((l) => l.replace(/(^|[^:'"\\])\/\/(?![^'"]*['"]\s*[;,)]).*$/, (m, a, o) => (/['"`]/.test(m.slice(2)) ? m : a)))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/* ── the head ──────────────────────────────────────────────────────────── */
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

function head({ title, description, canonical, css, extra = '' }) {
  return `<!doctype html>
<html lang="en" data-mode="light" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#F7F3EC" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E1F1E" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${p.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${origin}/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${p.name} — ${p.descriptor}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${origin}/assets/og.png">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/icon-180.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/${CONFIG.preloadFonts[0]}" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/${CONFIG.preloadFonts[1]}" crossorigin>
<link rel="stylesheet" href="/assets/${css}">
<script>
/* mode before paint: the stored choice, else the system's, else light */
try{var m=localStorage.getItem('phub.mode')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.mode=m}catch(e){}
document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');
</script>
${extra}
</head>
<body>`;
}

const tail = (js) => `<script src="/assets/${js}" defer></script>
<script>document.addEventListener('DOMContentLoaded',function(){var m=document.getElementById('main');if(m)m.dataset.mode=document.documentElement.dataset.mode||'light'});</script>
</body>
</html>
`;

/* ── build ─────────────────────────────────────────────────────────────── */
const faults = [...spineViolations(), ...calloutFaults()];
if (faults.length) {
  console.error('\n  the page contradicts the instrument beside it:\n');
  faults.forEach((f) => console.error(`   · ${f}`));
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* ── the face, lifted to the document ────────────────────────────────────
   On the board every --t-* and --c-* lives on .face[data-product], because
   the board draws five faces at once. A site draws one, and its chrome —
   the header, the skip link, the page background — sits OUTSIDE that
   element. So this product's own block is emitted a second time at :root,
   and its dark twin on <html data-mode="dark">. Same values, read from the
   same generated package: there is no second source for a colour. */
function rootFace(css, id) {
  const light = css.match(new RegExp(`\\.face\\[data-product="${id}"\\]\\{([^}]*)\\}`));
  const dark = css.match(new RegExp(`\\.face\\[data-product="${id}"\\]\\[data-mode="dark"\\][^{]*\\{([^}]*)\\}`));
  if (!light) throw new Error(`no face block for ${id}`);
  return [
    `:root{${light[1]}}`,
    dark ? `html[data-mode="dark"]{${dark[1]}}` : '',
  ].join('\n');
}

/* assets, content-hashed so they can be cached for a year */
const facesRaw = read('css/faces.css');
const cssBody = squeeze([SHEETS.map(read).join('\n'), rootFace(facesRaw, p.id)].join('\n'))
  .replace(/url\("fonts\//g, 'url("/assets/fonts/');
const jsBody = squeezeJs(read('js/site.js'));
const hash = (s) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36).padStart(7, '0').slice(0, 7);
};
const cssName = `site.${hash(cssBody)}.css`;
const jsName = `site.${hash(jsBody)}.js`;
write(`assets/${cssName}`, cssBody);
write(`assets/${jsName}`, jsBody);

/* fonts, referenced from the stylesheet as /assets/fonts/… */
fs.mkdirSync(path.join(OUT, 'assets', 'fonts'), { recursive: true });
let fontBytes = 0;
for (const f of fs.readdirSync(path.join(SRC, 'assets', 'fonts'))) {
  fs.copyFileSync(path.join(SRC, 'assets', 'fonts', f), path.join(OUT, 'assets', 'fonts', f));
  fontBytes += fs.statSync(path.join(SRC, 'assets', 'fonts', f)).size;
}

/* the marks, as files: one SVG for the tab, one flat SVG for anything that
   cannot read a custom property. The PNGs are rasterised by tools/icons.mjs. */
write('assets/favicon.svg', markLiteral(p.id, '#0F5C5A', '#F7F3EC', 32));
write('assets/mark.svg', markLiteral(p.id, '#0F5C5A', '#F7F3EC', 64));

/* the page */
const body = renderPage(CONFIG.product, CONFIG);
const ld = [
  {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: p.name, applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    description: CONFIG.description,
    url: origin,
    image: `${origin}/assets/og.png`,
    audience: { '@type': 'Audience', audienceType: 'Licensed adult foster homes, group homes and care agencies in Oregon' },
    publisher: { '@type': 'Organization', name: 'Bareeda LLC', alternateName: 'Provider Hub Oregon', url: 'https://providerhub.us' },
    isPartOf: { '@type': 'WebSite', name: 'Provider Hub Oregon', url: 'https://providerhub.us' },
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: CONFIG.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
];

write('index.html', head({
  title: `${p.name} — ${p.descriptor}`,
  description: CONFIG.description,
  canonical: `${origin}/`,
  css: cssName,
  extra: ld.map(jsonLd).join('\n'),
}) + body + tail(jsName));

write('privacy/index.html', head({
  title: `Privacy — ${p.name}`,
  description: `What ${p.name} holds, where it lives, and what leaves it.`,
  canonical: `${origin}/privacy`,
  css: cssName,
}) + privacyPage(CONFIG) + tail(jsName));

write('404.html', head({
  title: `Not here — ${p.name}`,
  description: 'That page does not exist.',
  canonical: `${origin}/`,
  css: cssName,
}) + `<main class="lp face canvas" id="main" data-product="${p.id}" data-mode="light">
  <section class="lp-sec" style="min-height:58vh;display:grid;align-content:center">
    <div class="lp-head"><h2>That page is not here.</h2><p class="lp-sub">It may have moved, or it may never have existed. The front page has everything.</p></div>
    <div class="lp-ctas" style="margin-top:28px"><a class="lp-btn pri" href="/">${p.name}</a><a class="lp-btn" href="https://providerhub.us">Provider Hub Oregon</a></div>
  </section>
</main>` + tail(jsName));

write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${origin}/privacy</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
</urlset>
`);
write('site.webmanifest', JSON.stringify({
  name: p.name, short_name: p.short, description: CONFIG.description,
  start_url: '/', display: 'standalone', background_color: '#F7F3EC', theme_color: '#0F5C5A',
  icons: [
    { src: '/assets/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2));

/* icons and the social card are rasterised separately, and kept in the repo
   so a deploy never needs a browser. Copy whatever is there. */
const pre = path.join(SRC, 'assets', 'raster');
if (fs.existsSync(pre)) {
  for (const f of fs.readdirSync(pre)) fs.copyFileSync(path.join(pre, f), path.join(OUT, 'assets', f));
}

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
const pageBytes = fs.statSync(path.join(OUT, 'index.html')).size;
console.log(`  ${p.name} → dist/`);
console.log(`   index.html   ${kb(pageBytes)}`);
console.log(`   ${cssName}   ${kb(Buffer.byteLength(cssBody))}`);
console.log(`   ${jsName}   ${kb(Buffer.byteLength(jsBody))}`);
console.log(`   fonts        ${kb(fontBytes)} on disk, latin subsets only`);
