// /pricing — the price, the two ways it is sold, and what stays on.

import { SIGNUP_FIVE, BILLING_STATES, EVERY_PLAN, TRIAL_FINE } from '../../../data/page.js';
import { header, footer, section, title, BOOK, atChapter, onThisPage, find, esc, ic, sellSwitch, tierGrid } from './chrome.js';

const SECS = BOOK['/pricing'];
const [TOP, TIERS, SIGNUP, BILLING, LAPSE] = SECS;

function render(cfg, p) {
  atChapter('/pricing');
  const s = find('pricing');
  const lapse = find('evidence').blocks.find((b) => b.label === 'If you stop paying');
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'pricing', tabs: SECS.filter((x) => x.tab) })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light">
${title(TOP, { eyebrow: 'Chapter · Pricing', h1: s.heading, lede: EVERY_PLAN, ctas: `<a class="btn pri lg" href="/#join" data-cta="pricing">${esc(cfg.cta.primary)}</a><a class="btn lg" href="#tiers">${ic('scale', 18)}<span>The tiers</span></a>`, index: onThisPage(SECS) })}
${section(TIERS, `<h2 id="h-tiers">The tiers.</h2><p class="sub">${esc(s.note)}</p>
  ${sellSwitch()}
  ${tierGrid(p)}
  <p class="fine">${esc(TRIAL_FINE)}</p>`)}
${section(SIGNUP, `<h2 id="h-signup">${esc(SIGNUP_FIVE.heading)}.</h2>
  <ol class="ten is-wide">${SIGNUP_FIVE.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
  <p class="closing">${esc(SIGNUP_FIVE.tail)}</p>`)}
${section(BILLING, `<h2 id="h-billing">${esc(BILLING_STATES.heading)}.</h2>
  <dl class="defs is-wide">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`)}
${section(LAPSE, `<h2 id="h-lapse">If you stop paying.</h2>
  <p class="closing">${esc(lapse.text)}</p>
  <p class="boundary">A worn contents page can always be reprinted.</p>`)}
</main>
${footer(cfg, p, { page: 'pricing', tabs: SECS })}`;
}

export const pricingPage = { path: 'pricing', title: 'Pricing', description: 'Binderkit is $29 a facility a month, or $149 once. A five-step signup, a three-day trial, and printing that keeps working if a payment fails.', render };
