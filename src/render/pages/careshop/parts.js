// careshop.app — the store's fittings: the aisle-strip header, the receipt
// footer, the tally bar, the ⌘K palette, and the demos every aisle shares.
// Every number a demo shows is the instrument's own (SURFACES.careshop) or
// the vault's (brand.js); nothing here invents a price, a rule or a claim.

import { esc, mark, social, byline, hello, mailto, skip, nextFloat, priceParts, chapterRail, footShell, priceCalc } from '../../shared.js';
import { SURFACES } from '../../instruments.js';
import { ic } from '../../icons/careshop.js';

const S = SURFACES.careshop;
export const screen = (key) => S.screens.find((s) => s.key === key);

/* ── what is on the shelves ───────────────────────────────────────────── */
/* the home aisles, in walk order; the "price" is what the aisle holds */
export const AISLES = [
  { id: 'loop', n: 'Aisle 1', t: 'The loop', qty: '7 stations' },
  { id: 'today', n: 'Home', t: 'Today', qty: '2 briefings' },
  { id: 'stock', n: 'Aisle 2', t: 'Stock', qty: '4 zones' },
  { id: 'queue', n: 'Aisle 3', t: 'The queue', qty: '5 origins' },
  { id: 'kitchen', n: 'Front desk', t: 'Your kitchen', qty: '1 door' },
  { id: 'pricing', n: 'Checkout', t: 'Pricing', qty: '3 plans' },
];
/* the pages, each an aisle of its own */
export const PAGES_NAV = [
  { path: 'loop', n: 'Aisle 1', t: 'The loop', qty: '6 screens', icon: 'pot' },
  { path: 'stock', n: 'Aisle 2', t: 'Stock', qty: '2 tools', icon: 'shelf' },
  { path: 'rules', n: 'Aisle 3', t: 'The rules', qty: '10 lines', icon: 'book' },
  { path: 'shelf', n: 'Aisle 4', t: 'The shelf', qty: '8 screens', icon: 'shelf' },
  { path: 'about', n: 'The store', t: 'About', qty: 'who we are', icon: 'store' },
  { path: 'write', n: 'The till', t: 'Write', qty: '1 inbox', icon: 'mail' },
];

/* ── the walk: the order a reader is offered the store in ──────────────
   Nine rooms in the order the store is laid out, so "next" always means
   one step further in, and the last step is the till. The pager at the
   foot of every page is built from this and nothing else, which is why it
   can never disagree with the drawer or the receipt. */
export const WALK = [
  ['/', 'Front of store', 'The whole store in one page'],
  ['/loop', 'Aisle 1 · The loop', 'Seven stations, six screens'],
  ['/stock', 'Aisle 2 · Stock', 'Zones, par, expiry, reserves'],
  ['/rules', 'Aisle 3 · The rules', 'Ten citations, and how sure we are'],
  ['/shelf', 'Aisle 4 · The shelf', 'All eight screens, full size'],
  ['/features', 'The aisles', 'Everything CareShop does'],
  ['/pricing', 'Checkout', 'Free, $19, $37'],
  ['/about', 'The store', 'Who makes this, and what is live'],
  ['/write', 'The till', 'Write to a person'],
  ['/privacy', 'Privacy', 'What the store holds'],
];

/* ── the next room, floating ─────────────────────────────────────────────
   The two-card previous/next block every page used to end with is gone;
   the walk now shows as one small pill at the bottom-left of the screen,
   revealed by js/site.js once the reader is well into the page. The label
   drops the aisle number: "Next · The loop" is the whole message. */
export function nextOf(here) {
  const path = here === 'home' ? '/' : `/${here}`;
  const i = WALK.findIndex(([p]) => p === path);
  const w = i >= 0 ? WALK[i + 1] : null;
  if (!w) return null;
  return { href: w[0], label: w[1].replace(/^(Aisle \d|The store|The till|Checkout|The aisles) · /, ''), gist: w[2] };
}

/* ── the aisle directory: what is on this page, and where you are ──────
   The store's own entrance board. Every stop on the page as a shelf
   ticket, in walk order, with the number the aisle strip uses. It is real
   anchors, so it works with no script; careshop.js marks the one you are
   standing in as you scroll, which is the whole reason it is here and not
   just in the drawer. */
