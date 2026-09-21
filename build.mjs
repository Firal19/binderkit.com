// build.mjs — one directory in, one directory out. No bundler, no dependencies,
// no framework: node build.mjs writes dist/ and dist/ is the site.
//
//   dist/index.html      the page, rendered whole — it reads with JS off
//   dist/<page>/         every marketing page the product's module exports
//   dist/privacy/        what the product holds, in plain words
//   dist/404.html
//   dist/assets/…        one stylesheet, one script, only the fonts it uses
//   dist/robots.txt, sitemap.xml, site.webmanifest
//
// Each product has its own page module, its own stylesheet and its own
// script; what they share is the reset, the instruments, the two forms and
// the small byline. Deterministic: the same source always produces the same
// bytes. DIST=<dir> writes somewhere other than ./dist.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spineViolations, calloutFaults } from './src/render/page.js';
import { privacyPage } from './src/render/privacy.js';
import { productOf, markLiteral, esc } from './src/kit.js';
import { socialUrls } from './src/render/social.js';
import { CONFIG } from './src/config.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, 'src');
const OUT = process.env.DIST ? path.resolve(process.env.DIST) : path.join(HERE, 'dist');
const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const has = (p) => fs.existsSync(path.join(SRC, p));
const write = (rel, body) => {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, body);
  return Buffer.byteLength(body);
};

const p = productOf(CONFIG.product);
const origin = `https://${CONFIG.domain}`;
const mod = await import(`./src/render/pages/${p.id}.js`);
const { render } = mod;
const extraPages = Array.isArray(mod.pages) ? mod.pages : [];
const chrome = { header: typeof mod.header === 'function' ? mod.header : null, footer: typeof mod.footer === 'function' ? mod.footer : null };

/* ── the stylesheet: the shared ground, the instruments, then the page,
   then every width tier in the kit ──────────────────────────────────────
   css/responsive.css is LAST on purpose and must stay last. It is the only
   sheet that carries a width query, and loading it after the page sheet is
   what lets the phone tier correct a page rule without !important: a page's
   `:root { --sec-y: … }` can no longer shadow the phone value, because the
   phone value is declared later at equal specificity.

   Two sheets are deliberately NOT here. css/sections.css and css/site.css
   speak an `.lp-*` component vocabulary that renders zero times in the four
   built sites; they also declare their own `.wrap` and `.sec`. They are
   reference material to lift ideas out of, not 73 kB of dead CSS to ship. */
const SHEETS = ['css/base.css', 'css/canvas.css', 'css/shells.css', 'css/faces.css', 'css/instruments-extra.css', `css/pages/${p.id}.css`, 'css/responsive.css'];

/* ── the token guard ────────────────────────────────────────────────────
   Three ways a page sheet can silently break the shared layer, and all
   three have already happened in this codebase:

     1. Declaring a `--t-*` name on :root. faces.css writes every --t-* name
        onto `.face[data-product="…"]`, which is (0,2,0) and beats :root, and
        every page's <main> carries that class. So `font-size: var(--t-11)`
        inside <main> is invalid-at-computed-value-time and silently inherits
        body size. No console error, green build, wrong page.
     2. Declaring a shared token on :root OUTSIDE a media query. It shadows
        the phone tier at every width, which is the bug responsive.css exists
        to make impossible.
     3. Typing a fifth gutter curve into a width: declaration. --wrap-w is
        exported as a value precisely so no bar ever has to.

   Names the shared layer owns outright are fatal. Names a site legitimately
   still owns at desktop (--gutter, --max, --dock, --hdr, --scroll-pad) are
   not checked at all. --sec-y and --t-* are reported, because moving them is
   per-site work that is still in flight. */
