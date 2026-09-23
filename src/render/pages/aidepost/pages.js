// /pricing, /about and /contact.

import { esc, sec, h2, eyebrow, faq, ic, SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, find, shell, tierBlock, joinBlock, BOUNDARY, ixNav, stateLegend } from './bits.js';
import { contact, mailto, hello, byline, reach } from '../../shared.js';

/* ── pricing ──────────────────────────────────────────────────────────── */
const CARE_TOPIC = 'I’m a caregiver';
const AP_TOPICS = ['Question', 'Early access', CARE_TOPIC, 'Pricing', 'Security and privacy', 'Press', 'Something else'];

export const pricingPage = {
  path: 'pricing',
  title: 'Pricing',
  description: 'Providers pay per house, plus one charge per job post. Caregivers never pay.',
  render(cfg, p) {
    const s = find('pricing');
    return shell(cfg, p, { page: 'pricing', ids: new Set(['top', 'pricing', 'post', 'signup', 'billing', 'questions', 'join', 'reach']) }, `<section class="hero hero-s" id="top" aria-labelledby="h1"><div class="wrap">${eyebrow('Pricing')}<h1 id="h1">${esc(s.heading)}</h1><p class="lede">${esc(EVERY_PLAN)}</p></div></section>
${ixNav([['pricing', 'The plans', 'prov'], ['post', 'One charge per post', 'prov'], ['signup', 'Signing up', 'both'], ['questions', 'Questions', 'both'], ['join', 'Join', 'both']])}
${sec('pricing', 'pricing', `<div class="wrap"><h2 id="h-pricing" class="sr-only">The plans</h2>${tierBlock(p)}<p class="fine">${esc(s.note)}</p></div>`)}
${sec('post', 'post', `<div class="wrap post-g">
  <div>${eyebrow('Job post')}<h2 id="h-post">One charge per post. It publishes when it is paid.</h2><p class="sub">A subscription is per house. A post is per post, on every plan including the trial, because a home that needs to hire should not have to upgrade to do it.</p></div>
  <ol class="flow-l">${[['Draft', 'seen by nobody outside your organisation.'], ['Pay', '$25. An unpaid post stays a draft.', 'open'], ['Published', 'reachable without an account, at an address nobody can enumerate.'], ['Applications', 'arrive with her profile and credentials. One per person, never ranked.'], ['Hired', 'a staff record, and onboarding for that house’s track.', 'covered']].map(([t, d, k]) => `<li class="${k ? `is-${k}` : ''}"><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ol>
</div>`)}
${sec('signup', 'signup', `<div class="wrap subs">
  <div class="note"><h3>${esc(SIGNUP_SIX.heading)}</h3><ol class="arrow">${SIGNUP_SIX.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="fine">${esc(SIGNUP_SIX.tail)} ${esc(find('hero').fine)}</p></div>
  <div class="note" id="billing"><h3>${esc(BILLING_STATES.heading)}</h3><dl class="defs">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
</div>`, { label: 'Signing up, and billing' })}
${sec('questions', 'questions', `<div class="wrap"><div class="q-g"><div class="head">${h2('questions', 'Asked about the price.')}</div>${faq(find('objections').rows.filter(([q]) => /post|Facebook|pay/i.test(q)))}</div>${reach(cfg, p, { subject: `Pricing — ${p.name}` })}</div>`)}
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
    return shell(cfg, p, { page: 'about', ids: new Set(['top', 'two', 'boundary', 'words', 'write']) }, `<section class="hero hero-s" id="top" aria-labelledby="h1"><div class="wrap">${eyebrow('About')}<h1 id="h1">The workforce record, and nothing else.</h1><p class="lede">${esc(p.lede)}</p></div></section>
${sec('two', 'two-s', `<div class="wrap two-g">${closing.map((b, i) => `<div class="two-b"><h2 id="${i === 0 ? 'h-two' : `h-two-${i}`}">${esc(b.heading)}</h2><p>${esc(b.text)}</p></div>`).join('')}<div class="two-b"><h2 id="h-two-b">Made in Oregon, for Oregon houses.</h2><p>Four licence tracks on one data model. The vocabulary is the rule’s own: relief care, substitute caregiver, competency-based training. Nothing is translated from another state.</p></div></div>`)}
${sec('boundary', 'bound', `<div class="wrap"><div class="head">${h2('boundary', 'What Aidepost will not do.')}</div><p class="boundary">${esc(BOUNDARY)}</p></div>`)}
${sec('words', 'words', `<div class="wrap words-g">
  <div>${eyebrow('The state words')}${h2('words', 'Four words, and no fifth.', 'Every state in Aidepost is one of these four. Coral means exactly two things: a shift nobody is on, and a credential that has run out.')}
    </div>
  ${stateLegend()}
</div>`)}
${ixNav([['two', 'Two sides', 'both'], ['boundary', 'What we will not do', 'both'], ['words', 'The four words', 'both'], ['write', 'Write to a person', 'both']])}
${sec('write', 'write', `<div class="wrap write-g"><div>${h2('write', 'Write to the person who built it.')}<p class="sub">One inbox, read by a person. Made in Oregon.</p>${byline(false)}</div><div class="write-a"><a class="btn pri lg" href="/contact">${ic('mail', 18, { pin: false })}Contact</a><a class="btn lg" href="${mailto(cfg)}">${esc(hello(cfg))}</a></div></div>`)}`);
  },
};

/* ── contact ──────────────────────────────────────────────────────────── */
export const contactPage = {
  path: 'contact',
  title: 'Contact',
  description: 'Write to a person. One address for houses, one for caregivers, one inbox.',
  render(cfg, p) {
    return shell(cfg, p, { page: 'contact', ids: new Set(['top', 'contact']) }, `<section class="hero hero-s" id="top" aria-labelledby="h1"><div class="wrap">${eyebrow('Contact')}<h1 id="h1">Write to a person.</h1><p class="lede">Every message lands in one inbox, and the person who reads it is the person who answers.</p></div></section>
${sec('contact', 'contact-s', `<h2 id="h-contact" class="sr-only">Two addresses, one form</h2><div class="wrap contact-g" data-care-topic="${esc(CARE_TOPIC)}" data-care-to="${esc(hello(cfg, 'caregivers'))}" data-main-to="${esc(hello(cfg))}">
  <div class="contact-t">
    <ul class="contact-l">
      <li>${ic('phone', 20, { pin: 'open' })}<span><b><a href="${mailto(cfg, 'I’m a caregiver — ' + p.name, 'caregivers')}">${esc(hello(cfg, 'caregivers'))}</a></b><small>I’m a caregiver. You will never be charged, and we will never ask for a card.</small><button class="ft-copy" type="button" data-copy="${esc(hello(cfg, 'caregivers'))}" data-copied="Caregiver address copied — opening your mail app" aria-label="Copy ${esc(hello(cfg, 'caregivers'))} and open your mail app">${ic('copy', 16)}Copy</button></span></li>
      <li>${ic('house', 20)}<span><b><a href="${mailto(cfg, 'I run a house — ' + p.name)}">${esc(hello(cfg))}</a></b><small>I run a house, or anything else: early access, pricing, press, security, privacy.</small><button class="ft-copy" type="button" data-copy="${esc(hello(cfg))}" data-copied="Address copied — opening your mail app" aria-label="Copy ${esc(hello(cfg))} and open your mail app">${ic('copy', 16)}Copy</button></span></li>
    </ul>
    <p class="fine">Two addresses, one inbox. No ticket, no bot, no newsletter.</p>
  </div>
  ${contact(cfg, p, { topics: AP_TOPICS, placeholder: 'What would you like to know? If you run a house, say which track. If you are a caregiver, say roughly where.' })}
</div>`)}`);
  },
};