/* Round 4. Firaol, on this board: "dont seem state of the art. so crowded,
   and so telling and doesnt follow the clean design". Every page's directory
   is now the shared chapter rail — one row, no counts or gists, a sticker
   glyph per stop, following the reader. The third column of `stops` (the
   aisle's "price") is no longer printed. */
const DIR_ICON = { loop: 'pot', today: 'clock', cook: 'pot', stock: 'shelf', queue: 'cart', shop: 'store', reserve: 'water', record: 'person', roles: 'person', kitchen: 'house', questions: 'mail', pricing: 'tag', start: 'clock', plans: 'tag', terms: 'book', counts: 'calc', shelf: 'shelf' };
const DIR_LIVE = new Set(['loop', 'today', 'stock', 'queue', 'shop', 'reserve', 'pricing']);
export function directory(stops, opts = {}) {
  if (!stops || !stops.length) return '';
  return chapterRail(stops.map(([id, name]) => ({ id, label: name, live: DIR_LIVE.has(id), icon: ic(DIR_ICON[id] || 'tag', 16) })), { label: opts.label || 'On this page', tail: opts.tail });
}

const prefix = (page) => (page === 'home' ? '' : '/');

/* ── THE EIGHT SCREENS, NAMED ONCE ─────────────────────────────────────
   surfaces.careshop carries `nav` for each screen — the tab it lives
   under — and on this product that is Shop, Cook, Stock, Stock, Cook,
   Shop, Today, Today: eight screens wearing four names, twice each. A
   strip labelled that way is a strip you cannot navigate. These are the
   names the screens actually have, and they are written here, once, so
   the film strip, the palette and the drawer can never drift apart.
   [key, the name, what it is for] — every word of it read from the
   screen's own title and sub in render/instruments.js. */
export const SHELF_TABS = [
  ['buy', 'Buy queue', 'what the house is short, and who approved it'],
  ['menu', 'The week’s menu', 'checked against who lives here'],
  ['expiry', 'Expiry Watch', 'most urgent first, money at the foot'],
  ['stock', 'Zones', 'pantry, fridge, freezer, reserve'],
  ['cook', 'Cook mode', 'today’s prep, and the allergen check'],
  ['shop', 'In the shop', 'aisle order, priced by store'],
  ['today', 'Today · a caregiver', 'one house, one shift'],
  ['today-mgr', 'Today · a manager', 'every house, rolled up'],
];

/* ── the header: the aisle strip ──────────────────────────────────────── */
export function header(cfg, p, opts = {}) {
  const page = opts.page || 'home';
  const home = page === 'home';
  const signs = home
    ? AISLES.map((a, i) => `<a class="sign" href="#${a.id}" data-aisle="${i + 1}"><span class="sign-a">${esc(a.n || 'Aisle')}</span><span class="sign-t">${esc(a.t)}</span></a>`).join('')
    : [`<a class="sign is-front" href="/"><span class="sign-a">Front</span><span class="sign-t">Home</span></a>`, ...PAGES_NAV.map((a, i) => `<a class="sign" href="/${a.path}" data-aisle="${i + 1}" ${a.path === page ? 'aria-current="page"' : ''}><span class="sign-a">${esc(a.n || 'Aisle')}</span><span class="sign-t">${esc(a.t)}</span></a>`)].join('');
  const where = home ? 'Front of store' : (PAGES_NAV.find((a) => a.path === page) || { t: opts.title || 'Aisle' }).t;
  return `<header class="aisle" id="top-bar" data-page="${esc(page)}" data-here="${esc(where)}">
  <div class="aisle-meter" data-progress aria-hidden="true"><i></i></div>
  <div class="wrap aisle-in">
    <a class="brand" href="/" aria-label="${esc(p.name)} — home">${mark(p.id, 28, { label: false })}<span class="brand-n">${esc(p.name)}</span></a>
    <nav class="strip" id="aisles" aria-label="Aisles" ${home ? 'data-spy' : ''} data-scrollx>${signs}</nav>
    <div class="aisle-r">
      <button class="kbtn" type="button" aria-controls="palette" aria-expanded="false" aria-label="Search" data-focus=".pal-in" data-label-open="Search" data-label-close="Close search">${ic('search', 18)}</button>
      <a class="signin" href="${esc(cfg.signIn.href)}">${esc(cfg.signIn.label)}</a>
      <button class="cord" type="button" data-mode-toggle aria-pressed="false" aria-label="Lights: switch between light and dark" data-theme-light="${esc(cfg.og.bg)}" data-theme-dark="#1b1613">${ic('cord', 18)}<span class="cord-pull" aria-hidden="true"></span></button>
      <a class="btn pri tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="nav"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.nav)}</a>
      <button class="tally" type="button" aria-controls="drawer" aria-expanded="false" aria-label="Aisles — open the menu" data-lock data-focus=".drawer-close" data-label-open="Aisles — open the menu" data-label-close="Aisles — close the menu">${ic('basket', 22)}<span class="tally-l">Aisles</span><span class="tally-n" aria-hidden="true">${AISLES.length + PAGES_NAV.length}</span></button>
    </div>
  </div>
</header>
${drawer(cfg, p, page)}`;
}

