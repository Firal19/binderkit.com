// careshop.app — the loop.
//
// The one product in the family that is live, so this page is drawn in the
// live application's own materials — paper, ink, sage and terracotta, Fraunces
// and Hanken Grotesk — and its buttons go to /signup. Phones fan out at the
// top the way the founder's inspiration board fans them; numbers get their
// own band; the loop is drawn as a ring.

import { esc, nav, foot, faq, tiers, sec, h2, eyebrow, ICON } from '../shared.js';
import { iosShell } from '../instruments.js';
import { PAGES } from '../../data/page.js';

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

const STATS = [
  ['$14.20', 'at risk on the shelf today', 'Every dated item, most urgent first, and the value totalled at the foot.'],
  ['3 × 5', 'days × beds is the reserve target', 'Arithmetic, not a shrug. The bed count is typed by a human.'],
  ['5', 'origins for a buy request. No sixth.', 'A menu shortfall, an expiry, a par breach, a reserve gap, or a caregiver’s ask.'],
  ['6', 'front doors, one contract', 'The shelf, the scanner, Today, a workbook, the catalogue, a shared run — all write the same request.'],
];

const RING = ['Count', 'Queue', 'Approve', 'Shop', 'Receipt', 'Stock', 'Cook', 'Count'];

const TILES = [
  { id: 'stock', k: 'stock', t: 'Stock, by zone', d: 'Pantry, fridge, freezer, reserve — in the walk order the house sets. On hand is never typed; it moves through the ledger, with an actor and a reason.', tag: 'Scan · count · par' },
  { id: 'queue', k: 'buy', t: 'The queue', d: 'What to buy and nothing else. Each line carries where it came from, who asked, who approved, and the cheapest store on the price ledger.', tag: 'Eight purchasing rules' },
  { id: 'cook', k: 'cook', t: 'Cook mode', d: 'Today’s prep in the house’s own time zone, timers in the steps, the allergen check before plating. Complete, and stock goes down — once.', tag: 'Tray notes rendered, never stored' },
  { id: 'shop', k: 'shop', t: 'Shopping mode', d: 'An aisle-ordered list, priced by store. A pick becomes Purchased with the real store and the real cost. Picks queue offline and never count twice.', tag: 'Works with no signal' },
];

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

function hero(cfg, p) {
  return `<section class="hero" id="top" aria-labelledby="h1">
    <div class="wrap hero-in">
      <div class="hero-t">
        ${eyebrow('The kitchen software for care homes · live at careshop.app')}
        <h1 id="h1">${esc(p.headline.text)}</h1>
        <p class="lede">${esc(p.lede)}</p>
        <div class="ctas">
          <a class="btn pri lg" href="${esc(cfg.cta.primaryHref)}" data-cta="hero">${ICON.arrow}${esc(cfg.cta.primary)}</a>
          <a class="btn lg" href="#loop">${esc(cfg.cta.secondary)}</a>
        </div>
        <p class="fine">Free to start — one house, up to three people, you included. No card to begin. Installs on iOS and Android.</p>
      </div>
      <div class="hero-v">
        <div class="fan" aria-hidden="true">
          <div class="fan-p is-l">${iosShell('careshop', { key: 'expiry' })}</div>
          <div class="fan-p is-c">${iosShell('careshop', { key: 'buy' })}</div>
          <div class="fan-p is-r">${iosShell('careshop', { key: 'menu' })}</div>
        </div>
      </div>
    </div>
  </section>`;
}

const stats = () => sec('numbers', 'numbers', `<div class="wrap"><ul class="stats">${STATS.map(([n, l, d]) => `<li><span class="stat-n">${esc(n)}</span><span class="stat-l">${esc(l)}</span><span class="stat-d">${esc(d)}</span></li>`).join('')}</ul></div>`, { label: 'Four numbers' });

function loop() {
  const s = find('loop');
  const n = RING.length - 1, R = 150, cx = 190, cy = 190;
  const pts = RING.slice(0, n).map((label, i) => { const a = (-90 + (360 / n) * i) * Math.PI / 180; return { label, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), i }; });
  const svg = `<svg class="ring" viewBox="0 0 380 380" role="img" aria-label="The loop: count, queue, approve, shop, receipt, stock, cook, and back to count">
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 7" opacity=".45"/>
    ${pts.map((pt) => `<g class="ring-n ${pt.i === 1 ? 'is-accent' : ''}"><circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="27"/><text x="${pt.x.toFixed(1)}" y="${(pt.y + 4).toFixed(1)}" text-anchor="middle">${esc(pt.label)}</text></g>`).join('')}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="ring-c">the loop</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="ring-s">closes by itself</text>
  </svg>`;
  return sec('loop', 'loop', `<div class="wrap loop-g">
    <div class="loop-t">
      ${eyebrow('The organising idea')}
      ${h2('loop', s.heading, 'The house’s own data moves around eight stations without anyone re-typing it. A feature that does not sit on the loop has to justify itself against it.')}
      <ol class="stations">${s.nodes.map((nd) => `<li><b>${esc(nd.label)}</b><span>${esc(nd.note)}</span></li>`).join('')}</ol>
    </div>
    <div class="loop-v">${svg}</div>
  </div>`);
}

