// /screens — the plate section.
//
// A printed book puts its illustrations together in one gathering and calls
// them plates. This is that gathering: all five real product screens, each
// at the size it ships, numbered, captioned, and carrying the one thing it
// proves. It lives on its own chapter because a full strip of five screens
// is thirty kilobytes of markup and the front page is the only route with a
// byte budget — and because "see the whole product" is a link a partner
// actually clicks, which is better as a page than as a section.

import { webShell, filmStrip, callouts, screensOf } from '../../instruments.js';
import { header, footer, section, title, BOOK, atChapter, onThisPage, esc, ic } from './chrome.js';

const SECS = BOOK['/screens'];
const [TOP, PLATES, ANNOTATED] = SECS;
const BASE = 'https://binderkit.com/screens';

/* One note per screen: the tab it is filed under, the caption, and the
   single claim the plate is evidence for. Every sentence is the product's
   own — the vault's screen text, the feature document, or the rule this
   site already prints. Nothing here is new. */
export const NOTES = {
  intake: {
    tab: 'Plan', title: 'Question zero, then five',
    cap: 'Question zero is your licence track. Then five questions, each saying why it is asked.',
    proves: 'The same five answers always produce the same plan, and the plan shows its reasoning.',
  },
  contents: {
    tab: 'Binders', title: 'The contents page',
    cap: 'One page per binder: the tabs in order, the rule beside each item, and a tag where a citation is not yet confirmed.',
    proves: 'The identity line is blank and filled in by hand. No field on this page could hold a person’s name.',
  },
  versions: {
    tab: 'Versions', title: 'Versions and control numbers',
    cap: 'An answer changed, the plan regenerated, the diff is shown. Notes stay attached.',
    proves: 'A superseded version is kept, never deleted, and its control number still prints the identical page.',
  },
  print: {
    tab: 'Print', title: 'The four artefacts',
    cap: 'The contents page, the tab dividers, the brief and the procedure. Every print is recorded.',
    proves: 'A print that fails consumes no control number. Any past control number reproduces the identical artefact.',
  },
  editor: {
    tab: 'Editing', title: 'Edit, guarded',
    cap: 'Add, remove or reorder a tab. Three guardrails answer in plain words.',
    proves: 'A refusal names the guardrail, the rule and the alternative. A refusal that offers no alternative is a defect.',
  },
};

export const ORDER = ['intake', 'contents', 'editor', 'versions', 'print'];

/** Each plate's own address, as a copy button inside its caption.
    filmStrip() gives every <li> an id of its own, so the link already
    exists; this only hands it to the reader. The captions come back in
    the order they were asked for, which is why the keys are walked in
    step with the closing tags. */
export function withAddresses(html, keys, id, base = BASE) {
  let i = 0;
  return html.replace(/<\/figcaption>/g, () => {
    const k = keys[i++];
    if (!k) return '</figcaption>';
    return `<button class="plate-a" type="button" data-copy="${esc(base)}#${esc(id)}-${esc(k)}" data-copied="Link to this plate copied">${ic('copy', 14, { bare: true })}<span>Copy this plate’s address</span></button></figcaption>`;
  });
}

/* tools/shots.mjs exempts a horizontally scrolling container by name — the
   [data-scrollx] attribute and eight class names — and the shared
   filmStrip() marks its rail with data-rail instead, so the gate reports
   every card and every jump chip on the strip as sideways overflow at 320,
   390 and 430. They are not overflowing: both containers are
   overflow-x:auto and a card wider than the glass is what a rail is FOR.
   Marking them with the attribute the gate already knows costs nothing and
   binds nothing — data-scrollx is a marker, and the only rule in this site
   that reads it is `.shell[data-scrollx]` in js/pages/binderkit.js. The
   real fix is one line in tools/shots.mjs or in filmStrip(); both are
   shared files, so it is written up in the handoff instead of made here. */
const scrollx = (html) => html
  .replace(/<ol class="fs-rail"/g, '<ol data-scrollx class="fs-rail"')
  .replace(/<nav class="fs-jump"/g, '<nav data-scrollx class="fs-jump"');

