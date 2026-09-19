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
import { iosShell } from '../instruments.js';
import { PAGES } from '../../data/page.js';
import { ic } from '../icons/careshop.js';
import { header, footer, sticker, chip, screen, parDemo, approveDemo, allergenDemo, reserveDemo, priceDemo, storeDemo, ladderDemo, cookDemo, printList } from './careshop/parts.js';
import { loopPage } from './careshop/loop.js';
import { stockPage } from './careshop/stock.js';
import { rulesPage } from './careshop/rules.js';
import { aboutPage } from './careshop/about.js';
import { writePage } from './careshop/write.js';

export { header, footer };

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

const STATS = [
  ['$', '14.20', 2, 'at risk on the shelf today', 'Every dated item, most urgent first, and the value totalled at the foot.'],
  ['', '3 × 5', 0, 'days × beds is the reserve target', 'Arithmetic, not a shrug. The bed count is typed by a human.'],
  ['', '5', 0, 'origins for a buy request. No sixth.', 'A menu shortfall, an expiry, a par breach, a reserve gap, or a caregiver’s ask.'],
  ['', '6', 0, 'front doors, one contract', 'The shelf, the scanner, Today, a workbook, the catalogue, a shared run — all write the same request.'],
];

/* the seven stations on the ring, each a link to the aisle it lives in */
export const RING = [
  ['Count', 'stock', 'A physical walk, one zone at a time, in the house’s own walk order.'],
  ['Queue', 'queue', 'What to buy and nothing else — each line carrying its origin.'],
  ['Approve', 'queue', 'Auto under the threshold, a manager above; the rule is recorded.'],
  ['Shop', 'queue', 'Aisle order at that shop. Works with no signal.'],
  ['Receipt', 'queue', 'Closing the run is the only moment stock rises from a shop.'],
  ['Stock', 'stock', 'On hand is never typed. It moves through the ledger.'],
  ['Cook', 'cook', 'Complete, and stock goes down — once.'],
];

