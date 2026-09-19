// shared.js — the few pieces every page is allowed to have in common.
// A page is its own design; these are the parts that would be identical in
// any honest implementation anyway: the escape, the skip link, the two forms
// that post to the two endpoints, the FAQ disclosure, the pricing rows, the
// social block, and the one byline.
//
// A page module owns its header and its footer. `nav()` and `foot()` below
// are the plain defaults a page may start from; none of the four uses them
// unchanged, and that is the point.

import { productOf, mark, esc } from '../kit.js';
import { JOIN } from '../data/page.js';
import { social, socialGlyph, socialUrls } from './social.js';

export { productOf, mark, esc, social, socialGlyph, socialUrls };

/* ── the byline ───────────────────────────────────────────────────────── */
const BUILDING = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>';
export const byline = (dark = false) => `<a class="pho ${dark ? 'is-dark' : ''}" href="https://providerhub.us" rel="noopener" aria-label="By Providerhub Oregon"><span class="pho-tile">${BUILDING}</span><span><span class="pho-by">By</span> Providerhub<span class="pho-or">Oregon</span></span></a>`;

/* ── small pieces ─────────────────────────────────────────────────────── */
export const skip = () => '<a class="skip" href="#main">Skip to content</a>';
export const sec = (id, cls, inner, opts = {}) => `<section class="sec ${cls}" id="${esc(id)}" ${opts.label ? `aria-label="${esc(opts.label)}"` : `aria-labelledby="h-${esc(id)}"`} data-reveal>${inner}</section>`;
export const h2 = (id, text, sub = '') => `<h2 id="h-${esc(id)}">${esc(text)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}`;
export const eyebrow = (t) => `<span class="eyebrow">${esc(t)}</span>`;

export const ICON = {
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h9"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
  sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M5.2 18.8l1.4-1.4M17.4 6.6l1.4-1.4"/></svg>',
  moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>',
};

