// /shelf — Aisle 4: the whole product, laid out like stock on a shelf.
//
// WHY THIS IS A ROUTE AND NOT A SECTION. A full strip of all eight screens
// is 31–48 kB of HTML, and index.html is the one file the build measures
// (tools/check.mjs:204). It was already 5 kB over the 160 kB warn before a
// byte of this landed. So the eight screens live here, where they cost the
// budget nothing — and it is the better page anyway: "see the whole
// product" is the link a partner actually clicks, and a route can be sent.
//
// Every word of every caption is read from the screen's own title and sub
// in render/instruments.js, from data/page.js, or from brand.js. The
// "What this proves" line under each screen is the only new sentence on
// the page and each one restates a rule the specification already states.

import { esc, sec, h2 } from '../../shared.js';
import { filmStrip, callouts, webShell, screensOf } from '../../instruments.js';
import { PAGES } from '../../../data/page.js';
import { STATE_SETS } from '../../../data/states.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker, directory, SHELF_TABS } from './parts.js';

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

/* the caption and the proof under each screen. `cap` overrides the
   screen's own sub only where a shorter line reads better in a strip;
   `proves` is the sentence that makes the picture evidence rather than
   decoration, and every one of them is a rule from the specification. */
const NOTES = {
  buy: {
    tab: 'Buy queue',
    cap: 'All houses · what is short, who asked, who approved, and the cheapest shop on the price list.',
    proves: 'Five origins and no sixth — a menu shortfall, an expiry, a par breach, a reserve gap, or a resident’s diet tag — and every request carries exactly one, preserved through to purchase. Where a purchasing rule decided, the rule is recorded in place of an approver.',
  },
  menu: {
    tab: 'The week’s menu',
    cap: 'One house, one week, checked against the tags of the people who live there.',
    proves: 'The allergen line warns and never prevents: preventing a menu teaches people to work around the product. A resident on this screen is “Room 3” — a label, never a name.',
  },
  expiry: {
    tab: 'Expiry Watch',
    cap: 'Every dated item across the houses, most urgent first, with the value at risk totalled at the foot.',
    proves: 'Dated at entry, not guessed. Three actions and each is one step from the row: use it, replace it — which files a request carrying the expiry origin — or discard it, which writes a waste movement with a note.',
  },
  stock: {
    tab: 'Zones',
    cap: 'Pantry, fridge, freezer, reserve — in the walk order the house sets, not the one a catalogue would pick.',
    proves: 'On hand is never typed. Count, scan, cook, discard or close a receipt — each one writes a movement carrying the actor, the reason and a key that records it exactly once. Par is the one number set directly, because a par is a target and not a fact.',
  },
  cook: {
    tab: 'Cook mode',
    cap: 'Today’s prep in the house’s own time zone, the allergen check before you plate.',
    proves: 'Complete, and stock goes down exactly once however many times completion is attempted. The tray note is rendered at the moment of viewing and stored on nothing.',
  },
  shop: {
    tab: 'In the shop',
    cap: 'An aisle-ordered list priced by store; a pick becomes Purchased with the real shop and the real cost.',
    proves: 'Every action works with no signal and lands exactly once on reconnection, so a pick is never counted twice. Closing the run is the only moment stock rises from a shop.',
  },
  today: {
    tab: 'Today · a caregiver',
    cap: 'Willow House, one shift: what to restock, what is dated, what is for dinner.',
    proves: 'The first screen after sign-in answers one question — what does this house need today — and every line on it is a link into the loop rather than a notification.',
  },
  'today-mgr': {
    tab: 'Today · a manager',
    cap: 'The same briefing, rolled up: every house, and the cost of the next run.',
    proves: 'Same day, two briefings, one record underneath. The roll-up counts houses; it never ranks them, because a count is not a grade.',
  },
};

/* the numbered callouts over the desktop till. Each `sel` is resolved
   against the shell at run time and a selector that stops matching simply
   hides its pin — the sentence stays in the list underneath either way.
   Two of them carry coordinates instead, so the page is annotated even
   with scripting off. */
const PINS = [
  { n: 1, text: 'The banner. Until a provider inspected on that track has reviewed the rule set, it says so here and on every export — including the one you hand a surveyor.', sel: '.notice-a' },
  { n: 2, text: 'The origin, on the row. Without it the queue is a list; with it, the queue is diagnosable.', sel: '.tbl-a tbody tr:nth-child(2) td:nth-child(3)' },
  { n: 3, text: 'The confidence on a citation. Ten Oregon citations are explained in the product; every other catalogue row carries the bare rule text and seeds inferred.', sel: '.conf-a' },
  { n: 4, text: 'Asked, then approved — by a person, or by the purchasing rule that decided instead of one.', sel: '.tbl-a tbody tr:nth-child(1) td:nth-child(6)' },
  { n: 5, text: 'Expiry Watch beside the queue: most urgent first, the money at the foot, and Make the shopping list one step away.', sel: '.page-side .tile-a' },
  { n: 6, text: 'One search field and one palette, the same four verbs the phone carries. Nothing on the web that is not on the phone.', x: 50, y: 7 },
];


