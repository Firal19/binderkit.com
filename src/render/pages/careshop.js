// careshop.app — the store.
//
// The one live product in the family, so the site is a kitchen and a grocery
// run: an aisle strip for a header, hanging signs for navigation, sticker
// icons, a till receipt for a footer. Drawn in the live application's own
// materials — paper, ink, sage, terracotta, Fraunces and Hanken Grotesk — and
// every button goes to careshop.app. The phones fan out at the top; the loop
// is a ring that turns as the stations beside it scroll past; every screen
// on the page is doing work. Rewritten 2026-09-23 to Firaol's review: short
// copy, compact demos, no confession, no sibling product anywhere.

import { esc, faq, sec, h2, skip, reach } from '../shared.js';
import { iosShell, screenSwitch } from '../instruments.js';
import { PAGES } from '../../data/page.js';
import { ic } from '../icons/careshop.js';
import { header, footer, sticker, roleIcon, screen, parDemo, approveDemo, allergenDemo, reserveDemo, priceDemo, storeDemo, ladderDemo, cookDemo, printList, directory, tierCards } from './careshop/parts.js';
import { loopPage } from './careshop/loop.js';
import { stockPage } from './careshop/stock.js';
import { rulesPage } from './careshop/rules.js';
import { aboutPage } from './careshop/about.js';
import { writePage } from './careshop/write.js';
import { featuresPage } from './careshop/features.js';
import { pricingPage } from './careshop/pricing.js';
import { shelfPage } from './careshop/shelf.js';

export { header, footer };

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

/* ── four facts about how the product is built ─────────────────────────
   Not readings off a sample house and not a customer count: each one is a
   thing a reader can open the product and check on day one. */
const STATS = [
  ['$', '0', 0, 'to start', 'One house, three people, every screen. No card.'],
  ['', '5', 0, 'origins for a buy request', 'A menu shortfall, an expiry, a par breach, a reserve gap, or a diet tag. No sixth.'],
  ['', '6', 0, 'front doors, one list', 'The shelf, the scanner, Today, an import, the catalogue, the system.'],
  ['', '10', 0, 'Oregon citations, explained', 'In one line each, inside the product, beside the shelf they govern.'],
];

/* the seven stations on the ring, each a link to the aisle it lives in.
   One line each: the row is 321px of text at 1024, which is 48 characters
   of this face, so every note here is under that. */
export const RING = [
  ['Count', 'stock', 'Zone by zone. Each item keeps its last count.'],
  ['Queue', 'queue', 'Only what to buy, each line with its origin.'],
  ['Approve', 'queue', 'Auto under your threshold, a manager above it.'],
  ['Shop', 'queue', 'In that shop’s aisle order. Works with no signal.'],
  ['Receipt', 'queue', 'Close the run: stock and prices go back, once.'],
  ['Stock', 'stock', 'Never typed. Every change is a movement.'],
  ['Cook', 'cook', 'Complete, and stock goes down. Once.'],
];

/* ── the entrance board ───────────────────────────────────────────────
   Every stop on the front page, in walk order, with the shortest true
   name. Real anchors, so it works with no script; careshop.js marks the
   one you are standing in as you scroll. */
export const HOME_STOPS = [
  ['today', 'What to cook'],
  ['queue', 'Buying'],
  ['shop', 'In the shop'],
  ['stock', 'Stock'],
  ['loop', 'The loop'],
  ['reserve', 'Reserves'],
  ['record', 'Residents'],
  ['roles', 'Who uses it'],
  ['kitchen', 'Sign in'],
  ['questions', 'Questions'],
  ['pricing', 'Pricing'],
  ['start', 'First ten minutes'],
];

const TILES = {
  today: { t: 'Today', d: 'The first screen after sign-in. Restock, expiry, dinner: what the house needs.', tag: 'Two briefings · one day' },
  stock: { t: 'Stock, by zone', d: 'Pantry, fridge, freezer, reserve, in the order you walk the house. On hand is never typed.', tag: 'Scan · count · par' },
  queue: { t: 'The queue', d: 'What to buy and nothing else. Each line says where it came from and the last price at the cheapest shop.', tag: 'Your purchasing rules' },
  cook: { t: 'Cook mode', d: 'Today’s prep, timers in the steps, the allergen check before plating. Complete, and stock goes down once.', tag: 'Tray notes drawn, never stored' },
  shop: { t: 'Shopping mode', d: 'An aisle-ordered list, priced by store. A pick becomes Purchased with the real shop and the real cost.', tag: 'Works with no signal' },
};