/* ── the address every page prints, and the mailto that goes with it ──── */
export const hello = (cfg) => `hello@${cfg.domain}`;
export const mailto = (cfg, subject = '') => `mailto:${hello(cfg)}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

/* ── the plain header a page may start from ───────────────────────────── */
export function nav(cfg, p, opts = {}) {
  const links = cfg.nav.map((l) => `<a href="#${esc(l.id)}">${esc(l.label)}</a>`).join('');
  const primary = cfg.cta.primaryHref || '#join';
  return `<header class="nav ${opts.cls || ''}" id="top-bar">
    <div class="wrap nav-in">
      <a class="brand" href="/" aria-label="${esc(p.name)} — home">${opts.brand || `${mark(p.id, 28, { label: false })}<span class="brand-n">${esc(p.name)}</span>`}</a>
      <nav class="links" aria-label="Sections" data-spy>${links}</nav>
      <div class="nav-r">
        ${cfg.signIn ? `<a class="signin" href="${esc(cfg.signIn.href)}">${esc(cfg.signIn.label)}</a>` : ''}
        <a class="btn pri sm" href="${esc(primary)}" data-cta="nav">${esc(cfg.cta.nav)}</a>
        <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu">${ICON.menu}</button>
      </div>
    </div>
    <div class="menu" id="menu" hidden>
      <nav class="wrap" aria-label="Sections, mobile">${links}${cfg.signIn ? `<a href="${esc(cfg.signIn.href)}">${esc(cfg.signIn.label)}</a>` : ''}<a class="btn pri" href="${esc(primary)}" data-cta="menu">${esc(cfg.cta.primary)}</a></nav>
    </div>
  </header>`;
}

/* ── the waitlist ─────────────────────────────────────────────────────── */
export function waitlist(cfg, p, copy = {}) {
  const opt = (v) => `<option value="${esc(v)}">${esc(v)}</option>`;
  const houses = [...JOIN.houseOptions, ...(cfg.joinHouses || [])];
  return `<form class="form" id="joinform" method="post" action="/api/waitlist" novalidate data-done="${esc(copy.done || JOIN.done)}" data-busy="${esc(JOIN.busy)}">
    <input type="hidden" name="product" value="${esc(p.id)}">
    <label class="field is-wide"><span>${esc(JOIN.fields.email)}</span><input type="email" name="email" required autocomplete="email" inputmode="email" placeholder="you@yourhouse.com" spellcheck="false"></label>
    <label class="field"><span>${esc(JOIN.fields.track)}</span><select name="track">${JOIN.tracks.map(opt).join('')}</select></label>
    <label class="field"><span>${esc(copy.housesLabel || JOIN.fields.houses)}</span><select name="houses">${houses.map(opt).join('')}</select></label>
    <p class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="company" tabindex="-1" autocomplete="off"></label></p>
    <button class="btn pri lg" type="submit">${esc(copy.button || JOIN.button)}</button>
    <p class="form-msg" role="status" aria-live="polite"></p>
  </form>`;
}

/* ── the contact form: a message from a person, to a person ───────────── */
export const TOPICS = ['Question', 'Early access', 'Pricing', 'Security and privacy', 'Press', 'Something else'];
export const CONTACT = {
  heading: 'Write to a person.',
  sub: 'Every message lands in one inbox, read by the people who build this. You get an answer from the same address, not a ticket number.',
  fields: { name: 'Your name', email: 'Your email', topic: 'What is it about?', message: 'Your message' },
  button: 'Send it',
  busy: 'Sending…',
  done: 'Sent. A receipt is on its way to you, and a person will answer from the same address.',
  fine: 'No ticket, no bot, no newsletter. One person reads it and answers.',
};
export function contact(cfg, p, copy = {}) {
  const opt = (v) => `<option value="${esc(v)}">${esc(v)}</option>`;
  return `<form class="form contact-f" id="contactform" method="post" action="/api/contact" novalidate data-done="${esc(copy.done || CONTACT.done)}" data-busy="${esc(CONTACT.busy)}">
    <input type="hidden" name="product" value="${esc(p.id)}">
    <label class="field"><span>${esc(CONTACT.fields.name)}</span><input type="text" name="name" autocomplete="name" placeholder="Your name"></label>
    <label class="field"><span>${esc(CONTACT.fields.email)}</span><input type="email" name="email" required autocomplete="email" inputmode="email" placeholder="you@yourhouse.com" spellcheck="false"></label>
    <label class="field is-wide"><span>${esc(CONTACT.fields.topic)}</span><select name="topic">${(copy.topics || TOPICS).map(opt).join('')}</select></label>
    <label class="field is-wide"><span>${esc(CONTACT.fields.message)}</span><textarea name="message" required rows="5" minlength="4" maxlength="4000" placeholder="${esc(copy.placeholder || 'What would you like to know?')}"></textarea></label>
    <p class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="company" tabindex="-1" autocomplete="off"></label></p>
    <button class="btn pri lg" type="submit">${esc(copy.button || CONTACT.button)}</button>
    <p class="form-msg" role="status" aria-live="polite"></p>
    <p class="fine contact-alt">Or write straight to <a href="${mailto(cfg)}">${esc(hello(cfg))}</a> — same inbox, same person.</p>
  </form>`;
}

/* ── questions, as real disclosures ───────────────────────────────────── */
export const faq = (rows) => `<div class="faq">${rows.map(([q, a], i) => `<details class="faq-i" ${i === 0 ? 'open' : ''}>
  <summary><h3>${esc(q)}</h3><span class="faq-x" aria-hidden="true"></span></summary>
  <div class="faq-a"><p>${esc(a)}</p></div>
</details>`).join('')}</div>`;

/* ── pricing, from the vault ──────────────────────────────────────────── */
export function tiers(p, main = 1, soonLabel = 'Early access') {
  return `<div class="tiers">${p.pricing.rows.map(([name, price, d], i) => {
    const soon = /^Open/.test(price);
    return `<div class="tier ${i === main ? 'is-main' : ''}">
      <span class="tier-n">${esc(name)}</span>
      <span class="tier-p ${soon ? 'is-soon' : ''}">${esc(soon ? soonLabel : price)}</span>
      <span class="tier-d">${esc(d)}</span>
    </div>`;
  }).join('')}</div>`;
}

/* ── the plain foot a page may start from ─────────────────────────────── */
export function foot(cfg, p, opts = {}) {
  const links = [
    [cfg.cta.primaryHref || '#join', cfg.cta.nav],
    ['/contact', 'Contact'],
    ['/privacy', 'Privacy'],
    ...(opts.links || []),
  ];
  return `<footer class="foot ${opts.cls || ''}" id="foot">
    <div class="wrap foot-in">
      <div class="foot-l">${mark(p.id, 24, { label: false })}<span class="foot-n">${esc(p.name)}</span><span class="foot-d">${esc(p.descriptor)}</span></div>
      <nav class="foot-r" aria-label="Footer">${links.map(([h, t]) => `<a href="${esc(h)}">${esc(t)}</a>`).join('')}</nav>
    </div>
    <div class="wrap foot-s">${social(p.id)}<a class="foot-mail" href="${mailto(cfg)}">${esc(hello(cfg))}</a></div>
    <div class="wrap foot-b">
      ${byline(Boolean(opts.dark))}
      <p class="foot-fine">${esc(opts.fine || '')} ${esc(cfg.legalLine)}</p>
    </div>
  </footer>`;
}