/* the receipt drawer — the phone's menu, printed as a till slip */
function drawer(cfg, p, page) {
  /* Round 4 (Firaol: "dont need the reciept thing"): the phone menu is a
     plain sheet now — the store's mark and name, this page's sections (filled
     by site.js pageIndex from the fold gists), the pages, and the two doors
     in. Same #drawer, same tally button, same close. */
  const row = (href, label, gist = '', cur = false) => `<a class="msheet-r" href="${esc(href)}"${cur ? ' aria-current="page"' : ''}><span><b>${esc(label)}</b>${gist ? `<small>${esc(gist)}</small>` : ''}</span></a>`;
  return `<div class="drawer" id="drawer" hidden>
    <div class="drawer-scrim" data-close aria-hidden="true"></div>
    <div class="drawer-sheet cs-sheet" role="dialog" aria-label="Menu">
      <button class="drawer-close" type="button" data-close aria-label="Close the menu">${ic('close', 22)}</button>
      <div class="cs-sheet-h">${mark(p.id, 34, { label: false })}<span><b>${esc(p.name)}</b><small>${esc(p.descriptor)}</small></span></div>
      <nav aria-label="Sections">
        <div class="msheet-g" data-page-index data-open-all="Open every section"><p class="msheet-k">On this page</p></div>
        <div class="msheet-g"><p class="msheet-k">Pages</p>${PAGES_NAV.map((a) => row(`/${a.path}`, a.t, '', a.path === page)).join('')}${row('/privacy', 'Privacy', '', page === 'privacy')}</div>
      </nav>
      <div class="cs-sheet-a"><a class="btn pri" href="${esc(cfg.cta.primaryHref)}" data-cta="drawer">${esc(cfg.cta.primary)}</a><a class="btn" href="${esc(cfg.signIn.href)}">Sign in</a></div>
    </div>
  </div>`;
}

/* ── the footer ─────────────────────────────────────────────────────────
   Round 4. Firaol, on the till receipt: "change the design. too cheesey,
   dont need the reciept thing." The shared footer shell, in the store's own
   paper and sage: the address that copies and opens mail, three groups
   with room to breathe, one quiet live line, the byline and the legal
   line, and the name across the foot. */
export function footer(cfg, p, opts = {}) {
  const page = opts.page || 'home';
  const next = nextOf(page);
  const motif = `<a class="cs-live" href="${esc(cfg.signIn.href)}"><i aria-hidden="true"></i><span>Live at careshop.app</span><b>Sign in</b></a>`;
  return `${footShell(cfg, p, {
    cls: 'cs-foot',
    note: 'One inbox. A person answers, usually the same day.',
    motif,
    groups: [
      { title: 'The product', links: [['/loop', 'The loop'], ['/stock', 'Stock'], ['/shelf', 'All eight screens'], ['/features', 'Features'], ['/pricing', 'Pricing']] },
      { title: 'The company', links: [['/about', 'About'], ['/rules', 'The rules'], ['/write', 'Write to a person'], ['/privacy', 'Privacy']] },
      { title: 'Get started', links: [[cfg.cta.primaryHref, 'Start free'], [cfg.signIn.href, 'Sign in'], ['/#today', 'See Today']] },
    ],
  })}
${tallyBar(cfg, p, page)}
${palette(cfg, page)}
${next ? nextFloat(next) : ''}`;
}

