// aidepost.com — the chrome. Two sides, and everything flips.
//
// The header is a two-sided switch: "I run a house | I'm a caregiver" sets
// html[data-side], which swaps the nav set, the CTA label and the tone. On a
// phone the menu is a split sheet — light half, dark half — and a fixed
// bottom split bar carries the mark as the pin between the halves. The
// footer is the week: seven columns, Monday to Sunday, today lit "tonight".

import { esc, mark, social, byline, hello, mailto } from '../../shared.js';
import { ic } from '../../icons/aidepost.js';

export const PROVIDER_NAV = [['board', 'The board'], ['credentials', 'Credentials'], ['hours', 'Hours'], ['pricing', 'Pricing']];
export const CAREGIVER_NAV = [['caregivers', 'Shifts near you'], ['wallet', 'Your wallet'], ['free', 'Free, for ever']];
export const PAGE_LINKS = [['/providers', 'Providers'], ['/caregivers', 'Caregivers'], ['/pricing', 'Pricing'], ['/about', 'About'], ['/contact', 'Contact']];

/* Where a section link points depends on the page it sits on: in-page when
   the id is here, back to the front page when it is not. */
const linker = (ids) => (id) => (ids && ids.has(id) ? `#${id}` : `/#${id}`);

const VERBS = [
  ['offer', 'Offer to own staff', 'the board · inward first', 'board'],
  ['post', 'Post outward', 'the board · your action, never a timer', 'post'],
  ['cred', 'Add a credential date', 'credentials · surfaced, never enforced', 'badge'],
  ['export', 'Export timesheets', 'hours · CSV, never pay', 'export'],
  ['side', 'Turn the page over', 'switch side', 'sides'],
  ['mode', 'Day / Night', 'switch the light', 'moon'],
  ['pricing', 'Go to pricing', '/pricing', 'free'],
  ['write', 'Write to a person', '/contact', 'mail'],
];

const modeBadge = () => `<button class="badge-t" type="button" data-mode-toggle aria-label="Switch to dark" data-theme-light="#F7F3EC" data-theme-dark="#1C1620"><span class="badge-d">${ic('sun', 16, { pin: false })}<span>Day</span></span><span class="badge-n">${ic('moon', 16, { pin: false })}<span>Night</span></span><span class="badge-pin" aria-hidden="true"></span></button>`;

function palette() {
  return `<div class="pal" id="pal" hidden role="dialog" aria-label="Command palette" aria-modal="true">
    <div class="pal-scrim" data-close></div>
    <div class="pal-c">
      <label class="pal-ask">${ic('search', 18, { pin: false })}<input class="pal-in" type="text" placeholder="Type a verb…" aria-label="Type a verb" autocomplete="off" spellcheck="false"><kbd>esc</kbd></label>
      <ul class="pal-list" role="list">${VERBS.map(([k, t, s, i]) => `<li><button class="pal-row" type="button" data-verb="${k}">${ic(i, 18)}<span class="pal-t">${esc(t)}</span><span class="pal-s">${esc(s)}</span></button></li>`).join('')}</ul>
      <p class="pal-none" hidden>No verb matches. Aidepost has four: offer, post, add a date, export.</p>
    </div>
  </div>`;
}

function keysCard() {
  const rows = [['1', 'I run a house'], ['2', 'I’m a caregiver'], ['⌘ K', 'The verbs'], ['?', 'This card'], ['Esc', 'Close whatever is open']];
  return `<div class="keys" id="keys" hidden role="dialog" aria-label="Keyboard shortcuts" aria-modal="true">
    <div class="pal-scrim" data-close></div>
    <div class="keys-c">
      <div class="keys-h">${ic('keyboard', 20)}<b>Keyboard</b><button class="keys-x" type="button" data-close aria-label="Close">${ic('x', 18, { pin: false })}</button></div>
      <dl class="keys-l">${rows.map(([k, w]) => `<div><dt><kbd>${esc(k)}</kbd></dt><dd>${esc(w)}</dd></div>`).join('')}</dl>
    </div>
  </div>`;
}

function notification() {
  return `<div class="ntf" id="ntf" hidden role="status" aria-live="polite">
    <button class="ntf-b" type="button" data-ntf-open><span class="ntf-i">${ic('bell', 18, { pin: 'open' })}</span><span class="ntf-t"><span class="ntf-k">Aidepost · now</span><span class="ntf-m">WH-1: Sat night is open.</span></span></button>
    <button class="ntf-x" type="button" aria-label="Dismiss" data-ntf-close>${ic('x', 18, { pin: false })}</button>
  </div>`;
}

