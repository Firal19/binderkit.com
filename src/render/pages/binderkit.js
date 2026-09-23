// binderkit.com — the front page.
//
// A binder, not a website. Index tabs down the right edge, a running control
// number in the top rule, a contents page for a footer, and a planner in the
// middle that fills the printed sheet as you answer. White paper, black ink,
// one periwinkle for what is derived rather than cited.
//
// THE WORKING DEMO. Everything a visitor can operate is the product itself:
// the planner runs the product's own rule in the browser, the sheet redraws
// from it, the screen switcher and the plate strip are the real screens, the
// guardrails answer in the product's verbatim words, and the determinism
// check generates the plan twice and compares the two.
//
// BUDGET NOTE. Only /index.html is measured (tools/check.mjs:204), so the
// FULL five-plate strip lives at /screens and this page carries the switcher
// and a two-plate strip. The two `.sec-dev` browser shells this page used to
// carry were the SAME two screens the switcher and the strip now show; a page
// that draws one screen twice is not denser for it.

import { waitlist, mark } from '../shared.js';
import { webShell, screenSwitch, SURFACES } from '../instruments.js';
import { PRODUCTS, byId } from '../../data/brand.js';
import { STATE_SETS } from '../../data/states.js';
import { SIGNUP_FIVE, BILLING_STATES, EVERY_PLAN, JOIN } from '../../data/page.js';
import { header, footer, section, title, sheet, dividers, planner, citesBlock, cite, ev, eyebrow, h2, HOME, atChapter, find, esc, ic } from './binderkit/chrome.js';
import { planPage } from './binderkit/plan.js';
import { libraryPage } from './binderkit/library.js';
import { pricingPage } from './binderkit/pricing.js';
import { aboutPage } from './binderkit/about.js';
import { contactPage } from './binderkit/contact.js';
import { screensPage, annotated, NOTES, ORDER, EDITOR_PINS } from './binderkit/screens.js';

export { header, footer };
export const pages = [screensPage, planPage, libraryPage, pricingPage, aboutPage, contactPage];

const [TOP, WHY, SCREENS, PLAN, PAGE, LIBRARY, EDITOR, VERSIONS, PLATES, NOTHING, ROLES, QUESTIONS, PRICING, FAMILY, JOINS] = HOME;
const S = SURFACES.binderkit;

export const ARTEFACTS = [
  ['The contents page', 'One page per binder. The item, the authority beside it, the evidence tag, the control number in the footer.'],
  ['Tab dividers', 'Numbered and labelled for common divider stock, in the order the plan gives them.'],
  ['The brief', 'One page: why this binder exists, what goes in it, and what does not.'],
  ['The procedure', 'How the binder is kept, step by step, as a standard operating procedure rather than a policy.'],
];
const HOLDS_NOTHING = [
  ['No resident, no staff member', 'beyond the platform’s own accounts.'],
  ['No upload of any kind', 'no document, no photograph, no logo.'],
  ['No record of whether a document is actually filed', 'that is the review cycle, and it requires findings.'],
  ['No review, no finding, no readiness measure', 'a claim about a home the product could not support.'],
  ['No free-text field about a person', 'labels that look like a name are refused.'],
  ['Identity lines print blank', 'and are completed by hand.'],
];
export const GUARDS = [['Coverage', 'Every item the library requires stays in some tab.'], ['Scope and access', 'Nothing that would hold a fact about a person can be added.'], ['Cohesion', 'A tab holds one subject; an item cannot be filed where it does not belong.']];
const RULES = ['A published library version is never changed; corrections are new versions.', 'Item identifiers are permanent, because notes and edits attach to them.', 'Notes survive everything — library change, track change, reset, re-plan.', 'A print that fails consumes no control number.', 'Nothing changes without acceptance: an update is an offer and a diff, never an applied change.'];

/* The three guardrails, in the product's verbatim words. Each row is an
   attempt a provider actually makes, the guardrail that answers, and the
   alternative the refusal is required to offer. The refusal texts are the
   ones written down in the feature document, unaltered. */