const KIT_KEYS = [
  ['One-time credentials', 'Caregivers get a username and password from an admin. No public sign-up for staff.'],
  ['Seeded on day one', 'The catalogue, the first house and the default zones are there before you add an item.'],
  ['On the phone', 'Installs on iOS and Android. Picks queue offline and never count twice.'],
];

/* a phone in a wrapper the page can scale, with a name for the reader */
const phone = (key, cls = '', opts = {}) => `<div class="ph ${cls}" data-phone="${esc(key)}">${iosShell('careshop', { key, ...opts })}</div>`;

/* ── the fold: an aisle the reader walks into rather than past ──────────
   Below 640 the store opens as an index. `sec()` lives in render/shared.js
   and takes no attribute bag, so the two attributes the shared folds()
   controller reads are stamped onto the section it returns. Nothing is
   removed from the HTML: with scripting off, on a printer, or above 640px,
   every one of these sections is open and whole. The third argument is the
   dock's name for the section, which careshop.js spies as data-stop. */
const fold = (html, gist, stop) =>
  html.replace('<section class="sec ', `<section data-phone="fold" data-gist="${esc(gist)}"${stop ? ` data-stop="${esc(stop)}"` : ''} class="sec `);
const named = (html, stop) =>
  html.replace('<section class="sec ', `<section data-stop="${esc(stop)}" class="sec `);

/* ── the hero: the headline, the fan, the scanner ─────────────────────── */
function hero(cfg, p) {
  const fanKeys = [['today', 'is-l'], ['stock', 'is-c'], ['buy', 'is-r']];
  return `<section class="hero" id="top" aria-labelledby="h1">
    <div class="hero-wash" aria-hidden="true"></div>
    <div class="wrap hero-in">
      <div class="hero-t">
        ${sticker('store', 'Live at careshop.app · Oregon care homes', 'is-live')}
        <h1 id="h1">${esc(p.headline.text)}</h1>
        <p class="lede">${esc(p.lede)}</p>
        <div class="ctas">
          <a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="hero"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a>
          <a class="btn lg" href="#today">${ic('clock', 18)}${esc(cfg.cta.secondary)}</a>
          <a class="signin-l" href="${esc(cfg.signIn.href)}">Already on CareShop? Sign in</a>
        </div>
        <p class="fine">Free to start. One house, three people, no card. Installs on iOS and Android.</p>
      </div>
      <div class="hero-v">
        <div class="fan" data-fan data-scroll-p aria-hidden="true">
          ${fanKeys.map(([k, cls]) => `<div class="fan-p ${cls}" data-fan-p>${phone(k)}${k === 'stock' ? scanner() : ''}</div>`).join('')}
        </div>
        <div class="fan-ui">
          <div class="fan-dots" data-fan-dots role="group" aria-label="Which phone"></div>
          <button type="button" class="scan-btn" data-scan-again>${ic('barcode', 16)}Scan again</button>
        </div>
      </div>
    </div>
  </section>`;
}

/* the barcode scanner card that lands an item on the shelf list */
function scanner() {
  return `<div class="scan" data-scan>
    <div class="scan-card">
      <span class="scan-h">${ic('barcode', 14)}Scanning</span>
      <span class="scan-code">${'<i></i>'.repeat(60)}</span>
      <span class="scan-line"></span>
      <span class="scan-r">0 41220 19624 0</span>
    </div>
    <div class="scan-found"><span class="st" data-state="stocked"><i></i>Found</span><b>Oat milk · 1 gal</b><span>a barcode and a typed name, nothing else required</span></div>
  </div>`;
}

