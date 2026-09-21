// careshop.app — the store.
//
// The one live product in the family, so the site is a kitchen and a grocery
// run: an aisle strip for a header, hanging signs for navigation, sticker
// icons, a till receipt for a footer. Drawn in the live application's own
// materials — paper, ink, sage, terracotta, Fraunces and Hanken Grotesk — and
// every button goes to careshop.app. The phones fan out at the top the way
// the founder's board fans them; the numbers get their own band; the loop is
// a ring that turns as you scroll. Every screen on the page is doing work.

import { esc, faq, sec, h2, skip } from '../shared.js';
import { iosShell, screenSwitch } from '../instruments.js';
import { PAGES } from '../../data/page.js';
import { ic } from '../icons/careshop.js';
import { header, footer, sticker, chip, screen, parDemo, approveDemo, allergenDemo, reserveDemo, priceDemo, storeDemo, ladderDemo, cookDemo, printList, walkOn, directory } from './careshop/parts.js';
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

/* ── EVERY FIGURE SAYS WHERE IT COMES FROM ─────────────────────────────
   The sixth field is the provenance, and it is not decoration. Two of
   these four are readings off the sample house the instruments on this
   page all draw — a demo number, and it says so on the number rather
   than in a footnote at the bottom of the receipt. The other two are
   facts about how the product is built, which a reader can check against
   the product itself. A landing page that shows a figure a visitor
   cannot source is the thing this whole site is trying not to be. */
const STATS = [
  ['$', '14.20', 2, 'at risk on the shelf today', 'Every dated item, most urgent first, and the value totalled at the foot.', 'demo data'],
  ['', '3 × 5', 0, 'days × beds is the reserve target', 'Arithmetic, not a shrug. The bed count is typed by a human.', 'demo data'],
  ['', '5', 0, 'origins for a buy request. No sixth.', 'A menu shortfall, an expiry, a par breach, a reserve gap, or a caregiver’s ask.', 'in the product'],
  ['', '6', 0, 'front doors, one contract', 'The shelf, the scanner, Today, a workbook, the catalogue, a shared run — all write the same request.', 'in the product'],
];

/* the seven stations on the ring, each a link to the aisle it lives in */
export const RING = [
  ['Count', 'stock', 'A physical walk, one zone at a time, in the house’s own walk order.'],
  ['Queue', 'queue', 'What to buy and nothing else — each line carrying its origin.'],
  ['Approve', 'queue', 'Auto under the threshold, a manager above; the rule is recorded.'],
  ['Shop', 'queue', 'Aisle order at that shop. Works with no signal.'],
  ['Receipt', 'queue', 'Closing the run is the only moment stock rises from a shop.'],
  ['Stock', 'stock', 'On hand is never typed. It moves through the record.'],
  ['Cook', 'cook', 'Complete, and stock goes down — once.'],
];

/* ── the entrance board ───────────────────────────────────────────────
   Every stop on the front page, in walk order, with the shortest true
   name and what is down there. It is real anchors, so it works with no
   script; careshop.js marks the one you are standing in as you scroll.
   These are the same ids the aisle signs, the drawer and the receipt all
   point at, so a name can only be wrong in one place. */
export const HOME_STOPS = [
  ['loop', 'The loop', '7 stations'],
  ['today', 'Today', '2 briefings'],
  ['stock', 'Stock', '4 zones'],
  ['queue', 'The queue', '5 origins'],
  ['cook', 'Cook mode', '1 warning'],
  ['reserve', 'Reserves', 'days × beds'],
  ['record', 'Residents', '9 refusals'],
  ['roles', 'Who is in the store', '6 people'],
  ['kitchen', 'Your kitchen', '1 door'],
  ['questions', 'Questions', '4 answers'],
  ['pricing', 'Pricing', '3 plans'],
  ['start', 'The first ten minutes', '4 steps'],
];

