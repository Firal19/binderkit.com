// The chrome every Cohort page wears: the time rail, the shift sheet, the
// phone tab bar, the command palette, and the end-of-shift footer.

import { esc, mark, social, byline, hello, mailto } from '../../shared.js';
import { ic } from '../../icons/cohort.js';
import { APP, STOPS, PAGE_LINKS, VERBS, DAY, hid, find } from './data.js';

const isHome = (opts) => !opts.page || opts.page === 'home';
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
        ${STOPS.map((s) => row(at(opts, s.id), s.icon, s.label, s.hr ? `${s.hr} · a stop on the front page` : 'A stop on the front page', 'stop')).join('')}
        ${PAGE_LINKS.map((l) => row(`/${l.path}`, l.icon, l.label, l.title, 'page')).join('')}
        ${row('/privacy', 'shield', 'Privacy', 'What Cohort holds, and what leaves it', 'page')}
        ${row(APP, 'ext', 'Sign in to your house', 'app.cohorthome.app', 'page', true)}
      </ul>
      <p class="pal-none" hidden>Nothing matches. Try a verb — sign, file, print.</p>
    </div>
    <button class="pal-scrim" type="button" data-close aria-label="Close"></button>
  </div>`;
}

/* ── the shift sheet: the phone's menu, drawn as the app's handoff sheet ── */
function sheet(cfg, p, opts) {
  const home = isHome(opts);
  return `<div class="ssheet" id="sheet" hidden>
    <div class="ssheet-in">
      <div class="ssheet-h"><span class="eyebrow">Shift sheet</span><button class="ssheet-x" type="button" data-close aria-label="Close the shift sheet">${ic('close', 22)}</button></div>
      <nav aria-label="Stops, on the phone">
        <ol class="ssheet-l">
          ${STOPS.map((s) => `<li><a href="${at(opts, s.id)}"><b class="ssheet-hr">${s.hr ? esc(s.hr) : ic(s.icon, 18)}</b><span>${esc(s.label)}</span>${ic('right', 18, { cls: 'ssheet-c' })}</a></li>`).join('')}
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
      <p class="ssheet-f">${esc(p.descriptor)} · ${esc(hello(cfg))}</p>
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

/* ── the header: the time rail ─────────────────────────────────────────── */
export function header(cfg, p, opts = {}) {
  const home = isHome(opts);
  const rail = home ? STOPS.filter((s) => s.id !== 'join') : PAGE_LINKS;
  const stop = (href, hr, label, current) => `<a class="rail-stop" href="${href}" ${current ? 'aria-current="page"' : ''}><span class="rail-hr">${hr}</span><span class="rail-tick" aria-hidden="true"></span><span class="rail-l">${esc(label)}</span></a>`;
  const stops = home
    ? rail.map((s) => stop(`#${s.id}`, s.hr ? esc(s.hr) : '', s.label, false)).join('')
    : rail.map((l) => stop(`/${l.path}`, '', l.label, opts.page === l.path)).join('');
  return `<header class="tr" id="top-bar" data-page="${esc(opts.page || 'home')}">
    <div class="wrap tr-in">
      <a class="brand" href="/" aria-label="${esc(p.name)} — home"><span class="brand-tile">${mark(p.id, 26, { label: false })}</span><span class="brand-n">${esc(p.name)}</span></a>
      <nav class="rail" aria-label="${home ? 'Sections' : 'Pages'}" data-spy data-progress>
        <span class="rail-line" aria-hidden="true"><i class="rail-fill"></i><i class="rail-now"></i></span>
        ${stops}
      </nav>
      <div class="tr-r">
        <div class="tr-tools">
          <button class="tr-k" type="button" aria-controls="pal" aria-expanded="false" data-focus=".pal-in" aria-label="Search">${ic('search', 17)}</button>
          <button class="shiftb" type="button" data-mode-toggle data-theme-dark="#0E1F1E" data-theme-light="#F9F4EC" aria-label="Switch to night shift"><span class="shiftb-d">${ic('sun', 15)}<span class="shiftb-l">Day</span></span><span class="shiftb-n">${ic('moon', 15)}<span class="shiftb-l">Night</span></span></button>
        </div>
        <span class="tr-rule" aria-hidden="true"></span>
        <a class="signin" href="${esc(cfg.signIn.href)}">${esc(cfg.signIn.label)}</a>
        <a class="stampb" href="${home ? '#join' : '/#join'}" data-cta="nav">${esc(cfg.cta.nav)}</a>
        <button class="tr-menu" type="button" aria-expanded="false" aria-controls="sheet" aria-label="Open the shift sheet" data-label-close="Close the shift sheet" data-lock data-focus=".ssheet-x">${ic('menu', 22)}</button>
      </div>
    </div>
  </header>`;
}