/* ── the numbers band ─────────────────────────────────────────────────── */
const stats = () => sec('numbers', 'numbers', `<div class="wrap"><ul class="stats">${STATS.map(([pre, n, dec, l, d]) => `<li><span class="stat-n">${pre}<span data-count="${esc(n)}" data-dec="${dec}">${esc(n)}</span></span><span class="stat-l">${esc(l)}</span><span class="stat-d">${esc(d)}</span></li>`).join('')}</ul></div>`, { label: 'Four numbers' });

/* ── the loop: a ring that turns as the stations beside it scroll ────────
   The ring is sticky in the right column and turns with the section's own
   scroll progress; the station under the pointer lights on the ring and in
   the list, and each ring node is a link to its station row. */
function loop() {
  const s = find('loop');
  const n = RING.length, R = 148, cx = 190, cy = 190;
  const pts = RING.map(([label], i) => { const a = (-90 + (360 / n) * i) * Math.PI / 180; return { label, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), i }; });
  const svg = `<svg class="ring" viewBox="0 0 380 380" aria-hidden="true" focusable="false">
    <g class="ring-rot">
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 7" opacity=".5"/>
      ${pts.map((pt) => `<a class="ring-n" href="#station-${pt.i + 1}" data-ring="${pt.i}" tabindex="-1"><circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="29"/><text x="${pt.x.toFixed(1)}" y="${(pt.y + 4.5).toFixed(1)}" text-anchor="middle">${esc(pt.label)}</text></a>`).join('')}
    </g>
    <path class="ring-ptr" d="M190 1l6 10h-12z"/>
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="ring-c">the loop</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="ring-s" data-ring-station>closes by itself</text>
  </svg>`;
  return sec('loop', 'loop', `<div class="wrap loop-g">
    <div class="loop-t">
      ${sticker('pot', 'Aisle 1 · the organising idea')}
      ${h2('loop', s.heading, s.sub)}
    </div>
    <div class="loop-v" data-ring-wrap data-scroll-p="parent">${svg}</div>
    <ol class="stations" data-stations>${RING.map(([label, target, note], i) => `<li id="station-${i + 1}" data-station="${i}"><b>${esc(label)}</b><span>${esc(note)}</span><a class="st-go" href="#${esc(target)}" aria-label="${esc(label)} — see the aisle">${ic('arrow', 14)}</a></li>`).join('')}</ol>
    <a class="more loop-more" href="/loop">${ic('arrow', 16)}Walk the whole loop, station by station</a>
  </div>`);
}

/* ── ROUND 4 · the story, told by the product itself ─────────────────────
   Firaol: "the pain of the caregiver not knowing what to cook, and a hands
   off provider sending his caregiver do the shopping, the shopping mode,
   price and also the 4 domain should be integrated well" — and of #queue and
   #cook: "they take huge amount of the space … the screen usage is not
   good, should be a vast screen". So the front page tells it in four beats,
   each one product screen standing on its own in the middle of the wide
   screen, with the demos that used to stack under it as small live cards on
   either side: what to cook, buying without being there, the shop, and the
   four domains on the shelf. */
const story = (id, cls, head, stage, left, right, foot = '') => sec(id, `${cls} cs4`, `<div class="wrap">
    <div class="cs4-h">${sticker(head.icon, head.tag)}${h2(id, head.title, head.lede)}</div>
    <div class="cs4-g">
      <div class="cs4-l">${left}</div>
      <div class="cs4-stage stage">${stage}</div>
      <div class="cs4-r">${right}</div>
    </div>${foot}
  </div>`);

/* 1 · what to cook tonight — the caregiver */
function today() {
  const sw = screenSwitch('careshop', {
    id: 'sw-today', only: ['today', 'today-mgr'], on: 0,
    label: 'Which briefing',
    notes: {
      today: { tab: 'A caregiver', cap: 'One house, one shift: what to cook, what is short, what is dated.' },
      'today-mgr': { tab: 'A manager', cap: 'Every house, rolled up: restock across houses and the next run.' },
    },
  });
  return story('today', 'briefing', {
    icon: 'clock', tag: 'Home · Today', title: 'What to cook tonight.',
    lede: 'No guessing at the fridge. Today tells her: Thursday dinner, chicken and rice, five trays — with the steps, the timers and the allergen check one tap away.',
  }, `<div class="is-sw">${sw}</div>`,
  `<div class="cs4-sat" id="cook">${cookDemo()}</div>`,
  `<div class="cs4-sat">${allergenDemo()}</div><a class="more" href="/shelf#shelf-menu">${ic('arrow', 16)}The week’s menu, full size</a>`);
}

