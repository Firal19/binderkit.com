// The chrome every Cohort page wears: the rail, the shift sheet, the phone
// tab bar, the command palette, and the end-of-shift footer.

import { esc, mark, social, byline, hello, mailto, nextFloat } from '../../shared.js';
import { ic } from '../../icons/cohort.js';
import { APP, STOPS, PAGE_LINKS, VERBS, DAY, hid, SCREEN_ORDER, SCREEN_NOTES, screenHref, ROUTES } from './data.js';
import { screensOf } from '../../instruments.js';

const isHome = (opts) => !opts.page || opts.page === 'home';

/* The five real screens, in vault order, each with the tab word it owns. */
export const SCREENS = screensOf('cohort')
  .slice()
  .sort((a, b) => SCREEN_ORDER.indexOf(a.key) - SCREEN_ORDER.indexOf(b.key))
  .map((s) => ({ ...s, note: SCREEN_NOTES[s.key] || { tab: s.title, proves: '' } }));
/* an in-page target from anywhere: on the front page a hash, elsewhere a route */
export const at = (opts, id) => (isHome(opts) ? `#${id}` : `/#${id}`);

/* ── the palette: the product's verbs, then the stops, then the pages ──── */
function palette(cfg, p, opts) {
  const row = (href, icon, t, s, kind, ext = false) => `<li><a class="pal-r" href="${esc(href)}" data-kind="${kind}" ${ext ? 'rel="noopener"' : ''}>${ic(icon, 18)}<span class="pal-t">${esc(t)}</span><span class="pal-s">${esc(s)}</span></a></li>`;
  return `<div class="pal" id="pal" hidden>
    <div class="pal-w" role="dialog" aria-modal="true" aria-label="Jump to">
      <label class="pal-q">${ic('search', 18)}<span class="sr-only">Type a verb, a stop or a page</span><input class="pal-in" type="search" placeholder="Sign a dose, pricing, the record…" autocomplete="off" spellcheck="false"><kbd>esc</kbd></label>
      <ul class="pal-l">
        ${VERBS.map((v) => row(at(opts, v.to), v.icon, v.t, v.s, 'verb')).join('')}
        ${SCREENS.map((sc, i) => `<li><a class="pal-r is-screen" href="${screenHref(sc.key)}" data-kind="screen"><span class="pal-no">${String(i + 1).padStart(2, '0')}</span><span class="pal-t">${esc(sc.note.tab)} — the screen</span><span class="pal-s">${esc(sc.title)}</span></a></li>`).join('')}
        ${STOPS.map((s) => row(at(opts, s.id), s.icon, s.label, 'On the front page', 'stop')).join('')}
        ${PAGE_LINKS.map((l) => row(`/${l.path}`, l.icon, l.label, l.title, 'page')).join('')}
        ${row('/privacy', 'shield', 'Privacy', 'What Cohort holds, and what leaves it', 'page')}
        ${row(APP, 'ext', 'Sign in to your house', 'app.cohorthome.app', 'page', true)}
      </ul>
      <p class="pal-none" hidden>Nothing matches. Try a verb — sign, file, print.</p>
    </div>
    <button class="pal-scrim" type="button" data-close aria-label="Close"></button>
  </div>`;
}

/* ── the shift sheet: the phone's menu ──────────────────────────────────── */
function sheet(cfg, p, opts) {
  const home = isHome(opts);
  return `<div class="ssheet" id="sheet" hidden>
    <div class="ssheet-in">
      <div class="ssheet-h"><span class="eyebrow">Menu</span><button class="ssheet-x" type="button" data-close aria-label="Close the menu">${ic('close', 22)}</button></div>
      <div class="ssheet-ix msheet-g" data-page-index data-open-all="Open every section of this page"><span class="msheet-k ssheet-k">In this page</span></div>
      <div class="ssheet-sc">
        <span class="msheet-k ssheet-k">The five screens</span>
        <div class="ssheet-scr">${SCREENS.map((sc, i) => `<a href="${screenHref(sc.key)}"><b>${String(i + 1).padStart(2, '0')}</b><span>${esc(sc.note.tab)}</span></a>`).join('')}</div>
      </div>
      <nav aria-label="Stops, on the phone">
        <ol class="ssheet-l">
          ${STOPS.map((s) => `<li><a href="${at(opts, s.id)}"><b class="ssheet-hr">${ic(s.icon, 18)}</b><span>${esc(s.label)}</span>${ic('right', 18, { cls: 'ssheet-c' })}</a></li>`).join('')}
        </ol>
        <ul class="ssheet-p">
          ${PAGE_LINKS.map((l) => `<li><a href="/${l.path}" ${opts.page === l.path ? 'aria-current="page"' : ''}>${ic(l.icon, 18)}<span>${esc(l.label)}</span></a></li>`).join('')}
        </ul>
      </nav>
      <div class="ssheet-t">
        <button class="shiftb" type="button" data-mode-toggle data-theme-dark="#0E1F1E" data-theme-light="#F9F4EC"><span class="shiftb-d">${ic('sun', 16)}<span class="shiftb-l">Day shift</span></span><span class="shiftb-n">${ic('moon', 16)}<span class="shiftb-l">Night shift</span></span></button>
        <button class="textb" type="button" data-text-toggle aria-pressed="false">${ic('text', 18)}<span>Larger text</span></button>
        <button class="textb" type="button" data-share data-share-title="Cohort — ${esc(p.descriptor)}">${ic('share', 18)}<span>Share</span></button>
      </div>
      <div class="ssheet-a">
        <a class="btn pri lg" href="${home ? '#join' : '/#join'}" data-cta="sheet">${esc(cfg.cta.primary)}</a>
        <a class="btn lg" href="${esc(APP)}">${esc(cfg.signIn.label)} to your house</a>
      </div>
      <p class="ssheet-f">${esc(p.descriptor)} · <a class="ssheet-fa" href="${mailto(cfg, `I’m staff — ${p.name}`)}">${esc(hello(cfg))}</a><button class="copyb" type="button" data-copy="${esc(hello(cfg))}" data-copied="Address copied — opening your mail app" aria-label="Copy ${esc(hello(cfg))} and open your mail app">${ic('copy', 16)}</button></p>
      <p class="ssheet-nl">No login yet? An administrator at your house adds you. Write to us and we will tell you who that is.</p>
    </div>
  </div>`;
}

