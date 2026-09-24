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
import { JOIN, REACH } from '../data/page.js';
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

/* "$39 / house / mo" → the number large, the unit small. "Card on file" and
   "$0" have no unit and print as they are. */
export const priceParts = (price) => {
  const i = String(price).indexOf(' / ');
  if (i < 0) return esc(price);
  return `${esc(price.slice(0, i))}<small>${esc(price.slice(i))}</small>`;
};

export function tiers(p, main = 1, soonLabel = 'Not priced yet') {
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
      <span class="tier-p ${soon ? 'is-soon' : ''}">${soon ? esc(soonLabel) : priceParts(price)}</span>
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

/* ── reach us: a question becomes a conversation in three steps ─────────
   Rendered after every site's questions. The address is the page's own box;
   the form is the site's contact page (careshop writes at /write). */
export function reach(cfg, p, opts = {}) {
  const to = hello(cfg, opts.box);
  const formHref = opts.formHref || (cfg.product === 'careshop' ? '/write' : '/contact');
  const arrow = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  return `<div class="reach" id="${esc(opts.id || 'reach')}">
    <div class="reach-t">
      <span class="eyebrow">${esc(REACH.eyebrow)}</span>
      <h3>${esc(opts.heading || REACH.heading)}</h3>
      <p>${esc(opts.sub || REACH.sub)}</p>
      <div class="reach-c">
        <a class="btn pri" href="${mailto(cfg, opts.subject || `A question — ${p.name}`, opts.box)}" data-cta="reach">${esc(REACH.cta)}${arrow}</a>
        <a class="btn" href="${esc(formHref)}">${esc(REACH.alt)}</a>
      </div>
      <p class="reach-a"><a href="${mailto(cfg, '', opts.box)}">${esc(to)}</a><button class="copyb" type="button" data-copy="${esc(to)}" data-copied="Address copied — opening your mail app" aria-label="Copy ${esc(to)} and open your mail app">${ICON.mail}</button></p>
    </div>
    <ol class="reach-s">${REACH.steps.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ol>
  </div>`;
}

/* ── the next page, floating ─────────────────────────────────────────────
   A small pill at the bottom-left that appears once the reader is well into
   the page: "Next · Screens". It replaces the two-card previous/next block
   every footer used to carry. Pure link; js/site.js only reveals it. */
export function nextFloat(next, opts = {}) {
  if (!next || !next.href) return '';
  const arrow = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  return `<a class="nxt ${esc(opts.cls || '')}" href="${esc(next.href)}" data-next aria-label="Next page: ${esc(next.label)}${next.gist ? ` — ${esc(next.gist)}` : ''}"><span class="nxt-k">${esc(opts.key || 'Next')}</span><b>${esc(next.label)}</b>${arrow}</a>`;
}

/* ═══ ROUND 4 · 2026-09-23 · direction A, "Stage & satellites" ══════════
   Three shared pieces Firaol's review asked for on every site: ONE on-page
   nav that follows the reader, a price you can set to your own number of
   houses, and a calm footer. Markup and shape only; every colour comes from
   the site's own faces tokens. Behaviour is js/site.js chapters(), houses()
   and anchors(). */
const p2 = (n) => String(n).padStart(2, '0');

/* ── the chapter rail ────────────────────────────────────────────────────
   chapterRail([{ id: 'board', label: 'The board', live: true, icon: ic('board', 16) }, …], {
     label: 'On this page', tail: { href: '/screens', label: 'All screens' }, cls: '' })
   Replaces every stacked index list ("so many items at one point"). A label
   is one to three words and nothing else — no counts, no gists ("so
   telling"). live marks a chapter whose section holds an instrument. Mount it
   as a DIRECT CHILD OF <main>, right after the hero: it is sticky, and a
   sticky element only travels as far as its parent does. The .crl-at before
   it marks where it sits in the flow, so a jump can tell whether the rail
   will be stuck (and covering) at the place it lands. */
export function chapterRail(rows, opts = {}) {
  const list = rows.filter((r) => r && r.id && r.label);
  /* r.icon is markup from the site's own icon set; it stands in for the
     number, which is what ties a chapter to the screen it is about */
  const items = list.map((r, i) => `<li><a class="crl-a" href="#${esc(r.id)}" data-n="${p2(i + 1)}" data-label="${esc(r.label)}"${r.live ? ' data-try' : ''}>${r.icon ? `<span class="crl-i" aria-hidden="true">${r.icon}</span>` : `<span class="crl-n" aria-hidden="true">${p2(i + 1)}</span>`}<span class="crl-t">${esc(r.label)}</span></a></li>`).join('');
  const tail = opts.tail ? `<a class="crl-x" href="${esc(opts.tail.href)}">${esc(opts.tail.label)}${ICON.arrow}</a>` : '';
  return `<span class="crl-at" aria-hidden="true"></span><nav class="crl${opts.cls ? ` ${esc(opts.cls)}` : ''}" aria-label="${esc(opts.label || 'On this page')}" data-crl>
    <span class="crl-now" aria-hidden="true"><b data-crl-n>01</b><span>/${p2(list.length)}</span></span>
    <ol class="crl-l" data-scrollx>${items}</ol>${tail}
    <i class="crl-p" aria-hidden="true"></i>
  </nav>`;
}

/* ── the price for your houses ───────────────────────────────────────────
   priceCalc(p, {
     start: 2, max: 12,
     noun: ['house', 'houses'],                 // binderkit: facility
     fit: { Free: '1-1', Pro: '2-5', Scale: '6-' },
     main: 'Pro',                               // the plan most homes pick
     lines: { Pro: ['…', '…'] },                // at most three, optional
     cta: { Pro: { href, label } },             // optional per plan
     skip: ['Job post'],                        // printed in the note, not a card
     note: 'Caregivers pay nothing.',
   })
   Every row of brand.js p.pricing becomes a plan. A price of the shape
   "$39 / house / mo" moves with the stepper (data-per); anything else prints
   as written. The number shown with scripting off is the one for `start`,
   so the page never prints a total it did not compute. */
export function priceCalc(p, o = {}) {
  const [one, many] = o.noun || ['house', 'houses'];
  const start = o.start || 1;
  const max = o.max || 12;
  const per = /^\$(\d+(?:\.\d+)?) \/ (house|facility) \/ mo$/;
  const skip = new Set(o.skip || []);
  const rows = p.pricing.rows.filter(([name]) => !skip.has(name));
  const money = (v) => '$' + (Math.round(v * 100) % 100 ? v.toFixed(2) : String(Math.round(v)));
  const plans = rows.map(([name, price, d]) => {
    const m = String(price).match(per);
    const lines = (o.lines && o.lines[name]) || [];
    const cta = o.cta && o.cta[name];
    const fit = o.fit && o.fit[name];
    const big = m
      ? `<b data-per="${m[1]}">${money(Number(m[1]) * start)}</b><small>/ mo</small>`
      : `<b>${esc(String(price).replace(/ \/ .*$/, ''))}</b>${/ \/ /.test(price) ? `<small>${esc(String(price).replace(/^[^/]*/, ''))}</small>` : ''}`;
    return `<div class="pc-plan${name === o.main ? ' is-main' : ''}" role="listitem"${fit ? ` data-fit="${esc(fit)}"` : ''}>
      <span class="pc-name">${esc(name)}${name === o.main && o.mainLabel ? `<em>${esc(o.mainLabel)}</em>` : ''}</span>
      <span class="pc-price">${big}</span>
      <span class="pc-unit">${m ? `${esc('$' + m[1])} per ${esc(m[2])} a month` : esc(o.unitNote && o.unitNote[name] ? o.unitNote[name] : ' ')}</span>
      <span class="pc-d">${esc(d)}</span>
      ${lines.length ? `<ul class="pc-l">${lines.slice(0, 3).map((l) => `<li>${ICON.check}<span>${esc(l)}</span></li>`).join('')}</ul>` : ''}
      ${fit ? `<span class="pc-fit" aria-hidden="true">${ICON.check}Fits your count</span>` : ''}
      ${cta ? `<a class="btn${name === o.main ? ' pri' : ''}" href="${esc(cta.href)}" data-cta="price-${esc(name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">${esc(cta.label)}</a>` : ''}
    </div>`;
  }).join('');
  const skipped = o.listSkipped ? p.pricing.rows.filter(([name]) => skip.has(name)).map(([name, price, d]) => `${esc(name)} · ${esc(price)} — ${esc(d)}`).join(' ') : '';
  return `<div class="pc${o.cls ? ` ${esc(o.cls)}` : ''}" data-houses data-start="${start}" data-min="1" data-max="${max}">
    <div class="pc-top">
      <p class="pc-q" id="${esc(o.id || 'pc')}-q">${esc(o.question || `How many ${many}?`)}</p>
      <div class="pc-step" role="group" aria-labelledby="${esc(o.id || 'pc')}-q">
        <button class="pc-b" type="button" data-houses-step="-1" aria-label="One fewer ${esc(one)}">−</button>
        <output class="pc-n" data-houses-n aria-live="polite">${start}</output>
        <button class="pc-b" type="button" data-houses-step="1" aria-label="One more ${esc(one)}">+</button>
      </div>
      <span class="pc-w" data-houses-w data-one="${esc(one)}" data-many="${esc(many)}">${esc(start === 1 ? one : many)}</span>
      ${o.aside ? `<span class="pc-aside">${esc(o.aside)}</span>` : ''}
    </div>
    <div class="pc-plans" role="list">${plans}</div>
    ${o.note || skipped ? `<p class="pc-note">${skipped ? `<span>${skipped}</span>` : ''}${o.note ? `<span>${esc(o.note)}</span>` : ''}</p>` : ''}
  </div>`;
}

/* ── the footer ───────────────────────────────────────────────────────────
   footShell(cfg, p, {
     groups: [{ title: 'Product', links: [['#board', 'The board'], …] }, …],
     box: 'caregivers',          // which address the footer prints
     note: 'One inbox. A person answers.',
     motif: '<one quiet live element>',   // aidepost's tonight, cohort's clock
     cls: 'ft-aidepost', dark: false,
     wordmark: 'Aidepost',       // the brand line across the foot, false for none
   })
   Firaol: "bit cramped, and make it state of the art footer" / the receipt is
   "too cheesey". So: the identity and one address on the left, the link
   groups with room to breathe on the right, one quiet motif, a bottom bar
   with the byline, the legal line and the social row, and the product's
   name drawn across the foot as the brand moment. The wordmark is an SVG
   text fitted to the width with textLength, so it spans the page at every
   width without a media query and never overflows. */
export function footShell(cfg, p, o = {}) {
  const to = hello(cfg, o.box);
  const groups = (o.groups || []).map((g) => `<nav class="fsh-g" aria-label="${esc(g.title)}"><h3 class="fsh-k">${esc(g.title)}</h3><ul>${g.links.map(([h, t]) => `<li><a href="${esc(h)}">${esc(t)}</a></li>`).join('')}</ul></nav>`).join('');
  const word = o.wordmark === false ? '' : (o.wordmark || p.name);
  /* a display face runs ~0.6em a letter, so this font size fills ~1000
     units; lengthAdjust="spacing" absorbs the rest without stretching a
     glyph. The viewBox stops just under the baseline: a descender is cut by
     the foot of the page, on purpose. */
  const wfs = word ? Math.round(1000 / (word.length * (o.wmRatio || 0.5))) : 0;
  const wh = Math.round(wfs * 0.74);
  const wm = word ? `<svg class="fsh-wm" viewBox="0 0 1000 ${wh}" aria-hidden="true" focusable="false"><text x="0" y="${wh - 2}" font-size="${wfs}" textLength="1000" lengthAdjust="spacing">${esc(word)}</text></svg>` : '';
  return `<footer class="fsh${o.cls ? ` ${esc(o.cls)}` : ''}" id="foot">
  <div class="wrap fsh-in">
    <div class="fsh-id">
      <a class="fsh-brand" href="/" aria-label="${esc(p.name)} — home">${o.brand || `${mark(p.id, 34, { label: false })}<span class="fsh-n">${esc(p.name)}</span>`}</a>
      <p class="fsh-d">${esc(o.descriptor || p.descriptor)}</p>
      <p class="fsh-mail"><a href="${mailto(cfg, '', o.box)}">${esc(to)}</a><button class="copyb" type="button" data-copy="${esc(to)}" data-copied="Address copied — opening your mail app" aria-label="Copy ${esc(to)} and open your mail app">${ICON.mail}</button></p>
      ${o.note ? `<p class="fsh-note">${esc(o.note)}</p>` : ''}
      ${o.motif ? `<div class="fsh-motif">${o.motif}</div>` : ''}
    </div>
    <div class="fsh-gs">${groups}</div>
    <div class="fsh-bot">
      ${byline(Boolean(o.dark))}
      <p class="fsh-legal">${o.fine ? `${esc(o.fine)} ` : ''}${esc(cfg.legalLine)}</p>
      ${social(p.id, { cls: 'fsh-soc', size: 17 })}
    </div>
  </div>
  ${wm}${o.after || ''}
</footer>`;
}