/* 2 · buying, without being there — the provider */
function queue() {
  const s = find('screen');
  const rule = `<div class="sat cs4-rule"><span class="sat-k">${ic('check', 16)}Your purchasing rules</span><b class="sat-v">Approve from anywhere.</b><span class="sat-t">Under your limit a rule approves the line; above it, you or a manager do. Assign a buyer, and when she is in the shop her phone opens on the list.</span></div>`;
  const doors = `<div class="sat cs4-doors"><span class="sat-k">${ic('cart', 16)}${esc(s.strip.label)}</span><ul class="cs4-chips">${s.strip.cells.map((c) => `<li>${esc(c)}</li>`).join('')}</ul><span class="sat-t">${esc(s.strip.foot)}</span></div>`;
  return story('queue', 'queue', {
    icon: 'cart', tag: 'Aisle 3 · The buy queue', title: 'You don’t have to be there.',
    lede: 'The list writes itself from the menu, the expiry dates and the pars. Staff add the rest. You approve from anywhere, and every line says where it came from and who asked.',
  }, `<div class="crop">${phone('buy')}</div>`,
  `<div class="cs4-sat">${approveDemo()}</div>`,
  `${rule}${doors}`);
}

/* 3 · in the shop — shopping mode and the price */
function shop() {
  const t = TILES.shop;
  return story('shop', 'shopsec', {
    icon: 'store', tag: t.tag, title: 'In the shop, aisle by aisle.',
    lede: 'The list sorts itself into that shop’s aisles — one hand, no signal needed. Pick the shop and the total changes. Every purchase remembers what you paid.',
  }, `<div class="crop">${phone('shop')}</div>`,
  `<div class="cs4-sat">${storeDemo()}</div>`,
  `<div class="cs4-sat">${priceDemo()}</div><div class="ctas is-row"><button type="button" class="btn" data-print>${ic('print', 18)}Print the list</button></div>`);
}

/* 4 · the four domains, on the shelf */
const DOMAINS = [
  ['leaf', 'Food', 'What goes on the menu, from the pantry to the freezer.'],
  ['plus', 'Care', 'Briefs, wipes, gloves, over-the-counter first aid.'],
  ['house', 'Household', 'Cleaning, paper, laundry.'],
  ['wrench', 'Operations', 'What the house runs on, beyond the kitchen.'],
];
function stock() {
  const dom = `<div class="sat cs4-dom"><span class="sat-k">${ic('shelf', 16)}Four domains, one list</span><ul class="cs4-dl">${DOMAINS.map(([icon, t, d]) => `<li><span class="cs4-di">${ic(icon, 18)}</span><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ul></div>`;
  return story('stock', 'stock', {
    icon: 'shelf', tag: 'Aisle 2 · Stock', title: 'Everything the house buys.',
    lede: 'Food, care, household and operations — counted by zone, in the order you walk the house. On hand is never typed; every change is a movement.',
  }, `<div class="crop">${phone('stock')}</div>`,
  `${dom}<div class="cs4-sat">${ladderDemo()}</div>`,
  `<div class="cs4-sat">${parDemo()}</div><a class="more" href="/stock">${ic('arrow', 16)}Stock in depth: zones, reserves, the calculator</a>`);
}

/* ── reserves and the rule ────────────────────────────────────────────── */
function reserve() {
  const s = find('depth');
  return sec('reserve', 'reserve', `<div class="wrap">
    <div class="res-g">
      <div class="res-t">${sticker('water', 'Reserves and the rule')}${h2('reserve', s.heading, s.sub)}<p class="pull">${esc(s.pull)}</p></div>
      <div class="res-d">${reserveDemo()}</div>
      <div class="res-l">${s.rows.map(([t, w, where]) => `<div class="res-r"><span class="res-k">${ic('tag', 16)}<b>${esc(t)}</b></span><span>${esc(w)}</span><em>${esc(where)}</em></div>`).join('')}
        <a class="more" href="/rules">${ic('arrow', 16)}The ten citations, and how sure we are</a></div>
    </div>
  </div>`);
}

/* ── the record ───────────────────────────────────────────────────────── */
function record() {
  const s = find('evidence');
  const keep = ['The resident record', 'Why initials are not a defence', 'Tray notes'];
  const blocks = keep.map((k) => s.blocks.find((b) => b.label === k)).filter(Boolean);
  return sec('record', 'record', `<div class="wrap">
    <div class="head">${sticker('person', 'Residents')}${h2('record', s.heading, 'Diet tags, allergens, one texture level. Enough for a tray note and a menu check, and nothing more.')}</div>
    <div class="ev">${blocks.map((b) => `<div class="ev-b"><span class="strip-l">${esc(b.label)}</span>${b.quote ? `<p class="quote">${esc(b.quote)}</p>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}</div>`).join('')}</div>
    <p class="boundary">CareShop runs the kitchen. Nothing clinical is ever stored.</p>
  </div>`);
}

