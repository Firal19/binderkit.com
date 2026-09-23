// /about — the live product, what it does, and who to write to.
//
// Short on purpose. What CareShop is, three things that are true of it, the
// one line it will not cross, and a person to write to. The maker appears as
// the byline lockup at the foot of every page, and nowhere else.

import { esc, sec, h2, hello, mailto, byline, reach } from '../../shared.js';
import { PAGES } from '../../../data/page.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker, directory } from './parts.js';

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

const TRUE = [
  ['Live, and bought today', 'A caregiver scans groceries into it at the shelf and in the store. Free, Pro at $19 a house, Scale at $37, sold on the web.'],
  ['The loop, closed', 'A menu shortfall, an expiry, a par breach or a reserve gap files its own buy request, and nobody re-types anything.'],
  ['A resident is a label', 'Initials or a room number, diet tags, one texture level, allergens. No diagnosis, no medication, no note.'],
  ['The reserve target', 'Days × licensed beds × the quantity per bed per day, with the on-hand reading and the gap, on the dashboard and on the surveyor PDF.'],
  ['Expiry, on every dated item', 'Dated at entry, sorted by urgency, totalled as value at risk.'],
  ['Offline in the store', 'Picks wait on the phone with no signal, land once, and are never counted twice.'],
];

export function aboutPage(cfg, p) {
  const proof = find('proof');
  const inner = `${pageHead('About the store', 'The kitchen software for care homes.', p.lede)}
${directory([['live', 'What it does', '3 proofs'], ['true', 'What is true of it', '6 lines'], ['line', 'The one line', '1 sentence'], ['who', 'Write to a person', '1 inbox']], { title: 'On this page' })}
${sec('live', 'live', `<div class="wrap">
  <div class="head">${sticker('store', 'Live at careshop.app')}${h2('live', 'What it does.', p.toneLine)}</div>
  <ul class="proofs">${proof.items.map(([t, d], i) => `<li>${ic(['barcode', 'cart', 'person'][i], 20)}<p><b>${esc(t)}.</b> ${esc(d)}</p></li>`).join('')}</ul>
</div>`)}
${sec('true', 'true-s', `<div class="wrap">
  <div class="head">${sticker('receipt', 'On the shelf')}${h2('true', 'What is true of it.', 'Six things you can open the product and check on day one.')}</div>
  <div class="take-g is-one">
    <div class="take-c is-on">
      <ul class="take-l">${TRUE.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ul>
    </div>
  </div>
</div>`)}
${sec('line', 'line-s', `<div class="wrap ledger-in">
  ${sticker('scale', 'The one line')}
  <p class="pull">CareShop runs the kitchen. It reads a house against its own counts, never ranks one house against another, and never says a house is compliant.</p>
  <p class="closing">Nothing clinical is stored. A resident is a label, a tray note is drawn when you look, and a message out of the system carries a house code and a count.</p>
</div>`, { label: 'The one line' })}
${sec('who', 'who', `<div class="wrap who-in">
  ${sticker('mail', 'Write to a person')}
  ${h2('who', 'Made in Oregon, for Oregon houses.', 'One inbox. The person who built it reads it and answers.')}
  <div class="who-r">${byline()}<a class="btn" href="${mailto(cfg)}">${ic('mail', 18)}${esc(hello(cfg))}</a><a class="btn pri" href="/write">${ic('receipt', 18)}Write to a person</a></div>
  ${reach(cfg, p, { formHref: '/write', id: 'reach-about' })}
</div>`)}`;
  return page(cfg, p, 'about', inner);
}