/* ── the bottom tally bar, phones only ────────────────────────────────── */
function tallyBar(cfg, p, page) {
  const where = page === 'home' ? 'Front of store' : (PAGES_NAV.find((a) => a.path === page) || { t: page === 'privacy' ? 'Privacy' : 'Aisle' }).t;
  /* THE DOCK IS THE ONLY PERSISTENT WAYFINDING ON A PHONE, so the thing it
     names is also the thing you can hand to somebody. "You are in" is a
     button now: press it and the address of the aisle you are standing in
     is on the clipboard — the page, the hash, the lot. careshop.js keeps
     data-copy in step with the label as you scroll, and the shared
     [data-copy] verb reads the attribute at the moment of the press, so
     the two can never disagree. With no script it is still a button and
     still copies: the page's own URL, which is the honest fallback. */
  return `<div class="tally-bar" id="tally-bar" role="region" aria-label="Where you are">
  <a class="tb-store" href="/" aria-label="${esc(p.name)} — home">${mark(p.id, 30, { label: false })}</a>
  <button type="button" class="tb-where" data-here-copy data-copy="https://${esc(cfg.domain)}${page === 'home' ? '' : `/${esc(page)}`}" data-copied="Link to this aisle copied"><span class="tb-l">You are in${ic('copy', 13)}</span><b class="tb-a" data-where aria-live="polite">${esc(where)}</b></button>
  <a class="btn pri sm tb-cta" href="${esc(cfg.cta.primaryHref)}" data-cta="tally">${esc(cfg.cta.nav)}</a>
</div>`;
}

/* ── ⌘K: the product's verbs ──────────────────────────────────────────── */
function palette(cfg, page) {
  const pre = prefix(page);
  const rows = [
    ['Scan an item', `${pre}#top`, 'barcode', 'the hero phone'],
    ['Open Today', `${pre}#today`, 'clock', 'the first screen'],
    ['Approve the queue', `${pre}#queue`, 'check', 'Aisle 3'],
    ['Make the shopping list', `${pre}#queue`, 'cart', 'Aisle 3'],
    ['Cook this', `${pre}#cook`, 'pot', 'the kitchen'],
    ['Set a par', `${pre}#stock`, 'scale', 'Aisle 2'],
    ['Work out the reserve', '/stock', 'water', 'Aisle 2, in depth'],
    ['Walk the loop', '/loop', 'arrow', 'seven stations'],
    ['Read the rules', '/rules', 'book', 'ten citations, explained'],
    ['Who makes this', '/about', 'store', 'About CareShop'],
    ['Write to a person', '/write', 'mail', 'one inbox'],
    ['Sign in', cfg.signIn.href, 'house', 'careshop.app/login'],
    ['Start free', cfg.cta.primaryHref, 'tag', 'no card to begin'],
  ];
  /* THE VERBS GET YOU WORKING; THE AISLES GET YOU AROUND. The palette used
     to hold thirteen things CareShop does and no way to reach the nine
     rooms it does them in, so a reader who knew the name of a page still
     had to close it and hunt the receipt. Every room in the walk is a row
     now, and every screen on the shelf is a row under it — one field,
     three kinds of destination, filtered by the same typing. */
  /* NO GLYPH ON THESE TWENTY-SIX ROWS, and the reason is bytes. A CareShop
     icon is a solid label with an even-odd cut-out — about 480 bytes of
     path each, inline, on every one of the ten routes. Thirteen verbs
     carry one because a verb is a thing you do and the sticker says which
     tool. A room and a screen are destinations in a list, and a list of
     destinations is read by its names: they take a dot in the store's
     mono, which is 34 bytes and is also the mark the receipt uses. */
  const rooms = WALK.filter(([href]) => href !== (page === 'home' ? '/' : `/${page}`))
    .map(([href, name, note]) => [name, href, '', note]);
  const screens = SHELF_TABS.map(([key, name, note]) => [name, `/shelf#shelf-${key}`, '', note]);
  return `<div class="pal" id="palette" hidden>
  <div class="pal-scrim" data-close aria-hidden="true"></div>
  <div class="pal-box" role="dialog" aria-label="Command palette">
    <label class="pal-q"><span class="sr-only">Type a verb</span>${ic('search', 20)}<input class="pal-in" type="text" placeholder="Type a verb — scan, approve, cook…" autocomplete="off" spellcheck="false"><kbd>esc</kbd></label>
    <ul class="pal-l" role="list">${[['VERBS', rows], ['AISLES', rooms], ['SCREENS', screens]].map(([h, set]) => `<li class="pal-h" aria-hidden="true">${esc(h)}</li>${set.map(([t, href, icon, note]) => `<li><a class="pal-r" href="${esc(href)}" data-verb="${esc(t.toLowerCase())}">${icon ? ic(icon, 18) : '<span class="pal-b" aria-hidden="true">&middot;</span>'}<span class="pal-t">${esc(t)}</span><span class="pal-n">${esc(note)}</span></a></li>`).join('')}`).join('')}</ul>
    <p class="pal-empty" hidden>No verb by that name. The receipt at the foot lists every aisle.</p>
  </div>
</div>`;
}