/* ── roles ────────────────────────────────────────────────────────────── */
function roles() {
  const s = find('roles');
  return sec('roles', 'roles', `<div class="wrap">
    <div class="head">${sticker('person', 'Who is in the store')}${h2('roles', s.heading, s.sub)}</div>
    <div class="role-l">${s.rows.map(([r, who, does, dev, wash]) => `<div class="role ${wash ? 'is-wash' : ''}"><span class="role-top">${roleIcon(r)}<span class="role-n">${esc(r)}</span></span><span class="role-w">${esc(who)}</span><span class="role-d">${esc(does)}</span><span class="role-r">${esc(dev)}</span></div>`).join('')}</div>
  </div>`);
}

/* ── your kitchen: the door to careshop.app, drawn as it is ───────────── */
function kitchen(cfg) {
  return sec('kitchen', 'kitchen', `<div class="wrap kit-g">
    <div class="kit-v">
      <a class="door" href="${esc(cfg.signIn.href)}" aria-label="Sign in at careshop.app">
        <span class="door-bar" aria-hidden="true"><i></i><i></i><i></i><span class="door-url">careshop.app/login</span></span>
        <span class="door-body" aria-hidden="true">
          <span class="door-tile">C</span>
          <span class="door-name">careshop.app</span>
          <span class="door-sub">The kitchen software for care homes</span>
          <span class="door-card">
            <span class="door-f">Username<span class="door-in is-on"></span></span>
            <span class="door-f">Password<span class="door-in"></span></span>
            <span class="door-btn">Sign in</span>
          </span>
          <span class="door-note">New caregivers receive a one-time username &amp; password from an admin.</span>
          <span class="door-note">Starting a new organization? <b>Create one</b></span>
        </span>
      </a>
    </div>
    <div class="kit-t">
      ${sticker('house', 'Already on CareShop')}
      ${h2('kitchen', 'Sign in at careshop.app.', 'One address for every house. Sign in with the username your admin gave you, or create an organisation. Free plan, no card.')}
      <div class="ctas">
        <a class="btn pri lg" href="${esc(cfg.signIn.href)}" data-cta="kitchen">${ic('house', 18)}Sign in</a>
        <a class="btn lg" href="${esc(cfg.cta.primaryHref)}">Create your organisation</a>
      </div>
      <ul class="kit-k">${KIT_KEYS.map(([k, v]) => `<li>${ic('check', 18)}<b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ul>
    </div>
  </div>`);
}

const questions = (cfg, p) => sec('questions', 'questions', `<div class="wrap q-g"><div class="head">${sticker('mail', 'Asked at the till')}${h2('questions', 'The questions we get.')}</div>${faq(find('objections').rows)}</div><div class="wrap">${reach(cfg, p, { formHref: '/write', subject: 'A question — CareShop' })}</div>`);

/* ── pricing: three price tags on a shelf (tierCards lives in parts.js) ── */
function pricing(cfg, p) {
  const s = find('pricing');
  return sec('pricing', 'pricing', `<div class="wrap">
    <div class="head is-split">${sticker('tag', 'Price tags')}${h2('pricing', s.heading, s.sub)}</div>
    ${tierCards(cfg, p)}
    <p class="fine">Sold on the web. Cancel in one tap, export any time.</p>
  </div>`);
}

function start(cfg) {
  const s = find('start');
  return sec('start', 'start', `<div class="wrap start-g">
    <div>${sticker('clock', 'The first ten minutes')}${h2('start', 'If the loop closes once, you trust it.')}</div>
    <ol class="ten">${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
    <div class="sec-dev"><p class="cap">Where the first ten minutes end: Today, with the loop closed once.</p>
      <a class="more" href="/shelf">${ic('shelf', 16)}All eight screens, full size</a></div>
    <a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="start"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a>
  </div>`);
}

/* Three things stay open on a phone: the hero, the loop — this product's
   whole organising idea — and the closing call, which here is the price and
   the first ten minutes. The numbers band stays open with them. Everything
   else is an aisle, and you walk into an aisle on purpose. */
export function render(cfg, p) {
  return `${skip()}
${header(cfg, p, { page: 'home' })}
<main id="main" class="page face canvas" data-product="careshop" data-mode="light">
${hero(cfg, p)}
${named(stats(), 'The store in numbers')}
${directory(HOME_STOPS, { tail: { href: '/shelf', label: 'All eight screens' } })}
${fold(today(), 'Tonight’s dinner, the steps, and the allergen check.', 'Home · Today')}
${fold(queue(), 'The list writes itself; you approve from anywhere.', 'Aisle 3 · The queue')}
${fold(shop(), 'Aisle by aisle, priced by store, with no signal.', 'In the shop')}
${fold(stock(), 'Food, care, household and operations, by zone.', 'Aisle 2 · Stock')}
${loop()}
${fold(reserve(), 'Days × beds × the quantity per bed, and the rule behind it.', 'Reserves')}
${fold(record(), 'Diet tags, allergens, one texture level. Never a name.', 'Residents')}
${fold(roles(), 'Who is in the store, what they do, on what device.', 'Who is in the store')}
${fold(kitchen(cfg), 'Sign in at careshop.app, or create an organisation.', 'Front desk · Your kitchen')}
${fold(questions(cfg, p), 'Asked at the till, and answered. Then ask a person.', 'Questions')}
${pricing(cfg, p)}
${named(start(cfg), 'The first ten minutes')}
${printList(cfg)}
</main>
${footer(cfg, p, { page: 'home' })}`;
}

export const pages = [
  { path: 'features', title: 'Features', description: 'Every station on the loop, the rule layer beside them, and who uses it on what device.', render: featuresPage },
  { path: 'pricing', title: 'Pricing', description: 'Free, Pro at nineteen a house, Scale at thirty-seven. What a plan counts, and what is sold.', render: pricingPage },
  { path: 'loop', title: 'The loop', description: 'Count, queue, approve, shop, receipt, stock, cook: seven stations, six screens, and the house’s own data moving around them.', render: loopPage },
  { path: 'stock', title: 'Stock', description: 'Stock by zone, the par you set, Expiry Watch with the value at risk, and the reserve target: days times beds times the quantity per bed.', render: stockPage },
  { path: 'shelf', title: 'The shelf', description: 'All eight CareShop screens at the size they ship, each captioned with what it proves, plus the buy queue at the till, annotated.', render: shelfPage },
  { path: 'rules', title: 'The rules', description: 'The ten Oregon citations CareShop explains, how sure we are about each, and the rules the product applies to itself.', render: rulesPage },
  { path: 'about', title: 'About', description: 'CareShop is live at careshop.app and used by real houses. Kitchen software for licensed Oregon care homes.', render: aboutPage },
  { path: 'write', title: 'Write to us', description: 'One inbox at kitchen@careshop.app. A question, a house that wants to switch, pricing, privacy. One person reads it and answers.', render: writePage },
];
