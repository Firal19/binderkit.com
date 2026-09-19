// build.mjs — one file in, one directory out. No bundler, no dependencies,
// no framework: node build.mjs writes dist/ and dist/ is the site.
//
//   dist/index.html      the page, rendered whole — it reads with JS off
//   dist/privacy/        what the product holds, in plain words
//   dist/404.html
//   dist/assets/…        one stylesheet, one script, only the fonts it uses
//   dist/robots.txt, sitemap.xml, site.webmanifest
//
// Each product has its own page module and its own stylesheet; what they
// share is the reset, the instruments and the small byline. Deterministic:
// the same source always produces the same bytes.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spineViolations, calloutFaults } from './src/render/page.js';
import { privacyPage } from './src/render/privacy.js';
import { productOf, markLiteral, esc } from './src/kit.js';
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
const { render } = await import(`./src/render/pages/${p.id}.js`);

/* ── the stylesheet: the shared ground, the instruments, then the page ── */
const SHEETS = ['css/base.css', 'css/canvas.css', 'css/shells.css', 'css/faces.css', 'css/instruments-extra.css', `css/pages/${p.id}.css`];

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
    .map((l) => l.replace(/(^|[^:'"\\])\/\/(?![^'"]*['"]\s*[;,)]).*$/, (m, a) => (/['"`]/.test(m.slice(2)) ? m : a)))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/* The instruments read --t-* and --c-* off .face[data-product]; the board
   wrote those for five products at once. A page draws one, and its page
   stylesheet may repaint that face. The generated package stays the source
   for every value it does not repaint. */
const faces = read('css/faces.css');
const facesForThis = faces.split('\n').filter((line) => !/\.face\[data-product="/.test(line) || line.includes(`data-product="${p.id}"`) || /^\.face \.lp-|^\.st-a/.test(line)).join('\n');

/* ── the head ──────────────────────────────────────────────────────────── */
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

function head({ title, description, canonical, css, preload = [], extra = '' }) {
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="${CONFIG.og.bg}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(p.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${origin}/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(p.name)} — ${esc(p.descriptor)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${origin}/assets/og.png">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/icon-180.png">
<link rel="manifest" href="/site.webmanifest">
${preload.map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/${f}" crossorigin>`).join('\n')}
<link rel="stylesheet" href="/assets/${css}">
<script>document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');</script>
${extra}
</head>
<body>`;
}
const tail = (js) => `<script src="/assets/${js}" defer></script>
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

const cssBody = squeeze(SHEETS.map((s) => (s === 'css/faces.css' ? facesForThis : read(s))).join('\n'));
const jsBody = squeezeJs(read('js/site.js'));
const hash = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36).padStart(7, '0').slice(0, 7); };
const cssName = `site.${hash(cssBody)}.css`;
const jsName = `site.${hash(jsBody)}.js`;
write(`assets/${cssName}`, cssBody);
write(`assets/${jsName}`, jsBody);

/* only the fonts this page's stylesheet names */
const fontsUsed = [...new Set([...cssBody.matchAll(/\/assets\/fonts\/([^")]+)/g)].map((m) => m[1]))];
fs.mkdirSync(path.join(OUT, 'assets', 'fonts'), { recursive: true });
let fontBytes = 0;
for (const f of fontsUsed) {
  const src = path.join(SRC, 'assets', 'fonts', f);
  if (!fs.existsSync(src)) { console.error(`  the stylesheet names a font that is not here: ${f}`); process.exit(1); }
  fs.copyFileSync(src, path.join(OUT, 'assets', 'fonts', f));
  fontBytes += fs.statSync(src).size;
}
const preload = (CONFIG.preloadFonts || []).filter((f) => fontsUsed.includes(f));

write('assets/favicon.svg', markLiteral(p.id, CONFIG.og.tile, CONFIG.og.glyph, 32));
write('assets/mark.svg', markLiteral(p.id, CONFIG.og.tile, CONFIG.og.glyph, 64));

const body = render(CONFIG, p);
const ld = [
  {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: p.name, applicationCategory: 'BusinessApplication', operatingSystem: 'Web, iOS, Android',
    description: CONFIG.description, url: origin, image: `${origin}/assets/og.png`,
    audience: { '@type': 'Audience', audienceType: 'Licensed adult foster homes, group homes and care agencies in Oregon' },
    publisher: { '@type': 'Organization', name: 'Bareeda LLC', alternateName: 'Providerhub Oregon', url: 'https://providerhub.us' },
  },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: CONFIG.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
];

write('index.html', head({ title: `${p.name} — ${p.descriptor}`, description: CONFIG.description, canonical: `${origin}/`, css: cssName, preload, extra: ld.map(jsonLd).join('\n') }) + body + tail(jsName));
write('privacy/index.html', head({ title: `Privacy — ${p.name}`, description: `What ${p.name} holds, where it lives, and what leaves it.`, canonical: `${origin}/privacy`, css: cssName, preload }) + privacyPage(CONFIG) + tail(jsName));
write('404.html', head({ title: `Not here — ${p.name}`, description: 'That page does not exist.', canonical: `${origin}/`, css: cssName, preload }) + `<main id="main" class="page face canvas" data-product="${p.id}" data-mode="light">
  <section class="sec" aria-label="Not found" style="min-height:60vh;display:grid;align-content:center"><div class="wrap"><div class="head"><h2>That page is not here.</h2><p class="sub">It may have moved, or it may never have existed. The front page has everything.</p></div><div class="ctas"><a class="btn pri" href="/">${esc(p.name)}</a></div></div></section>
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
  start_url: '/', display: 'standalone', background_color: CONFIG.og.bg, theme_color: CONFIG.og.tile,
  icons: [{ src: '/assets/favicon.svg', sizes: 'any', type: 'image/svg+xml' }, { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' }],
}, null, 2));

const pre = path.join(SRC, 'assets', 'raster');
if (fs.existsSync(pre)) for (const f of fs.readdirSync(pre)) fs.copyFileSync(path.join(pre, f), path.join(OUT, 'assets', f));

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
console.log(`  ${p.name} → dist/`);
console.log(`   index.html   ${kb(fs.statSync(path.join(OUT, 'index.html')).size)}`);
console.log(`   ${cssName}   ${kb(Buffer.byteLength(cssBody))}`);
console.log(`   ${jsName}   ${kb(Buffer.byteLength(jsBody))}`);
console.log(`   fonts        ${kb(fontBytes)} — ${fontsUsed.join(', ')}`);