/* ── a sub-page body: skip, header, main, footer ──────────────────────── */
export const page = (cfg, p, slug, inner) => `${skip()}
${header(cfg, p, { page: slug })}
<main id="main" class="page face canvas pg pg-${esc(slug)}" data-product="careshop" data-mode="light">
${inner}
</main>
${footer(cfg, p, { page: slug })}`;

/* a page's opening: eyebrow sticker, h1, lede */
export const pageHead = (n, title, lede, extra = '') => `<section class="hero pg-hero" id="top" aria-labelledby="h1">
  <div class="wrap pg-hero-in">
    <div class="pg-hero-t"><span class="sticker">${ic('tag', 16)}${esc(n)}</span><h1 id="h1">${esc(title)}</h1></div>
    <p class="lede">${esc(lede)}</p>
    ${extra}
  </div>
</section>`;

/* ── small furniture ──────────────────────────────────────────────────── */
/* one sticker per seat: the licence holder's key, the manager's clipboard,
   the caregiver's scan, the buyer's cart, the link a spouse opens, and the
   operator's wrench. Six cards, six different people at a glance. */
export const ROLE_ICON = { provider: 'key', manager: 'clipboard', caregiver: 'scan', buyer: 'cart', 'no account': 'link', operator: 'wrench' };
export const roleIcon = (name) => `<span class="role-i">${ic(ROLE_ICON[String(name).toLowerCase()] || 'person', 24)}</span>`;
export const sticker = (icon, text, cls = '') => `<span class="sticker ${cls}">${ic(icon, 16)}${esc(text)}</span>`;
export const chip = (state, text) => `<span class="st" data-state="${esc(state)}"><i aria-hidden="true"></i>${esc(text)}</span>`;

/* ── the demos ─────────────────────────────────────────────────────────── */

/* the par slider: a shelf row whose par you set; short → a request appears */
export function parDemo() {
  const row = screen('stock').rows[0]; // Rice · 10 lb, Par 3 · on hand 1
  return `<div class="demo par" data-par data-hand="1">
    <div class="demo-h">${sticker('scale', 'Par')}<span class="demo-t">Set the par. The shelf answers.</span></div>
    <div class="shelf-row">
      <span class="shelf-t"><b>${esc(row.t)}</b><span>on hand <output data-par-hand>1</output></span></span>
      <span class="st" data-state="short" data-par-state><i aria-hidden="true"></i><span data-par-text>2 below par</span></span>
    </div>
    <label class="range"><span class="range-l">Par <output data-par-out>3</output></span><input type="range" min="0" max="6" step="1" value="3" data-par-range aria-label="Par for Rice, 10 lb"></label>
    <div class="mini-q" aria-live="polite">
      <span class="mini-q-h">${ic('cart', 14)}In the queue</span>
      <ul data-par-queue><li class="mini-q-r"><b>${esc(row.t)}</b><span>Par breach · 2 below par</span></li></ul>
      <p class="mini-q-empty" hidden>Nothing from this shelf. At or above par, nothing to do.</p>
    </div>
    <p class="demo-f">Par is the one number you set. On hand moves through the record.</p>
  </div>`;
}