export const plates = (id, keys, opts = {}) => scrollx(withAddresses(filmStrip('binderkit', {
  id,
  kind: 'ios',
  only: keys,
  notes: NOTES,
  label: opts.label || 'The five Binderkit screens, at the size they ship',
  hint: opts.hint || 'Drag it, scroll it, or use the arrow keys.',
  jumpLabel: 'Jump to a plate',
}), keys, id, opts.base));

/* The annotated desktop shell, wrapped once for both pages.

   Two things the shared callouts() cannot know about:

   1. It has no data-kind to key off, so instruments-extra's default room
      of 460px applies to a 1280px browser and scales it to a third of
      true size on a desk. The page sheet gives it a web card's room back.
   2. Below 900 the stage scrolls sideways at the house's own reframe
      value — 460px of a 768px shell, z=0.599, the same density the old
      .shell wrapper shipped — and tools/shots.mjs exempts a horizontal
      scroller by name, so the stage says data-scrollx. The pins are
      hidden there: a pin's percentage resolves against the VISIBLE box
      of a scroller, not its content, so it would point at the wrong
      pixel the moment a finger moved it. The numbered list underneath
      carries every sentence, which is the component's own fallback. */
export const annotated = (inner, pins, opts = {}) => callouts(inner, pins, opts)
  .replace('<div class="cal-stage">', '<div class="cal-stage" data-scrollx>')
  + `<p class="shell-hint">${ic('left', 16)}<span>${esc(opts.hint || 'Drag it sideways for the rest')}</span>${ic('right', 16)}</p>`;

/* The four numbered callouts over the guarded editor. Each names a real
   element of the screen; site.js measures it and puts the pin on it, and a
   selector that stops matching hides its pin rather than pointing at the
   wrong thing — the sentence stays in the list underneath either way. */
export const EDITOR_PINS = [
  { n: 1, sel: '.tbl-a tbody tr:first-child .tg', text: 'Required. Coverage refuses a removal and offers the move instead: “This item is required by 411-360-0170; it can move but not go.”' },
  { n: 2, sel: '.tbl-a tbody tr:last-child td:nth-child(3)', text: 'An item of your own carries no rule. Its column reads “Your own practice”, and it lives on this plan only.' },
  { n: 3, sel: '.notice-a', text: 'The refusal says what you tried, which guardrail applied, the rule behind it, and one thing to do instead.' },
  { n: 4, sel: '.spines', text: 'Three guardrails and no fourth: coverage, scope, cohesion.' },
];

function render(cfg, p) {
  atChapter('/screens');
  const five = screensOf('binderkit');
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'screens', tabs: SECS.filter((s) => s.tab) })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light">
${title(TOP, {
    eyebrow: 'Chapter · The screens',
    h1: 'Five screens, at the size they ship.',
    lede: `Every screen Binderkit has: ${five.map((s) => NOTES[s.key].tab.toLowerCase()).join(', ')}. Each one is numbered, captioned, and says what it shows.`,
    ctas: `<a class="btn pri lg" href="#plates">${ic('binder', 18)}<span>Open the screens</span></a><a class="btn lg" href="/#join" data-cta="screens">${esc(cfg.cta.primary)}</a>`,
    index: onThisPage(SECS),
  })}
${section(PLATES, `<h2 id="h-plates">Five screens.</h2><p class="sub">Swipe, drag, or use the arrow keys. Every screen has its own address, so one can be sent on its own.</p>
  ${plates('plates', ORDER)}
  <p class="cap">In the product’s own order: the questions, the binder they produce, the editing, the version, the print.</p>`)}
${section(ANNOTATED, `<h2 id="h-annotated">The guarded editor, at desk size.</h2><p class="sub">The same refusals, on the screen a provider plans at.</p>
  ${annotated(webShell('binderkit', { key: 'editor' }), EDITOR_PINS, { id: 'cal-plates', label: 'What the guarded editor does' })}
  <p class="refusal">“This item is required by section 0170. You can move it, but it can’t come out.”</p>
  <p class="cap">That is the product’s voice. It never says “not allowed”.</p>`)}
</main>
${footer(cfg, p, { page: 'screens', tabs: SECS })}`;
}

export const screensPage = {
  path: 'screens',
  title: 'The screens',
  description: 'All five Binderkit screens — plan, binders, editing, versions and print — each at the size it ships, numbered and captioned.',
  render,
};
