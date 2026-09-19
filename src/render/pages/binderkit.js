// binderkit.com — the page.
//
// A document, not a website: white paper, one serif, mono citations, a margin
// column that numbers every section the way a control number numbers every
// print. No cards, no gradients, no device chrome — the product prints, and
// the page reads like the thing it prints.

import { esc, nav, foot, waitlist, faq, tiers, sec, h2, eyebrow, ICON } from '../shared.js';
import { webShell, SURFACES } from '../instruments.js';
import { PAGES, SIGNUP_FIVE, BILLING_STATES, EVERY_PLAN, JOIN } from '../../data/page.js';

const spec = PAGES.binderkit;
const find = (k) => spec.sections.find((s) => s.key === k);
let n = 0;
const ctl = () => `BK-LP-${String(++n).padStart(2, '0')}`;

/* the printed sheet, drawn from the same surface the callouts quote */
function sheet(opts = {}) {
  const s = SURFACES.binderkit;
  return `<div class="paper-sheet ${opts.cls || ''}">
    <div class="ps-title">${esc(s.paperTitle)}</div>
    <div class="ps-head"><span>Facility ______</span><span>Resident ______</span></div>
    ${s.rows.map(([no, item, auth, ev]) => `<div class="ps-row"><span class="ps-n">${esc(no)}</span><span class="ps-i">${esc(item)}</span><span class="ps-a">${esc(auth)}<i class="ev is-${esc(ev)}">${esc(ev)}</i></span></div>`).join('')}
    <div class="ps-foot"><span>${esc(s.control)}</span><span>by Providerhub Oregon</span></div>
  </div>`;
}

