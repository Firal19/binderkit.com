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

/* ── the address a page prints, and the mailto that goes with it ────────
   hello(cfg)               → the site's default box    shift@cohorthome.app
   hello(cfg, 'caregivers') → a named box              caregiver@aidepost.com
   mailto(cfg)              → bare mailto to the default box
   mailto(cfg, subject)     → with a prefilled subject
   mailto(cfg, subject, key) → both
   The keys come from cfg.mail, which src/configs.js fills from lib/boxes.js.
   An unknown key falls back to the site's default box, never to nothing.  */
export const box    = (cfg, key = 'main') => ((cfg.mail && cfg.mail.boxes && (cfg.mail.boxes[key] || cfg.mail.boxes.main)) || 'hello');
export const hello  = (cfg, key) => `${box(cfg, key)}@${cfg.domain}`;
export const mailto = (cfg, subject = '', key) =>
  `mailto:${hello(cfg, key)}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
/* what a route prints when nothing else says otherwise */
export const boxAt     = (cfg, route) => ((cfg.mail && cfg.mail.routes) || {})[route] || 'main';
export const subjectAt = (cfg, route) => ((cfg.mail && cfg.mail.subjects) || {})[route] || '';

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

/* ── the shared phone nav ─────────────────────────────────────────────
   The four headers today range 56–98px tall, carry up to fifteen links,
   and two of them clip a scroll strip mid-word at the right edge. This is
   the one pattern they can all point at. It is SHAPE, not style: every
   colour and face still comes from the site's own sheet, so four headers
   built on it still read as four different designs at 390px.

   The phone bar is three slots and nothing else:

     [ mark + where you are ] ———— [ one 44px CTA ] [ menu 44x44 ]

   and the menu opens a bottom sheet, because that is where the thumb is.

     mobileNav(cfg, p, {
       where:  'Features',                     // where you are, as plain text
       cta:    { href: '#join', label: 'Early access' },
       groups: [{ title: 'Pages', rows: [
                  { href: '/plan', label: 'The plan', gist: 'Four weeks', current: true },
                ] }],
       index:  true,           // prepend an "In this page" group, built at
                               // runtime from every [data-phone="fold"]
                               // section's heading and data-gist
       id:     'mnav',         // the sheet's id; must be unique on the page
       label:  'Menu',
       brand:  '<custom markup>',
     })

   Returns { bar, sheet } — two strings, and they must be placed
   SEPARATELY:

     `<header class="rule" id="top-bar">${n.bar}</header>${n.sheet}`

   THE SHEET MUST NOT BE A CHILD OF THE HEADER. Every sticky header in this
   kit paints itself with backdrop-filter, and backdrop-filter (like filter,
   transform and will-change) makes an element a CONTAINING BLOCK for its
   position: fixed descendants. Nested inside the header, the sheet anchors
   its `bottom: 0` to the 56px bar instead of the viewport and renders above
   the top of the screen — measured at top: -465px before this was split in
   two. It is a sibling of the header, not a child.

   Behaviour is js/site.js `menus()`, which already implements the whole
   controller — any button[aria-controls] toggles its panel, Escape closes,
   a click on a link inside closes, data-lock locks body scroll, and a
   resize above 900px auto-closes. It needs no change; it needs markup.
   The "In this page" group and the "Open every section" button are filled
   by `pageIndex()` from the same data the fold reads. */
export const sheetRow = ({ href, label, gist = '', current = false, cls = '' }) =>
  `<a class="msheet-r ${cls}" href="${esc(href)}"${current ? ' aria-current="page"' : ''}><span><b>${esc(label)}</b>${gist ? `<small>${esc(gist)}</small>` : ''}</span></a>`;

export const sheetGroup = ({ title, rows = [], index = false, openAll = 'Open every section' }) =>
  `<div class="msheet-g"${index ? ` data-page-index data-open-all="${esc(openAll)}"` : ''}>${title ? `<p class="msheet-k">${esc(title)}</p>` : ''}${rows.map(sheetRow).join('')}</div>`;

export function mobileNav(cfg, p, opts = {}) {
  const id = opts.id || 'mnav';
  const label = opts.label || 'Menu';
  const brand = opts.brand || `${mark(p.id, 28, { label: false })}<span class="mbar-n">${esc(p.short || p.name)}</span>`;
  const cta = opts.cta === null ? null : (opts.cta || { href: cfg.cta.primaryHref || '#join', label: cfg.cta.nav });
  const groups = [
    ...(opts.index === false ? [] : [{ title: opts.indexTitle || 'In this page', rows: [], index: true, openAll: opts.openAll }]),
    ...(opts.groups || []),
  ];
  const bar = `<div class="bar-in mbar">
    <a class="mbar-id" href="/" aria-label="${esc(p.name)} — home">${brand}${opts.where ? `<span class="mbar-where">${esc(opts.where)}</span>` : ''}</a>
    <div class="mbar-r">
      ${cta ? `<a class="btn pri sm" href="${esc(cta.href)}" data-cta="bar">${esc(cta.label)}</a>` : ''}
      <button class="mbar-menu" type="button" aria-expanded="false" aria-controls="${esc(id)}" aria-label="${esc(label)}" data-label-open="${esc(label)}" data-label-close="Close menu" data-lock>${ICON.menu}</button>
    </div>
  </div>`;
  const sheet = `<div class="msheet" id="${esc(id)}" hidden>
    <span class="msheet-grab" aria-hidden="true"></span>
    <nav aria-label="${esc(opts.navLabel || 'Menu')}">${groups.map(sheetGroup).join('')}</nav>
  </div>`;
  return { bar, sheet, toString: () => bar + sheet };
}

/* ── the waitlist ─────────────────────────────────────────────────────── */
export function waitlist(cfg, p, copy = {}) {
  const opt = (v) => `<option value="${esc(v)}">${esc(v)}</option>`;
  const houses = [...JOIN.houseOptions, ...(cfg.joinHouses || [])];
  return `<form class="form" id="joinform" method="post" action="/api/waitlist" novalidate data-done="${esc(copy.done || JOIN.done)}" data-busy="${esc(JOIN.busy)}">
    <input type="hidden" name="product" value="${esc(p.id)}">
    <label class="field is-wide"><span>${esc(JOIN.fields.email)}</span><input type="email" name="email" required autocomplete="email" inputmode="email" placeholder="you@yourhouse.com" spellcheck="false"></label>
    <label class="field"><span>${esc(JOIN.fields.phone)}</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="(503) 555-0142" spellcheck="false"></label>
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
  sub: 'Every message lands in one inbox, and the person who reads it is the person who answers.',
  fields: {
    name: 'Your name', email: 'Your email', topic: 'What is it about?', message: 'Your message',
    phone: 'Phone (optional)',
  },
  altButton: 'Send from my email app',
  altNote: 'Sending from this page is one click and a receipt comes straight back. Sending from your own mail app leaves you a copy in Sent and lets you attach a file. Both reach the same person.',
  button: 'Send it',
  busy: 'Sending…',
  done: 'Sent. A receipt is on its way to you, and a person will answer from the same inbox.',
  fine: 'One person reads it and answers.',
};
/* copy.box names a non-default box for this page — aidepost's /contact passes
   nothing and starts on the default; its topic select rewrites data-to and the
   closing line at runtime when the topic reads “I’m a caregiver”. */