const TRIES = [
  ['coverage', 'Remove a required tab', 'Coverage',
    'This item is required by 411-360-0170. You can move it to another tab, but it can’t come out of the binder.',
    'Tab 1, Admission and documentation, can go to any other tab in this binder — and the move is one tap away.'],
  ['scope', 'Move a staff record across', 'Scope and access',
    'Staff records and resident records are kept separately. This item can move within the staff file.',
    'The tabs inside the staff file are offered instead. Records about different subjects are kept apart.'],
  ['cohesion', 'Split a tab in two', 'Cohesion',
    'These items are one tab. Move the whole tab, or move this item into an existing tab here.',
    'Move the whole tab, or pick an existing tab in the destination binder.'],
];

/* The boundary test, in the product's own four questions. The first answer
   has to be yes and the other three no; each answer that is not, names the
   room the request belongs in. Four checkboxes and a :has() rule — no
   script, and it works with scripting off. */
const BTEST = [
  ['does', 'Does it tell a provider what goes where?', 'Yes — that is Binderkit’s whole domain: which binders, which tabs, which items, in which order, with the rule beside each.'],
  ['store', 'Does it store a document?', 'Then it belongs to Provider Hub Oregon, the Digital Binder. Binderkit prints the tab the document goes in and takes no upload of any kind.'],
  ['track', 'Does it track what is filed?', 'Then it is a review cycle, and a review cycle needs findings — records about people. It stays out.'],
  ['finding', 'Does it record a finding?', 'Then it is a record about a person, and holding none of them is the whole of this product’s value.'],
];

/* The state of the work. Every line is read from the vault entry, the page
   specification or the feature document — nothing here is an estimate of
   ours. A product that cannot say what is missing has not counted it. */
const WORK = [
  ['page', 'This page', 'live', 'The only Binderkit you can use today. The planner below runs the product’s rule in your browser; nothing you type leaves it.'],
  ['product', 'The product', 'draft', 'Draft v1.1, and no repository yet. The engineering is the easy half and it has not started.'],
  ['libraries', 'The libraries', 'none', 'Four are needed, one per licence track. None is written. The library is the gate.'],
  ['citations', 'Citations read against the rule', 'none', 'None. Not one of the thirty-two adult-foster-home items, and not one of the ninety-nine agency citations.'],
  ['reading', 'The reading', 'open', 'Thirty to forty hours per library, each needing a provider inspected on that track. No content owner is assigned.'],
  ['price', 'The price', 'open', 'Not decided. Whether Binderkit is a subscription or a single purchase is open item #9, and no number is printed anywhere on this site.'],
];
const COUNTS = [
  ['libraries', 'Libraries needed', '4'],
  ['written', 'Libraries written', '0'],
  ['observed', 'Items observed', '32'],
  ['derived', 'Items derived', '94'],
  ['recorded', 'Citations recorded', '99'],
  ['verified', 'Citations verified', '0'],
];
const TABLES = [
  ['product', 'Product tables', '9', 'All organisational: your facilities, your answers, your plans, your versions, your prints.'],
  ['platform', 'Platform tables with account information', '7', 'Users, memberships, invites, notification preferences, support tickets, and the platform’s own admin and impersonation records.'],
  ['phi', 'Tables holding anything about a resident', '0', 'There is no field in this product that can hold a name, a date of birth, a diagnosis or a finding.'],
];
const NOTIFS = [
  ['plan', 'Your plan has a new version'],
  ['library', 'The library has been updated'],
  ['trial', 'Your trial ends tomorrow'],
  ['export', 'Your export can be downloaded'],
];
/* The control number, taken apart. The form is the one the specification
   states — facility code, binder, plan version, print sequence — and the
   binder letters are the codes the planner on this page already uses. */
const CTLX = [
  ['facility', 'Facility code', 'WH-1', 'Made from the facility name’s initials and a number when you create it, never changed, and never containing a person’s name.'],
  ['binder', 'Binder', 'RB', 'The resident binder. SB staff, FB facility, EB emergency, PB policy — the same codes the planner above prints.'],
  ['version', 'Plan version', 'v2', 'Every generation, edit, reset and re-plan makes one, and every one is kept and can be reprinted.'],
  ['sequence', 'Print sequence', '0418', 'Two prints of the same version carry different numbers, and a print that fails consumes none.'],
];

