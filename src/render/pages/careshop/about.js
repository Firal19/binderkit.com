// /about — the live product, who makes it, what is true today and what is
// not, the three rooms next door, and the ladder out of the kitchen.
//
// EVERY LINE ON THE LEDGER BELOW IS SOURCED. The live column is read from
// brand.js `proof` and `pricing` and from the "Today" column of the rule
// table in data/page.js; the not-live column is read from the same places
// — a row that says `coming`, a sentence in the specification that says
// "not in the product yet", and the trial, which brand.js prices at Free
// $0 / Pro $19 / Scale $37 and no trial at all. Nothing here is softened
// and nothing here is invented. An operator who states exactly what is and
// is not true is the rarest signal in this category; the page is built to
// make that legible rather than to hide it in a footnote.

import { esc, sec, h2, hello, mailto, byline, mark } from '../../shared.js';
import { byId } from '../../../data/brand.js';
import { PAGES } from '../../../data/page.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker, directory } from './parts.js';

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

/* ── the ledger. [what, where it is stated] ─────────────────────────────
   `live` is the shelf: it is running in houses today. `not` is the back
   room: specified, priced or promised, and not there. A reader who checks
   one of these against the product must find it exactly as written. */
const LIVE = [
  ['Live at careshop.app, and bought today', 'A caregiver scans groceries into it at the shelf and in the store. Free, Pro at $19 a house, Scale at $37 — sold on the web through Stripe Checkout.'],
  ['The loop, closed', 'A menu shortfall, an expiry, a par breach or a reserve gap files its own buy request carrying its origin, and nobody re-types anything.'],
  ['The origin on every request', 'Five origins and no sixth, recorded on every buy request and preserved through to purchase.'],
  ['Ten Oregon citations, explained', 'Ten are explained in one line each inside the product. Every other catalogue row carries the bare rule text and no explanation at all.'],
  ['A resident is a label', 'Initials or a room number, diet tags, one texture level, allergens. No diagnosis, no medication, no incident, no clinical note.'],
  ['The reserve target', 'Days × licensed beds × the quantity per bed per day, with the on-hand reading and the gap, on the dashboard and on the surveyor PDF.'],
  ['Expiry, on every dated item', 'Dated at entry, sorted by urgency, totalled as value at risk. An item tracked by count alone carries no date and never appears there.'],
  ['Offline in the store', 'Picks wait on the phone with no signal, land exactly once on reconnection, and are never counted twice.'],
];
const NOT = [
  ['The three-day trial', 'Not live. The tiers running today are Free, Pro and Scale, and there is no trial in the product at all. It is named here rather than sold.'],
  ['The confidence on a citation', 'Specified, not built. The field that would print confirmed or inferred beside a citation does not exist in the product yet.'],
  ['Four of the eight purchasing rules', 'Four run today. The receipt requirement, the trip cap, the substitution mode and price-at-pickup are not applied yet.'],
  ['The customer business associate agreement', 'CareShop holds residents’ diet tags, texture and allergens. A customer BAA belongs with that, and it is not in place yet. We are telling you because you would find out.'],
  ['Reading the till roll on the device', 'In the specification, not in the product. A pick is marked purchased by hand with the real store and the real cost.'],
  ['Fatal Four on residents', 'On items today. The per-resident tags and the coverage reading per house are designed and not built.'],
  ['The boundary sentence in Settings', 'Two wordings ship today and one of them has to be retired: whether CareShop runs the kitchen and the household, or the household.'],
];

const LADDER_LINE = 'CareShop graduates by export → import; your kitchen record is already in PHO’s shape.';

export function aboutPage(cfg, p) {
  const pho = byId.pho;
  const ladder = find('ladder');

  const inner = `${pageHead('About the store', 'The kitchen software for care homes.', `${p.proof[0]} ${p.lede}`)}
${directory([['live', 'What is true today', '3 proofs'], ['ledger', 'Live, and not live', '8 and 7'], ['grad', 'The ladder out of the kitchen', '5 rows'], ['who', 'Who makes this', '1 answer']], { title: 'On this page' })}
${sec('live', 'live', `<div class="wrap">
  <div class="head">${sticker('store', 'Live at careshop.app')}${h2('live', 'What is true today.', p.toneLine)}</div>
  <ul class="proofs">${p.proof.map((t, i) => `<li>${ic(['store', 'book', 'person'][i], 20)}<p>${esc(t)}</p></li>`).join('')}</ul>
</div>`)}
${sec('ledger', 'ledger-s', `<div class="wrap">
  <div class="head">${sticker('receipt', 'The stock take')}${h2('ledger', 'What is live, and what is not.', 'Everything on the left is in the product today. Everything on the right is specified, priced or promised somewhere, and is not.')}</div>
  <div class="take-g">
    <div class="take-c is-on">
      <span class="strip-l">${ic('check', 16)}On the shelf · ${LIVE.length}</span>
      <ul class="take-l">${LIVE.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ul>
    </div>
    <div class="take-c is-off">
      <span class="strip-l">${ic('x', 16)}Not in the product · ${NOT.length}</span>
      <ul class="take-l">${NOT.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ul>
    </div>
  </div>
  <p class="closing">A count is not a grade, and neither is this. It is the same ledger discipline the product applies to a shelf, applied to itself: on hand is what is on hand.</p>
</div>`)}
${sec('grad', 'grad-s', `<div class="wrap">
  <div class="head">${sticker('box', 'The ladder')}${h2('grad', ladder.heading, `${LADDER_LINE} ${ladder.sub}`)}</div>
  <ul class="ldr">${ladder.rows.map(([from, to]) => `<li class="ldr-r"><span class="ldr-f">${esc(from)}</span>${ic('arrow', 16)}<span class="ldr-t">${esc(to)}</span></li>`).join('')}</ul>
  <div class="grad-f">
    <span class="grad-mk">${mark('pho', 40, { label: false })}</span>
    <p>${esc(pho.descriptor)}. ${esc(ladder.footer)}</p>
    <a class="btn" href="https://providerhub.us" rel="noopener">${ic('store', 18)}providerhub.us</a>
  </div>
</div>`)}
${sec('who', 'who', `<div class="wrap who-in">
  ${sticker('person', 'Who makes this')}
  ${h2('who', 'Provider Hub Oregon makes it.', `${pho.descriptor}. For Oregon houses.`)}
  <div class="who-r">${byline()}<a class="btn" href="https://providerhub.us" rel="noopener">${ic('store', 18)}providerhub.us</a><a class="btn" href="${mailto(cfg)}">${ic('mail', 18)}${esc(hello(cfg))}</a><a class="btn pri" href="/write">${ic('receipt', 18)}Write to a person</a></div>
</div>`)}`;
  return page(cfg, p, 'about', inner);
}
