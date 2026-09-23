// aidepost.com — the chrome. Two sides, and everything flips.
//
// The header is a two-sided switch: "I run a house | I'm a caregiver" sets
// html[data-side], which swaps the nav set, the CTA label and the tone. On a
// phone the menu is a split sheet — light half, dark half — and a fixed
// bottom split bar carries the mark as the pin between the halves. The
// footer keeps the week as a rail with tonight lit, over four clean columns.

import { esc, mark, social, byline, hello, mailto, boxAt, nextFloat } from '../../shared.js';
import { ic } from '../../icons/aidepost.js';

/* each nav item carries a small glyph from the badge set */
export const PROVIDER_NAV = [['board', 'The board', 'board'], ['credentials', 'Credentials', 'badge'], ['hours', 'Hours', 'clock'], ['pricing', 'Pricing', 'tag']];
export const CAREGIVER_NAV = [['caregivers', 'Shifts near you', 'distance'], ['wallet', 'Your wallet', 'wallet'], ['free', 'Free, for ever', 'free']];
export const PAGE_LINKS = [['/providers', 'Providers'], ['/caregivers', 'Caregivers'], ['/screens', 'The screens'], ['/pricing', 'Pricing'], ['/about', 'About'], ['/contact', 'Contact']];

/* ── the ring of routes, and the next one after this page ─────────────
   The two-card previous/next block is gone; a small floating "Next · X"
   (shared nextFloat) takes its place at the end of every footer. */
export const ROUTES = [
  ['/', 'Both sides', 'The whole argument on one page', 'both'],
  ['/providers', 'For providers', 'The board, credentials, hours, hiring', 'prov'],
  ['/caregivers', 'For caregivers', 'Shifts near you, free for ever', 'care'],
  ['/screens', 'The screens', 'All five, at the size they ship', 'both'],
  ['/pricing', 'Pricing', 'Per house, plus one charge per post', 'both'],
  ['/about', 'About', 'The workforce record, and nothing else', 'both'],
  ['/contact', 'Contact', 'One inbox, one person answers', 'both'],
  ['/privacy', 'Privacy', 'What Aidepost holds, and what it does not', 'both'],
];
export const routeIx = (path) => ROUTES.findIndex(([h]) => h === path);
export const nextOf = (path) => {
  const i = routeIx(path);
  const n = i < 0 ? null : ROUTES[i + 1];
  return n ? { href: n[0], label: n[1], gist: n[2] } : null;
};

/* Where you are, said in the header on a phone, where there is no nav rail
   to infer it from. */
export const WHERE = { home: 'Both sides', providers: 'For providers', caregivers: 'For caregivers', screens: 'The screens', pricing: 'Pricing', about: 'About', contact: 'Contact', privacy: 'Privacy', '404': 'Not here' };

/* Where a section link points depends on the page it sits on: in-page when
   the id is here, back to the front page when it is not. */
const linker = (ids) => (id) => (ids && ids.has(id) ? `#${id}` : `/#${id}`);

const GO = [
  ['/', 'Both sides', 'the front page'],
  ['/providers', 'For providers', 'the board, credentials, hours, hiring'],
  ['/caregivers', 'For caregivers', 'shifts near you, free for ever'],
  ['/screens', 'The screens', 'all five, at the size they ship'],
  ['/pricing', 'Pricing', 'per house, plus one charge per post'],
  ['/about', 'About', 'the workforce record, and nothing else'],
  ['/contact', 'Contact', 'one inbox, one person answers'],
  ['/privacy', 'Privacy', 'what Aidepost holds'],
];

const VERBS = [
  ['offer', 'Offer to own staff', 'the board · inward first', 'board'],
  ['post', 'Post outward', 'the board · your action, never a timer', 'post'],
  ['cred', 'Add a credential date', 'credentials · surfaced, never enforced', 'badge'],
  ['export', 'Export timesheets', 'hours · CSV, never pay', 'export'],
  ['side', 'Turn the page over', 'switch side', 'sides'],
  ['mode', 'Day / Night', 'switch the light', 'moon'],
];

const modeBadge = () => `<button class="badge-t" type="button" data-mode-toggle aria-label="Switch to dark" data-theme-light="#F7F3EC" data-theme-dark="#1C1620"><span class="badge-d">${ic('sun', 16, { pin: false })}<span>Day</span></span><span class="badge-n">${ic('moon', 16, { pin: false })}<span>Night</span></span><span class="badge-pin" aria-hidden="true"></span></button>`;

