// /pricing — the price tags.
//
// careshop.app is the one live product in the family, so this page shows what
// the product charges today and nothing it does not. The three tiers, their
// sentences and the note are read from data/brand.js and data/page.js; the
// ladder is the product's own upgrade path. Nothing here is invented, and the
// three-day trial is named as not live rather than sold.

import { esc, sec, h2, faq } from '../../shared.js';
import { PAGES } from '../../../data/page.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker } from './parts.js';

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

/* A tier's list is that tier's own sentence, broken where it is already a
   list — the same rule the front page uses, so the two cannot drift. */
const lines = (d) => ['Every screen, every plan', ...d.split(/\.\s+/).flatMap((x) => {
  const t = x.replace(/\.$/, '').trim();
  return t.length > 40 ? t.split(/,\s+/) : [t];
}).filter(Boolean).map((t) => t.charAt(0).toUpperCase() + t.slice(1))];

export function pricingPage(cfg, p) {
  const s = find('pricing');
  const ladder = find('ladder');
  const rows = [['Free', '$0', 'One house, up to three people. No card to begin.'],
    ...p.pricing.rows.filter(([n]) => n !== '3-day trial' && n !== 'Free')];

  const inner = `${pageHead('Price tags', s.heading, s.sub)}
${sec('plans', 'plans-s', `<div class="wrap">
  <div class="tiers">${rows.map(([n, price, d], i) => `<div class="tier ${i === 1 ? 'is-main' : ''}">${i === 1 ? '<span class="tier-flag">Most houses</span>' : ''}<span class="tier-n">${esc(n)}</span><span class="tier-p">${esc(price.replace(' / mo', ''))}<small>${price.includes('/ mo') ? ' / house / mo' : ''}</small></span><ul class="tier-f">${lines(d).map((t) => `<li><span class="tier-tick" aria-hidden="true"></span>${esc(t)}</li>`).join('')}</ul><a class="btn ${i === 1 ? 'pri' : ''}" href="${esc(cfg.cta.primaryHref)}" data-cta="pricing">${i === 0 ? 'Start free' : 'Start with ' + esc(n)}</a></div>`).join('')}</div>
  <p class="fine">${esc(s.note)}</p>
</div>`, { label: 'Plans' })}
${sec('counts', 'counts-s', `<div class="wrap">
  <div class="head">${sticker('tag', 'What a plan counts')}${h2('counts', 'The unit is the house.', 'Not the seat, not the resident, not the item. A house is a licensed facility, and a plan covers however many people work in it.')}</div>
  <dl class="defs">
    <dt>Houses</dt><dd>Free covers one. Pro covers up to five. Scale is unlimited, and adds spend across houses, catalogue import, and copying a catalogue from one house to another.</dd>
    <dt>People</dt><dd>Free is three. Above that a plan does not count people at all — a house puts its whole kitchen on it.</dd>
    <dt>An action above your plan</dt><dd>Shown with its cost, never silently blocked. You see the screen either way.</dd>
    <dt>The person with no account</dt><dd>A spouse doing the Costco run opens a shared run, checks off and closes it. That is not a seat and is not counted.</dd>
  </dl>
</div>`)}
${sec('ladder', 'ladder-s', `<div class="wrap">
  <div class="head">${sticker('box', 'When the kitchen becomes the house')}${h2('ladder', ladder.heading, ladder.sub)}</div>
  <ul class="lad">${ladder.rows.map(([from, to]) => `<li class="lad-r"><span class="lad-f">${esc(from)}</span>${ic('arrow', 16)}<span class="lad-t">${esc(to)}</span></li>`).join('')}</ul>
  <p class="fine">Nothing is re-typed and nothing is stranded: what the kitchen holds is exported and imported whole, on one login.</p>
</div>`)}
${sec('questions', 'pq-s', `<div class="wrap q-g">
  <div class="head">${sticker('mail', 'Asked at the till')}${h2('questions', 'The questions we get.')}</div>
  ${faq(find('objections').rows)}
</div>`)}
${sec('pjoin', 'pjoin-s', `<div class="wrap">
  <div class="head">${sticker('clock', 'The first ten minutes')}${h2('pjoin', 'If the loop closes once, you trust it.', 'Start on the free plan with one house. No card until you want a second.')}</div>
  <div class="ctas"><a class="btn pri lg" href="${esc(cfg.cta.primaryHref)}" data-cta="pricing-join">${esc(cfg.cta.primary)}${ic('arrow', 18)}</a><a class="btn lg" href="/write">${ic('mail', 18)}Ask about pricing</a></div>
</div>`)}`;
  return page(cfg, p, 'pricing', inner);
}