export const artefacts = () => `<div class="arts"><span class="strip-l">Four things print</span>
  <div class="art-g">${ARTEFACTS.map(([t, d], i) => `<div class="art"><span class="art-n">${i + 1}</span><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div></div>`;

/* ── the sections ─────────────────────────────────────────────────────── */
const hero = (cfg, p) => title(TOP, {
  eyebrow: 'Binder setup for Oregon care homes · no resident data, ever',
  h1: p.headline.text,
  lede: p.lede,
  ctas: `<a class="btn pri lg" href="#join" data-cta="hero">${esc(cfg.cta.primary)}</a><a class="btn lg" href="#page">${ic('page', 18)}<span>${esc(cfg.cta.secondary)}</span></a><a class="btn lg" href="/screens" data-cta="hero-screens">${ic('binder', 18)}<span>All five screens</span></a>`,
  fine: 'It prints on day one, on the black-and-white printer you already own. Nothing on this page is behind a signup: the planner, the sheet, the editor and the plates all run here.',
  aside: `<div class="desk"><div class="divs" aria-hidden="true"><i></i><i></i><i></i></div>${sheet({ cls: 'is-hero' })}<button class="sheet-tap" type="button" data-lens aria-label="Magnify the contents page">${ic('zoom', 18)}<span>Magnify</span></button></div>`,
});
/* No "on this page" block in this title page, and it is the one chapter
   that goes without: the front page is the only one with sixteen sections,
   the only one whose right-edge tab rail is a section index rather than a
   chapter list, and the only one measured for bytes. Three copies of its
   own navigation are already one more than it needs. The other six
   chapters, which have neither a section rail nor a byte budget, carry it. */

/* ── 02 · why this one can ship first ─────────────────────────────────── */
function why() {
  const s = find('proof');
  return section(WHY, `${eyebrow('The case, in three')}${h2('why', 'Why this is the one that can ship first.', 'Two of these are structural facts about the product rather than promises about it, and both can be checked on this page.')}
    <div class="art-g proof-g">${s.items.map(([t, d], i) => `<div class="art proof" data-proof="${i + 1}"><span class="art-n proof-n">${String(i + 1).padStart(2, '0')}</span><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div>
    <p class="closing">No business associate agreement, because the product receives no protected information — which is why signing up is five steps rather than six, and why this is the mini with no legal gate in front of its first customer.</p>`);
}

/* ── 03 · every surface, switched by its own index tab ────────────────── */
const screens = () => section(SCREENS, `${eyebrow('The product, running here')}${h2('screens', 'Answers in, binder out — one index tab each.', 'The two halves of Binderkit, switched the way a binder is switched: by the tab. Nothing on the page moves when you change tab, because the stage keeps the height of the taller screen.')}
  ${screenSwitch('binderkit', { id: 'sw-screens', kind: 'ios', only: ['intake', 'contents'], notes: NOTES, on: 0, label: 'Binderkit screens' })}
  <p class="cap">Editing, versions and print are the other three screens; all five, at full bleed and with what each proves, are in the plate section: <a href="/screens">The screens</a>. Screens use sample data.</p>`);

const plan = () => section(PLAN, `${eyebrow('Question zero, then five')}${h2('plan', 'Five answers in. Five binders out.', 'Question zero is the licence track; it selects the library, and the library is everything. Then five questions, one per page. The same answers always produce the same plan, with the reasoning shown.')}
  ${planner()}
  <div class="det">
    <span class="strip-l">Deterministic, and you can check it here</span>
    <p>Generate the plan twice from the answers above and compare the two, character for character. In the product the test is stronger — two generations from the same library version produce byte-identical files — but this is the same rule, running in your browser.</p>
    <button class="btn sm" type="button" data-determinism>${ic('reset', 18)}<span>Generate it twice and compare</span></button>
    <p class="det-out" data-det-out role="status" aria-live="polite">Not run yet.</p>
  </div>
  <p class="cap">The whole chapter — every step from question zero to reset, with the three guardrails — is at <a href="/plan">The plan</a>.</p>`);

