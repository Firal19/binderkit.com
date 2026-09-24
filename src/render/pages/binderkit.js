// binderkit.com — the front page.
//
// A binder, not a website. Index tabs down the right edge, a running control
// number in the top rule, a chapter list for a footer, and a planner in the
// middle that fills the printed sheet as you answer. White paper, black ink,
// one periwinkle for what is derived rather than cited.
//
// THE WORKING DEMO. Everything a visitor can operate is the product itself:
// the planner runs the product's own rule in the browser, the sheet redraws
// from it, the screen switcher and the register are the real screens, the
// guardrails answer in the product's verbatim words, and the determinism
// check generates the plan twice and compares the two.
//
// Rewritten 2026-09-23 to the review: short copy, no ladder, no sibling, no
// sample-data confession, real prices, a reach-us block after the questions.
// Trimmed the same day to the second review: the rules list and the three
// struck words live on /library only, the versions table stands alone, the
// ledger is four rules about people, and the roles are three cards, not a
// table. Trimmed again to the third: the page keeps three notes on the
// sheet, says in one line what prints and points at /plan for the four
// cards, drops the guardrail tiles the pins already state, drops the
// four-question test under the four rules, and its evidence legend is the
// same three words as every other page.

import { waitlist, reach } from '../shared.js';
import { webShell, screenSwitch, SURFACES } from '../instruments.js';
import { SIGNUP_FIVE, EVERY_PLAN, JOIN } from '../../data/page.js';
import { header, footer, section, title, sheet, dividers, planner, libTable, cite, ev, eyebrow, h2, HOME, atChapter, find, esc, ic, sellSwitch, tierGrid, WORDS, wordsList } from './binderkit/chrome.js';
import { planPage } from './binderkit/plan.js';
import { libraryPage } from './binderkit/library.js';
import { pricingPage } from './binderkit/pricing.js';
import { aboutPage } from './binderkit/about.js';
import { contactPage } from './binderkit/contact.js';
import { screensPage, annotated, NOTES, ORDER, EDITOR_PINS } from './binderkit/screens.js';

export { header, footer };
export const pages = [screensPage, planPage, libraryPage, pricingPage, aboutPage, contactPage];

const [TOP, WHY, SCREENS, PLAN, PAGE, LIBRARY, EDITOR, VERSIONS, PLATES, NOTHING, ROLES, QUESTIONS, PRICING, JOINS] = HOME;
const S = SURFACES.binderkit;

/* Four rules, every one about a person. What the product will not DO —
   store, track, review, certify — is the product's own test, run on every
   request inside the product; the page states the rules and stops. */
const HOLDS_NOTHING = [
  ['No resident and no staff member', 'beyond the accounts that sign in.'],
  ['No upload of any kind', 'no document, no photograph, no logo.'],
  ['No free-text field about a person', 'a label that reads like a name is refused.'],
  ['Identity lines print blank', 'and are filled in by hand.'],
];

/* The three guardrails, in the product's verbatim words: an edit a provider
   actually tries, the guardrail that answers, and the alternative it offers. */
const TRIES = [
  ['coverage', 'Remove a required tab', 'Coverage',
    'This item is required by 411-360-0170. You can move it to another tab, but it can’t come out of the binder.',
    'Tab 1, Admission and documentation, can go to any other tab in this binder, and the move is one tap away.'],
  ['scope', 'Move a staff record across', 'Scope',
    'Staff records and resident records are kept separately. This item can move within the staff file.',
    'The tabs inside the staff file are offered instead.'],
  ['cohesion', 'Split a tab in two', 'Cohesion',
    'These items are one tab. Move the whole tab, or move this item into an existing tab here.',
    'Move the whole tab, or pick an existing tab in the destination binder.'],
];

const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* What prints is one line here. The four cards — the contents page, the
   dividers, the brief, the procedure — are /plan#artefacts, beside the
   phone screen that makes them; they were printed here a second time. */
export const artefacts = () => `<p class="cap arts-line">Four things print: the contents page, the tab dividers, the brief and the procedure. <a href="/plan#artefacts">What prints, in full</a></p>`;

