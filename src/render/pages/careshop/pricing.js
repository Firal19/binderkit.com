// /pricing — the price tags.
//
// careshop.app is the one live product in the family, so this page shows what
// the product charges today: Free, Pro at $19 a house, Scale at $37. The
// three tiers are read from data/brand.js; the terms slip says how it is
// sold; the questions end in a person to write to.

import { esc, sec, h2, faq, reach } from '../../shared.js';
import { PAGES } from '../../../data/page.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker, directory, tierCards } from './parts.js';

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

/* the terms of the till, as the product sells itself */
const TERMS = [
  ['SOLD ON', 'The web, through Stripe Checkout'],
  ['THE APP', 'Never presents a purchase sheet'],
  ['THE UNIT', 'A house. Not a seat, not a resident, not an item'],
  ['ABOVE YOUR PLAN', 'Shown with its cost, never silently blocked'],
  ['CANCEL', 'One tap, and export any time'],
  ['THE SHOPPER WITH NO ACCOUNT', 'Opens a shared run and closes it. Not a seat, and not counted'],
];

export function pricingPage(cfg, p) {
  const s = find('pricing');
  const inner = `${pageHead('Price tags', s.heading, s.sub)}
${directory([['plans', 'The plans'], ['terms', 'How it is sold'], ['counts', 'What a plan counts'], ['questions', 'Questions']])}
${sec('plans', 'plans-s', `<div class="wrap">
  ${tierCards(cfg, p, { cta: 'pricing-page' })}
  <p class="fine">${esc(s.note)}</p>
</div>`, { label: 'Plans' })}
${sec('terms', 'terms-s', `<div class="wrap">
  <div class="head">${sticker('tag', 'Before you reach for a card')}${h2('terms', 'How it is sold.', 'Free, nineteen and thirty-seven are the real prices, and you can pay them today.')}</div>
  <dl class="terms">${TERMS.map(([k, v]) => `<div class="terms-r"><dt>${esc(k.charAt(0) + k.slice(1).toLowerCase())}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
</div>`)}
${sec('counts', 'counts-s', `<div class="wrap">
  <div class="head">${sticker('tag', 'What a plan counts')}${h2('counts', 'The unit is the house.', 'Not the seat, not the resident, not the item. A plan covers however many people work in a house.')}</div>
  <dl class="defs">
    <dt>Houses</dt><dd>Free covers one. Pro covers up to five. Scale is unlimited, with spend across houses, catalogue import, and copying a catalogue from one house to another.</dd>
    <dt>People</dt><dd>Free is three. Above that a plan does not count people at all.</dd>
    <dt>An action above your plan</dt><dd>Shown with its cost, never silently blocked. You see the screen either way.</dd>
    <dt>The person with no account</dt><dd>A spouse doing the Costco run opens a shared run, ticks it off and closes it. Not a seat, and not counted.</dd>
  </dl>
</div>`)}
${sec('questions', 'pq-s', `<div class="wrap q-g">
  <div class="head">${sticker('mail', 'Asked at the till')}${h2('questions', 'The questions we get.')}</div>
  ${faq(find('objections').rows)}
</div><div class="wrap">${reach(cfg, p, { formHref: '/write', id: 'reach-pricing', subject: 'Pricing — CareShop' })}</div>`)}
${sec('pjoin', 'pjoin-s', `<div class="wrap">
  <div class="head">${sticker('clock', 'The first ten minutes')}${h2('pjoin', 'If the loop closes once, you trust it.', 'Start on the free plan with one house. No card until you want a second.')}</div>
  <div class="ctas"><a class="btn pri lg" href="${esc(cfg.cta.primaryHref)}" data-cta="pricing-join">${esc(cfg.cta.primary)}${ic('arrow', 18)}</a><a class="btn lg" href="/write">${ic('mail', 18)}Ask about pricing</a></div>
</div>`)}`;
  return page(cfg, p, 'pricing', inner);
}