/* ── the footer: the end-of-shift sheet ──────────────────────────────────
   The shift sheet, the palette and the phone tab bar are fixed overlays;
   they render here rather than in the header because the header's
   backdrop-filter would make it their containing block. */
const RING_TEXT = 'LOGGED BY COHORT · COHORTHOME.APP · LOGGED BY COHORT · COHORTHOME.APP · ';
const stampLogo = (p) => `<div class="stampl" aria-hidden="true">
  <svg class="stampl-r" viewBox="0 0 132 132" aria-hidden="true"><defs><path id="ring" d="M66 66m-49 0a49 49 0 1 1 98 0a49 49 0 1 1-98 0"/></defs><circle cx="66" cy="66" r="62" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="66" cy="66" r="57" fill="none" stroke="currentColor" stroke-width=".75" stroke-dasharray="2 3"/><circle cx="66" cy="66" r="38" fill="none" stroke="currentColor" stroke-width="1.25"/><text class="stampl-t" font-size="9.2" letter-spacing="2.1"><textPath href="#ring">${RING_TEXT}</textPath></text></svg>
  <span class="stampl-m">${mark(p.id, 80, { label: false, mono: true })}</span>
  <span class="stampl-c" data-clock>--:--</span>
</div>`;

export function footer(cfg, p, opts = {}) {
  const home = isHome(opts);
  const col = (id, title, inner) => `<details class="eos-d" id="eos-${id}" open><summary><span class="eos-k">${esc(title)}</span>${ic('down', 18, { cls: 'eos-chev' })}</summary><div class="eos-b">${inner}</div></details>`;
  const link = (href, t, ext = false) => `<li><a href="${esc(href)}" ${ext ? 'rel="noopener"' : ''}>${esc(t)}${ext ? ic('ext', 13, { cls: 'eos-ext' }) : ''}</a></li>`;
  const disclaimer = find('foot').disclaimer;
  return `<footer class="eos" id="foot" aria-labelledby="h-foot">
    <div class="wrap">
      <div class="eos-head">
        <div><span class="eos-when">18:45</span><h2 class="eos-h" id="h-foot">End of shift.</h2></div>
        <p class="eos-sub">What this site is, where it goes, and how to reach a person.</p>
      </div>
      <div class="eos-g">
        ${col('product', 'Product', `<ul class="eos-l">${STOPS.map((s) => link(at(opts, s.id), s.hr ? `${s.hr} · ${s.label}` : s.label)).join('')}${link('/features', 'Everything Cohort does')}${link('/security', 'Security')}</ul>`)}
        ${col('company', 'Company', `<ul class="eos-l">${link('/about', 'About')}${link('/contact', 'Contact')}${link('/privacy', 'Privacy')}${link('https://providerhub.us', 'providerhub.us', true)}${link(APP, 'Sign in to your house', true)}</ul>`)}
        ${col('help', 'Help', `<ul class="eos-l">${link('/features', 'Features')}${link('/security', 'Security')}${link('/pricing', 'Pricing')}${link('/contact', 'Write to a person')}</ul>`)}
        ${col('write', 'Write to us', `<p class="eos-mail"><a href="${mailto(cfg)}">${esc(hello(cfg))}</a><button class="copyb" type="button" data-copy="${esc(hello(cfg))}" data-copied="Address copied" aria-label="Copy the address">${ic('copy', 16)}</button></p><p class="eos-fine">One inbox. A person answers.</p>${social(p.id, { text: true, cls: 'stamps', size: 18, label: 'Cohort on social' })}`)}
      </div>
      <div class="eos-sign">
        <div class="eos-out">
          <span class="eos-so">Oregon · <b data-clock>--:--</b></span>
          <p class="eos-fine">${esc(disclaimer)}</p>
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
    <a class="totop" href="${home ? '#top' : '#main'}" aria-label="${home ? 'Back to 06:55, the top of the page' : 'Back to the top'}">${ic('totop', 18)}<span>${home ? '06:55' : 'Top'}</span></a>
    ${home ? `<div class="mcta"><a class="btn pri" href="#join" data-cta="mobile">${esc(cfg.cta.primary)}</a><span class="mcta-t"><b data-oregon-short>06:55</b> in Oregon</span></div>` : ''}
  </footer>`;
}

export { DAY, hid };