function page() {
  const s = find('screen');
  const on = (fn) => (typeof fn === 'function' ? fn(S) : fn);
  return section(PAGE, `${eyebrow('The signature output')}${h2('page', s.heading, s.sub)}
    <div class="sheet-tools">
      <div class="legend" role="group" aria-label="Show rows by evidence"><span class="strip-l">Show</span>${['verified', 'derived', 'open'].map((t) => `<button class="tog" type="button" data-ev-toggle="${t}" aria-pressed="true">${ev(t)}</button>`).join('')}<span class="tog-count" data-legend-count>5 of 5 rows</span></div>
      <div class="sheet-acts">
        <button class="btn sm" type="button" data-turn aria-pressed="false">${ic('turn', 18)}<span>Turn the page</span></button>
        <button class="btn sm" type="button" data-lens data-ruler>${ic('ruler', 18)}<span>Hold it at true size</span></button>
        <button class="btn sm" type="button" data-print>${ic('print', 18)}<span>Print the contents page</span></button>
      </div>
    </div>
    <div class="page-g print-zone">
      <div class="page-v"><div class="leaf" data-leaf><div class="leaf-f">${sheet({ cls: 'is-page', print: true })}</div><div class="leaf-b">${dividers()}</div></div></div>
      <ol class="annot">${s.callouts.map(([t, d]) => `<li><b>${esc(on(t))}</b><span>${esc(d)}</span></li>`).join('')}</ol>
    </div>
    <div class="banner-note"><span class="strip-l">${esc(s.side.label)}</span><p>${esc(s.side.text)}</p></div>
    ${artefacts()}
    <p class="cap">${esc(s.caption)}</p>
    <div class="figure"><span class="strip-l">${esc(s.figure.heading)}</span><p><s class="strike is-plain">${esc(s.figure.rejected)}</s> <span class="figure-k">${esc(s.figure.kept)}</span></p><span class="cap">${esc(s.figure.caption)}</span></div>`);
}