export function contact(cfg, p, copy = {}) {
  const opt = (v) => `<option value="${esc(v)}">${esc(v)}</option>`;
  const to = hello(cfg, copy.box);
  return `<form class="form contact-f" id="contactform" method="post" action="/api/contact" novalidate data-done="${esc(copy.done || CONTACT.done)}" data-busy="${esc(CONTACT.busy)}">
    <input type="hidden" name="product" value="${esc(p.id)}">
    <label class="field"><span>${esc(CONTACT.fields.name)}</span><input type="text" name="name" autocomplete="name" placeholder="Your name"></label>
    <label class="field"><span>${esc(CONTACT.fields.email)}</span><input type="email" name="email" required autocomplete="email" inputmode="email" placeholder="you@yourhouse.com" spellcheck="false"></label>
    <label class="field"><span>${esc(CONTACT.fields.phone)}</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="(503) 555-0142" spellcheck="false"></label>
    <label class="field is-wide"><span>${esc(CONTACT.fields.topic)}</span><select name="topic">${(copy.topics || TOPICS).map(opt).join('')}</select></label>
    <label class="field is-wide"><span>${esc(CONTACT.fields.message)}</span><textarea name="message" required rows="5" minlength="4" maxlength="4000" placeholder="${esc(copy.placeholder || 'What would you like to know?')}"></textarea></label>
    <p class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="company" tabindex="-1" autocomplete="off"></label></p>
    <div class="send-two">
      <button class="btn pri lg" type="submit">${esc(copy.button || CONTACT.button)}</button>
      <button class="btn lg send-alt" type="button" data-send-mail data-to="${esc(to)}">${esc(CONTACT.altButton)}</button>
    </div>
    <p class="fine send-note">${esc(CONTACT.altNote)}</p>
    <p class="form-msg" role="status" aria-live="polite"></p>
    <p class="fine contact-alt">Either way it reaches <a href="${mailto(cfg, '', copy.box)}">${esc(to)}</a> — same inbox, same person.</p>
  </form>`;
}

/* ── questions, as real disclosures ───────────────────────────────────── */
export const faq = (rows) => `<div class="faq">${rows.map(([q, a], i) => `<details class="faq-i" ${i === 0 ? 'open' : ''}>
  <summary><h3>${esc(q)}</h3><span class="faq-x" aria-hidden="true"></span></summary>
  <div class="faq-a"><p>${esc(a)}</p></div>
</details>`).join('')}</div>`;

/* ── pricing, from the vault ──────────────────────────────────────────── */
/* Which tiers the register has not decided, said plainly. Exported because
   binderkit/pricing.js and aidepost/bits.js each keep their own copy of the
   "Open -> Early access" substitution, and the line has to reach all three. */
export function openNote(p) {
  const open = p.pricing.rows.filter(([, price]) => /^Open/.test(price)).map(([name]) => name);
  return open.length
    ? `<p class="tier-open">${esc(open.join(' and '))} ${open.length > 1 ? 'are' : 'is'} not priced yet.</p>`
    : '';
}

export function tiers(p, main = 1, soonLabel = 'Early access') {
  /* A row whose price reads "Open (#n)" is one the register has NOT decided. The
     page used to print soonLabel there and stop, which reads as a plan you can
     buy rather than a price that does not exist yet — the page overstating what
     the data says. The register's own note cannot be printed verbatim (it cites
     the decision number and a prior internal figure), so the line below is
     derived from the rows themselves: which tiers are open, said plainly. A
     product whose prices ARE set, like CareShop, emits nothing extra. */
  const note = openNote(p);
  return `<div class="tiers">${p.pricing.rows.map(([name, price, d], i) => {
    const soon = /^Open/.test(price);
    return `<div class="tier ${i === main ? 'is-main' : ''}">
      <span class="tier-n">${esc(name)}</span>
      <span class="tier-p ${soon ? 'is-soon' : ''}">${esc(soon ? soonLabel : price)}</span>
      <span class="tier-d">${esc(d)}</span>
    </div>`;
  }).join('')}</div>${note}`;
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