function palette() {
  return `<div class="pal" id="pal" hidden role="dialog" aria-label="Command palette" aria-modal="true">
    <div class="pal-scrim" data-close></div>
    <div class="pal-c">
      <label class="pal-ask">${ic('search', 18, { pin: false })}<input class="pal-in" type="text" placeholder="Type a verb…" aria-label="Type a verb" autocomplete="off" spellcheck="false"><kbd>esc</kbd></label>
      <ul class="pal-list" role="list">${VERBS.map(([k, t, s, i]) => `<li><button class="pal-row" type="button" data-verb="${k}">${ic(i, 18)}<span class="pal-t">${esc(t)}</span><span class="pal-s">${esc(s)}</span></button></li>`).join('')}${GO.map(([h, t, s]) => `<li><a class="pal-row is-go" href="${h}"><span class="pal-go" aria-hidden="true"></span><span class="pal-t">${esc(t)}</span><span class="pal-s">${esc(s)}</span><span class="pal-p">${esc(h)}</span></a></li>`).join('')}</ul>
      <p class="pal-none" hidden>Nothing matches. Aidepost has four verbs — offer, post, add a date, export — and eight places to be.</p>
    </div>
  </div>`;
}

function keysCard() {
  const rows = [['1', 'I run a house'], ['2', 'I’m a caregiver'], ['⌘ K', 'The verbs, and every page'], ['← →', 'Move through the screens — in the strip, or in the tabs'], ['Home End', 'The first screen, the last screen'], ['?', 'This card'], ['Esc', 'Close whatever is open']];
  return `<div class="keys" id="keys" hidden role="dialog" aria-label="Keyboard shortcuts" aria-modal="true">
    <div class="pal-scrim" data-close></div>
    <div class="keys-c">
      <div class="keys-h">${ic('keyboard', 20)}<b>Keyboard</b><button class="keys-x" type="button" data-close aria-label="Close">${ic('x', 18, { pin: false })}</button></div>
      <dl class="keys-l">${rows.map(([k, w]) => `<div><dt><kbd>${esc(k)}</kbd></dt><dd>${esc(w)}</dd></div>`).join('')}</dl>
    </div>
  </div>`;
}

/* ── the notification: one push, on the side you are on ───────────────
   It slides in from the right edge when the board comes into view. The
   provider's version is the message a manager gets when a shift is still
   open at 24 hours; the caregiver's is what a relief worker sees when a
   shift near her goes outward. Each explains itself in one line. */
function notification() {
  return `<div class="ntf" id="ntf" hidden role="status" aria-live="polite">
    <button class="ntf-b" type="button" data-ntf-open>
      <span class="ntf-i">${ic('bell', 18, { pin: 'open' })}</span>
      <span class="ntf-t">
        <span class="ntf-k">Aidepost · now</span>
        <span class="ntf-m s-prov">WH-1: Sat night is still open.</span>
        <span class="ntf-m s-care">A shift near you: Sat night · 6.2 mi.</span>
        <span class="ntf-w s-prov">The push a manager gets 24 hours out. Tap to see how it gets covered.</span>
        <span class="ntf-w s-care">The push a relief caregiver gets when a shift goes outward. Tap to see it.</span>
      </span>
    </button>
    <button class="ntf-x" type="button" aria-label="Dismiss" data-ntf-close>${ic('x', 18, { pin: false })}</button>
  </div>`;
}