const TILES = {
  stock: { t: 'Stock, by zone', d: 'Pantry, fridge, freezer, reserve — in the walk order the house sets. On hand is never typed; it moves through the ledger, with an actor and a reason.', tag: 'Scan · count · par' },
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

/* ── the hero: the headline, the fan, the scanner ─────────────────────── */
function hero(cfg, p) {
  const fanKeys = [['expiry', 'is-l'], ['stock', 'is-c'], ['buy', 'is-r']];
  return `<section class="hero" id="top" aria-labelledby="h1">
    <div class="hero-wash" aria-hidden="true"></div>
    <div class="wrap hero-in">
      <div class="hero-t">
        ${sticker('store', 'Live at careshop.app · Oregon care homes', 'is-live')}
        <h1 id="h1">${esc(p.headline.text)}</h1>
        <p class="lede">${esc(p.lede)}</p>
        <div class="ctas">
          <a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="hero"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a>
          <a class="btn lg" href="#loop">${ic('pot', 18)}${esc(cfg.cta.secondary)}</a>
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
const stats = () => sec('numbers', 'numbers', `<div class="wrap"><ul class="stats">${STATS.map(([pre, n, dec, l, d]) => {
  const parts = n.split(' × ');
  const num = parts.map((x) => `<span data-count="${esc(x)}" data-dec="${dec}">${esc(x)}</span>`).join('<span class="stat-x"> × </span>');
  return `<li><span class="stat-n">${pre}${num}</span><span class="stat-l">${esc(l)}</span><span class="stat-d">${esc(d)}</span></li>`;
}).join('')}</ul></div>`, { label: 'Four numbers' });

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
  return sec('queue', 'queue', `<div class="wrap">
    <div class="head">${sticker('cart', 'Aisle 3 · ' + t.tag)}${h2('queue', s.heading, s.sub)}</div>
    <div class="aisle-g is-rev">
      <div class="aisle-ph"><div class="crop">${phone('buy')}</div><p class="ph-cap">${esc(s.caption)}</p></div>
      <div class="aisle-d">${approveDemo()}${priceDemo()}</div>
    </div>
    <div class="doors"><span class="strip-l">${esc(s.strip.label)}</span><div class="doors-r" data-scrollx>${s.strip.cells.map((c, i) => `<span class="door-c"><span class="door-n">${i + 1}</span>${esc(c)}</span>`).join('')}</div><p class="doors-f">${esc(s.strip.foot)}</p></div>
    <div class="shopq">
      <div class="shopq-t">${sticker('store', TILES.shop.tag)}<h3>${esc(TILES.shop.t)}</h3><p>${esc(TILES.shop.d)}</p>
        <button type="button" class="btn" data-print>${ic('print', 18)}Print the list</button></div>
      ${storeDemo()}
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
    <div class="aisle-g is-rev menu-g">
      <div class="aisle-ph" data-menu-phone><div class="crop">${phone('menu')}</div><p class="ph-cap">${esc(m.foot)}</p></div>
      <div class="aisle-d"><div class="menu-t"><h3>${esc(m.title)} — ${esc(m.sub)}</h3><p>${esc(m.desktopSub)}</p></div>${allergenDemo()}</div>
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
  return sec('record', 'record', `<div class="wrap">
    <div class="head">${sticker('person', 'Residents')}${h2('record', s.heading, 'Diet tags, allergens, one texture level. Enough for a tray note and a menu check, and nothing more.')}</div>
    <div class="ev">${s.blocks.slice(0, 6).map((b) => `<div class="ev-b ${b.wide ? 'is-wide' : ''}"><span class="strip-l">${esc(b.label)}</span>${b.quote ? `<p class="quote">${esc(b.quote)}</p>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}</div>`).join('')}</div>
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
        <span class="door-bar" aria-hidden="true"><i></i><i></i><i></i><span class="door-url"><b>yourhouse</b>.careshop.app</span></span>
        <span class="door-body" aria-hidden="true">
          <span class="door-tile">C</span>
          <span class="door-name">careshop.app</span>
          <span class="door-sub">Inventory &amp; compliance for residential care</span>
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
      ${h2('kitchen', 'Your kitchen has its own address.', 'Every organisation on CareShop lives at its own subdomain. Sign in with the username your admin gave you — or create an organisation, and the catalogue, the first house and the default storage zones are seeded before you add a thing. Free plan, no card.')}
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
  return sec('pricing', 'pricing', `<div class="wrap">
    <div class="head">${sticker('tag', 'Price tags')}${h2('pricing', 'Nineteen dollars a house.', 'Every plan sees every screen; an action above your plan is shown with its cost, never silently blocked.')}</div>
    <div class="tiers">${rows.map(([n, price, d], i) => `<div class="tier ${i === 1 ? 'is-main' : ''}"><span class="tier-hole" aria-hidden="true"></span><span class="tier-n">${esc(n)}</span><span class="tier-p">${esc(price.replace(' / mo', ''))}<small>${price.includes('/ mo') ? ' / house / mo' : ''}</small></span><span class="tier-d">${esc(d)}</span><a class="btn ${i === 1 ? 'pri' : ''}" href="${esc(cfg.cta.primaryHref)}">${i === 0 ? 'Start free' : 'Start with ' + esc(n)}</a></div>`).join('')}</div>
    <p class="fine">Sold on the web through Stripe Checkout; the app never presents a purchase sheet. Cancel in one tap, export any time.</p>
  </div>`);
}

function start(cfg) {
  const s = find('start');
  return sec('start', 'start', `<div class="wrap start-g">
    <div>${sticker('clock', 'The first ten minutes')}${h2('start', 'If the loop closes once, you trust it.')}</div>
    <ol class="ten">${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
    <a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="start"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a>
  </div>`);
}

export function render(cfg, p) {
  return `${skip()}
${header(cfg, p, { page: 'home' })}
<main id="main" class="page face canvas" data-product="careshop" data-mode="light">
${hero(cfg, p)}
${stats()}
${loop()}
${stock()}
${queue()}
${cook()}
${reserve()}
${record()}
${roles()}
${kitchen(cfg)}
${questions()}
${pricing(cfg, p)}
${start(cfg)}
${printList(cfg)}
</main>
${footer(cfg, p, { page: 'home', fine: find('foot').disclaimer })}`;
}

export const pages = [
  { path: 'loop', title: 'The loop', description: 'Count, queue, approve, shop, receipt, stock, cook — seven stations, six screens, and the house’s own data moving around them without anyone re-typing it.', render: loopPage },
  { path: 'stock', title: 'Stock', description: 'Stock by zone, the par you set, Expiry Watch with the value at risk, and the reserve target — days times beds times the quantity per bed per day.', render: stockPage },
  { path: 'rules', title: 'The rules', description: 'The ten Oregon citations CareShop explains today, how sure we are about each, what is specified and not yet built, and what was removed and will not return.', render: rulesPage },
  { path: 'about', title: 'About', description: 'CareShop is live at careshop.app and used by real houses. It is one of four rooms in a family of software for licensed Oregon care homes, by Provider Hub Oregon.', render: aboutPage },
  { path: 'write', title: 'Write to us', description: 'One inbox, read by the people who build CareShop. A question, a house that wants to switch, pricing, privacy — a person answers from the same address.', render: writePage },
];