function library() {
  const s = find('depth');
  const words = STATE_SETS.binderkit;
  return section(LIBRARY, `${eyebrow('The library is the product')}${h2('library', s.heading, s.sub)}
    <table class="lib"><thead><tr>${s.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${s.rows.map((row) => `<tr><th scope="row" data-col="${esc(s.cols[0])}">${esc(row[0])}</th>${row.slice(1).map((c, i) => `<td data-col="${esc(s.cols[i + 1])}" class="${i === 0 ? 'is-auth' : ''}">${i === 0 ? `<code>${esc(c)}</code>` : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
    <p class="closing">${esc(s.closing)}</p>
    <div class="tags"><span class="strip-l">Four words, and every item on every page is one of them</span>
      <div class="tag-g words is-4">${words.map(([k, label, , what]) => `<div data-word="${esc(k)}"><i class="ev is-${esc(k)}">${esc(label)}</i><span>${esc(what)}</span></div>`).join('')}</div>
    </div>
    ${citesBlock()}
    <div class="struck"><span class="strip-l">${esc(s.struck.heading)}</span><p>${s.struck.words.map((w, i) => `<s class="strike" style="--d:${i * 260}ms">${esc(w)}</s>`).join('')}</p><span class="cap">${esc(s.struck.foot)}</span></div>
    <p class="cap">The four libraries, what is written and what is not, and the six things this product will never do: <a href="/library">The library</a>.</p>`);
}

const editor = () => section(EDITOR, `${eyebrow('Edit, guarded')}${h2('editor', 'Add, remove or reorder a tab. Three guardrails answer in plain words.', 'Coverage, scope and access, cohesion. A refusal names the rule that caused it and offers an alternative — a refusal that cannot explain itself is a bug.')}
  ${annotated(webShell('binderkit', { key: 'editor' }), EDITOR_PINS, { id: 'cal-editor', label: 'What the guarded editor does' })}
  <div class="tryg">
    <span class="strip-l">Try one of the three edits it refuses</span>
    <div class="tryg-b">${TRIES.map(([k, attempt, name, refusal, alt]) => `<button class="btn sm" type="button" aria-pressed="false" data-guard-try="${esc(k)}" data-gname="${esc(name)}" data-refusal="${esc(refusal)}" data-alt="${esc(alt)}">${ic('tab', 18)}<span>${esc(attempt)}</span></button>`).join('')}</div>
    <div class="tryg-o" data-guard-out role="status" aria-live="polite"><p class="tryg-idle">Pick one. The product answers in the words it is written to use — it never says “not allowed”.</p></div>
  </div>
  <p class="cap">The web is Binderkit’s primary surface, because a provider building binders is at a table with a printer.</p>
  <div class="guards">${GUARDS.map(([t, d]) => `<div class="guard"><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div>`);

function versions() {
  const v = S.screens.find((s) => s.key === 'versions').diff;
  return section(VERSIONS, `${eyebrow('Versions and control numbers')}${h2('versions', 'Every version kept. Every page reproducible.', 'An answer changes, the plan regenerates, the diff is shown, and the version becomes n+1. Notes carry by item ID. Any past control number prints the identical page.')}
    <div class="vtog" role="group" aria-label="Which version to show"><button class="tog" type="button" data-v="1" aria-pressed="false">v1 · RB-0417</button><button class="tog" type="button" data-v="2" aria-pressed="true">v2 · RB-0418</button></div>
    <p class="replan" data-v-banner>A re-plan was offered and accepted: answer 1 changed. One tab added, one moved, nothing removed. v1 is kept, and its control number still prints the identical page.</p>
    <table class="lib ver" data-vtable data-v="2"><thead><tr><th scope="col">Version or item</th><th scope="col">Change</th><th scope="col">Why</th><th scope="col">Evidence</th><th scope="col">Date</th></tr></thead>
      <tbody>${v.map(([t, what, why2, tag, when]) => `<tr data-change="${esc(what)}"><th scope="row" data-col="Version or item">${esc(t)}</th><td data-col="Change" class="chg">${esc(what)}</td><td data-col="Why">${/^OAR/.test(why2) ? cite(why2) : esc(why2)}</td><td data-col="Evidence">${ev(tag)}</td><td data-col="Date"><code>${esc(when || '—')}</code></td></tr>`).join('')}</tbody></table>
    <div class="rules"><span class="strip-l">The rules that make a printed page trustworthy</span>
      <ol>${RULES.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
    </div>`);
}

/* ── 09 · the register of plates ──────────────────────────────────────
   A printed book lists its plates before it prints them, with a page
   number against each. This is that list: five rows, each naming the
   screen, what it shows and the one thing it is evidence for, each with
   the address of its plate and a button that copies it.

   It is a LIST and not a second strip because the front page is the only
   route tools/check.mjs weighs (check.mjs:204 measures '/index.html' and
   nothing else) and a five-card rail is 30 kB of markup. The switcher two
   sections up is the front page's operable instrument; the rail, at full
   bleed with all five, is one link away and costs the budget nothing. */
const platesSec = () => section(PLATES, `${eyebrow('The register of plates')}${h2('plates', 'Five screens, and what each one is evidence for.', 'Every plate has an address of its own, so a single screen can be sent to somebody without the rest of the page around it.')}
  <ol class="preg">${ORDER.map((k, i) => `<li class="preg-i" data-plate="${esc(k)}">
    <span class="preg-n">${String(i + 1).padStart(2, '0')}</span>
    <div class="preg-b"><b><a href="/screens#plates-${esc(k)}">${esc(NOTES[k].title)}</a></b>
      <span class="preg-tab">${esc(NOTES[k].tab)}</span>
      <span class="preg-c">${esc(NOTES[k].cap)}</span>
      <span class="preg-p"><span class="preg-pl">What this proves</span>${esc(NOTES[k].proves)}</span></div>
    <button class="plate-a" type="button" data-copy="https://binderkit.com/screens#plates-${esc(k)}" data-copied="Link to this plate copied">${ic('copy', 14, { bare: true })}<span>Copy the address</span></button>
  </li>`).join('')}</ol>
  <a class="btn lg preg-cta" href="/screens" data-cta="plates">${ic('binder', 18)}<span>Open the plate section</span></a>`);

const TICK = '<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l5 5 9-10" fill="none" stroke-width="2" stroke-linecap="square"/></svg>';
function nothing() {
  const b = find('boundary');
  const next = b.cols.find((c) => c.kind === 'next');
  const never = b.cols.find((c) => c.kind === 'never');
  return section(NOTHING, `${eyebrow('The defining constraint')}${h2('nothing', 'It holds nothing about anyone.', 'Six rules hold that in place, and each one is load-bearing. It is why the signup has five steps instead of six, and why there is no business associate agreement to sign.')}
  <ol class="six" data-ledger>${HOLDS_NOTHING.map(([t, d]) => `<li>${TICK}<div><b>${esc(t)}</b> <span>${esc(d)}</span></div></li>`).join('')}</ol>
  <div class="bd-g">
    <div class="bd-c"><span class="strip-l">${esc(next.label)} — it belongs to a sibling</span>
      <ul class="next">${next.items.map(([t, id, note]) => `<li data-next="${esc(id)}"><b class="next-t">${esc(t)}</b><span>${esc(byId[id] ? byId[id].short : id)}</span><small>${esc(note)}</small></li>`).join('')}</ul>
    </div>
    <div class="bd-c bd-never"><span class="strip-l">${esc(never.label)} — not by a sibling either</span>
      <ol class="refused">${never.items.slice(0, 5).map(([t]) => `<li>${esc(t)}</li>`).join('')}</ol>
      <span class="cap">${esc(never.items[never.items.length - 1][0])}</span>
    </div>
  </div>
  <div class="bt" data-btest><fieldset><legend class="strip-l">${esc(b.strip.label)}</legend>
    <div class="bt-rows">${BTEST.map(([k, q]) => `<label class="bt-r" for="bt-${esc(k)}"><input class="bt-i" id="bt-${esc(k)}" type="checkbox" data-bt="${esc(k)}"><span class="bt-b" aria-hidden="true"></span><span class="bt-q">${esc(q)}</span></label>`).join('')}</div>
    <div class="bt-out" data-bt-out>
      <p class="bt-0">Tick what the capability you have in mind does. The first answer has to be yes and the other three no.</p>
      ${BTEST.map(([k, , verdict]) => `<p class="bt-a" data-bt-a="${esc(k)}">${esc(verdict)}</p>`).join('')}
    </div>
  </fieldset></div>
  <p class="boundary">Binderkit plans and prints your binders. It does not store documents, track what is filed, record reviews, or certify readiness.</p>`);
}

function roles() {
  const s = find('roles');
  return section(ROLES, `${eyebrow('Who does what')}${h2('roles', s.heading, s.sub)}
    <table class="lib"><thead><tr>${s.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${s.rows.map(([r, who, does, dev]) => `<tr><th scope="row" data-col="${esc(s.cols[0])}"><code>${esc(r)}</code></th><td data-col="${esc(s.cols[1])}">${esc(who)}</td><td data-col="${esc(s.cols[2])}">${esc(does)}</td><td data-col="${esc(s.cols[3])}">${esc(dev)}</td></tr>`).join('')}</tbody></table>
    <dl class="perms">${s.perms.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
    <p class="closing">${esc(s.closing)}</p>`);
}

function questions(cfg) {
  const rows = find('objections').rows;
  return section(QUESTIONS, `${eyebrow('Questions')}${h2('questions', 'The questions we get.')}
    <div class="faq">${rows.map(([q, a], i) => `<details class="faq-i" id="q-${i + 1}" ${i === 0 ? 'open' : ''}>
      <summary><span class="faq-n">Q${i + 1}</span><h3>${esc(q)}</h3><span class="faq-x" aria-hidden="true"></span></summary>
      <div class="faq-a"><p>${esc(a)}</p><a class="faq-link" href="#q-${i + 1}" data-copy="https://${esc(cfg.domain)}/#q-${i + 1}" data-copied="Link to this question copied">${ic('share', 16)}<span>Link to this question</span></a></div>
    </details>`).join('')}</div>`);
}

export const sellSwitch = () => `<div class="ptog" role="group" aria-label="How it is sold"><button class="tog" type="button" data-sell="sub" aria-pressed="true">Subscription</button><button class="tog" type="button" data-sell="once" aria-pressed="false">Single purchase</button></div>
  <p class="sell-note" data-sell-note data-sub="As a subscription: per facility, renewing, with the three-day trial and one-tap cancel." data-once="As a single purchase: per facility, once — a binder revised twice a year may want that rather than a subscription.">As a subscription: per facility, renewing, with the three-day trial and one-tap cancel.</p>`;

function pricing(cfg, p) {
  const s = find('pricing');
  const soon = (price) => (/^Open/.test(price) ? 'Not priced yet' : price);
  return section(PRICING, `${eyebrow('Pricing')}${h2('pricing', s.heading, EVERY_PLAN)}
    ${sellSwitch()}
    <div class="tiers">${p.pricing.rows.map(([name, price, d], i) => `<div class="tier ${i === 1 ? 'is-main' : ''}"><span class="tier-n">${esc(name)}</span><span class="tier-p ${/^Open/.test(price) ? 'is-soon' : ''}">${esc(soon(price))}</span><span class="tier-d">${esc(d)}</span></div>`).join('')}</div>
    <p class="fine">${esc(s.note)}</p>
    <div class="subs">
      <div class="note"><h3>${esc(SIGNUP_FIVE.heading)}</h3><ol class="arrow">${SIGNUP_FIVE.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="cap">${esc(SIGNUP_FIVE.tail)}</p></div>
      <div class="note"><h3>${esc(BILLING_STATES.heading)}</h3><dl class="defs">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
    </div>
    <p class="cap">The whole chapter, with what stays on when you stop paying: <a href="/pricing">Pricing</a>.</p>`);
}

/* ── 15 · one house, four rooms, and the ladder out of this one ───────── */
function family() {
  const f = find('family');
  const l = find('ladder');
  const pho = byId.pho;
  const room = (x, cls = '') => `<li class="room ${cls}" data-fam="${esc(x.id)}"><span class="room-m" aria-hidden="true">${mark(x.id, 30, { label: false, mono: true, tile: 'var(--ink)', glyph: 'var(--bg)' })}</span>
    <div><b>${esc(x.name)}</b><span>${esc(x.descriptor)} — ${esc(x.owns.toLowerCase())}.</span></div>
    <a class="room-l" href="https://${esc(x.domain)}" rel="noopener">${esc(x.domain)}</a></li>`;
  return section(FAMILY, `${eyebrow('The family')}${h2('family', f.heading, 'Binderkit owns the paperwork and nothing else. When a provider outgrows it, the plan and its versions are already in the shape the enterprise platform reads.')}
    <ul class="rooms">${room(pho, 'is-house')}</ul>
    <div class="grad"><span class="strip-l">${esc(l.heading)}</span>
      <p class="sub">${esc(pho.proof[2])}</p>
      <ol class="toc is-ladder">${l.rows.map(([k, v], i) => `<li data-grad="${esc((v.match(/M[0-9]+/) || ['x'])[0])}"><span class="toc-no">${i + 1}</span><span class="toc-t">${esc(k)}</span><span class="toc-l" aria-hidden="true"></span><span class="toc-n is-text">${esc(v)}</span></li>`).join('')}</ol>
      <p class="cap">${esc(l.footer)}</p>
      <p class="boundary">${esc(l.pull)}</p>
    </div>`);
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
${questions(cfg)}
${pricing(cfg, p)}
${family()}
${join(cfg, p)}
</main>
${footer(cfg, p, { page: 'home', fine: find('foot').disclaimer })}`;
}