/* THE PAGE INDEX CARRIES NO data-open-all, AND THAT IS THE WHOLE FIX.
   site.js:203 delegates open-all with `e.target.closest('[data-open-all]')`.
   While the attribute sat on the .sheet-ix HOLDER, every row inside it was an
   ancestor match: tapping "The questions we get." expanded all ten sections
   underneath the anchor the browser had already resolved, and landed the
   reader 12,858px from the heading they asked for. Only row one looked right,
   by accident. The attribute belongs on the button and nowhere else — site.js
   sets it there itself (`all.dataset.openAll = ''`) and falls back to the
   identical label string, so removing it here costs nothing and fixes the one
   control that earns the right to fold ten of thirteen sections.
   Do not reintroduce it to give the button a custom label. */
export function header(cfg, p, opts = {}) {
  const page = opts.page || 'home';
  const at = linker(opts.ids);
  const set = (rows, side) => `<ul class="nav-set" data-set="${side}">${rows.map(([id, label]) => `<li><a href="${at(id)}">${esc(label)}</a></li>`).join('')}</ul>`;
  const provHref = page === 'home' ? '#providers' : page === 'providers' ? '#top' : '/providers';
  const careHref = page === 'home' ? '#caregivers' : page === 'caregivers' ? '#top' : '/caregivers';
  const sheetLinks = (rows) => rows.map(([id, label]) => `<a href="${at(id)}">${esc(label)}</a>`).join('');

  return `<header class="hd" id="top-bar" data-page="${esc(page)}">
    <div class="wrap hd-in">
      <a class="brand" href="/" aria-label="${esc(p.name)} — home">${mark(p.id, 30, { label: false })}<span class="brand-n">${esc(p.name)}</span></a>
      <div class="sw" role="group" aria-label="Which side are you on?">
        <button class="sw-b is-prov" type="button" data-side-set="provider" aria-pressed="true">I run a house</button>
        <button class="sw-b is-care" type="button" data-side-set="caregiver" aria-pressed="false">I’m a caregiver</button>
      </div>
      <nav class="hd-nav" aria-label="Sections" data-spy>${set(PROVIDER_NAV, 'provider')}${set(CAREGIVER_NAV, 'caregiver')}</nav>
      <div class="hd-r">
        <button class="hd-k" type="button" aria-controls="pal" aria-expanded="false" aria-label="Search" data-focus=".pal-in">${ic('search', 18, { pin: false })}</button>
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
          <nav class="sheet-n" aria-label="For providers">${sheetLinks(PROVIDER_NAV)}<a class="sheet-deep" href="/providers">${ic('arrow', 18, { pin: false })}Providers, at depth</a></nav>
        </div>
        <div class="sheet-half is-care" data-side-half="caregiver">
          <span class="sheet-k">${ic('phone', 20)}I’m a caregiver</span>
          <nav class="sheet-n" aria-label="For caregivers">${sheetLinks(CAREGIVER_NAV)}<a class="sheet-deep" href="/caregivers">${ic('arrow', 18, { pin: false })}Caregivers, at depth</a></nav>
        </div>
      </div>
      <div class="sheet-ix msheet-g" data-page-index><span class="msheet-k">In this page</span></div>
      <div class="sheet-f">
        <nav class="sheet-p" aria-label="Pages">${[['/pricing', 'Pricing'], ['/about', 'About'], ['/contact', 'Contact'], ['/privacy', 'Privacy']].map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join('')}</nav>
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

/* ── the footer: the week ─────────────────────────────────────────────── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ── the footer a phone gets instead of the week ───────────────────────
   "Aidepost, laid out as a week" is a desktop metaphor. Seven day-columns
   is seven day-columns; below 900 the grid used to restack to 2-up, keep
   all 21 links and all seven day labels, and destroy the one thing that
   made them mean anything — 1,850px of footer on every one of seven routes,
   which is 50% of /about and 55% of /contact. So the week is not reflowed:
   it is replaced, by its own branch, gated in CSS at <=900. The desktop
   week above survives byte-for-byte and so does the 901–1280 swipe strip.

   "Oregon" is dropped here and only here: its four destinations are
   Company's four, exactly — 4 of the 21 links were pure repeats. Every
   destination on the week is still one tap away in this footer.

   Order, per the spec: identity · the address · two or three disclosures ·
   social · legal (which stays outside, shared with the desktop footer). */
function phoneFoot(cfg, p, at, li) {
  const group = (title, rows) => `<details class="ft-ph-d"><summary><b>${esc(title)}</b><span class="faq-x" aria-hidden="true"></span></summary>${li(rows)}</details>`;
  return `<div class="ft-ph">
    <div class="ft-ph-id">${mark(p.id, 40, { label: false })}<b class="ft-sun-n">${esc(p.name)}</b><span class="ft-sun-d">${esc(p.descriptor)}</span></div>
    <p class="ft-w"><a href="${mailto(cfg)}">${esc(hello(cfg))}</a></p>
    <div class="ft-ph-act">
      <button class="ft-copy" type="button" data-copy="${esc(hello(cfg))}" data-copied="Address copied">${ic('copy', 18)}Copy the address</button>
      <p class="ft-note">One inbox. A person answers.</p>
    </div>
    ${group('Product', [['/providers#board', 'The board'], ['/providers#credentials', 'Credentials'], ['/providers#hours', 'Hours'], ['/providers#hiring', 'Hiring'], ['/pricing', 'Pricing']])}
    ${group('Caregivers', [['/caregivers#caregivers', 'Shifts near you'], ['/caregivers#wallet', 'Your wallet'], ['/caregivers#free', 'Free, for ever'], [at('join'), 'Join as a caregiver']])}
    ${group('Company', [['/about', 'About'], ['/contact', 'Contact'], ['/privacy', 'Privacy'], ['https://providerhub.us', 'providerhub.us']])}
    ${social(p.id, { cls: 'soc-pills', size: 16, label: 'Aidepost on social, again' })}
    ${byline(true)}
  </div>`;
}

export function footer(cfg, p, opts = {}) {
  const at = linker(opts.ids);
  const li = (rows) => `<ul class="ft-l">${rows.map(([h, t]) => `<li><a href="${esc(h)}">${esc(t)}</a></li>`).join('')}</ul>`;
  const cols = [
    ['Product', li([['/providers#board', 'The board'], ['/providers#credentials', 'Credentials'], ['/providers#hours', 'Hours'], ['/providers#hiring', 'Hiring'], ['/pricing', 'Pricing']])],
    ['Caregivers', li([['/caregivers#caregivers', 'Shifts near you'], ['/caregivers#wallet', 'Your wallet'], ['/caregivers#free', 'Free, for ever'], [at('join'), 'Join as a caregiver']])],
    ['Company', li([['/about', 'About'], ['/contact', 'Contact'], ['/privacy', 'Privacy'], ['https://providerhub.us', 'providerhub.us']])],
    ['Oregon', li([['/about', 'About Aidepost'], ['/privacy', 'Privacy'], ['/contact', 'Write to a person'], ['https://providerhub.us', 'providerhub.us']])],
    ['Write', `<p class="ft-w"><a href="${mailto(cfg)}">${esc(hello(cfg))}</a></p><button class="ft-copy" type="button" data-copy="${esc(hello(cfg))}" data-copied="Address copied">${ic('copy', 18)}Copy the address</button><p class="ft-note">One inbox. A person answers.</p>`],
    ['Social', social(p.id, { cls: 'soc-pills', size: 16, text: true, label: 'Aidepost on social' })],
    ['', `<div class="ft-sun">${mark(p.id, 80, { label: false })}<span class="ft-sun-n">${esc(p.name)}</span><span class="ft-sun-d">${esc(p.descriptor)}</span>${byline(true)}</div>`],
  ];
  return `<footer class="ft" id="foot">
    <div class="wrap">
      <div class="ft-top">
        <p class="ft-line">${ic('board', 20)}<span>Tonight is <b data-clock="day">the day</b>. <span class="ft-today"></span></span></p>
        <button class="btn sm ft-print" type="button" data-print>${ic('print', 18, { pin: false })}Print the roster</button>
      </div>
      <div class="ft-wk" role="group" aria-label="Aidepost, laid out as a week">
        ${cols.map(([title, body], i) => `<div class="ft-d${title ? '' : ' is-sun'}" data-day="${DAYS[i]}"><span class="ft-dn">${DAYS[i]}<i class="ft-tonight" aria-hidden="true">tonight</i></span>${title ? `<b class="ft-dt">${esc(title)}</b>` : ''}${body}</div>`).join('')}
      </div>
      ${phoneFoot(cfg, p, at, li)}
      <div class="ft-legal">
        <p>${esc(opts.fine || '')} ${esc(cfg.legalLine)}</p>
        <button class="ft-keys" type="button" aria-controls="keys" aria-expanded="false">${ic('keyboard', 18, { pin: false })}Keyboard shortcuts</button>
      </div>
    </div>
  </footer>`;
}