function tokenGuard(sheet, css) {
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');
  /* cut out every @media block, so only top-level rules are left */
  let top = '', depth = 0, at = false;
  for (let i = 0; i < bare.length; i++) {
    const c = bare[i];
    if (!at && bare.startsWith('@media', i)) { at = true; depth = 0; }
    if (!at) { top += c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) at = false; }
  }
  const fatal = [], soft = [];
  for (const m of top.matchAll(/(?::root|html)\s*\{([^}]*)\}/g)) {
    for (const d of m[1].matchAll(/(--[a-z0-9-]+)\s*:/g)) {
      const n = d[1];
      if (/^--(fs|sp|bp|mock)-|^--(tap|tap-row|wrap-w|track-label)$/.test(n)) fatal.push(n);
      else if (/^--t-/.test(n) || n === '--sec-y') soft.push(n);
    }
  }
  for (const m of bare.matchAll(/(?:^|[;{])\s*width\s*:\s*([^;{}]*)/gm)) {
    const v = m[1];
    if (/100%/.test(v) && /clamp\(\s*[\d.]+px\s*,\s*[\d.]+vw/.test(v) && !/var\(--wrap-w\)/.test(v)) {
      soft.push(`a fifth gutter curve in \`width: ${v.trim().slice(0, 72)}\``);
    }
  }
  if (fatal.length) {
    console.error(`\n  ${sheet} declares a token the shared layer owns, on :root, outside a media query:\n`);
    [...new Set(fatal)].forEach((n) => console.error(`   ✗ ${n} — it belongs in css/base.css or css/responsive.css`));
    process.exit(1);
  }
  if (soft.length) {
    for (const n of [...new Set(soft)]) {
      console.log(n.startsWith('--t-')
        ? `   · ${sheet}: ${n} on :root is shadowed inside <main> by faces.css — rename it off the --t-* namespace`
        : n === '--sec-y'
          ? `   · ${sheet}: --sec-y on :root — move it into @media (min-width: 641px) so the phone tier can set it`
          : `   · ${sheet}: ${n} — point it at var(--wrap-w)`);
    }
  }
}

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

/* faces.css keys its dark palette off [data-mode="dark"] only, and an earlier
   pass derived an [data-mode="auto"] variant here to cover a visitor whose OS
   is dark while site.js leaves the root at "auto". Measured: it changed 0 of 8
   faces on every site, because render/instruments.js:829/1019 give EVERY .face
   an explicit data-mode, so the derived selectors match nothing the un-gated
   rules do not already match. Removed rather than left as a fix that is not
   one — if a .face is ever emitted without data-mode, this is the place. */
const facesWithAuto = facesForThis;

/* ── the head ──────────────────────────────────────────────────────────── */
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

function head({ title, description, canonical, css, preload = [], extra = '', image = `${origin}/assets/og.png` }) {
  return `<!doctype html>
<html lang="en" class="no-js" data-mode="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="${CONFIG.og.bg}">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(p.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(p.name)} — ${esc(p.descriptor)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${image}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/icon-180.png">
<link rel="manifest" href="/site.webmanifest">
${preload.map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/${f}" crossorigin>`).join('\n')}
<link rel="stylesheet" href="/assets/${css}">
<script>document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');try{var m=localStorage.getItem('pho-mode');if(m==='dark'||m==='light')document.documentElement.setAttribute('data-mode',m);}catch(e){}</script>
${extra}
</head>
<body>`;
}
/* One floating way to write, on every page of every site. It is an <a href>
   to the site's own hello@, so it works with scripting off, opens in a mail
   app, and can be middle-clicked. site.js reveals it past the first screen so
   it never competes with the hero's own call to action. */
const fab = (c) => `<a class="fab" href="mailto:hello@${c.domain}" data-fab aria-label="Write to hello@${c.domain}">`
  + `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">`
  + `<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3 7 9 6 9-6"/></svg>`
  + `<span class="fab-t">Write to us</span></a>`;