/* ── the phone tab bar: the app's own navigation, made the site's ─────── */
function tabs(cfg, p, opts) {
  const home = isHome(opts);
  const items = home
    ? [['#top', 'clock', 'Today'], ['#shift', 'handoff', 'Shift'], ['#house', null, 'Your house'], ['#record', 'record', 'Record'], ['#join', 'mail', 'Join']]
    : [['/', 'clock', 'Home'], ['/features', 'note', 'Features'], ['/#house', null, 'Your house'], ['/pricing', 'tag', 'Pricing'], ['/contact', 'mail', 'Contact']];
  return `<nav class="tabs" aria-label="Sections, phone" ${home ? 'data-tabs' : ''}>
    ${items.map(([href, icon, label]) => (icon
    ? `<a class="tab-s" href="${href}" ${!home && opts.page === href.slice(1) ? 'aria-current="page"' : ''}>${ic(icon, 22)}<span>${esc(label)}</span></a>`
    : `<a class="tab-s tab-m" href="${href}" aria-label="${esc(label)}"><span class="tab-mk">${mark('cohort', 30, { label: false })}</span></a>`)).join('')}
  </nav>`;
}

/* ── the header: the rail ──────────────────────────────────────────────── */
export function header(cfg, p, opts = {}) {
  const home = isHome(opts);
  const rail = home ? STOPS.filter((s) => s.id !== 'join') : PAGE_LINKS;
  const stop = (href, label, current) => `<a class="rail-stop" href="${href}" ${current ? 'aria-current="page"' : ''}><span class="rail-tick" aria-hidden="true"></span><span class="rail-l">${esc(label)}</span></a>`;
  const stops = home
    ? rail.map((s) => stop(`#${s.id}`, s.label, false)).join('')
    : rail.map((l) => stop(`/${l.path}`, l.label, opts.page === l.path)).join('');
  return `<header class="tr" id="top-bar" data-page="${esc(opts.page || 'home')}">
    <div class="wrap tr-in">
      <a class="brand" href="/" aria-label="${esc(p.name)} — home"><span class="brand-tile">${mark(p.id, 26, { label: false })}</span><span class="brand-n">${esc(p.name)}</span></a>
      <nav class="rail" aria-label="${home ? 'Sections' : 'Pages'}" data-spy data-progress>
        <span class="rail-line" aria-hidden="true"><i class="rail-fill"></i><i class="rail-now"></i></span>
        ${stops}
      </nav>
      <div class="tr-r">
        <div class="tr-tools">
          <button class="tr-k" type="button" aria-controls="pal" aria-expanded="false" data-focus=".pal-in" aria-label="Search this site">${ic('search', 17)}</button>
          <button class="shiftb" type="button" data-mode-toggle data-theme-dark="#0E1F1E" data-theme-light="#F9F4EC" aria-label="Switch to night shift"><span class="shiftb-d">${ic('sun', 15)}<span class="shiftb-l">Day</span></span><span class="shiftb-n">${ic('moon', 15)}<span class="shiftb-l">Night</span></span></button>
        </div>
        <span class="tr-rule" aria-hidden="true"></span>
        <a class="signin" href="${esc(cfg.signIn.href)}">${esc(cfg.signIn.label)}</a>
        <a class="stampb" href="${home ? '#join' : '/#join'}" data-cta="nav">${esc(cfg.cta.nav)}</a>
        <button class="tr-menu" type="button" aria-expanded="false" aria-controls="sheet" aria-label="Open the menu" data-label-close="Close the menu" data-lock data-focus=".ssheet-x">${ic('menu', 22)}</button>
      </div>
    </div>
  </header>`;
}

