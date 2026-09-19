// /stock — Aisle 2 in depth: zones, par, Expiry Watch, reserves, the ledger.

import { esc, sec, h2 } from '../../shared.js';
import { iosShell } from '../../instruments.js';
import { PAGES } from '../../../data/page.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker, screen, parDemo, ladderDemo, reserveDemo, printList, showMe } from './parts.js';

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);
const phone = (key) => `<div class="ph" data-phone="${esc(key)}">${iosShell('careshop', { key })}</div>`;

export function stockPage(cfg, p) {
  const st = screen('stock');
  const ex = screen('expiry');
  const loop = find('loop');
  const depth = find('depth');
  const reserveRow = depth.rows.find(([t]) => t === 'Emergency reserves');
  const foodRow = depth.rows.find(([t]) => t === 'Food safety');
  const machine = (label) => loop.machines.find(([l]) => l === label)[1];

  const inner = `${pageHead('Aisle 2 · stock', 'Stock, by zone. On hand is never typed.', st.desktopSub)}
${sec('zones', 'zones', `<div class="wrap aisle-g">
  <div class="aisle-ph"><div class="crop">${phone('stock')}</div><p class="ph-cap">${esc(st.foot)}</p></div>
  <div class="aisle-d">
    ${sticker('shelf', 'Four zones · walk order set by the house')}
    ${h2('zones', 'Zone is where it sits.', 'Pantry, fridge, freezer, reserve — in the walk order the house sets. Category is the catalogue facet; aisle is the route through a store. The three are never conflated, because they are three different physical sequences.')}
    <div class="zones">${st.zones.map((z, i) => `<span class="zone"><span class="zone-n">${i + 1}</span>${ic(['shelf', 'water', 'clock', 'lock'][i], 16)}${esc(z)}</span>`).join('')}</div>
    <p class="st-p">${esc(loop.nodes[0].note)}</p>
    <div class="shows">${showMe('Rice', 'Short')}${showMe('Whole milk', 'Expiring')}${showMe('Oatmeal', 'Stocked')}</div>
  </div>
</div>`)}
${sec('par', 'par-s', `<div class="wrap aisle-g is-rev">
  <div class="aisle-ph">${parDemo()}</div>
  <div class="aisle-d">${sticker('scale', 'Par')}${h2('par', 'Par is the one number you set.', 'A par is a target, not a fact, so it stays direct. Everything else about on-hand moves through the ledger — count, scan, cook, discard, receipt — with an actor and a reason on every row.')}<p class="st-p">${esc(find('start').steps[1])} That is the second of the first ten minutes.</p></div>
</div>`)}
${sec('expiry', 'expiry-s', `<div class="wrap aisle-g">
  <div class="aisle-ph"><div class="crop">${phone('expiry')}</div><p class="ph-cap">${esc(ex.foot)}</p></div>
  <div class="aisle-d">${sticker('clock', 'Expiry Watch')}${h2('expiry', 'Dated at entry, most urgent first.', machine('Expiry'))}${ladderDemo()}<p class="st-p"><b>${esc(foodRow[0])}.</b> ${esc(foodRow[1])} <em class="today">${esc(foodRow[2])}</em></p></div>
</div>`)}
${sec('reserves', 'reserves-s', `<div class="wrap aisle-g is-rev">
  <div class="aisle-ph">${reserveDemo()}</div>
  <div class="aisle-d">${sticker('water', 'Reserves')}${h2('reserves', depth.heading, depth.pull)}<p class="st-p">${esc(machine('Reserve'))}</p><p class="st-p"><b>${esc(reserveRow[0])}.</b> ${esc(reserveRow[1])} <em class="today">${esc(reserveRow[2])}</em></p><p class="st-p">${esc(find('start').steps[3])}</p><a class="more" href="/rules">${ic('arrow', 16)}The rule, and how sure we are</a></div>
</div>`)}
${sec('ledger', 'ledger', `<div class="wrap ledger-in">
  ${sticker('receipt', 'The ledger')}
  <p class="pull">Every change to on-hand is a recorded, immutable movement.</p>
  <p class="closing">${esc(loop.closing)}</p>
  <div class="ctas"><a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="stock-end"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a><button type="button" class="btn lg" data-print>${ic('print', 18)}Print the shopping list</button></div>
</div>`, { label: 'The ledger' })}
${printList(cfg)}`;
  return page(cfg, p, 'stock', inner);
}