const QUESTIONS = SURFACES.binderkit.screens.find((s) => s.key === 'intake').questions;
const REASONS = [
  ['Resident binder', 'Because the licence is AFH-DD, and every AFH-DD home keeps one per resident.', 'OAR 411-360-0170'],
  ['Staff binder', 'Because you answered that the facility has staff other than the provider.', 'OAR 411-360-0180'],
  ['Facility binder', 'Because every licence keeps the licence, the inspection letters and the house records somewhere.', 'OAR 411-360-0130'],
  ['Emergency binder', 'Because emergency information is posted, not filed — so it prints as a gathered list at the end.', 'OAR 411-360-0150'],
  ['Policy binder', 'Because you answered that the provider keeps the policy binder.', 'OAR 411-360-0130'],
];
const ARTEFACTS = [
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

const ROWS = (cls, inner, label) => `<section class="sec ${cls}" id="${esc(cls)}" ${label ? `aria-label="${esc(label)}"` : `aria-labelledby="h-${esc(cls)}"`} data-reveal><div class="wrap doc"><span class="ctl">${ctl()}</span><div class="doc-b">${inner}</div></div></section>`;

function hero(cfg, p) {
  return `<section class="hero" id="top" aria-labelledby="h1">
    <div class="wrap doc">
      <span class="ctl">${ctl()}</span>
      <div class="doc-b hero-in">
        <div class="hero-t">
          ${eyebrow('Binder setup for Oregon care homes · no resident data, ever')}
          <h1 id="h1">${esc(p.headline.text)}</h1>
          <p class="lede">${esc(p.lede)}</p>
          <div class="ctas">
            <a class="btn pri lg" href="#join" data-cta="hero">${esc(cfg.cta.primary)}</a>
            <a class="btn lg" href="#page">${esc(cfg.cta.secondary)}</a>
          </div>
          <p class="fine">It prints on day one, on the black-and-white printer you already own.</p>
        </div>
        <div class="hero-v"><div class="desk"><div class="divs" aria-hidden="true"><i></i><i></i><i></i></div>${sheet({ cls: 'is-hero' })}</div></div>
      </div>
    </div>
  </section>`;
}

const questions5 = () => ROWS('plan', `${eyebrow('Question zero, then five')}${h2('plan', 'Five answers in. Five binders out.', 'Question zero is the licence track; it selects the library, and the library is everything. Then five questions, one per page. The same answers always produce the same plan, with the reasoning shown.')}
  <ol class="qs">${QUESTIONS.map(([no, q, a]) => `<li><span class="q-n">${no === '0' ? 'Q0' : `Q${no}`}</span><h3>${esc(q)}</h3><span class="q-a">${esc(a)}</span></li>`).join('')}</ol>
  <div class="reasons"><span class="strip-l">The plan, with its reasoning</span>
    ${REASONS.map(([b, why, auth]) => `<div class="reason"><b>${esc(b)}</b><span>${esc(why)}</span><em>${esc(auth)}</em></div>`).join('')}
  </div>`);

function page() {
  const s = find('screen');
  const on = (fn) => (typeof fn === 'function' ? fn(SURFACES.binderkit) : fn);
  return ROWS('page', `${eyebrow('The signature output')}${h2('page', s.heading, s.sub)}
    <div class="page-g">
      <div class="page-v">${sheet()}</div>
      <ol class="annot">${s.callouts.map(([t, d]) => `<li><b>${esc(on(t))}</b><span>${esc(d)}</span></li>`).join('')}</ol>
    </div>
    <div class="arts"><span class="strip-l">Four things print</span>
      <div class="art-g">${ARTEFACTS.map(([t, d], i) => `<div class="art"><span class="art-n">${i + 1}</span><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div>
    </div>`);
}

function library() {
  const s = find('depth');
  return ROWS('library', `${eyebrow('The library is the product')}${h2('library', s.heading, s.sub)}
    <table class="lib"><thead><tr>${s.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${s.rows.map(([t, a, c]) => `<tr><th scope="row" data-col="${esc(s.cols[0])}">${esc(t)}</th><td data-col="${esc(s.cols[1])}"><code>${esc(a)}</code></td><td data-col="${esc(s.cols[2])}">${esc(c)}</td></tr>`).join('')}</tbody></table>
    <div class="tags"><span class="strip-l">Every item prints its evidence tag</span>
      <div class="tag-g"><div><i class="ev is-verified">verified</i><span>Someone inspected on this track read the primary source.</span></div><div><i class="ev is-derived">derived</i><span>Inferred from the rule chapter; prints that way, visibly, until confirmed.</span></div><div><i class="ev is-open">open</i><span>No authority yet — marked as such, never hidden.</span></div></div>
    </div>
    <div class="struck"><span class="strip-l">${esc(s.struck.heading)}</span><p>${s.struck.words.map((w) => `<s>${esc(w)}</s>`).join('')}</p><span class="cap">${esc(s.struck.foot)}</span></div>`);
}

const editor = () => ROWS('editor', `${eyebrow('Edit, guarded')}${h2('editor', 'Add, remove or reorder a tab. Three guardrails answer in plain words.', 'Coverage, scope and access, cohesion. A refusal names the rule that caused it and offers an alternative — a refusal that cannot explain itself is a bug.')}
  <div class="shell">${webShell('binderkit', { key: 'editor' })}</div>
  <p class="cap">Shown at true size; drag sideways on a phone. The web is Binderkit’s primary surface, because a provider building binders is at a table with a printer.</p>
  <div class="guards">${[['Coverage', 'Every item the library requires stays in some tab.'], ['Scope and access', 'Nothing that would hold a fact about a person can be added.'], ['Cohesion', 'A tab holds one subject; an item cannot be filed where it does not belong.']].map(([t, d]) => `<div class="guard"><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div>
  <p class="refusal">“This item is required by 411-360-0170; it can move but not go.”</p>`);

function versions() {
  const v = SURFACES.binderkit.screens.find((s) => s.key === 'versions').diff;
  return ROWS('versions', `${eyebrow('Versions and control numbers')}${h2('versions', 'Every version kept. Every page reproducible.', 'An answer changes, the plan regenerates, the diff is shown, and the version becomes n+1. Notes carry by item ID. Any past control number prints the identical page.')}
    <table class="lib ver"><thead><tr><th scope="col">Version or item</th><th scope="col">Change</th><th scope="col">Why</th><th scope="col">Evidence</th><th scope="col">Date</th></tr></thead>
      <tbody>${v.map(([t, what, why, ev, when]) => `<tr><th scope="row" data-col="Version or item">${esc(t)}</th><td data-col="Change">${esc(what)}</td><td data-col="Why">${esc(why)}</td><td data-col="Evidence"><i class="ev is-${esc(ev)}">${esc(ev)}</i></td><td data-col="Date"><code>${esc(when || '—')}</code></td></tr>`).join('')}</tbody></table>
    <div class="rules"><span class="strip-l">The rules that make a printed page trustworthy</span>
      <ol>${['A published library version is never changed; corrections are new versions.', 'Item identifiers are permanent, because notes and edits attach to them.', 'Notes survive everything — library change, track change, reset, re-plan.', 'A print that fails consumes no control number.', 'Nothing changes without acceptance: an update is an offer and a diff, never an applied change.'].map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
    </div>`);
}

const nothing = () => ROWS('nothing', `${eyebrow('The defining constraint')}${h2('nothing', 'It holds nothing about anyone.', 'Six rules hold that in place, and each one is load-bearing. It is why the signup has five steps instead of six, and why there is no business associate agreement to sign.')}
  <ol class="six">${HOLDS_NOTHING.map(([t, d]) => `<li><b>${esc(t)}</b> <span>${esc(d)}</span></li>`).join('')}</ol>
  <p class="boundary">Binderkit plans and prints your binders. It does not store documents, track what is filed, record reviews, or certify readiness.</p>`);

function roles() {
  const s = find('roles');
  return ROWS('roles', `${h2('roles', s.heading, s.sub)}
    <table class="lib"><thead><tr>${s.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${s.rows.map(([r, who, does, dev]) => `<tr><th scope="row" data-col="${esc(s.cols[0])}"><code>${esc(r)}</code></th><td data-col="${esc(s.cols[1])}">${esc(who)}</td><td data-col="${esc(s.cols[2])}">${esc(does)}</td><td data-col="${esc(s.cols[3])}">${esc(dev)}</td></tr>`).join('')}</tbody></table>
    <dl class="perms">${s.perms.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
    <p class="closing">${esc(s.closing)}</p>`);
}

const questions = () => ROWS('questions', `${h2('questions', 'The questions we get.')}${faq(find('objections').rows)}`);

function pricing(cfg, p) {
  const s = find('pricing');
  return ROWS('pricing', `${h2('pricing', s.heading, EVERY_PLAN)}${tiers(p, 1)}<p class="fine">${esc(s.note)}</p>
    <div class="subs">
      <div class="note"><h3>${esc(SIGNUP_FIVE.heading)}</h3><ol class="arrow">${SIGNUP_FIVE.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="cap">${esc(SIGNUP_FIVE.tail)}</p></div>
      <div class="note"><h3>${esc(BILLING_STATES.heading)}</h3><dl class="defs">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
    </div>`);
}

function join(cfg, p) {
  const s = find('start');
  return ROWS('join', `<div class="join-g">
    <div>${eyebrow(JOIN.eyebrow)}<h2 id="h-join">${esc(JOIN.heading)}</h2><p class="sub">${esc(JOIN.sub)}</p>
      <div class="ten"><span class="strip-l">${esc(s.heading)}</span><ol>${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div></div>
    <div class="join-f">${waitlist(cfg, p, { housesLabel: 'How many facilities?' })}<p class="fine">${esc(JOIN.fine)}</p></div>
  </div>`);
}

export function render(cfg, p) {
  n = 0;
  return `${nav(cfg, p)}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light">
${hero(cfg, p)}
${questions5()}
${page()}
${library()}
${editor()}
${versions()}
${nothing()}
${roles()}
${questions()}
${pricing(cfg, p)}
${join(cfg, p)}
</main>
${foot(cfg, p, { fine: find('foot').disclaimer })}`;
}