/* ── EVERY KEY THE STORE ANSWERS TO ────────────────────────────────────
   Nothing below is new behaviour: the palette, the aisle walk, the rail
   and the ticket switcher all already answer these keys, on this page and
   on the other nine. What was missing was anywhere that SAYS so — and a
   demo a partner is given ninety seconds with is a demo whose keyboard
   has to be discoverable, not discovered. */
const KEYS = [
  ['⌘K', 'Ctrl K', 'Open the palette: the verbs, the nine rooms and all eight screens, in one field'],
  ['←', '→', 'Walk to the previous or the next aisle of the page you are on'],
  ['←', '→', 'On the shelf rail, or on a ticket switcher: the previous or the next screen'],
  ['Home', 'End', 'On a ticket switcher: the first screen, or the last'],
  ['Tab', '', 'The rail itself takes focus, so a keyboard reaches the screens without a mouse'],
  ['Esc', '', 'Close the palette, the drawer, or an open aisle'],
];

const stateRows = STATE_SETS.careshop;

export function shelfPage(cfg, p) {
  const screens = screensOf('careshop');
  const q = find('screen');

  const strip = filmStrip('careshop', {
    id: 'shelf',
    kind: 'ios',
    notes: NOTES,
    label: 'All eight CareShop screens, at the size they ship',
    jumpLabel: 'Jump to a screen',
    hint: 'Drag it, flick it, or use the arrow keys. Every screen here is the product itself.',
  });

  const inner = `${pageHead('Aisle 4 · the shelf', 'Eight screens. All of them, full size.', 'The whole of CareShop, in the order a house meets it.', `<div class="ctas"><a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="shelf"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a><a class="btn lg" href="#strip">${ic('down', 18)}Start at the queue</a></div>`)}
${sec('strip', 'shelf-s', `<div class="wrap">
  <div class="head">${sticker('shelf', 'The shelf · ' + screens.length + ' screens')}${h2('strip', 'Pick one up.', 'Each one is captioned with what it is, and the one thing it proves.')}</div>
  ${strip}
</div>`, { label: 'Every screen' })}
${sec('till', 'till-s', `<div class="wrap">
  <div class="head">${sticker('store', 'On a laptop, at the desk')}${h2('till', 'The same queue, at the till.', q.sub)}</div>
  ${callouts(webShell('careshop', { key: 'buy', width: 1280 }), PINS, { label: 'What the buy queue shows, point by point', id: 'cal-till' })}
  <p class="demo-f">${esc(q.side.label)}. ${esc(q.side.text)}</p>
</div>`, { label: 'The buy queue, annotated' })}
${sec('labels', 'labels-s', `<div class="wrap">
  <div class="head">${sticker('tag', 'The four labels')}${h2('labels', 'Four words, and no fifth.', 'Every item in the store wears exactly one of them. Four words for the state of an item. Three of them are on the screens above; a reserve gap is marked separately.')}</div>
  <ul class="labels-l">${stateRows.map(([key, word, , note]) => `<li class="labels-i"><span class="st" data-state="${esc(key)}"><i aria-hidden="true"></i>${esc(word)}</span><p>${esc(note)}</p></li>`).join('')}</ul>
</div>`, { label: 'The four state words' })}
${sec('keys', 'keys-s', `<div class="wrap">
  <div class="head">${sticker('keyboard', 'Without touching the mouse')}${h2('keys', 'Every key the store answers to.', 'The rail, the ticket switcher and the palette were built for a keyboard first.')}</div>
  <ul class="keys">${KEYS.map(([a, b, d]) => `<li><span class="keys-k"><kbd>${esc(a)}</kbd>${b ? `<kbd>${esc(b)}</kbd>` : ''}</span><span>${esc(d)}</span></li>`).join('')}</ul>
</div>`)}
${sec('addresses', 'addr-s', `<div class="wrap">
  <div class="head">${sticker('receipt', 'Send one to somebody')}${h2('addresses', 'Every screen has an address.', 'Copy one and paste it into a message. It opens on that screen.')}</div>
  <ul class="addr-l">${SHELF_TABS.map(([key, name], i) => `<li class="addr-r"><a class="addr-a" href="#shelf-${esc(key)}"><span class="addr-n">${String(i + 1).padStart(2, '0')}</span><b>${esc(name)}</b></a><button type="button" class="rc-b addr-c" data-copy="https://${esc(cfg.domain)}/shelf#shelf-${esc(key)}" data-copied="Link to ${esc(name)} copied">${ic('copy', 16)}Copy the link</button></li>`).join('')}</ul>
  
</div>`, { label: 'Deep links to every screen' })}`;
  return page(cfg, p, 'shelf', inner);
}
