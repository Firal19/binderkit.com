// shared.js — the few pieces every page is allowed to have in common.
// A page is its own design; these are the parts that would be identical in
// any honest implementation anyway: the escape, the skip link, the form that
// posts to the waitlist, the FAQ disclosure, and the one byline.

import { productOf, mark, esc } from '../kit.js';
import { JOIN } from '../data/page.js';

export { productOf, mark, esc };

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
};

/* ── the header ───────────────────────────────────────────────────────── */
export function nav(cfg, p, opts = {}) {
  const links = cfg.nav.map((l) => `<a href="#${esc(l.id)}">${esc(l.label)}</a>`).join('');
  const primary = cfg.cta.primaryHref || '#join';
  return `<header class="nav ${opts.cls || ''}" id="top-bar">
    <div class="wrap nav-in">
      <a class="brand" href="/" aria-label="${esc(p.name)} — home">${opts.brand || `${mark(p.id, 28, { label: false })}<span class="brand-n">${esc(p.name)}</span>`}</a>
      <nav class="links" aria-label="Sections">${links}</nav>
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

/* ── the foot ─────────────────────────────────────────────────────────── */
export function foot(cfg, p, opts = {}) {
  const links = [
    [cfg.cta.primaryHref || '#join', cfg.cta.nav],
    ['/privacy', 'Privacy'],
    ...(opts.links || []),
  ];
  return `<footer class="foot ${opts.cls || ''}" id="foot">
    <div class="wrap foot-in">
      <div class="foot-l">${mark(p.id, 24, { label: false })}<span class="foot-n">${esc(p.name)}</span><span class="foot-d">${esc(p.descriptor)}</span></div>
      <nav class="foot-r" aria-label="Footer">${links.map(([h, t]) => `<a href="${esc(h)}">${esc(t)}</a>`).join('')}</nav>
    </div>
    <div class="wrap foot-b">
      ${byline(Boolean(opts.dark))}
      <p class="foot-fine">${esc(opts.fine || '')} ${esc(cfg.legalLine)}</p>
    </div>
  </footer>`;
}
