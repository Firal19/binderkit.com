// /stock — Aisle 2 in depth: zones, par, Expiry Watch, reserves, the ledger.

import { esc, sec, h2 } from '../../shared.js';
import { iosShell } from '../../instruments.js';
import { PAGES } from '../../../data/page.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker, screen, parDemo, ladderDemo, reserveDemo, printList, showMe, directory } from './parts.js';

/* ── the fold: below 640 a long aisle opens as an index ────────────────
   sec() lives in render/shared.js and takes no attribute bag, so the two
   attributes the shared folds() controller reads are stamped onto the
   section it returns. Nothing leaves the HTML: with scripting off, on a
   printer, or above 640px every section is open and whole. */
const fold = (html, gist) =>
  html.replace('<section class="sec ', `<section data-phone="fold" data-gist="${esc(gist)}" class="sec `);


const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);
const phone = (key) => `<div class="ph" data-phone="${esc(key)}">${iosShell('careshop', { key })}</div>`;


/* ── THE THREE AXES, NEVER CONFLATED ───────────────────────────────────
   Rule 2 of the product's twelve: zone (the house) is not aisle (the shop
   walk) is not category (the catalogue facet); none is derived from
   another and none is merged into one ordering. The instrument is three
   exclusive disclosures over the SAME five items, so the reader sees one
   shelf sorted two real ways — and is told plainly why the third is a
   definition here rather than a list. `name=` on <details> is the
   browser's own exclusive accordion: no script, and where it is not
   supported the panels simply all open, which is still correct. */
const AXES = [
  ['Zone', '9 zones', 'Where it sits in the house, in the walk order the house sets.', [
    ['Pantry', 'Rice · 10 lb · Oatmeal · 42 oz'],
    ['Fridge', 'Whole milk · gal · Applesauce · cups'],
    ['Reserve', 'Bottled water · 24-pk'],
  ]],
  ['Aisle', '19 aisles', 'The route through one shop, in that shop’s own sequence. Never alphabetical, never by category.', [
    ['Aisle 3 · Dairy', 'Whole milk · 2 gal · Oat milk · 1 gal'],
    ['Aisle 7 · Grains', 'Rice · 10 lb · Oatmeal · 42 oz'],
    ['Aisle 12 · Water', 'Bottled water · 24-pk × 3'],
  ]],
  ['Category', '20 categories', 'The catalogue’s own facet, for meal planning. Not listed here on purpose: nobody walks a category, and the product never derives one axis from another.', []],
];

/* the movement: the seven things every change to on-hand carries. Read
   straight out of the loop's closing paragraph in data/page.js. */
const MOVEMENT = [
  ['item', 'Rice · 10 lb'],
  ['house', 'WH-1'],
  ['delta', '−2 cups'],
  ['reason', 'cook · from a fixed set'],
  ['actor', 'K. Silva'],
  ['time', 'Thu 18:42'],
  ['key', 'recorded exactly once'],
];