export function header(cfg, p, opts = {}) {
  const page = opts.page || 'home';
  const at = linker(opts.ids);
  const set = (rows, side) => `<ul class="nav-set" data-set="${side}">${rows.map(([id, label, icon]) => `<li><a href="${at(id)}">${ic(icon || 'board', 15, { pin: side === 'caregiver' ? 'open' : 'ink', cls: 'nav-ic' })}<span>${esc(label)}</span></a></li>`).join('')}</ul>`;
  const provHref = page === 'home' ? '#providers' : page === 'providers' ? '#top' : '/providers';
  const careHref = page === 'home' ? '#caregivers' : page === 'caregivers' ? '#top' : '/caregivers';
  const sheetLinks = (rows) => rows.map(([id, label, icon]) => `<a href="${at(id)}">${ic(icon || 'board', 18, { pin: false })}${esc(label)}</a>`).join('');

  return `<header class="hd" id="top-bar" data-page="${esc(page)}">
    <div class="wrap hd-in">
      <div class="hd-id">
        <a class="brand" href="/" aria-label="${esc(p.name)} — home">${mark(p.id, 30, { label: false })}<span class="brand-n">${esc(p.name)}</span></a>
        <span class="hd-where" data-where>${esc(WHERE[page] || 'Both sides')}</span>
      </div>
      <div class="sw" role="group" aria-label="Which side are you on?">
        <button class="sw-b is-prov" type="button" data-side-set="provider" aria-pressed="true">I run a house</button>
        <button class="sw-b is-care" type="button" data-side-set="caregiver" aria-pressed="false">I’m a caregiver</button>
      </div>
      <nav class="hd-nav" aria-label="Sections" data-spy>${set(PROVIDER_NAV, 'provider')}${set(CAREGIVER_NAV, 'caregiver')}</nav>
      <div class="hd-r">
        <button class="hd-k" type="button" aria-controls="pal" aria-expanded="false" aria-label="Search, and the verbs (⌘K)" data-focus=".pal-in">${ic('search', 18, { pin: false })}</button>
        <a class="btn pri sm hd-cta" href="${at('join')}" data-cta="nav"><span class="s-prov"><span class="l-long">${esc(cfg.cta.primary)}</span><span class="l-short">${esc(cfg.cta.nav)}</span></span><span class="s-care"><span class="l-long">${esc(cfg.cta.secondary)}</span><span class="l-short">Find shifts</span></span></a>
        ${modeBadge()}
        <button class="hd-menu" type="button" aria-controls="sheet" aria-expanded="false" aria-label="Open menu" data-label-close="Close menu" data-lock data-focus=".sheet-n a">${ic('menu', 22, { pin: false })}<span class="hd-menu-l" aria-hidden="true">Menu</span></button>
      </div>
    </div>
  </header>
  <div class="sheet" id="sheet" hidden>
      <div class="sheet-g">
        <div class="sheet-half is-prov" data-side-half="provider">
          <span class="sheet-k">${ic('house', 20)}I run a house</span>
          <nav class="sheet-n" aria-label="For providers">${sheetLinks(PROVIDER_NAV)}<a href="/providers" class="sheet-deep">${ic('arrow', 18, { pin: false })}Providers, at depth</a></nav>
        </div>
        <div class="sheet-half is-care" data-side-half="caregiver">
          <span class="sheet-k">${ic('phone', 20)}I’m a caregiver</span>
          <nav class="sheet-n" aria-label="For caregivers">${sheetLinks(CAREGIVER_NAV)}<a href="/caregivers" class="sheet-deep">${ic('arrow', 18, { pin: false })}Caregivers, at depth</a></nav>
        </div>
      </div>
      <div class="sheet-ix msheet-g" data-page-index><span class="msheet-k">In this page</span></div>
      <div class="sheet-f">
        <nav class="sheet-p" aria-label="Pages">${[['/screens', 'Screens'], ['/pricing', 'Pricing'], ['/about', 'About'], ['/contact', 'Contact'], ['/privacy', 'Privacy']].map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join('')}</nav>
        ${modeBadge()}<button class="sheet-x" type="button" data-close aria-label="Close menu">${ic('x', 20, { pin: false })}</button>
      </div>
    </div>
  ${palette()}
  ${keysCard()}
  ${notification()}
  <nav class="bar" aria-label="Two sides">
    <a class="bar-h is-prov" href="${provHref}" data-side-set="provider"><span class="bar-pinlet" aria-hidden="true"></span><span class="bar-t">For providers</span></a>
    <span class="bar-pin" aria-hidden="true">${mark(p.id, 24, { label: false, mono: true })}</span>
    <a class="bar-h is-care" href="${careHref}" data-side-set="caregiver"><span class="bar-pinlet" aria-hidden="true"></span><span class="bar-t">For caregivers</span></a>
  </nav>`;
}

/* ── the footer: the week as a rail, four columns, the sign-off ─────── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* which address this page prints: THE ROUTE DECIDES, never the stored side */
const routeOfPage = (page) => (!page || page === 'home' ? '/' : `/${page}`);
const writeKey = (cfg, opts) => opts.box || boxAt(cfg, routeOfPage(opts.page));

function writeCol(cfg, key) {
  const to = hello(cfg, key);
  const other = key === 'caregivers' ? hello(cfg) : hello(cfg, 'caregivers');
  const alt = key === 'caregivers' ? `Running a house? ${other}` : `Caregivers: ${other}`;
  return {
    line: `<p class="ft-w"><a href="${mailto(cfg, '', key)}">${esc(to)}</a></p>`,
    copy: `<button class="ft-copy" type="button" data-copy="${esc(to)}" data-copied="Address copied — opening your mail app" aria-label="Copy ${esc(to)} and open your mail app">${ic('mail', 18)}Write to us</button>`,
    note: `<p class="ft-note">One inbox. A person answers.</p><p class="ft-note ft-alt">${esc(alt)} — same inbox.</p>`,
  };
}