/* ── the footer: the end-of-shift sheet ──────────────────────────────────
   The shift sheet, the palette and the phone tab bar are fixed overlays;
   they render here rather than in the header because the header's
   backdrop-filter would make it their containing block. */
const RING_TEXT = 'COHORT · COHORTHOME.APP · COHORT · COHORTHOME.APP · ';
const stampLogo = (p) => `<div class="stampl" aria-hidden="true">
  <svg class="stampl-r" viewBox="0 0 132 132" aria-hidden="true"><defs><path id="ring" d="M66 66m-50 0a50 50 0 1 1 100 0a50 50 0 1 1-100 0"/></defs><circle cx="66" cy="66" r="63" fill="none" stroke="currentColor" stroke-width="1.25"/><circle cx="66" cy="66" r="38.5" fill="none" stroke="currentColor" stroke-width=".75" opacity=".55"/><text class="stampl-t" font-size="8.4" letter-spacing="2.6"><textPath href="#ring">${RING_TEXT}</textPath></text></svg>
  <span class="stampl-m">${mark(p.id, 56, { label: false, mono: true })}</span>
</div>`;

/* the page after this one, on the route line; the last one leads home */
const nextOf = (opts) => {
  const here = ROUTES.findIndex((r) => r.page === (opts.page || 'home'));
  const n = here >= 0 ? ROUTES[here + 1] : null;
  return n ? { href: `/${n.path}`, label: n.label, gist: n.gist } : { href: '/', label: 'The shift', gist: 'Back to the front page' };
};

export function footer(cfg, p, opts = {}) {
  const home = isHome(opts);
  const col = (id, title, inner) => `<details class="eos-d" id="eos-${id}" open><summary><span class="eos-k">${esc(title)}</span>${ic('down', 18, { cls: 'eos-chev' })}</summary><div class="eos-b">${inner}</div></details>`;
  const link = (href, t, ext = false) => `<li><a href="${esc(href)}" ${ext ? 'rel="noopener"' : ''}>${esc(t)}${ext ? ic('ext', 13, { cls: 'eos-ext' }) : ''}</a></li>`;
  return `<footer class="eos" id="foot" aria-labelledby="h-foot">
    <div class="wrap">
      <div class="eos-head">
        <h2 class="eos-h" id="h-foot">End of shift.</h2>
        <p class="eos-sub">Everything on this site, and a person to write to.</p>
      </div>
      <div class="eos-g">
        ${col('product', 'Product', `<ul class="eos-l">${STOPS.map((s) => link(at(opts, s.id), s.label)).join('')}${link('/screens', 'The five screens')}${link('/features', 'Everything Cohort does')}${link('/security', 'Security and privacy')}</ul>`)}
        ${col('company', 'Company', `<ul class="eos-l">${link('/about', 'About')}${link('/contact', 'Contact')}${link('/privacy', 'Privacy')}${link(APP, 'Sign in to your house', true)}</ul>`)}
        ${col('write', 'Write to us', `<p class="eos-mail"><a href="${mailto(cfg)}">${esc(hello(cfg))}</a><button class="copyb" type="button" data-copy="${esc(hello(cfg))}" data-copied="Address copied — opening your mail app" aria-label="Copy the address and open your mail app">${ic('copy', 16)}</button></p><p class="eos-fine">One inbox. A person answers within a working day.</p>${social(p.id, { text: true, cls: 'stamps', size: 18, label: 'Cohort on social' })}`)}
      </div>
      <div class="eos-sign">
        <div class="eos-out">
          <span class="eos-so">Oregon · <b data-clock>--:--</b></span>
          <p class="eos-fine">Daily operations for care homes. Made in Oregon.</p>
        </div>
        ${stampLogo(p)}
        <div class="eos-by">
          ${byline(false)}
          <p class="eos-legal">${esc(cfg.legalLine)}</p>
          <div class="eos-act"><button class="textb" type="button" data-share data-share-title="Cohort — ${esc(p.descriptor)}">${ic('share', 16)}<span>Share this page</span></button>${home ? `<a class="textb" href="/privacy">${ic('shield', 16)}<span>Privacy</span></a>` : `<a class="textb" href="/">${ic('clock', 16)}<span>Back to the shift</span></a>`}</div>
        </div>
      </div>
    </div>
    ${sheet(cfg, p, opts)}
    ${palette(cfg, p, opts)}
    ${tabs(cfg, p, opts)}
    <a class="totop" href="${home ? '#top' : '#main'}" aria-label="Back to the top">${ic('totop', 18)}<span>Top</span></a>
    ${nextFloat(nextOf(opts))}
  </footer>`;
}

export { DAY, hid };
