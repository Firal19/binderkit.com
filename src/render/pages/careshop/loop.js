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

/* Seven stations at 1,300px each is nine phone screens of walking before the
   record at the foot. `opts.gist` folds a station below 640: the sticky
   .rail above is already this page's index, every one of its pills is a
   hash link, and the shared folds() opens a target before it scrolls to it.
   Station 1 stays open — a page whose first station is shut has not
   started. */
function station(i, id, title, body, visual, opts = {}) {
  const s = sec(`s-${id}`, `station ${opts.rev ? 'is-rev' : ''}`, `<div class="wrap st-g">
    <div class="st-t">
      <span class="st-no"><b>${i}</b><span>of 7</span></span>
      ${h2(`s-${id}`, title)}
      ${body}
    </div>
    <div class="st-v">${visual}</div>
  </div>`);
  return opts.gist
    ? s.replace('<section class="sec ', `<section data-phone="fold" data-gist="${esc(opts.gist)}" class="sec `)
    : s;
}

export function loopPage(cfg, p) {
  const s = find('loop');
  const q = find('screen');
  const node = (label) => s.nodes.find((n) => n.label === label);
  const machine = (label) => s.machines.find(([l]) => l === label)[1];
  const buy = screen('buy');
  const sharedRun = find('evidence').blocks.find((b) => b.label === 'The shared run');
  const para = (t) => `<p class="st-p">${esc(t)}</p>`;
  const rail = `<nav class="rail" aria-label="Stations" data-spy data-scrollx>${['count', 'queue', 'approve', 'shop', 'receipt', 'stock', 'cook'].map((id, i) => `<a href="#s-${id}"><span>${i + 1}</span>${esc(id.charAt(0).toUpperCase() + id.slice(1))}</a>`).join('')}</nav>`;

  const inner = `${pageHead('Aisle 1 · the loop', s.heading, s.sub, `<div class="ctas"><a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="loop"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a><a class="btn lg" href="#s-count">${ic('down', 18)}Start at the count</a></div>`)}
${rail}
${station(1, 'count', node('The count').label + '.', `${reg('count')}${reg('scan')}${para(node('The count').note)}${para(find('proof').items[0][1])}<div class="shows">${showMe('Rice · 10 lb', 'The row that is short')}${showMe('Bottled water', 'The reserve gap')}</div>`, phone('stock'))}
${station(2, 'queue', 'The queue.', `${reg('queue')}${para(q.sub)}${para(node('The shortfall').note)}<div class="shows">${buy.rows.slice(0, 4).map((r) => showMe(r.item, r.origin.split(' · ')[0])).join('')}</div>`, phone('buy'), { rev: true, gist: 'What to buy and nothing else, each line with its origin.' })}
${station(3, 'approve', node('The policy').label + '.', `${para(node('The policy').note)}<p class="st-p"><b>${esc(q.side.label)}.</b> ${esc(q.side.text)}</p>`, approveDemo(), { gist: 'Auto under the threshold, a manager above — and recorded.' })}
${station(4, 'shop', node('The shop').label + '.', `${reg('shop')}${para(node('The shop').note)}${para(find('objections').rows[2][1])}<div class="shows">${showMe('Oatmeal', 'Still to pick')}${showMe('Bottled water', 'Cheaper at Costco')}</div>`, phone('shop'), { rev: true, gist: 'Aisle order at that shop. It works with no signal.' })}
${station(5, 'receipt', node('The receipt').label + '.', `${para(node('The receipt').note)}<p class="st-p"><b>The shared run.</b> ${esc(machine('Shared run'))}</p>`, receiptInstrument(), { gist: 'Closing the run is the only moment stock rises.' })}
${station(6, 'stock', 'Back on the shelf.', `${reg('reserve')}<p class="st-p"><b>Expiry.</b> ${esc(machine('Expiry'))}</p><p class="st-p"><b>Reserve.</b> ${esc(machine('Reserve'))}</p><div class="shows">${showMe('Applesauce', 'Two days')}${showMe('Frozen peas', 'Over — a note, not an alarm')}</div><a class="more" href="/stock">${ic('arrow', 16)}Stock in depth</a>`, phone('expiry'), { rev: true, gist: 'Expiry and the reserve, back on the shelf.' })}
${station(7, 'cook', node('The menu').label + ', and the cook.', `${reg('cook')}${para(node('The menu').note)}<p class="st-p"><b>Cook.</b> ${esc(machine('Cook'))}</p><div class="shows">${showMe('Allergen check', 'Before plating')}${showMe('Complete', 'Stock down, once')}</div>`, `<div class="ph-pair" data-scrollx>${phone('cook')}${phone('menu')}</div>`, { gist: 'The menu, the allergen check, complete — once.' })}
${sec('token', 'token-s', `<div class="wrap">
  <div class="head">${sticker('lock', 'The sixth person has no account')}${h2('token', 'A spouse doing the Costco run.', 'The person doing the shopping is often not the person with the licence, and the product is built around that rather than around a seat. A token link opens one run — and it is the sharpest example of the boundary this product keeps.')}</div>
  <div class="tok">
    <div class="tok-c is-yes"><span class="strip-l">${ic('check', 16)}The link grants</span><ul>${['Ticking an item off the run', 'Marking one unavailable', 'Closing the run when it is done'].map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
    <div class="tok-c is-no"><span class="strip-l">${ic('x', 16)}It grants nothing else</span><ul>${['No session, and no route into anything else', 'No resident, no tag, no tray note — the snapshot comes from a source that cannot read the resident table', 'No write to the ledger: a signed-in person confirms first, because an account-less person cannot be held to a financial record'].map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
  </div>
  <p class="st-p">${esc(sharedRun.text.split('The email that carries')[1] ? 'The email that carries' + sharedRun.text.split('The email that carries')[1] : sharedRun.text)}</p>
  <p class="demo-f">${esc(machine('Shared run'))}</p>
</div>`, { label: 'The shared run' })}
${sec('ledger', 'ledger', `<div class="wrap ledger-in">
  ${sticker('receipt', 'The record')}
  <p class="pull">${esc(s.pull)}</p>
  <p class="closing">${esc(s.closing)}</p>
  <div class="ctas"><a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="loop-end"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a><a class="btn lg" href="/#kitchen">${ic('house', 18)}Your kitchen</a></div>
</div>`, { label: 'The record' })}`;
  return page(cfg, p, 'loop', inner);
}