/* approve the queue: rows that move Pending → Approved → In cart → Bought */
export function approveDemo() {
  const rows = screen('buy').rows.filter((r) => r.stage === 'Pending' || r.stage === 'Approved').slice(0, 3);
  return `<div class="demo appr" data-approve>
    <div class="demo-h">${sticker('check', 'Approve')}<span class="demo-t">Move a line along.</span><span class="stamp" data-approve-stamp aria-live="polite">0 approved by you</span></div>
    <ul class="q-rows">${rows.map((r) => `<li class="q-row" data-stage="${esc(r.stage)}">
      <span class="q-main"><b>${esc(r.item)}</b><span>${esc(r.origin)} · asked by ${esc(r.asked)}</span></span>
      <span class="q-stage" data-stage-label>${esc(r.stage)}</span>
      <button type="button" class="q-btn" data-approve-btn>${ic('arrow', 16)}<span>${r.stage === 'Pending' ? 'Approve' : 'To cart'}</span></button>
    </li>`).join('')}</ul>
    <p class="demo-f">${esc(screen('buy').foot)}</p>
  </div>`;
}

/* the allergen chips: Room 3's tags drive the Thursday warning on the menu */
export function allergenDemo() {
  const m = screen('menu');
  const room3 = m.tags.find(([r]) => r === 'Room 3');
  const tags = room3[1].split(' · ');
  return `<div class="demo allg" data-allergen>
    <div class="demo-h">${sticker('nut', 'Allergens')}<span class="demo-t">${esc(room3[0])}’s tags. Toggle one and watch Thursday.</span></div>
    <div class="chips" role="group" aria-label="Room 3 allergen tags">${tags.map((t) => `<button type="button" class="chip" aria-pressed="true" data-tag="${esc(t)}">${ic('nut', 14)}${esc(t)}</button>`).join('')}</div>
    <p class="allg-note" data-allergen-note aria-live="polite" data-on="${esc(m.warn)}" data-off="Thursday · peanut noodles. Nobody on this menu carries a peanut tag, so the line is quiet. Put the tag back and the warning returns. It warns, it never prevents.">${esc(m.warn)}</p>
  </div>`;
}

/* the reserve calculator: days × beds × per-bed-per-day, with a unit toggle */
export function reserveDemo() {
  return `<div class="demo resv" data-reserve data-unit="gal">
    <div class="demo-h">${sticker('water', 'Reserve')}<span class="demo-t">Days × beds × per bed per day.</span>
      <span class="unit" role="group" aria-label="Unit"><button type="button" class="unit-b" aria-pressed="true" data-unit-set="gal">gal</button><button type="button" class="unit-b" aria-pressed="false" data-unit-set="l">L</button></span></div>
    <div class="resv-in">
      <label class="num"><span>Days</span><input type="number" inputmode="numeric" min="1" max="30" value="3" data-r="days"></label>
      <span class="num-x" aria-hidden="true">×</span>
      <label class="num"><span>Licensed beds</span><input type="number" inputmode="numeric" min="1" max="60" value="5" data-r="beds"></label>
      <span class="num-x" aria-hidden="true">×</span>
      <label class="num"><span>Per bed per day (<span data-unit-l>gal</span>)</span><input type="number" inputmode="decimal" min="0" step="0.5" value="1" data-r="per"></label>
    </div>
    <dl class="resv-out" aria-live="polite">
      <div><dt>Target</dt><dd><b data-r-target>15</b> <span data-unit-l>gal</span></dd></div>
      <div><dt>On hand</dt><dd><b data-r-hand>6</b> <span data-unit-l>gal</span></dd></div>
      <div class="is-gap"><dt>Gap</dt><dd><b data-r-gap>9</b> <span data-unit-l>gal</span> <span class="st" data-state="short" data-r-state><i aria-hidden="true"></i><span data-r-state-t>Gap · files into the queue</span></span></dd></div>
    </dl>
    <p class="demo-f">The bed count is typed by a person, never derived. On hand comes from the last count.</p>
  </div>`;
}

/* price memory: tap a shelf item to see the ledger's last price */
export function priceDemo() {
  const items = screen('buy').rows.map((r) => {
    const [store, price] = r.store.split(' · ');
    return { t: r.item, store, price };
  });
  return `<div class="demo pm" data-price-memory>
    <div class="demo-h">${sticker('tag', 'Price memory')}<span class="demo-t">Tap a shelf item.</span></div>
    <ul class="shelf-l" role="list">${items.map((it, i) => `<li><button type="button" class="shelf-b" aria-expanded="false" aria-controls="pm-${i}" data-pm>${ic('tag', 16)}<span>${esc(it.t)}</span></button>
      <div class="pm-pop" id="pm-${i}" hidden><b>Last paid ${esc(it.price)} at ${esc(it.store)}</b><span>An item with no history shows no price, never a guess.</span></div></li>`).join('')}</ul>
    <p class="demo-f">Every purchase records a price at that shop on that date. Nothing is overwritten.</p>
  </div>`;
}