const TILES = {
  today: { t: 'Today', d: 'The first screen after sign-in. A caregiver sees their shift; a manager sees every house. Restock, expiry, dinner — what the house needs.', tag: 'Two briefings · one day' },
  stock: { t: 'Stock, by zone', d: 'Pantry, fridge, freezer, reserve — in the walk order the house sets. On hand is never typed; it moves through the record, with an actor and a reason.', tag: 'Scan · count · par' },
  queue: { t: 'The queue', d: 'What to buy and nothing else. Each line carries where it came from, who asked, who approved, and the cheapest store on the price ledger.', tag: 'Eight purchasing rules' },
  cook: { t: 'Cook mode', d: 'Today’s prep in the house’s own time zone, timers in the steps, the allergen check before plating. Complete, and stock goes down — once.', tag: 'Tray notes rendered, never stored' },
  shop: { t: 'Shopping mode', d: 'An aisle-ordered list, priced by store. A pick becomes Purchased with the real store and the real cost. Picks queue offline and never count twice.', tag: 'Works with no signal' },
};

const REFUSED = [
  ['Any compliance grade, score, or readiness measure', 'a count is not a grade'],
  ['Storing a tray note', 'rendered, always, so no other record contains resident information'],
  ['Putting a resident on a shopping list, a shared link, or an export', 'structural — enforced by how the snapshot is built'],
  ['Preventing a menu because of an allergen', 'it warns; preventing teaches people to work around the product'],
  ['Typing stock on hand directly', 'the ledger is the truth'],
  ['Deriving the bed count from the resident list', 'a regulated number is typed by a human'],
  ['Merging zone, aisle, and category', 'three different physical sequences'],
  ['Deleting a movement', 'it is the record'],
  ['Ranking houses', 'a count is not a grade'],
];

const KIT_KEYS = [
  ['One-time credentials', 'Caregivers get a username and password from an admin; there is no public sign-up for staff.'],
  ['Seeded on day one', 'The catalogue, the first house and the default storage zones are there before you add a single item.'],
  ['On the phone', 'Installs on iOS and Android. Picks queue offline and are never counted twice.'],
];

/* a phone in a wrapper the page can scale, with a name for the reader */
const phone = (key, cls = '', opts = {}) => `<div class="ph ${cls}" data-phone="${esc(key)}">${iosShell('careshop', { key, ...opts })}</div>`;

/* ── the fold: an aisle the reader walks into rather than past ──────────
   Below 640 the store opens as an index. `sec()` lives in render/shared.js
   and takes no attribute bag, so the two attributes the shared folds()
   controller reads are stamped onto the section it returns. Nothing is
   removed from the HTML: with scripting off, or on a printer, or above
   640px, every one of these sections is open and whole.

   The gist is the sign hanging over the aisle — what is down there, in one
   line, written short enough to read at a glance. */
/* The third argument is the dock's name for the section — the shortest true
   one, in the store's own words. careshop.js spies it as data-stop so the
   "You are in" bar can name all fourteen stops instead of the six the
   desktop sign strip happens to carry. NOT data-where: that attribute is the
   selector for the bar's own output elements. */
const fold = (html, gist, stop) =>
  html.replace('<section class="sec ', `<section data-phone="fold" data-gist="${esc(gist)}"${stop ? ` data-stop="${esc(stop)}"` : ''} class="sec `);