/* ── the sections ─────────────────────────────────────────────────────── */
const hero = (cfg, p) => title(TOP, {
  eyebrow: 'Binder setup for Oregon care homes',
  h1: p.headline.text,
  lede: p.lede,
  ctas: `<a class="btn pri lg" href="#join" data-cta="hero">${esc(cfg.cta.primary)}</a><a class="btn lg" href="#page">${ic('page', 18)}<span>Contents page</span></a><a class="lnk" href="/screens" data-cta="hero-screens">All five screens${ARROW}</a>`,
  fine: 'Prints on day one, on the printer you already own. No resident data, ever.',
  aside: `<div class="desk"><div class="divs" aria-hidden="true"><i></i><i></i><i></i></div>${sheet({ cls: 'is-hero' })}<button class="sheet-tap" type="button" data-lens aria-label="Magnify the contents page">${ic('zoom', 18)}<span>Magnify</span></button></div>`,
});

/* ── 02 · why ─────────────────────────────────────────────────────────── */
function why() {
  const s = find('proof');
  return section(WHY, `${eyebrow('Why Binderkit')}${h2('why', 'Three things that make it work.')}
    <div class="art-g proof-g">${s.items.map(([t, d], i) => `<div class="art proof" data-proof="${i + 1}"><span class="art-n proof-n">${String(i + 1).padStart(2, '0')}</span><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div>
    <p class="closing">No customer agreement to sign, because nothing about a person is stored. Sign up in five steps and print the same day.</p>`);
}

/* ── 03 · the screens, switched by their own index tab ────────────────── */
const screens = () => section(SCREENS, `${eyebrow('The product, running here')}${h2('screens', 'Answers in, binder out.', 'Two screens, switched by their index tabs. Nothing on the page moves when you switch.')}
  ${screenSwitch('binderkit', { id: 'sw-screens', kind: 'ios', only: ['intake', 'contents'], notes: NOTES, on: 0, label: 'Binderkit screens' })}
  <p class="cap">Editing, versions and print are the other three: <a href="/screens">all five screens, at the size they ship</a>.</p>`);

const plan = () => section(PLAN, `${eyebrow('Question zero, then five')}${h2('plan', 'Five answers in. Five binders out.', 'Your licence track selects the library. Then five questions, and the plan says why each binder is there.')}
  ${planner({ fine: false })}
  <div class="det">
    <span class="strip-l">Check it yourself</span>
    <p>The same answers always give the same plan. Generate it twice and compare, character for character.</p>
    <button class="btn sm" type="button" data-determinism>${ic('reset', 18)}<span>Generate it twice and compare</span></button>
    <p class="det-out" data-det-out role="status" aria-live="polite"></p>
  </div>
  <a class="lnk sec-link" href="/plan">The plan, step by step${ARROW}</a>`);

function page() {
  const s = find('screen');
  /* Three notes, not five: the blank identity line, the rule beside an
     item, the control number. The two on the derived tag and the filter
     are what the legend's own toggles above the sheet already do. The
     last note quotes the sheet's footer line; the byline on it is the
     printed page's own, and outside the mock it is a company name on a
     product page, so the quotation stops at the control number. */
  const notes = [0, 1, 4].map((i) => s.callouts[i]);
  const label = (fn) => String(typeof fn === 'function' ? fn(S) : fn).replace(/\s*·\s*by Provider Hub Oregon/, '');
  return section(PAGE, `${eyebrow('What prints')}${h2('page', s.heading, s.sub)}
    <div class="sheet-tools">
      <div class="legend" role="group" aria-label="Show rows by evidence"><span class="strip-l">Show</span>${['verified', 'derived', 'open'].map((t) => `<button class="tog" type="button" data-ev-toggle="${t}" aria-pressed="true">${ev(t)}</button>`).join('')}<span class="tog-count" data-legend-count>5 of 5 rows</span></div>
      <div class="sheet-acts">
        <button class="btn sm" type="button" data-turn aria-pressed="false">${ic('turn', 18)}<span>Turn the page</span></button>
        <button class="btn sm" type="button" data-lens data-ruler>${ic('ruler', 18)}<span>True size</span></button>
        <button class="btn sm" type="button" data-print>${ic('print', 18)}<span>Print it</span></button>
      </div>
    </div>
    <div class="page-g print-zone">
      <div class="page-v"><div class="leaf" data-leaf><div class="leaf-f">${sheet({ cls: 'is-page', print: true })}</div><div class="leaf-b">${dividers()}</div></div></div>
      <ol class="annot">${notes.map(([t, d]) => `<li><b>${esc(label(t))}</b><span>${esc(d)}</span></li>`).join('')}</ol>
    </div>
    ${artefacts()}`);
}

/* The table and the three words, and nothing else. The rules in plain
   words and the three struck words are /library's own sections (#evidence
   and #words), one link away, and were printed here a second time. The
   words are chrome.js WORDS — the same three the legend toggles and the
   library chapter use. */
function library() {
  const s = find('depth');
  return section(LIBRARY, `${eyebrow('Four tracks')}${h2('library', s.heading, s.sub)}
    ${libTable(s)}
    <div class="tags"><span class="strip-l">${WORDS.length === 3 ? 'Three' : String(WORDS.length)} words, on every item</span>
      ${wordsList()}
    </div>
    <a class="lnk sec-link" href="/library#evidence">The rules, in plain words${ARROW}</a>`);
}

const editor = () => section(EDITOR, `${eyebrow('Edit, guarded')}${h2('editor', 'Add, remove or reorder a tab. Three guardrails answer.', 'Coverage, scope and cohesion. A refusal names the rule and offers one thing to do instead. It never says “not allowed”.')}
  ${annotated(webShell('binderkit', { key: 'editor' }), EDITOR_PINS, { id: 'cal-editor', label: 'What the guarded editor does' })}
  <div class="tryg">
    <span class="strip-l">Try one of the three edits it refuses</span>
    <div class="tryg-b">${TRIES.map(([k, attempt, name, refusal, alt]) => `<button class="btn sm" type="button" aria-pressed="false" data-guard-try="${esc(k)}" data-gname="${esc(name)}" data-refusal="${esc(refusal)}" data-alt="${esc(alt)}">${ic('tab', 18)}<span>${esc(attempt)}</span></button>`).join('')}</div>
    <div class="tryg-o" data-guard-out role="status" aria-live="polite"><p class="tryg-idle">Pick one. The product answers in its own words.</p></div>
  </div>`);

/* The evidence column carries one of the three words or nothing: the
   superseded version's row says "Superseded, kept" in plain words in its
   Change column, and a fourth tag for it was a fourth word. */
function versions() {
  const v = S.screens.find((s) => s.key === 'versions').diff;
  return section(VERSIONS, `${eyebrow('Versions and control numbers')}${h2('versions', 'Every version kept. Every page reproducible.', 'An answer changes, the plan regenerates, the diff is shown, and the version becomes n+1. Any past control number prints the identical page.')}
    <div class="vtog" role="group" aria-label="Which version to show"><button class="tog" type="button" data-v="1" aria-pressed="false">v1 · RB-0417</button><button class="tog" type="button" data-v="2" aria-pressed="true">v2 · RB-0418</button></div>
    <p class="replan" data-v-banner>A re-plan was offered and accepted: answer 1 changed. One tab added, one moved, nothing removed. v1 is kept and still prints.</p>
    <table class="lib ver" data-vtable data-v="2"><thead><tr><th scope="col">Version or item</th><th scope="col">Change</th><th scope="col">Why</th><th scope="col">Evidence</th><th scope="col">Date</th></tr></thead>
      <tbody>${v.map(([t, what, why2, tag, when]) => `<tr data-change="${esc(what)}"><th scope="row" data-col="Version or item">${esc(t)}</th><td data-col="Change" class="chg">${esc(what)}</td><td data-col="Why">${/^OAR/.test(why2) ? cite(why2) : esc(why2)}</td><td data-col="Evidence">${ev(WORDS.some(([k]) => k === tag) ? tag : '')}</td><td data-col="Date"><code>${esc(when || '—')}</code></td></tr>`).join('')}</tbody></table>`);
}

/* ── 09 · the five screens, listed ────────────────────────────────────
   A list, not a second strip: the front page is the only route with a
   byte budget, and the full strip lives at /screens one link away. */
const platesSec = () => section(PLATES, `${eyebrow('Five screens')}${h2('plates', 'Five screens, and what each one shows.', 'Every screen has an address of its own, so one can be sent on its own.')}
  <ol class="preg">${ORDER.map((k, i) => `<li class="preg-i" data-plate="${esc(k)}">
    <span class="preg-n">${String(i + 1).padStart(2, '0')}</span>
    <div class="preg-b"><b><a href="/screens#plates-${esc(k)}">${esc(NOTES[k].title)}</a></b>
      <span class="preg-tab">${esc(NOTES[k].tab)}</span>
      <span class="preg-c">${esc(NOTES[k].cap)}</span></div>
    <button class="plate-a" type="button" data-copy="https://binderkit.com/screens#plates-${esc(k)}" data-copied="Link to this screen copied">${ic('copy', 14, { bare: true })}<span>Copy the address</span></button>
  </li>`).join('')}</ol>
  <a class="btn lg preg-cta" href="/screens" data-cta="plates">${ic('binder', 18)}<span>Open all five</span></a>`);

const TICK = '<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l5 5 9-10" fill="none" stroke-width="2" stroke-linecap="square"/></svg>';
function nothing() {
  return section(NOTHING, `${eyebrow('The rule underneath')}${h2('nothing', 'It holds nothing about anyone.', 'Four rules keep it that way. They are why there is no customer agreement to sign before you print.')}
  <ol class="six" data-ledger>${HOLDS_NOTHING.map(([t, d]) => `<li>${TICK}<div><b>${esc(t)}</b> <span>${esc(d)}</span></div></li>`).join('')}</ol>`);
}

/* Three seats as three cards, each with its own punched icon: who they are
   and what they do, a line each. The device column is gone — it read
   "Laptop" three times — and the five-row permission list is one line
   under the cards. */
const SEATS = [
  ['provider', 'key', 'The licence holder or executive director.', 'Answers the questions, edits the plan, prints.'],
  ['manager', 'print', 'The resident manager or program manager.', 'Prints a fresh contents page, adds notes.'],
  ['viewer', 'glasses', 'A consultant or adviser, invited to named facilities.', 'Reads and prints that facility’s plan.'],
];
function roles() {
  const s = find('roles');
  return section(ROLES, `${eyebrow('Who does what')}${h2('roles', s.heading, 'Who answers, who prints, and what each seat may do.')}
    <div class="roles-g">${SEATS.map(([r, icon, who, does]) => `<div class="role" data-role="${esc(r)}">${ic(icon, 24, { cls: 'role-i' })}<code class="role-n">${esc(r)}</code><b>${esc(who)}</b><span>${esc(does)}</span></div>`).join('')}</div>
    <p class="role-key"><span><b>Answer, edit, reset, re-plan</b> provider only</span><span><b>Notes</b> manager and provider</span><span><b>Print</b> everyone, the viewer included</span></p>
    <p class="closing">${esc(s.closing)}</p>`);
}

function questions(cfg, p) {
  const rows = find('objections').rows;
  return section(QUESTIONS, `${eyebrow('Questions')}${h2('questions', 'The questions we get.')}
    <div class="faq">${rows.map(([q, a], i) => `<details class="faq-i" id="q-${i + 1}" ${i === 0 ? 'open' : ''}>
      <summary><span class="faq-n">Q${i + 1}</span><h3>${esc(q)}</h3><span class="faq-x" aria-hidden="true"></span></summary>
      <div class="faq-a"><p>${esc(a)}</p><a class="faq-link" href="#q-${i + 1}" data-copy="https://${esc(cfg.domain)}/#q-${i + 1}" data-copied="Link to this question copied">${ic('share', 16)}<span>Link to this question</span></a></div>
    </details>`).join('')}</div>
    ${reach(cfg, p, { subject: 'A question about Binderkit' })}`);
}

function pricing(cfg, p) {
  const s = find('pricing');
  return section(PRICING, `${eyebrow('Pricing')}${h2('pricing', s.heading, EVERY_PLAN)}
    ${sellSwitch()}
    ${tierGrid(p)}
    <p class="fine">${esc(s.note)}</p>
    <p class="signup-line"><b>${esc(SIGNUP_FIVE.heading)}:</b> ${SIGNUP_FIVE.steps.map((t) => t.toLowerCase()).join(' → ')}. <a href="/pricing">Pricing in full${ARROW}</a></p>`);
}

function join(cfg, p) {
  const s = find('start');
  return section(JOINS, `<div class="join-g">
    <div>${eyebrow(JOIN.eyebrow)}<h2 id="h-join">${esc(JOIN.heading)}</h2><p class="sub">${esc(JOIN.sub)}</p>
      <div class="ten"><span class="strip-l">${esc(s.heading)}</span><ol>${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="cap">${esc(s.sub)}</p></div></div>
    <div class="join-f">${waitlist(cfg, p, { housesLabel: 'How many facilities?' })}<p class="fine">${esc(JOIN.fine)}</p></div>
  </div>`);
}

export function render(cfg, p) {
  atChapter('/');
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'home' })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light" data-printing="sheet">
${hero(cfg, p)}
${why()}
${screens()}
${plan()}
${page()}
${library()}
${editor()}
${versions()}
${platesSec()}
${nothing()}
${roles()}
${questions(cfg, p)}
${pricing(cfg, p)}
${join(cfg, p)}
</main>
${footer(cfg, p, { page: 'home' })}`;
}