function tilesBlock() {
  return sec('tiles', 'tiles', `<div class="wrap">
    <div class="head">${eyebrow('Four screens a house lives on')}${h2('tiles', 'Stock, the queue, cook mode, the shop.', 'Phone-first, because the person counting is at the shelf and the person buying is in the store.')}</div>
    <div class="tile-g">${TILES.map((t) => `<article class="tile" id="${esc(t.id)}">
      <div class="tile-v"><div class="crop">${iosShell('careshop', { key: t.k })}</div></div>
      <div class="tile-t"><span class="tag">${esc(t.tag)}</span><h3>${esc(t.t)}</h3><p>${esc(t.d)}</p></div>
    </article>`).join('')}</div>
  </div>`, { label: 'The four screens' });
}

function reserve() {
  const s = find('depth');
  return sec('reserve', 'reserve', `<div class="wrap res-g">
    <div class="res-t">${eyebrow('Reserves and the rule')}${h2('reserve', s.heading, s.sub)}<p class="pull">${esc(s.pull)}</p><p class="closing">${esc(s.closing)}</p></div>
    <div class="res-l">${s.rows.map(([t, w, where]) => `<div class="res-r"><b>${esc(t)}</b><span>${esc(w)}</span><em>${esc(where)}</em></div>`).join('')}</div>
  </div>`);
}

function record() {
  const s = find('evidence');
  return sec('record', 'record', `<div class="wrap">
    <div class="head">${eyebrow('Residents')}${h2('record', s.heading, 'Diet tags, allergens, one texture level. Enough for a tray note and a menu check, and nothing more.')}</div>
    <div class="ev">${s.blocks.map((b) => `<div class="ev-b"><span class="strip-l">${esc(b.label)}</span>${b.quote ? `<p class="quote">${esc(b.quote)}</p>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}</div>`).join('')}</div>
    <div class="refused"><span class="strip-l">Nine things it refuses to do, and will not do under another name</span>
      <ul class="chips">${REFUSED.map(([t, why]) => `<li><b>${esc(t)}</b><span>${esc(why)}</span></li>`).join('')}</ul>
    </div>
    <p class="boundary">CareShop runs the household. It does not keep residents’ care records, schedule staff, or build binders.</p>
  </div>`);
}

function roles() {
  const s = find('roles');
  return sec('roles', 'roles', `<div class="wrap">
    <div class="head">${h2('roles', s.heading, s.sub)}</div>
    <div class="role-l">${s.rows.map(([r, who, does, dev, wash]) => `<div class="role ${wash ? 'is-wash' : ''}"><span class="role-n">${esc(r)}</span><span class="role-w">${esc(who)}</span><span class="role-d">${esc(does)}</span><span class="role-r">${esc(dev)}</span></div>`).join('')}</div>
  </div>`);
}

const questions = () => sec('questions', 'questions', `<div class="wrap q-g"><div class="head">${h2('questions', 'The questions we get.')}</div>${faq(find('objections').rows)}</div>`);

function pricing(cfg, p) {
  const rows = [['Free', '$0', 'One house, up to three people. No card to begin.'], ...p.pricing.rows.filter(([n]) => n !== '3-day trial')];
  return sec('pricing', 'pricing', `<div class="wrap">
    <div class="head">${h2('pricing', 'Nineteen dollars a house.', 'Every plan sees every screen; an action above your plan is shown with its cost, never silently blocked.')}</div>
    <div class="tiers">${rows.map(([n, price, d], i) => `<div class="tier ${i === 1 ? 'is-main' : ''}"><span class="tier-n">${esc(n)}</span><span class="tier-p">${esc(price)}</span><span class="tier-d">${esc(d)}</span><a class="btn ${i === 1 ? 'pri' : ''}" href="${esc(cfg.cta.primaryHref)}">${i === 0 ? 'Start free' : 'Start with ' + esc(n)}</a></div>`).join('')}</div>
    <p class="fine">Sold on the web through Stripe Checkout; the app never presents a purchase sheet. Cancel in one tap, export any time.</p>
  </div>`);
}

function start(cfg) {
  const s = find('start');
  return sec('start', 'start', `<div class="wrap start-g">
    <div>${eyebrow('The first ten minutes')}${h2('start', 'If the loop closes once, you trust it.')}</div>
    <ol class="ten">${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
    <a class="btn pri lg" href="${esc(cfg.cta.primaryHref)}" data-cta="start">${ICON.arrow}${esc(cfg.cta.primary)}</a>
  </div>`);
}

export function render(cfg, p) {
  const brand = `<span class="brand-c" aria-hidden="true">C</span><span class="brand-n">careshop<span>.app</span></span>`;
  return `${nav(cfg, p, { brand })}
<main id="main" class="page face canvas" data-product="careshop" data-mode="light">
${hero(cfg, p)}
${stats()}
${loop()}
${tilesBlock()}
${reserve()}
${record()}
${roles()}
${questions()}
${pricing(cfg, p)}
${start(cfg)}
</main>
${foot(cfg, p, { fine: find('foot').disclaimer, links: [['/features', 'Features'], ['/pricing', 'Pricing'], ['/contact', 'Contact']] })}`;
}
