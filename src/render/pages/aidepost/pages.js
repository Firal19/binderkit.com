// /pricing, /about and /contact.

import { esc, sec, h2, eyebrow, faq, ic, SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, find, shell, tierBlock, joinBlock, BOUNDARY } from './bits.js';
import { contact, mailto, hello, byline } from '../../shared.js';
import { PRODUCTS } from '../../../data/brand.js';

/* ── pricing ──────────────────────────────────────────────────────────── */
const AP_TOPICS = ['Question', 'Early access', 'I’m a caregiver', 'Pricing', 'Security and privacy', 'Press', 'Something else'];

export const pricingPage = {
  path: 'pricing',
  title: 'Pricing',
  description: 'Providers pay: a subscription per house plus one charge per job post, on every plan including the trial. Caregivers never pay — a documented exception.',
  /* #post CARRIES TWO HEADS, BECAUSE AT 390 THE TIER CARD IS 425px ABOVE IT.
     The card reads "Job post / One charge per post / Publishes the listing
     when paid"; the wide head reads both of those lines back. At desktop the
     card is one of five in a horizontal rank two grid contexts away, and the
     echo lands as a callback. Stacked at 390 the two sit inside one 844px
     viewport and read as a duplication bug — the reader's first thought is
     that the page repeated itself. The phone head says the thing the card did
     not: why a post is priced outside the subscription, which is what the
     paragraph under it actually argues. Only one span is ever displayed, so
     only one is ever in the accessibility tree; the swap is CSS, needs no JS,
     and /pricing carries no folds to read both strings into a summary. */
  render(cfg, p) {
    const s = find('pricing');
    return shell(cfg, p, { page: 'pricing', ids: new Set(['top', 'pricing', 'post', 'signup', 'billing', 'questions', 'join']) }, `<section class="hero hero-s" id="top" aria-labelledby="h1"><div class="wrap">${eyebrow('Pricing')}<h1 id="h1">${esc(s.heading)}</h1><p class="lede">${esc(EVERY_PLAN)}</p></div></section>
${sec('pricing', 'pricing', `<div class="wrap">${tierBlock(p)}<p class="fine">${esc(s.note)}</p></div>`)}
${sec('post', 'post', `<div class="wrap post-g">
  <div>${eyebrow('Job post')}<h2 id="h-post"><span class="ap-wide">One charge per post. It publishes when it is paid.</span><span class="ap-phone">Why a post is not in the subscription.</span></h2><p class="sub">A subscription is per house. A post is per post — on every tier, including the trial, because a home that needs to hire should not have to upgrade to do it.</p></div>
  <ol class="flow-l">${[['Draft', 'invisible to everyone outside your organisation.'], ['Pay', 'the per-post charge — an unpaid posting stays a draft.', 'open'], ['Published', 'reachable without an account, at an opaque address that carries no organisation, house or sequence.'], ['Applications', 'arrive with her profile and her credentials as self-attested — one per person per posting, never ranked or scored.'], ['Hired', 'a staff record, onboarding open for that house’s track.', 'covered']].map(([t, d, k]) => `<li class="${k ? `is-${k}` : ''}"><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ol>
</div>`)}
${sec('signup', 'signup', `<div class="wrap subs">
  <div class="note"><h3>${esc(find('start').signupHeading)}</h3><ol class="arrow">${SIGNUP_SIX.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="fine">${esc(SIGNUP_SIX.tail)} ${esc(find('hero').fine)}</p></div>
  <div class="note" id="billing"><h3>${esc(BILLING_STATES.heading)}</h3><dl class="defs">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
</div>`, { label: 'Signing up, and billing' })}
${sec('questions', 'questions', `<div class="wrap q-g"><div class="head">${h2('questions', 'Asked about the price.')}</div>${faq(find('objections').rows.filter(([q]) => /post|Facebook|pay/i.test(q)).concat([['Do caregivers pay for Aidepost?', 'Never. Providers buy Aidepost. Caregivers create a profile, keep their credential dates, claim shifts and apply to posts free, without an organisation and without a card.']]))}</div>`)}
${sec('join', 'join', joinBlock(cfg, p))}`);
  },
};

/* ── about ────────────────────────────────────────────────────────────── */
export const aboutPage = {
  path: 'about',
  title: 'About',
  description: 'Aidepost is the workforce record for Oregon care homes: providers buy it, caregivers use it free.',
  render(cfg, p) {
    const ev = find('evidence');
    const closing = ev.closingBlocks;
    const umbrella = PRODUCTS.find((x) => x.id === 'pho');
    return shell(cfg, p, { page: 'about', ids: new Set(['top', 'two', 'boundary', 'write']) }, `<section class="hero hero-s" id="top" aria-labelledby="h1"><div class="wrap">${eyebrow('About')}<h1 id="h1">The workforce record, and nothing else.</h1><p class="lede">${esc(p.lede)}</p></div></section>
${sec('two', 'two-s', `<div class="wrap two-g">${closing.map((b) => `<div class="two-b"><h2 id="${b === closing[0] ? 'h-two' : 'h-two-b'}">${esc(b.heading)}</h2><p>${esc(b.text)}</p></div>`).join('')}</div>`)}
${sec('boundary', 'bound', `<div class="wrap"><div class="head">${h2('boundary', 'What Aidepost will not do.')}</div><p class="boundary">${esc(BOUNDARY)}</p></div>`)}
${sec('write', 'write', `<div class="wrap write-g"><div>${h2('write', 'Made in Oregon.')}<p class="sub">${esc(umbrella.name)} — ${esc(umbrella.descriptor.toLowerCase())}. One inbox, read by a person.</p>${byline(false)}</div><div class="write-a"><a class="btn pri lg" href="/contact">${ic('mail', 18, { pin: false })}Contact</a><a class="btn lg" href="${mailto(cfg)}">${esc(hello(cfg))}</a></div></div>`)}`);
  },
};

/* ── contact ──────────────────────────────────────────────────────────── */
export const contactPage = {
  path: 'contact',
  title: 'Contact',
  description: 'Write to a person. One inbox, one person answers, from the same address.',
  render(cfg, p) {
    return shell(cfg, p, { page: 'contact', ids: new Set(['top', 'contact']) }, `<section class="hero hero-s" id="top" aria-labelledby="h1"><div class="wrap">${eyebrow('Contact')}<h1 id="h1">Write to a person.</h1><p class="lede">Every message lands in one inbox. You get an answer from the same address.</p></div></section>
${sec('contact', 'contact-s', `<div class="wrap contact-g">
  <div class="contact-t">
    <ul class="contact-l">
      <li>${ic('mail', 20)}<span><b>${esc(hello(cfg))}</b><small>Same inbox, same person. </small><button class="ft-copy" type="button" data-copy="${esc(hello(cfg))}" data-copied="Address copied">${ic('copy', 16)}Copy</button></span></li>
      <li>${ic('house', 20)}<span><b>I run a house</b><small>Pick “Early access” and say how many houses.</small></span></li>
      <li>${ic('phone', 20, { pin: 'open' })}<span><b>I’m a caregiver</b><small>Pick “I’m a caregiver”. You will never be charged, and we will never ask for a card.</small></span></li>
      <li>${ic('badge', 20)}<span><b>Press, security, privacy</b><small>Each has its own topic so it reaches the right person first.</small></span></li>
    </ul>
    <p class="fine">No ticket, no bot, no newsletter. One person reads it and answers.</p>
  </div>
  ${contact(cfg, p, { topics: AP_TOPICS, placeholder: 'What would you like to know? If you run a house, say which track. If you are a caregiver, say roughly where.' })}
</div>`)}`);
  },
};