const tail = (js) => `${fab(CONFIG)}
<script src="/assets/${js}" defer></script>
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

tokenGuard(`css/pages/${p.id}.css`, read(`css/pages/${p.id}.css`));
const cssBody = squeeze(SHEETS.map((s) => (s === 'css/faces.css' ? facesWithAuto : read(s))).join('\n'));
const jsBody = squeezeJs([read('js/site.js'), has(`js/pages/${p.id}.js`) ? read(`js/pages/${p.id}.js`) : ''].join('\n'));
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

const sameAs = socialUrls(p.id);
const publisher = { '@type': 'Organization', name: 'Bareeda LLC', alternateName: 'Providerhub Oregon', url: 'https://providerhub.us', email: `hello@${CONFIG.domain}`, sameAs: socialUrls('pho') };
const ld = [
  {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: p.name, applicationCategory: 'BusinessApplication', operatingSystem: 'Web, iOS, Android',
    description: CONFIG.description, url: origin, image: `${origin}/assets/og.png`, sameAs,
    audience: { '@type': 'Audience', audienceType: 'Licensed adult foster homes, group homes and care agencies in Oregon' },
    publisher,
  },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: CONFIG.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
];

const body = render(CONFIG, p);
write('index.html', head({ title: `${p.name} — ${p.descriptor}`, description: CONFIG.description, canonical: `${origin}/`, css: cssName, preload, extra: ld.map(jsonLd).join('\n') }) + body + tail(jsName));

/* the marketing pages the product's module exports */
const routes = ['/'];
for (const pg of extraPages) {
  const slug = String(pg.path || '').replace(/^\/|\/$/g, '');
  if (!slug || !/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(slug)) { console.error(`  a page has a bad path: ${JSON.stringify(pg.path)}`); process.exit(1); }
  if (slug === 'privacy' || slug === 'api' || slug === 'assets') { console.error(`  a page module may not export ${slug}/`); process.exit(1); }
  const pageLd = [{ '@context': 'https://schema.org', '@type': 'WebPage', name: pg.title, description: pg.description, url: `${origin}/${slug}`, isPartOf: { '@type': 'WebSite', name: p.name, url: origin }, publisher }, ...(pg.jsonLd ? [].concat(pg.jsonLd) : [])];
  write(`${slug}/index.html`, head({ title: `${pg.title} — ${p.name}`, description: pg.description, canonical: `${origin}/${slug}`, css: cssName, preload, extra: pageLd.map(jsonLd).join('\n') }) + pg.render(CONFIG, p) + tail(jsName));
  routes.push(`/${slug}`);
}

write('privacy/index.html', head({ title: `Privacy — ${p.name}`, description: `What ${p.name} holds, where it lives, and what leaves it.`, canonical: `${origin}/privacy`, css: cssName, preload }) + privacyPage(CONFIG, chrome) + tail(jsName));
routes.push('/privacy');
write('404.html', head({ title: `Not here — ${p.name}`, description: 'That page does not exist.', canonical: `${origin}/`, css: cssName, preload }) + `<a class="skip" href="#main">Skip to content</a>
${chrome.header ? chrome.header(CONFIG, p, { page: '404', title: 'Not here' }) : ''}
<main id="main" class="page face canvas" data-product="${p.id}" data-mode="light">
  <section class="sec" aria-label="Not found" style="min-height:60vh;display:grid;align-content:center"><div class="wrap"><div class="head"><h1>That page is not here.</h1><p class="sub">It may have moved, or it may never have existed. The front page has everything.</p></div><div class="ctas"><a class="btn pri" href="/">${esc(p.name)}</a></div></div></section>
</main>
${chrome.footer ? chrome.footer(CONFIG, p, { page: '404' }) : ''}` + tail(jsName));

write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${origin}${r === '/' ? '/' : r}</loc><changefreq>${r === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${r === '/' ? '1.0' : r === '/privacy' ? '0.3' : '0.7'}</priority></url>`).join('\n')}
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
console.log(`  ${p.name} → ${path.relative(HERE, OUT) || 'dist'}/`);
console.log(`   index.html   ${kb(fs.statSync(path.join(OUT, 'index.html')).size)}`);
console.log(`   pages        ${routes.join(' ')}`);
console.log(`   ${cssName}   ${kb(Buffer.byteLength(cssBody))}`);
console.log(`   ${jsName}   ${kb(Buffer.byteLength(jsBody))}`);
console.log(`   fonts        ${kb(fontBytes)} — ${fontsUsed.join(', ')}`);
