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
const [TOP, PLATES, ANNOTATED, SAMPLE] = SECS;
const BASE = 'https://binderkit.com/screens';

/* One note per screen: the tab it is filed under, the caption, and the
   single claim the plate is evidence for. Every sentence is the product's
   own — the vault's screen text, the feature document, or the rule this
   site already prints. Nothing here is new. */
export const NOTES = {
  intake: {
    tab: 'Plan', title: 'Question zero, then five',
    cap: 'Question zero is the licence track and it selects the library. Then five questions, each saying why it is asked and what it will change.',
    proves: 'The same five answers always produce the same plan, and the plan shows its reasoning.',
  },
  contents: {
    tab: 'Binders', title: 'The contents page',
    cap: 'One page per binder: the tabs in order, numbered, the authority beside each item, the evidence tag where a citation is short of confirmed.',
    proves: 'The identity line is blank and filled in by hand. No field on this page could hold a person’s name.',
  },
  versions: {
    tab: 'Versions', title: 'Versions and control numbers',
    cap: 'An answer changed, the plan regenerated, the diff is shown. Notes are carried by item ID.',
    proves: 'A superseded version is kept, never deleted, and its control number still prints the identical page.',
  },
  print: {
    tab: 'Print', title: 'The four artefacts',
    cap: 'The contents page, the tab dividers, the brief and the procedure. Every print writes a row: version, control number, artefact, who and when.',
    proves: 'A print that fails consumes no control number. Any past control number reproduces the identical artefact.',
  },
  editor: {
    tab: 'Editing', title: 'Edit, guarded',
    cap: 'Add, remove or reorder a tab. Three guardrails answer in plain words: coverage, scope and access, cohesion.',
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
  hint: opts.hint || 'Drag it, scroll it, or use the arrow keys. Every screen here is drawn from the product’s own specification.',
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
  + `<p class="shell-hint">${ic('left', 16)}<span>${esc(opts.hint || 'Shown at the density a phone can read — drag it sideways')}</span>${ic('right', 16)}</p>`;

/* The four numbered callouts over the guarded editor. Each names a real
   element of the screen; site.js measures it and puts the pin on it, and a
   selector that stops matching hides its pin rather than pointing at the
   wrong thing — the sentence stays in the list underneath either way. */
export const EDITOR_PINS = [
  { n: 1, sel: '.tbl-a tbody tr:first-child .tg', text: 'Required. Coverage refuses a removal and offers the move instead: “This item is required by 411-360-0170; it can move but not go.”' },
  { n: 2, sel: '.tbl-a tbody tr:last-child td:nth-child(3)', text: 'A custom item carries no authority at all. Its column reads “Your own practice”, and it lives on this plan only — it never enters a library and never reaches anyone else.' },
  { n: 3, sel: '.notice-a', text: 'The refusal states what was attempted, which guardrail applied, the rule behind it, and one thing to do instead — one tap away.' },
  { n: 4, sel: '.spines', text: 'Three guardrails and no fourth: coverage, scope and access, cohesion. A guardrail that refuses the same item over and over is evidence about the library, not about the provider.' },
];

const REAL = [
  ['The screens', 'Drawn from the product’s specification, not from a running build. Binderkit has no repository yet; its status is draft v1.1.'],
  ['The facility', 'Meadow Care, facility WH-1 — the seeded demonstration world, not a customer.'],
  ['The rows', 'Illustrative. The AFH-DD library is content work that has not been done; thirty-two items were observed on one provider’s shelf and none has been read against the rule.'],
  ['The identity fields', 'Blank, here and in the product. That is the one thing on these plates that is exactly what ships.'],
  ['The control numbers', 'RB-0417 and RB-0418 are made up for the demonstration. The form is real: facility code, binder, plan version, print sequence.'],
];

function render(cfg, p) {
  atChapter('/screens');
  const five = screensOf('binderkit');
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'screens', tabs: SECS.filter((s) => s.tab) })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light">
${title(TOP, {
    eyebrow: 'Chapter · The screens',
    h1: 'Five plates, at the size they ship.',
    lede: `Every screen Binderkit has, in one gathering: ${five.map((s) => NOTES[s.key].tab.toLowerCase()).join(', ')}. Each one is numbered, captioned, and says what it is evidence for. Nothing on this page is a picture of a picture — they are the same drawings the front page runs.`,
    ctas: `<a class="btn pri lg" href="#plates">${ic('binder', 18)}<span>Open the plates</span></a><a class="btn lg" href="/#join" data-cta="screens">${esc(cfg.cta.primary)}</a>`,
    index: onThisPage(SECS),
  })}
${section(PLATES, `<h2 id="h-plates">Five plates.</h2><p class="sub">Snap through them with a finger, a trackpad or the arrow keys. Every plate carries its own address, so one screen can be sent on its own.</p>
  ${plates('plates', ORDER)}
  <p class="cap">The order is the product’s own: question zero, the binder it produces, the editing it permits, the version that results, the print that ends it.</p>`)}
${section(ANNOTATED, `<h2 id="h-annotated">The guarded editor, annotated.</h2><p class="sub">Four numbered callouts on the desktop shell. Point at one and it lights the thing it quotes.</p>
  ${annotated(webShell('binderkit', { key: 'editor' }), EDITOR_PINS, { id: 'cal-plates', label: 'What the guarded editor does' })}
  <p class="refusal">“This item is required by section 0170. You can move it, but it can’t come out.”</p>
  <p class="cap">That sentence is the product’s voice, set down in the design register. It never says “not allowed”.</p>`)}
${section(SAMPLE, `<h2 id="h-sample">What is real on these plates.</h2><p class="sub">Five lines, because a screenshot with sample data in it should say so on the same page rather than in a footer.</p>
  <dl class="ledger">${REAL.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  <p class="boundary">It holds nothing about anyone, so there is nothing on these plates to redact.</p>`)}
</main>
${footer(cfg, p, { page: 'screens', tabs: SECS, fine: 'Screens on this page use sample data.' })}`;
}

export const screensPage = {
  path: 'screens',
  title: 'The screens',
  description: 'All five Binderkit screens in one gathering — plan, binders, editing, versions and print — each at the size it ships, numbered and captioned with what it proves.',
  render,
};