/* the store picker: re-total the shopping list by what the ledger knows at each shop */
export function storeDemo() {
  const sh = screen('shop');
  /* one line per aisle — three rows are enough to re-total, and the card
     stays at a working size beside the text */
  const lines = [];
  for (const [aisle, items] of sh.aisles) {
    const [t, price] = items[0];
    const at = price.match(/at (.+)$/);
    lines.push({ aisle, t, price: price.replace(/ at .+$/, ''), store: at ? at[1] : 'WinCo' });
  }
  const stores = ['WinCo', 'Costco', 'Fred Meyer'];
  const known = (s) => lines.filter((l) => l.store === s);
  return `<div class="demo sp" data-stores>
    <div class="demo-h">${sticker('store', 'Store')}<span class="demo-t">Pick the shop. The list re-totals.</span></div>
    <div class="chips" role="group" aria-label="Store">${stores.map((s, i) => `<button type="button" class="chip" aria-pressed="${i === 0 ? 'true' : 'false'}" data-store="${esc(s)}">${ic('store', 14)}${esc(s)}<span class="chip-n">${known(s).length}</span></button>`).join('')}</div>
    <ul class="sp-l" role="list">${lines.map((l) => `<li class="sp-r" data-store-of="${esc(l.store)}" data-price="${esc(l.price.replace('$', ''))}"><span class="sp-a">${esc(l.aisle.split(' · ')[0])}</span><span class="sp-t">${esc(l.t)}</span><span class="sp-p" data-sp-price>${esc(l.price)}</span><span class="sp-none">no price at this shop</span></li>`).join('')}</ul>
    <div class="sp-total"><span>Total at <b data-sp-store>WinCo</b></span><b data-sp-total>$0.00</b><span class="sp-note" data-sp-note></span></div>
  </div>`;
}

/* expiry watch: a ladder you can sort by urgency or by value */
export function ladderDemo() {
  const rows = screen('expiry').ladder.filter(([, , v]) => v !== '—');
  return `<div class="demo lad" data-ladder>
    <div class="demo-h">${sticker('clock', 'Expiry Watch')}<span class="demo-t">Most urgent first, or most money first.</span>
      <span class="sortb" role="group" aria-label="Sort"><button type="button" class="unit-b" aria-pressed="true" data-sort="urgency">${ic('clock', 14)}Urgency</button><button type="button" class="unit-b" aria-pressed="false" data-sort="value">${ic('tag', 14)}Value</button></span></div>
    <ul class="lad-l" role="list">${rows.map(([t, days, val, state]) => `<li class="lad-r" data-days="${days}" data-val="${esc(val.replace('$', ''))}">
      <span class="lad-t">${esc(t)}</span>
      <span class="lad-bar" aria-hidden="true"><i style="--w:${Math.max(8, Math.min(100, 100 - Number(days) * 9))}%"></i></span>
      ${chip(state, `${days} ${Number(days) === 1 ? 'day' : 'days'}`)}
      <span class="lad-v">${esc(val)}</span>
    </li>`).join('')}</ul>
    <p class="demo-f">${esc(screen('expiry').risk)}</p>
  </div>`;
}

/* cook mode: complete step four and the shelf goes down, once */
export function cookDemo() {
  const c = screen('cook');
  return `<div class="demo cook-d" data-cook>
    <div class="demo-h">${sticker('pot', 'Cook mode')}<span class="demo-t">${esc(c.sub)}</span></div>
    <ol class="cook-steps">${c.steps.map(([n, t, d, st]) => `<li class="cook-s" data-state="${esc(st)}" data-step="${n}"><span class="cook-n">${n}</span><span class="cook-t"><b>${esc(t)}</b><span>${esc(d)}</span></span>${n === '4' ? `<button type="button" class="q-btn" data-cook-complete>${ic('check', 16)}<span>Complete</span></button>` : ''}</li>`).join('')}</ol>
    <div class="shelf-line" aria-live="polite">
      <span class="mini-q-h">${ic('shelf', 14)}On the shelf</span>
      <span class="shelf-it"><b>Rice</b><b class="shelf-n" data-shelf="rice" data-name="rice" data-unit="cups" data-start="14" data-take="2">14</b><span>cups</span></span>
      <span class="shelf-it"><b>Chicken thighs</b><b class="shelf-n" data-shelf="chicken" data-name="chicken thighs" data-unit="lb" data-start="5" data-take="3">5</b><span>lb</span></span>
    </div>
  </div>`;
}