export function stockPage(cfg, p) {
  const st = screen('stock');
  const ex = screen('expiry');
  const loop = find('loop');
  const depth = find('depth');
  const reserveRow = depth.rows.find(([t]) => t === 'Emergency reserves');
  const foodRow = depth.rows.find(([t]) => t === 'Food safety');
  const machine = (label) => loop.machines.find(([l]) => l === label)[1];
  const closers = find('evidence').closingBlocks;

  const inner = `${pageHead('Aisle 2 · stock', 'Stock, by zone. On hand is never typed.', st.desktopSub)}
${directory([['zones', 'Zones', '4 in this house'], ['par', 'Par', '1 number you set'], ['expiry', 'Expiry Watch', '$14.20 at risk'], ['reserves', 'Reserves', 'days × beds'], ['axes', 'The three axes', 'never merged'], ['movement', 'The movement record', '7 fields'], ['ledger', 'The record', '1 rule']], { title: 'On this page' })}
${sec('zones', 'zones', `<div class="wrap aisle-g">
  <div class="aisle-ph"><div class="crop">${phone('stock')}</div></div>
  <div class="aisle-d">
    ${sticker('shelf', 'Four zones · walk order set by the house')}
    ${h2('zones', 'Zone is where it sits.', 'Pantry, fridge, freezer, reserve, in the walk order the house sets.')}
    <div class="zones">${st.zones.map((z, i) => `<span class="zone"><span class="zone-n">${i + 1}</span>${ic(['shelf', 'water', 'clock', 'lock'][i], 16)}${esc(z)}</span>`).join('')}</div>
    <p class="st-p">${esc(loop.nodes[0].note)}</p>
    <div class="shows">${showMe('Rice', 'Short')}${showMe('Whole milk', 'Expiring')}${showMe('Oatmeal', 'Stocked')}</div>
  </div>
</div>`)}
${fold(sec('par', 'par-s', `<div class="wrap aisle-g is-rev">
  <div class="aisle-ph">${parDemo()}</div>
  <div class="aisle-d">${sticker('scale', 'Par')}${h2('par', 'Par is the one number you set.', 'A par is a target, not a fact. Everything else about on-hand moves through the record, with an actor and a reason on every row.')}<p class="st-p">${esc(find('start').steps[1])}</p></div>
</div>`), 'Par is a target you set; everything else moves through the record.')}
${fold(sec('expiry', 'expiry-s', `<div class="wrap aisle-g">
  <div class="aisle-ph"><div class="crop">${phone('expiry')}</div></div>
  <div class="aisle-d">${sticker('clock', 'Expiry Watch')}${h2('expiry', 'Dated at entry, most urgent first.', machine('Expiry'))}${ladderDemo()}<p class="st-p"><b>${esc(foodRow[0])}.</b> ${esc(foodRow[1])} <em class="today">${esc(foodRow[2])}</em></p></div>
</div>`), 'Dated at entry, most urgent first, with the value at risk.')}
${fold(sec('reserves', 'reserves-s', `<div class="wrap aisle-g is-rev">
  <div class="aisle-ph">${reserveDemo()}</div>
  <div class="aisle-d">${sticker('water', 'Reserves')}${h2('reserves', depth.heading, depth.pull)}<p class="st-p">${esc(machine('Reserve'))}</p><p class="st-p"><b>${esc(reserveRow[0])}.</b> ${esc(reserveRow[1])} <em class="today">${esc(reserveRow[2])}</em></p><p class="st-p">${esc(find('start').steps[3])}</p><a class="more" href="/rules">${ic('arrow', 16)}The rule, and how sure we are</a></div>
</div>`), 'Days × beds × the quantity per bed per day.')}
${fold(sec('axes', 'axes-s', `<div class="wrap">
  <div class="head">${sticker('sort', 'Three sequences, one item')}${h2('axes', 'Zone is not aisle is not category.', 'The same five things, sorted the two ways a person actually walks them.')}</div>
  <div class="axes">${AXES.map(([n, count, note, rows], i) => `<details class="axes-d" name="careshop-axis"${i === 0 ? ' open' : ''}>
    <summary><b>${esc(n)}</b><span class="axes-c">${esc(count)}</span>${ic('down', 14)}</summary>
    <div class="axes-b"><p>${esc(note)}</p>${rows.length ? `<ul class="axes-l">${rows.map(([g, items]) => `<li><span class="axes-g">${esc(g)}</span><span>${esc(items)}</span></li>`).join('')}</ul>` : ''}</div>
  </details>`).join('')}</div>
</div>`), 'Zone, aisle and category are three different physical sequences.')}
${fold(sec('movement', 'move-s', `<div class="wrap">
  <div class="head">${sticker('receipt', 'The ledger rule')}${h2('movement', 'On hand is never typed.', 'Every change is a recorded movement. A correction is a further movement, never an edit.')}</div>
  <ul class="mvt">${MOVEMENT.map(([k, v]) => `<li><span class="mvt-k">${esc(k)}</span><b>${esc(v)}</b></li>`).join('')}</ul>
  <p class="demo-f">Seven fields on every movement. Delete is not one of the reasons.</p>
  <div class="two-up">${closers.map((b) => `<div class="two-c"><b>${esc(b.heading)}</b><p>${esc(b.text)}</p></div>`).join('')}</div>
</div>`), 'Seven fields on every movement — and what happens when two people disagree.')}
${sec('ledger', 'ledger', `<div class="wrap ledger-in">
  ${sticker('receipt', 'The record')}
  <p class="pull">Every change to on-hand is a recorded, immutable movement.</p>
  <p class="closing">${esc(loop.closing)}</p>
  <div class="ctas"><a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="stock-end"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a><button type="button" class="btn lg" data-print>${ic('print', 18)}Print the shopping list</button></div>
</div>`, { label: 'The record' })}
${printList(cfg)}`;
  return page(cfg, p, 'stock', inner);
}