/* the footer a phone gets: identity, the address, three groups, social */
function phoneFoot(cfg, p, at, li, w) {
  const group = (title, rows) => `<details class="ft-ph-d"><summary><b>${esc(title)}</b><span class="faq-x" aria-hidden="true"></span></summary>${li(rows)}</details>`;
  return `<div class="ft-ph">
    <div class="ft-ph-id">${mark(p.id, 40, { label: false })}<b class="ft-sun-n">${esc(p.name)}</b><span class="ft-sun-d">${esc(p.descriptor)}</span></div>
    ${w.line}
    <div class="ft-ph-act">
      ${w.copy}
      ${w.note}
    </div>
    ${group('Product', [['/providers#board', 'The board'], ['/providers#credentials', 'Credentials'], ['/providers#hours', 'Hours'], ['/providers#hiring', 'Hiring'], ['/screens', 'All five screens'], ['/pricing', 'Pricing']])}
    ${group('Caregivers', [['/caregivers#caregivers', 'Shifts near you'], ['/caregivers#wallet', 'Your wallet'], ['/caregivers#free', 'Free, for ever'], [at('join'), 'Join as a caregiver']])}
    ${group('Company', [['/about', 'About'], ['/contact', 'Contact'], ['/privacy', 'Privacy']])}
    ${social(p.id, { cls: 'soc-pills', size: 16, label: 'Aidepost on social, again' })}
  </div>`;
}

export function footer(cfg, p, opts = {}) {
  const at = linker(opts.ids);
  const w = writeCol(cfg, writeKey(cfg, opts));
  const li = (rows) => `<ul class="ft-l">${rows.map(([h, t]) => `<li><a href="${esc(h)}">${esc(t)}</a></li>`).join('')}</ul>`;
  const cols = [
    ['Product', li([['/providers#board', 'The board'], ['/providers#credentials', 'Credentials'], ['/providers#hours', 'Hours'], ['/providers#hiring', 'Hiring'], ['/screens', 'All five screens'], ['/pricing', 'Pricing']])],
    ['Caregivers', li([['/caregivers#caregivers', 'Shifts near you'], ['/caregivers#wallet', 'Your wallet'], ['/caregivers#free', 'Free, for ever'], [at('join'), 'Join as a caregiver']])],
    ['Company', li([['/about', 'About'], ['/contact', 'Contact'], ['/privacy', 'Privacy']])],
    ['Write', `${w.line}${w.copy}${w.note}${social(p.id, { cls: 'soc-pills', size: 16, text: true, label: 'Aidepost on social' })}`],
  ];
  const next = nextOf(routeOfPage(opts.page));
  return `<footer class="ft" id="foot">
    <div class="wrap">
      <div class="ft-top">
        <p class="ft-line">${ic('board', 20)}<span>Tonight is <b data-clock="day">the day</b>.</span></p>
        <ol class="ft-week" aria-label="This week, with tonight lit">${DAYS.map((d) => `<li class="ft-day" data-day="${d}"><span>${d}</span><i class="ft-tonight" aria-hidden="true">tonight</i></li>`).join('')}</ol>
        <button class="btn sm ft-print" type="button" data-print>${ic('print', 18, { pin: false })}Print the roster</button>
      </div>
      <div class="ft-g">
        ${cols.map(([title, body]) => `<div class="ft-c"><b class="ft-dt">${esc(title)}</b>${body}</div>`).join('')}
      </div>
      ${phoneFoot(cfg, p, at, li, w)}
      <div class="ft-sign">
        <div class="ft-sun">${mark(p.id, 44, { label: false })}<span><span class="ft-sun-n">${esc(p.name)}</span><span class="ft-sun-d">${esc(p.descriptor)}</span></span></div>
        <div class="ft-by">${byline(true)}<p class="ft-legal">${esc(opts.fine || '')} ${esc(cfg.legalLine)}</p></div>
      </div>
    </div>
    <button class="ft-keys" type="button" aria-controls="keys" aria-expanded="false" aria-label="Keyboard shortcuts" data-fab-side>${ic('keyboard', 18, { pin: false })}<span>Keys</span></button>
    ${next ? nextFloat(next) : ''}
  </footer>`;
}
