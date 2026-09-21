// binderkit.com — the front page.
//
// A binder, not a website. Index tabs down the right edge, a running control
// number in the top rule, a contents page for a footer, and a planner in the
// middle that fills the printed sheet as you answer. White paper, black ink,
// one periwinkle for what is derived rather than cited.

import { waitlist } from '../shared.js';
import { webShell, SURFACES } from '../instruments.js';
import { SIGNUP_FIVE, BILLING_STATES, EVERY_PLAN, JOIN } from '../../data/page.js';
import { header, footer, section, title, sheet, dividers, planner, citesBlock, cite, ev, eyebrow, h2, HOME, find, esc, ic } from './binderkit/chrome.js';
import { planPage } from './binderkit/plan.js';
import { libraryPage } from './binderkit/library.js';
import { pricingPage } from './binderkit/pricing.js';
import { aboutPage } from './binderkit/about.js';
import { contactPage } from './binderkit/contact.js';

export { header, footer };
export const pages = [planPage, libraryPage, pricingPage, aboutPage, contactPage];

const [TOP, PLAN, PAGE, LIBRARY, EDITOR, VERSIONS, NOTHING, ROLES, QUESTIONS, PRICING, JOINS] = HOME;
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

export const artefacts = () => `<div class="arts"><span class="strip-l">Four things print</span>
  <div class="art-g">${ARTEFACTS.map(([t, d], i) => `<div class="art"><span class="art-n">${i + 1}</span><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div></div>`;

/* ── the sections ─────────────────────────────────────────────────────── */
const hero = (cfg, p) => title(TOP, {
  eyebrow: 'Binder setup for Oregon care homes · no resident data, ever',
  h1: p.headline.text,
  lede: p.lede,
  ctas: `<a class="btn pri lg" href="#join" data-cta="hero">${esc(cfg.cta.primary)}</a><a class="btn lg" href="#page">${ic('page', 18)}<span>${esc(cfg.cta.secondary)}</span></a>`,
  fine: 'It prints on day one, on the black-and-white printer you already own.',
  aside: `<div class="desk"><div class="divs" aria-hidden="true"><i></i><i></i><i></i></div>${sheet({ cls: 'is-hero' })}<button class="sheet-tap" type="button" data-lens aria-label="Magnify the contents page">${ic('zoom', 18)}<span>Magnify</span></button></div>`,
});

const plan = () => section(PLAN, `${eyebrow('Question zero, then five')}${h2('plan', 'Five answers in. Five binders out.', 'Question zero is the licence track; it selects the library, and the library is everything. Then five questions, one per page. The same answers always produce the same plan, with the reasoning shown.')}
  ${planner()}
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
  const cell = (r, i) => (i === 1 ? r.replace(/OAR [0-9-]+/g, (m) => cite(m)) : esc(r));
  return section(LIBRARY, `${eyebrow('The library is the product')}${h2('library', s.heading, s.sub)}
    <table class="lib"><thead><tr>${s.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${s.rows.map((row) => `<tr><th scope="row" data-col="${esc(s.cols[0])}">${esc(row[0])}</th>${row.slice(1).map((c, i) => `<td data-col="${esc(s.cols[i + 1])}" class="${i === 0 ? 'is-auth' : ''}">${i === 0 ? `<code>${esc(c)}</code>` : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
    <p class="closing">${esc(s.closing)}</p>
    <div class="tags"><span class="strip-l">Every item prints its evidence tag</span>
      <div class="tag-g"><div>${ev('verified')}<span>Someone inspected on this track read the primary source.</span></div><div>${ev('derived')}<span>Inferred from the rule chapter; prints that way, visibly, until confirmed.</span></div><div>${ev('open')}<span>No authority yet — marked as such, never hidden.</span></div></div>
    </div>
    ${citesBlock()}
    <div class="struck"><span class="strip-l">${esc(s.struck.heading)}</span><p>${s.struck.words.map((w, i) => `<s class="strike" style="--d:${i * 260}ms">${esc(w)}</s>`).join('')}</p><span class="cap">${esc(s.struck.foot)}</span></div>
    <p class="cap">The four libraries, what is written and what is not, and the six things this product will never do: <a href="/library">The library</a>.</p>`);
}

const editor = () => section(EDITOR, `${eyebrow('Edit, guarded')}${h2('editor', 'Add, remove or reorder a tab. Three guardrails answer in plain words.', 'Coverage, scope and access, cohesion. A refusal names the rule that caused it and offers an alternative — a refusal that cannot explain itself is a bug.')}
  <div class="shell" data-scrollx><div class="shell-in">${webShell('binderkit', { key: 'editor' })}</div></div>
  <p class="shell-hint" data-shell-hint>${ic('left', 16)}<span>Shown at true size — drag sideways</span>${ic('right', 16)}</p>
  <p class="cap">The web is Binderkit’s primary surface, because a provider building binders is at a table with a printer.</p>
  <div class="guards">${GUARDS.map(([t, d]) => `<div class="guard"><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div>
  <p class="refusal">“${esc(S.screens.find((x) => x.key === 'editor').refusal)}”</p>`);

function versions() {
  const v = S.screens.find((s) => s.key === 'versions').diff;
  return section(VERSIONS, `${eyebrow('Versions and control numbers')}${h2('versions', 'Every version kept. Every page reproducible.', 'An answer changes, the plan regenerates, the diff is shown, and the version becomes n+1. Notes carry by item ID. Any past control number prints the identical page.')}
    <div class="vtog" role="group" aria-label="Which version to show"><button class="tog" type="button" data-v="1" aria-pressed="false">v1 · RB-0417</button><button class="tog" type="button" data-v="2" aria-pressed="true">v2 · RB-0418</button></div>
    <p class="replan" data-v-banner>A re-plan was offered and accepted: answer 1 changed. One tab added, one moved, nothing removed. v1 is kept, and its control number still prints the identical page.</p>
    <table class="lib ver" data-vtable data-v="2"><thead><tr><th scope="col">Version or item</th><th scope="col">Change</th><th scope="col">Why</th><th scope="col">Evidence</th><th scope="col">Date</th></tr></thead>
      <tbody>${v.map(([t, what, why, tag, when]) => `<tr data-change="${esc(what)}"><th scope="row" data-col="Version or item">${esc(t)}</th><td data-col="Change" class="chg">${esc(what)}</td><td data-col="Why">${/^OAR/.test(why) ? cite(why) : esc(why)}</td><td data-col="Evidence">${ev(tag)}</td><td data-col="Date"><code>${esc(when || '—')}</code></td></tr>`).join('')}</tbody></table>
    <div class="rules"><span class="strip-l">The rules that make a printed page trustworthy</span>
      <ol>${RULES.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
    </div>`);
}

const TICK = '<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l5 5 9-10" fill="none" stroke-width="2" stroke-linecap="square"/></svg>';
const nothing = () => section(NOTHING, `${eyebrow('The defining constraint')}${h2('nothing', 'It holds nothing about anyone.', 'Six rules hold that in place, and each one is load-bearing. It is why the signup has five steps instead of six, and why there is no business associate agreement to sign.')}
  <ol class="six" data-ledger>${HOLDS_NOTHING.map(([t, d]) => `<li>${TICK}<div><b>${esc(t)}</b> <span>${esc(d)}</span></div></li>`).join('')}</ol>
  <p class="boundary">Binderkit plans and prints your binders. It does not store documents, track what is filed, record reviews, or certify readiness.</p>`);

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
  const soon = (price) => (/^Open/.test(price) ? 'Early access' : price);
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

function join(cfg, p) {
  const s = find('start');
  return section(JOINS, `<div class="join-g">
    <div>${eyebrow(JOIN.eyebrow)}<h2 id="h-join">${esc(JOIN.heading)}</h2><p class="sub">${esc(JOIN.sub)}</p>
      <div class="ten"><span class="strip-l">${esc(s.heading)}</span><ol>${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="cap">${esc(s.sub)}</p></div></div>
    <div class="join-f">${waitlist(cfg, p, { housesLabel: 'How many facilities?' })}<p class="fine">${esc(JOIN.fine)}</p></div>
  </div>`);
}

export function render(cfg, p) {
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'home' })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light" data-printing="sheet">
${hero(cfg, p)}
${plan()}
${page()}
${library()}
${editor()}
${versions()}
${nothing()}
${roles()}
${questions(cfg)}
${pricing(cfg, p)}
${join(cfg, p)}
</main>
${footer(cfg, p, { page: 'home', fine: find('foot').disclaimer })}`;
}
