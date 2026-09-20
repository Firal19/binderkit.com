// /loop — the loop at full depth: seven stations, six screens, and the
// sentences from the specification and the feature register beside each.

import { esc, sec, h2 } from '../../shared.js';
import { iosShell } from '../../instruments.js';
import { PAGES } from '../../../data/page.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker, screen, approveDemo, receiptInstrument, showMe } from './parts.js';

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

const REG = {
  count: 'Stock, zones, expiry',
  scan: 'Scan — a barcode and a name',
  queue: 'The queue and the purchasing rules',
  shop: 'Shopping trips, prices, receipts',
  cook: 'Menus, recipes, cook mode',
  reserve: 'Emergency reserves',
  today: 'Today and the daily briefing',
};
const reg = (k) => `<span class="reg"><b>${esc(REG[k])}</b></span>`;

const phone = (key) => `<div class="ph" data-phone="${esc(key)}">${iosShell('careshop', { key })}</div>`;

function station(i, id, title, body, visual, opts = {}) {
  return sec(`s-${id}`, `station ${opts.rev ? 'is-rev' : ''}`, `<div class="wrap st-g">
    <div class="st-t">
      <span class="st-no"><b>${i}</b><span>of 7</span></span>
      ${h2(`s-${id}`, title)}
      ${body}
    </div>
    <div class="st-v">${visual}</div>
  </div>`);
}

export function loopPage(cfg, p) {
  const s = find('loop');
  const q = find('screen');
  const node = (label) => s.nodes.find((n) => n.label === label);
  const machine = (label) => s.machines.find(([l]) => l === label)[1];
  const buy = screen('buy');
  const para = (t) => `<p class="st-p">${esc(t)}</p>`;
  const rail = `<nav class="rail" aria-label="Stations" data-spy data-scrollx>${['count', 'queue', 'approve', 'shop', 'receipt', 'stock', 'cook'].map((id, i) => `<a href="#s-${id}"><span>${i + 1}</span>${esc(id.charAt(0).toUpperCase() + id.slice(1))}</a>`).join('')}</nav>`;

  const inner = `${pageHead('Aisle 1 · the loop', s.heading, s.sub, `<div class="ctas"><a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="loop"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a><a class="btn lg" href="#s-count">${ic('down', 18)}Start at the count</a></div>`)}
${rail}
${station(1, 'count', node('The count').label + '.', `${reg('count')}${reg('scan')}${para(node('The count').note)}${para(find('proof').items[0][1])}<div class="shows">${showMe('Rice · 10 lb', 'The row that is short')}${showMe('Bottled water', 'The reserve gap')}</div>`, phone('stock'))}
${station(2, 'queue', 'The queue.', `${reg('queue')}${para(q.sub)}${para(node('The shortfall').note)}<div class="shows">${buy.rows.slice(0, 4).map((r) => showMe(r.item, r.origin.split(' · ')[0])).join('')}</div>`, phone('buy'), { rev: true })}
${station(3, 'approve', node('The policy').label + '.', `${para(node('The policy').note)}<p class="st-p"><b>${esc(q.side.label)}.</b> ${esc(q.side.text)}</p>`, approveDemo())}
${station(4, 'shop', node('The shop').label + '.', `${reg('shop')}${para(node('The shop').note)}${para(find('objections').rows[2][1])}<div class="shows">${showMe('Oatmeal', 'Still to pick')}${showMe('Bottled water', 'Cheaper at Costco')}</div>`, phone('shop'), { rev: true })}
${station(5, 'receipt', node('The receipt').label + '.', `${para(node('The receipt').note)}<p class="st-p"><b>The shared run.</b> ${esc(machine('Shared run'))}</p>`, receiptInstrument())}
${station(6, 'stock', 'Back on the shelf.', `${reg('reserve')}<p class="st-p"><b>Expiry.</b> ${esc(machine('Expiry'))}</p><p class="st-p"><b>Reserve.</b> ${esc(machine('Reserve'))}</p><div class="shows">${showMe('Applesauce', 'Two days')}${showMe('Frozen peas', 'Over — a note, not an alarm')}</div><a class="more" href="/stock">${ic('arrow', 16)}Stock in depth</a>`, phone('expiry'), { rev: true })}
${station(7, 'cook', node('The menu').label + ', and the cook.', `${reg('cook')}${para(node('The menu').note)}<p class="st-p"><b>Cook.</b> ${esc(machine('Cook'))}</p><div class="shows">${showMe('Allergen check', 'Before plating')}${showMe('Complete', 'Stock down, once')}</div>`, `<div class="ph-pair" data-scrollx>${phone('cook')}${phone('menu')}</div>`)}
${sec('ledger', 'ledger', `<div class="wrap ledger-in">
  ${sticker('receipt', 'The record')}
  <p class="pull">${esc(s.pull)}</p>
  <p class="closing">${esc(s.closing)}</p>
  <div class="ctas"><a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="loop-end"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a><a class="btn lg" href="/#kitchen">${ic('house', 18)}Your kitchen</a></div>
</div>`, { label: 'The record' })}`;
  return page(cfg, p, 'loop', inner);
}