/* the same name, for a section that stays open and has no sign in the aisle
   strip. Without it the dock reads "Checkout · Pricing" for the 2,400px that
   run from the price tags to the foot of the store. */
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
        <p class="fine">Free to start — one house, up to three people, you included. No card to begin. Installs on iOS and Android.</p>
      </div>
      <div class="hero-v">
        <div class="fan" data-fan aria-hidden="true">
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
      <span class="scan-code"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <span class="scan-line"></span>
      <span class="scan-r">0 41220 19624 0</span>
    </div>
    <div class="scan-found"><span class="st" data-state="stocked"><i></i>Found</span><b>Oat milk · 1 gal</b><span>a barcode and a typed name — nothing else required</span></div>
  </div>`;
}

/* ── the numbers band ─────────────────────────────────────────────────── */
const stats = () => sec('numbers', 'numbers', `<div class="wrap"><ul class="stats">${STATS.map(([pre, n, dec, l, d, src]) => {
  const parts = n.split(' × ');
  const num = parts.map((x) => `<span data-count="${esc(x)}" data-dec="${dec}">${esc(x)}</span>`).join('<span class="stat-x"> × </span>');
  return `<li><span class="stat-n">${pre}${num}</span><span class="stat-l">${esc(l)}</span><span class="stat-d">${esc(d)}</span><span class="stat-s" data-src="${esc(src)}">${esc(src)}</span></li>`;
}).join('')}</ul>
<p class="stat-f">Two of these four are readings off the sample house every screen here shows — marked <b>demo data</b>, and not a customer count. The other two are facts about how the product is built.</p></div>`, { label: 'Four numbers' });

/* ── the loop: a ring that turns as you scroll ────────────────────────── */
function loop() {
  const s = find('loop');
  const n = RING.length, R = 148, cx = 190, cy = 190;
  const pts = RING.map(([label, target], i) => { const a = (-90 + (360 / n) * i) * Math.PI / 180; return { label, target, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), i }; });
  const svg = `<svg class="ring" viewBox="0 0 380 380" aria-hidden="true" focusable="false">
    <g class="ring-rot">
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 7" opacity=".5"/>
      ${pts.map((pt) => `<a class="ring-n" href="#${esc(pt.target)}" data-ring="${pt.i}" tabindex="-1"><circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="29"/><text x="${pt.x.toFixed(1)}" y="${(pt.y + 4.5).toFixed(1)}" text-anchor="middle">${esc(pt.label)}</text></a>`).join('')}
    </g>
    <path class="ring-ptr" d="M190 1l6 10h-12z"/>
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="ring-c">the loop</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="ring-s" data-ring-station>closes by itself</text>
  </svg>`;
  return sec('loop', 'loop', `<div class="wrap loop-g">
    <div class="loop-t">
      ${sticker('pot', 'Aisle 1 · the organising idea')}
      ${h2('loop', s.heading, s.sub)}
      <div class="loop-strip" data-loop-strip data-scrollx>${RING.map(([label, target, note], i) => `<a class="ls-c" href="#${esc(target)}" data-ls="${i}"><span class="ls-n">${i + 1}</span><b>${esc(label)}</b><span>${esc(note)}</span></a>`).join('')}</div>
      <div class="ls-dots" data-ls-dots aria-hidden="true"></div>
      <a class="more" href="/loop">${ic('arrow', 16)}Walk the whole loop — seven stations, six screens</a>
    </div>
    <div class="loop-v" data-ring-wrap>${svg}</div>
    <ol class="stations">${s.nodes.map((nd) => `<li ${nd.accent ? 'class="is-accent"' : ''}><b>${esc(nd.label)}</b><span>${esc(nd.note)}</span></li>`).join('')}</ol>
  </div>`);
}

/* ── Today · the live home ────────────────────────────────────────────── */
/* ── Today · the device you can switch ────────────────────────────────
   Two static crops side by side asked the reader to compare two pictures
   at 244px each. One device with a two-ticket rail asks them to press
   something, and the stage keeps its box across both panels, so nothing
   on the page moves when they do. The shared screenSwitch() draws it —
   roving tabindex, aria-selected, one role="tabpanel" per screen — and
   this sheet dresses the rail as the store's own shelf-edge tickets.
   With scripting off the tabs are not painted and both screens stack,
   which is the composition it replaced. */
function today() {
  const t = TILES.today;
  const sw = screenSwitch('careshop', {
    id: 'sw-today', only: ['today', 'today-mgr'], on: 0,
    label: 'Which briefing',
    notes: {
      today: { tab: 'A caregiver', cap: 'Willow House · one shift. Cook today, what is short, what is dated.' },
      'today-mgr': { tab: 'A manager', cap: 'Every house, rolled up — restock across houses and the cost of the next run.' },
    },
  });
  return sec('today', 'briefing', `<div class="wrap">
    <div class="head">${sticker('clock', t.tag)}${h2('today', t.t + '.', t.d)}</div>
    <div class="aisle-g is-wide">
      <div class="aisle-ph is-sw">${sw}</div>
      <div class="aisle-d">
        <ul class="brief-roles">
          <li><b>A caregiver sees their shift.</b><span>Cook today, what is short, what is dated — one house, in the house’s own time zone.</span></li>
          <li><b>A manager sees every house.</b><span>The same briefing, rolled up: restock across houses, the cost of the next run, the reserve gaps.</span></li>
          <li><b>Restock, expiry, dinner.</b><span>Open it after sign-in. Cook from it. A shortfall files into the queue from it, carrying its origin.</span></li>
        </ul>
        <a class="more" href="/loop">${ic('arrow', 16)}Then the loop — seven stations, six screens</a>
      </div>
    </div>
  </div>`);
}

/* ── Aisle 2 · stock ──────────────────────────────────────────────────── */
function stock() {
  const t = TILES.stock;
  return sec('stock', 'stock', `<div class="wrap">
    <div class="head">${sticker('shelf', 'Aisle 2 · ' + t.tag)}${h2('stock', t.t + '.', t.d)}</div>
    <div class="aisle-g">
      <div class="aisle-ph"><div class="crop">${phone('stock')}</div></div>
      <div class="aisle-d">${parDemo()}${ladderDemo()}<a class="more" href="/stock">${ic('arrow', 16)}Stock in depth — zones, reserves, the calculator</a></div>
    </div>
  </div>`);
}

/* ── Aisle 3 · the queue ──────────────────────────────────────────────── */
function queue() {
  const s = find('screen');
  const t = TILES.queue;
  const sh = screen('shop');
  return sec('queue', 'queue', `<div class="wrap">
    <div class="head">${sticker('cart', 'Aisle 3 · ' + t.tag)}${h2('queue', s.heading, s.sub)}</div>
    <div class="aisle-g is-rev">
      <div class="aisle-ph"><div class="crop">${phone('buy')}</div><p class="ph-cap">${esc(s.caption)}</p></div>
      <div class="aisle-d">${approveDemo()}${priceDemo()}</div>
    </div>
    <div class="doors"><span class="strip-l">${esc(s.strip.label)}</span><div class="doors-r" data-scrollx>${s.strip.cells.map((c, i) => `<span class="door-c"><span class="door-n">${i + 1}</span>${esc(c)}</span>`).join('')}</div><p class="doors-f">${esc(s.strip.foot)}</p></div>
    <div class="aisle-g shopq is-rev">
      <div class="aisle-ph">${storeDemo()}</div>
      <div class="aisle-d">
        <div class="shopq-t">${sticker('store', TILES.shop.tag)}<h3>${esc(TILES.shop.t)}</h3><p>${esc(TILES.shop.d)}</p>
          <p class="ph-cap is-left">${esc(sh.foot)}</p>
          <div class="ctas is-row"><button type="button" class="btn" data-print>${ic('print', 18)}Print the list</button><a class="btn" href="/shelf#shelf-shop">${ic('shelf', 18)}See the shop screen</a></div></div>
      </div>
    </div>
  </div>`);
}

/* ── the kitchen: cook mode and the menu ──────────────────────────────── */
function cook() {
  const t = TILES.cook;
  const m = screen('menu');
  return sec('cook', 'cook', `<div class="wrap">
    <div class="head">${sticker('pot', t.tag)}${h2('cook', t.t + '.', t.d)}</div>
    <div class="aisle-g">
      <div class="aisle-ph"><div class="crop">${phone('cook')}</div></div>
      <div class="aisle-d">${cookDemo()}</div>
    </div>
    <div class="menu-g" data-menu-phone>
      <div class="menu-t"><h3>${esc(m.title)} — ${esc(m.sub)}</h3><p>${esc(m.desktopSub)}</p></div>
      <div class="menu-d">${allergenDemo()}
        <div class="menu-side"><p class="ph-cap is-left">${esc(m.foot)}</p><a class="more" href="/shelf#shelf-menu">${ic('arrow', 16)}The menu screen, full size</a></div>
      </div>
    </div>
  </div>`);
}

/* ── reserves and the rule ────────────────────────────────────────────── */
function reserve() {
  const s = find('depth');
  return sec('reserve', 'reserve', `<div class="wrap">
    <div class="res-g">
      <div class="res-t">${sticker('water', 'Reserves and the rule')}${h2('reserve', s.heading, s.sub)}<p class="pull">${esc(s.pull)}</p></div>
      <div class="res-d">${reserveDemo()}</div>
      <div class="res-l">${s.rows.map(([t, w, where]) => `<div class="res-r"><span class="res-k">${ic('tag', 16)}<b>${esc(t)}</b></span><span>${esc(w)}</span><em>${esc(where)}</em></div>`).join('')}
        <p class="closing">${esc(s.closing)}</p>
        <a class="more" href="/rules">${ic('arrow', 16)}The ten citations, and how sure we are</a></div>
    </div>
  </div>`);
}

/* ── the record ───────────────────────────────────────────────────────── */
function record() {
  const s = find('evidence');
  const keep = new Set(['The resident record', 'Why initials are not a defence', 'The customer agreement', 'Tray notes']);
  const blocks = s.blocks.filter((b) => keep.has(b.label));
  return sec('record', 'record', `<div class="wrap">
    <div class="head">${sticker('person', 'Residents')}${h2('record', s.heading, 'Diet tags, allergens, one texture level. Enough for a tray note and a menu check, and nothing more.')}</div>
    <div class="ev">${blocks.map((b) => `<div class="ev-b ${b.wide ? 'is-wide' : ''}"><span class="strip-l">${esc(b.label)}</span>${b.quote ? `<p class="quote">${esc(b.quote)}</p>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}</div>`).join('')}</div>
    <div class="refused"><span class="strip-l">Nine things it refuses to do, and will not do under another name</span>
      <ul class="chips-l">${REFUSED.map(([t, why]) => `<li>${ic('x', 16)}<b>${esc(t)}</b><span>${esc(why)}</span></li>`).join('')}</ul>
    </div>
    <p class="boundary">CareShop runs the household. It does not keep residents’ care records, schedule staff, or build binders.</p>
  </div>`);
}