/* the printable shopping list — hidden on screen, the whole page in print */
export function printList(cfg) {
  const sh = screen('shop');
  return `<section class="print-list" aria-label="The shopping list, for print">
    <h2 class="pl-h">${esc(sh.title)} — ${esc(sh.sub)}</h2>
    ${sh.aisles.map(([a, items]) => `<h3 class="pl-a">${esc(a)}</h3><ul class="pl-l">${items.map(([t, price, st]) => `<li><span class="pl-ck" aria-hidden="true">${st === 'picked' ? '☒' : '☐'}</span>${esc(t)}<span class="pl-p">${esc(price)}</span></li>`).join('')}</ul>`).join('')}
    <p class="pl-f">${esc(sh.total)} · ${esc(cfg.domain)}</p>
  </section>`;
}

/* a till receipt drawn as the product writes one: the moment stock rises */
export function receiptInstrument() {
  const sh = screen('shop');
  const picked = [];
  for (const [, items] of sh.aisles) for (const [t, price, st] of items) if (st === 'picked') picked.push([t, price]);
  return `<div class="rc rc-inst" role="img" aria-label="A closed run: the receipt that writes the ledger">
    <div class="rc-top"><b class="rc-store">WINCO RUN · CLOSED</b><span class="rc-meta">3 PICKED · 2 LEFT IN THE QUEUE</span></div>
    <div class="rc-lines">${picked.map(([t, pr]) => `<span class="rc-l"><span>${esc(t.toUpperCase())}</span><i aria-hidden="true"></i><b>${esc(pr)}</b></span>`).join('')}</div>
    <div class="rc-tear" aria-hidden="true"></div>
    <div class="rc-sum"><span class="rc-l is-total"><span>PICKED</span><i aria-hidden="true"></i><b>$15.76</b></span>
    <span class="rc-l"><span>LEDGER</span><i aria-hidden="true"></i><b>3 PURCHASE MOVEMENTS</b></span>
    <span class="rc-l"><span>PRICES</span><i aria-hidden="true"></i><b>3 · WINCO · TODAY</b></span></div>
    <p class="rc-thanks">STOCK ROSE ONCE. ANYTHING UNTICKED WENT BACK TO THE QUEUE.</p>
  </div>`;
}

/* a "show me" chip: lights the matching row on the phone beside it */
export const showMe = (text, label = text) => `<button type="button" class="show" data-show="${esc(text)}">${ic('pin', 14)}<span>${esc(label)}</span></button>`;

/* ── the three price tags, shared by the front page and /pricing ────────── */
const PLAN_LINES = {
  Free: ['One house', 'Up to three people', 'Every screen, every plan'],
  Pro: ['Up to five houses', 'Unlimited people', 'Every screen, every plan'],
  Scale: ['Unlimited houses', 'Spend across houses', 'Catalogue import and copying'],
};
/* Round 4. Firaol, on the three equal price tags: "change." One stepper
   sets your houses; each plan prints its month for that many, and the one
   that fits your count is marked — Free for one house, Pro up to five,
   Scale beyond. Every price is brand.js's. */
export function tierCards(cfg, p, opts = {}) {
  const cta = { href: cfg.cta.primaryHref, label: 'Start free' };
  return priceCalc(p, {
    id: opts.id || 'pc-cs', cls: 'pc-cs', start: 1, max: 12,
    fit: { Free: '1-1', Pro: '2-5', Scale: '6-' },
    main: 'Pro', mainLabel: 'Most houses',
    unitNote: { Free: 'One house · three people · no card' },
    cta: { Free: cta, Pro: { href: cfg.cta.primaryHref, label: 'Start with Pro' }, Scale: { href: cfg.cta.primaryHref, label: 'Start with Scale' } },
  });
}

