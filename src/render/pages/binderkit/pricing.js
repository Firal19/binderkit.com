// /pricing — the price is open, and the page prints that rather than a number.

import { SIGNUP_FIVE, BILLING_STATES, EVERY_PLAN, TRIAL_FINE } from '../../../data/page.js';
import { header, footer, section, title, BOOK, atChapter, onThisPage, find, esc, ic } from './chrome.js';
import { openNote } from '../../shared.js';

const SECS = BOOK['/pricing'];
const [TOP, TIERS, SIGNUP, BILLING, LAPSE] = SECS;

const sellSwitch = () => `<div class="ptog" role="group" aria-label="How it is sold"><button class="tog" type="button" data-sell="sub" aria-pressed="true">Subscription</button><button class="tog" type="button" data-sell="once" aria-pressed="false">Single purchase</button></div>
  <p class="sell-note" data-sell-note data-sub="As a subscription: per facility, renewing, with the three-day trial and one-tap cancel." data-once="As a single purchase: per facility, once — a binder revised twice a year may want that rather than a subscription.">As a subscription: per facility, renewing, with the three-day trial and one-tap cancel.</p>`;

function render(cfg, p) {
  atChapter('/pricing');
  const s = find('pricing');
  const lapse = find('evidence').blocks.find((b) => b.label === 'If you stop paying');
  const soon = (price) => (/^Open/.test(price) ? 'Early access' : price);
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'pricing', tabs: SECS.filter((x) => x.tab) })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light">
${title(TOP, { eyebrow: 'Chapter · Pricing', h1: s.heading, lede: EVERY_PLAN, ctas: `<a class="btn pri lg" href="/#join" data-cta="pricing">${esc(cfg.cta.primary)}</a><a class="btn lg" href="#tiers">${ic('scale', 18)}<span>The tiers</span></a>`, index: onThisPage(SECS) })}
${section(TIERS, `<h2 id="h-tiers">Three tiers.</h2><p class="sub">${esc(s.note)}</p>
  ${sellSwitch()}
  <div class="tiers">${p.pricing.rows.map(([name, price, d], i) => `<div class="tier ${i === 1 ? 'is-main' : ''}"><span class="tier-n">${esc(name)}</span><span class="tier-p ${/^Open/.test(price) ? 'is-soon' : ''}">${esc(soon(price))}</span><span class="tier-d">${esc(d)}</span></div>`).join('')}</div>${openNote(p)}`)}
${section(SIGNUP, `<h2 id="h-signup">${esc(SIGNUP_FIVE.heading)}</h2>
  <ol class="ten is-wide">${SIGNUP_FIVE.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
  <p class="closing">${esc(SIGNUP_FIVE.tail)}</p>
  <p class="fine">${esc(TRIAL_FINE)}</p>`)}
${section(BILLING, `<h2 id="h-billing">${esc(BILLING_STATES.heading)}</h2><p class="sub">Four billing states, and what each one lets you do.</p>
  <dl class="defs is-wide">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`)}
${section(LAPSE, `<h2 id="h-lapse">If you stop paying.</h2>
  <p class="closing">${esc(lapse.text)}</p>
  <p class="boundary">Withholding a reprint is not leverage, it is spite.</p>`)}
</main>
${footer(cfg, p, { page: 'pricing', tabs: SECS })}`;
}

export const pricingPage = { path: 'pricing', title: 'Pricing', description: 'Priced in the open: three tiers, as a subscription or a single purchase, a five-step signup, and what stays on if a payment fails.', render };