/* ── roles ────────────────────────────────────────────────────────────── */
function roles() {
  const s = find('roles');
  return sec('roles', 'roles', `<div class="wrap">
    <div class="head">${sticker('person', 'Who is in the store')}${h2('roles', s.heading, s.sub)}</div>
    <div class="role-l">${s.rows.map(([r, who, does, dev, wash]) => `<div class="role ${wash ? 'is-wash' : ''}"><span class="role-n">${esc(r)}</span><span class="role-w">${esc(who)}</span><span class="role-d">${esc(does)}</span><span class="role-r">${ic('phone', 14)}${esc(dev)}</span></div>`).join('')}</div>
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
      ${h2('kitchen', 'Sign in at careshop.app.', 'One address for every house. Sign in with the username your admin gave you — or create an organisation, and the catalogue, the first house and the default storage zones are seeded before you add a thing. Free plan, no card.')}
      <div class="ctas">
        <a class="btn pri lg" href="${esc(cfg.signIn.href)}" data-cta="kitchen">${ic('house', 18)}Sign in</a>
        <a class="btn lg" href="${esc(cfg.cta.primaryHref)}">Create your organisation</a>
      </div>
      <ul class="kit-k">${KIT_KEYS.map(([k, v]) => `<li>${ic('check', 18)}<b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ul>
    </div>
  </div>`);
}

const questions = () => sec('questions', 'questions', `<div class="wrap q-g"><div class="head">${sticker('mail', 'Asked at the till')}${h2('questions', 'The questions we get.')}</div>${faq(find('objections').rows)}</div>`);

function pricing(cfg, p) {
  const rows = [['Free', '$0', 'One house, up to three people. No card to begin.'], ...p.pricing.rows.filter(([n]) => n !== '3-day trial' && n !== 'Free')];
  /* a tier's list is that tier's own sentence, broken where it is already a
     list — nothing here is invented. The first line is the section's own
     promise, which is true of every plan by definition. */
  const lines = (d) => ['Every screen, every plan', ...d.split(/\.\s+/).flatMap((x) => {
    const t = x.replace(/\.$/, '').trim();
    return t.length > 40 ? t.split(/,\s+/) : [t];
  }).filter(Boolean).map((t) => t.charAt(0).toUpperCase() + t.slice(1))];
  return sec('pricing', 'pricing', `<div class="wrap">
    <div class="head is-split">${sticker('tag', 'Price tags')}${h2('pricing', 'Nineteen dollars a house.', 'Every plan sees every screen; an action above your plan is shown with its cost, never silently blocked.')}</div>
    <div class="tiers">${rows.map(([n, price, d], i) => `<div class="tier ${i === 1 ? 'is-main' : ''}">${i === 1 ? '<span class="tier-flag">Most houses</span>' : ''}<span class="tier-n">${esc(n)}</span><span class="tier-p">${esc(price.replace(' / mo', ''))}<small>${price.includes('/ mo') ? ' / house / mo' : ''}</small></span><ul class="tier-f">${lines(d).map((t) => `<li><span class="tier-tick" aria-hidden="true"></span>${esc(t)}</li>`).join('')}</ul><a class="btn ${i === 1 ? 'pri' : ''}" href="${esc(cfg.cta.primaryHref)}">${i === 0 ? 'Start free' : 'Start with ' + esc(n)}</a></div>`).join('')}</div>
    <p class="fine">Sold on the web through Stripe Checkout; the app never presents a purchase sheet. Cancel in one tap, export any time.</p>
  </div>`);
}

function start(cfg) {
  const s = find('start');
  return sec('start', 'start', `<div class="wrap start-g">
    <div>${sticker('clock', 'The first ten minutes')}${h2('start', 'If the loop closes once, you trust it.')}</div>
    <ol class="ten">${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
    <div class="sec-dev"><p class="cap">Where the first ten minutes end: Today, with the loop closed once — the same screen at the top of this page, and the first of the eight on the shelf.</p>
      <a class="more" href="/shelf">${ic('shelf', 16)}All eight screens, full size</a></div>
    <a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="start"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a>
  </div>`);
}

/* Three things stay open on a phone, and they are the three the rule names:
   the hero, the section that carries the claim — the loop, which is this
   product's whole organising idea and already has a phone form, a snap
   strip of seven cards with dots — and the closing call, which here is the
   price and the first ten minutes. The numbers band stays open with them:
   it is four figures, 780px, and it is the hero's evidence rather than a
   section of its own. Everything else is an aisle, and you walk into an
   aisle on purpose. */
export function render(cfg, p) {
  return `${skip()}
${header(cfg, p, { page: 'home' })}
<main id="main" class="page face canvas" data-product="careshop" data-mode="light">
${hero(cfg, p)}
${named(stats(), 'The store in numbers')}
${directory(HOME_STOPS)}
${loop()}
${fold(today(), 'The first screen after sign-in — a shift, or every house.', 'Home · Today')}
${fold(stock(), 'Pantry, fridge, freezer, reserve — in the house’s walk order.', 'Aisle 2 · Stock')}
${fold(queue(), 'What to buy and nothing else, each line carrying its origin.', 'Aisle 3 · The queue')}
${fold(cook(), 'Today’s prep, timers in the steps, the allergen check.', 'Cook mode')}
${fold(reserve(), 'Days × beds × the quantity per bed, and the rule behind it.', 'Reserves')}
${fold(record(), 'Diet tags, allergens, one texture level — and nine refusals.', 'Residents')}
${fold(roles(), 'Who is in the store, what they do, on what device.', 'Who is in the store')}
${fold(kitchen(cfg), 'Sign in at careshop.app, or create an organisation.', 'Front desk · Your kitchen')}
${fold(questions(), 'Asked at the till, and answered.', 'Questions')}
${pricing(cfg, p)}
${named(start(cfg), 'The first ten minutes')}
${printList(cfg)}
${walkOn('home')}
</main>
${footer(cfg, p, { page: 'home', fine: find('foot').disclaimer })}`;
}

export const pages = [
  { path: 'features', title: 'Features', description: 'Every station on the loop, the rule layer beside them, who uses it on what device, and the list of what this product refuses to do.', render: featuresPage },
  { path: 'pricing', title: 'Pricing', description: 'Free, Pro at nineteen a house, Scale at thirty-seven — what a plan counts, and the ladder out of the kitchen into the whole house.', render: pricingPage },
  { path: 'loop', title: 'The loop', description: 'Count, queue, approve, shop, receipt, stock, cook — seven stations, six screens, and the house’s own data moving around them without anyone re-typing it.', render: loopPage },
  { path: 'stock', title: 'Stock', description: 'Stock by zone, the par you set, Expiry Watch with the value at risk, and the reserve target — days times beds times the quantity per bed per day.', render: stockPage },
  { path: 'shelf', title: 'The shelf', description: 'All eight CareShop screens at the size they ship, each captioned with what it proves — plus the buy queue at the till, annotated point by point.', render: shelfPage },
  { path: 'rules', title: 'The rules', description: 'The ten Oregon citations CareShop explains today, how sure we are about each, and what will not return.', render: rulesPage },
  { path: 'about', title: 'About', description: 'CareShop is live at careshop.app and used by real houses. Kitchen software for licensed Oregon care homes, by Provider Hub Oregon.', render: aboutPage },
  { path: 'write', title: 'Write to us', description: 'One inbox. A question, a house that wants to switch, pricing, privacy — a person answers from the same address.', render: writePage },
];
