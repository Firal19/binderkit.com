// binderkit.com — the binder's furniture, shared by every chapter.
//
// The index tabs, the top rule with its running control number, the
// contents page that is the footer, the sheet that the planner fills, and the
// planner itself. Everything here is the site's — nothing is the product's
// except the rows it quotes from the instruments.

import { esc, mark, social, byline, hello, mailto, nextFloat, priceParts, footShell } from '../../shared.js';
import { SURFACES } from '../../instruments.js';
import { PAGES } from '../../../data/page.js';
import { ic, lampIcon } from '../../icons/binderkit.js';

export { esc, ic };
export const spec = PAGES.binderkit;
export const find = (k) => spec.sections.find((s) => s.key === k);
const S = SURFACES.binderkit;
const intake = S.screens.find((s) => s.key === 'intake');

/* ── the book: chapters, and the sections of the front page ───────────── */
export const CHAPTERS = [
  { path: '/', title: 'Binderkit', sub: 'The front page', ctl: 'BK-LP' },
  { path: '/screens', title: 'The screens', sub: 'Five screens, at the size they ship', ctl: 'BK-SC' },
  { path: '/plan', title: 'The plan', sub: 'Five answers in, five binders out', ctl: 'BK-PL' },
  { path: '/library', title: 'The library', sub: 'Four tracks, four libraries', ctl: 'BK-LB' },
  { path: '/pricing', title: 'Pricing', sub: '$29 a facility a month, or $149 once', ctl: 'BK-PR' },
  { path: '/about', title: 'About', sub: 'Who makes Binderkit', ctl: 'BK-AB' },
  { path: '/contact', title: 'Contact', sub: 'Write to a person', ctl: 'BK-CT' },
  { path: '/privacy', title: 'Privacy', sub: 'What it holds, and what leaves it', ctl: 'BK-PV' },
];

/** A numbered section list for a chapter: [{id,label,tab}] → with control numbers. */
export const number = (prefix, list) => list.map((s, i) => ({ ...s, ctl: `${prefix}-${String(i + 1).padStart(2, '0')}` }));

export const HOME = number('BK-LP', [
  { id: 'top', label: 'The title page', tab: '' },
  { id: 'why', label: 'Why Binderkit', tab: 'Why', foldName: 'Why Binderkit', gist: 'Nothing about anyone, and the same answers always make the same plan.' },
  { id: 'screens', label: 'The screens', tab: 'Screens', foldName: 'The screens', gist: 'Answers in, binder out, switched by index tab.' },
  { id: 'plan', label: 'The plan', tab: 'Plan', gist: 'Your licence track picks the library. Then five questions.' },
  { id: 'page', label: 'The page', tab: 'Page' },
  { id: 'library', label: 'The library', tab: 'Library', gist: 'Four tracks, four libraries, the rule beside every item.' },
  { id: 'editor', label: 'The editor', tab: 'Editor', gist: 'A refusal names the rule and offers something to do instead.' },
  { id: 'versions', label: 'Versions', tab: 'Versions', gist: 'An answer changes, the plan regenerates, the diff is shown.' },
  { id: 'plates', label: 'The screens, listed', tab: 'Plates', foldName: 'Five screens', gist: 'Five screens, each with an address of its own.' },
  { id: 'nothing', label: 'Nothing about anyone', tab: 'Nothing', gist: 'Four rules that keep every fact about a person out.' },
  { id: 'roles', label: 'Roles', tab: 'Roles', gist: 'Who plans, who prints, and what each may see.' },
  { id: 'questions', label: 'Questions', tab: 'FAQ', gist: 'The five we are asked most, and how to reach us.' },
  { id: 'pricing', label: 'Pricing', tab: 'Pricing', gist: '$29 a facility a month, or $149 once.' },
  { id: 'join', label: 'Join', tab: 'Join' },
]);

/* ── THE BOOK, in one place ───────────────────────────────────────────
   Every chapter's sections, numbered. It was one array per chapter file,
   which was fine while nothing needed to see across chapters; the palette,
   the chapter pager and the site-wide section index all do. One source, so
   a section cannot exist in the header and be missing from the palette.

   A chapter's first entry is its title page, and its label is the h1's own
   wording, minus the full stop: the phone foot bar prints that label as the
   page name, and a bar that says "a shelf of binders" under a heading that
   says "five binders" is two claims. js/pages/binderkit.js fitName() cuts
   it at a word boundary where the bar is narrower than the words. */
export const BOOK = {
  '/': HOME,
  '/screens': number('BK-SC', [
    { id: 'top', label: 'Five screens, at the size they ship', tab: '' },
    { id: 'five-plates', hid: 'plates', label: 'Five screens', tab: 'Screens' },
    { id: 'annotated', label: 'The guarded editor, at desk size', tab: 'Desk size', foldName: 'At desk size', gist: 'The same refusals, on the screen a provider plans at.' },
  ]),
  '/plan': number('BK-PL', [
    { id: 'top', label: 'Five answers in. Five binders out', tab: '' },
    { id: 'answers', label: 'The answers, and the plan', tab: 'Answers' },
    { id: 'steps', label: 'From question zero to reset', tab: 'Steps', foldName: 'The steps', gist: 'What each step decides, and what it costs to change your mind.' },
    { id: 'guardrails', label: 'The three guardrails', tab: 'Guardrails', gist: 'Coverage, scope and access, cohesion.' },
    { id: 'artefacts', label: 'What prints', tab: 'Prints', gist: 'The contents page, the dividers, the brief and the procedure.' },
  ]),
  '/library': number('BK-LB', [
    { id: 'top', label: 'Your licence track selects the library', tab: '' },
    { id: 'libraries', label: 'Four tracks, four libraries', tab: 'Libraries' },
    { id: 'evidence', label: 'The rules, in plain words', tab: 'Rules', foldName: 'The rules', gist: 'Every citation on your plan, and how sure we are of it.' },
    { id: 'words', label: 'Three words', tab: 'Words' },
  ]),
  '/pricing': number('BK-PR', [
    { id: 'top', label: 'Priced per facility', tab: '' },
    { id: 'tiers', label: 'The tiers', tab: 'Tiers' },
    { id: 'signup', label: 'Signing up', tab: 'Signing up' },
    { id: 'billing', label: 'If a payment fails', tab: 'Payment' },
    { id: 'lapse', label: 'If you stop paying', tab: 'Lapse' },
  ]),
  '/about': number('BK-AB', [
    { id: 'top', label: 'Binder setup for Oregon care homes', tab: '' },
    { id: 'first', label: 'Nothing about anyone', tab: 'Nothing' },
    { id: 'maker', label: 'Who makes it', tab: 'Maker' },
  ]),
  '/contact': number('BK-CT', [
    { id: 'top', label: 'Write to a person', tab: '' },
    { id: 'write', label: 'The message', tab: 'Write' },
    { id: 'elsewhere', label: 'Elsewhere', tab: 'Elsewhere' },
  ]),
};

/* ── where we are, for the addresses this chapter prints ──────────────
   A control number IS an address in a binder, so on this site it is also
   the address of the section: every one is a button that copies the deep
   link. Building that link needs the chapter's own path, and `section()`
   is called from six modules that each render one chapter at a time —
   build.mjs walks `pages` sequentially and awaits nothing between them, so
   one module-level cursor is enough and is cheaper than threading a path
   through every call. `chapter('/plan')` is the first line of a render. */
const ORIGIN = 'https://binderkit.com';
let CUR = '/';
export const atChapter = (path) => { CUR = path || '/'; return ''; };
export const addr = (id) => `${ORIGIN}${CUR === '/' ? '/' : CUR}#${id}`;

/* ── small pieces ─────────────────────────────────────────────────────── */
export const eyebrow = (t) => `<span class="eyebrow">${esc(t)}</span>`;
export const h2 = (id, text, sub = '') => `<h2 id="h-${esc(id)}">${esc(text)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}`;
export const ev = (tag) => (tag ? `<i class="ev is-${esc(tag)}">${esc(tag)}</i>` : '');
export const place = (t) => (t ? `<i class="place">${esc(t)}</i>` : '');

/* ── the three words on every item, and no fourth ─────────────────────
   verified, derived, open. The sheet's legend, the library chapter's
   evidence section and the front page's own legend all read from this one
   list, so the vocabulary cannot drift: the front page used to print four
   words (unverified, superseded) that no other page and no toggle knew.
   "posted" on the sheet is a placement mark, not an evidence grade. */
export const WORDS = [
  ['verified', 'A provider inspected on this track read the rule itself.'],
  ['derived', 'Taken from the rule chapter. It prints that way until confirmed.'],
  ['open', 'No rule yet. Marked as such, never hidden.'],
];
export const wordsList = () => `<div class="tag-g words">${WORDS.map(([k, what]) => `<div data-word="${esc(k)}">${ev(k)}<span>${esc(what)}</span></div>`).join('')}</div>`;

/** A section of the document: the control number in the margin, the body beside it. */
export function section(s, inner, opts = {}) {
  /* `hid` when the section's own id is not the heading's: /screens carries
     a film strip that instruments.js emits as <div id="plates">, so the
     section around it is #five-plates while its <h2> is still h-plates.
     Two elements with one id is invalid HTML and the five href="#plates"
     links on that page resolved to whichever came first. */
  const label = opts.label ? `aria-label="${esc(opts.label)}"` : `aria-labelledby="h-${esc(s.hid || s.id)}"`;
  /* Below 640 a chapter opens as its own contents page: a section with a
     gist becomes one tappable line carrying its heading and its gist, and
     site.js folds() does the rest. Nothing is deleted, so print,
     find-in-page and the crawler still see the whole document.

     A gist is not free — it costs the reader a tap — so a chapter only
     earns one where folding actually shortens the chapter. Measured at
     390 in WebKit against the same page with every fold opened,
     /pricing was +0.4%, /about +0.2% and /contact +2.7%: three routes
     paying a tap for nothing, and on /pricing the three folded sections
     were the signup, billing and lapse answers, which is the content a
     chapter called "Priced in the open" exists to show. Six gists came
     off — maker, elsewhere, words, signup, billing, lapse — and with
     them /about and /contact stop folding at all, which is right for a
     three-section chapter: an index of one line is not an index.

     The home page keeps its thirteen (+34.1% with every fold opened),
     /plan its three (-10.2%) and /library its three (-5.4%), because
     there the fold discloses a page that is genuinely long. */
  const gist = opts.gist || s.gist;
  /* A fold summary is an INDEX row, and an index row carries a name, not a
     claim. site.js folds() builds it from the section's own <h2>, which on
     this site is the argument the section makes — "Add, remove or reorder a
     tab. Three guardrails answer in plain words." — three lines of 21px
     serif that have to be READ, seven of them in a row with nothing but a
     hairline between them. data-fold-n carries the short name the contents
     sheet and the footer already print for the same section; the control
     number is already on the element. js/pages/binderkit.js puts the two on
     one line and leaves the claim to the gist beneath. */
  const fold = gist ? ` data-phone="fold" data-gist="${esc(gist)}" data-fold-n="${esc(opts.foldName || s.foldName || s.label)}"` : '';
  return `<section class="sec ${opts.cls || ''}" id="${esc(s.id)}" ${label} data-ctl="${esc(s.ctl)}" data-name="${esc(s.label)}"${fold} data-reveal>
  <div class="wrap doc">${ctlStamp(s)}<div class="doc-b">${inner}</div></div>
</section>`;
}

/** The control number in the margin — and the address of the section.
    js/site.js verbs() already owns [data-copy]; this needs no script of
    its own, and with scripting off it is a button that does nothing
    visible, which is why the number itself is the label rather than a
    verb. */
export const ctlStamp = (s) => `<button class="ctl" type="button" data-copy="${esc(addr(s.id))}" data-copied="Link to this section copied" aria-label="Copy the link to ${esc(s.label)} — control number ${esc(s.ctl)}"><span class="ctl-n">${esc(s.ctl)}</span>${ic('copy', 14, { bare: true, cls: 'ctl-c' })}</button>`;

/* ── the chapter's own contents, at the head of the chapter ───────────
   The binder's answer to "what is on this page": the same numbered list
   with leader dots the footer and the contents sheet print, marked with
   aria-current as you scroll — site.js header() drives any [data-spy]
   whose links point at sections, so this costs no script.
   It is shown from 641 up and hidden below, where the page already has
   three copies of its own navigation: the snapping tab strip under the
   rule, the contents sheet the header opens, and the folded index the
   page itself becomes. A fourth would be the longest of the four. */
export function onThisPage(list, opts = {}) {
  const rows = list.filter((s) => s.tab !== '');
  if (!rows.length) return '';
  return `<nav class="here-w" aria-label="${esc(opts.label || 'What is on this page')}">
    <span class="strip-l">${esc(opts.title || 'On this page')}</span>
    <ol class="toc here" data-spy>${rows.map((s, i) => `<li><a href="#${esc(s.id)}"><span class="toc-no">${i + 1}</span><span class="toc-t">${esc(s.label)}</span><span class="toc-l here-l" aria-hidden="true"></span><span class="toc-n here-n">${esc(s.ctl)}</span></a></li>`).join('')}</ol>
  </nav>`;
}

/* ── leaf back, leaf forward ──────────────────────────────────────────
   Two real links, no script, on every chapter: the binder is a book and a
   book has a page before this one and a page after it. */
export function pager(path) {
  const list = CHAPTERS;
  const i = list.findIndex((c) => c.path === path);
  if (i < 0) return '';
  const prev = list[i - 1];
  const next = list[i + 1];
  const side = (c, kind, rel) => (c
    ? `<a class="pager-a is-${kind}" href="${esc(c.path)}" rel="${rel}"><span class="pager-k">${kind === 'prev' ? 'Leaf back' : 'Leaf forward'}</span><span class="pager-t">${esc(c.title)}</span><span class="pager-n">${esc(c.ctl)}</span></a>`
    : '<span class="pager-a is-none"></span>');
  return `<nav class="pager" aria-label="Previous and next chapter">${side(prev, 'prev', 'prev')}${side(next, 'next', 'next')}</nav>`;
}

/** The title page of a chapter. */
export function title(s, { eyebrow: eb, h1, lede, ctas = '', fine = '', aside = '', index = '' }) {
  return `<section class="hero" id="${esc(s.id)}" aria-labelledby="h1" data-ctl="${esc(s.ctl)}" data-name="${esc(s.label)}">
  <div class="wrap doc">${ctlStamp(s)}
    <div class="doc-b hero-in ${aside ? 'has-aside' : ''}">
      <div class="hero-t">${eb ? eyebrow(eb) : ''}<h1 id="h1">${esc(h1)}</h1>${lede ? `<p class="lede">${esc(lede)}</p>` : ''}${ctas ? `<div class="ctas">${ctas}</div>` : ''}${fine ? `<p class="fine">${esc(fine)}</p>` : ''}</div>
      ${aside ? `<div class="hero-v">${aside}</div>` : ''}
    </div>
    ${index}
  </div>
</section>`;
}

/* ── citations: the rules on this site, in plain words ────────────────
   Grouped by licence track. Each row is the rule number as a chip, the
   rule's own name, and one line saying what it is about in words a new
   provider can read. The popover (js/pages/binderkit.js cites()) reads the
   same rows, so a citation anywhere on the page explains itself. */
export const TRACK_NAMES = {
  'AFH-DD': 'Adult foster homes · developmental disabilities · OAR chapter 411, division 360',
  'Agency': 'Agencies and group homes · OAR chapter 411, division 325',
};
export const CITES = [
  ['OAR 411-360-0130', 'Standards', 'What every home keeps in order: the licence, the house rules, the records a surveyor asks for first.', 'AFH-DD'],
  ['OAR 411-360-0140', 'Health care', 'How each resident’s health needs and medications are written down and kept.', 'AFH-DD'],
  ['OAR 411-360-0150', 'Emergency information', 'What is posted on the wall for an emergency, rather than filed in a binder.', 'AFH-DD'],
  ['OAR 411-360-0170', 'Documentation and records', 'What goes in each resident’s binder. The section a resident binder is built from.', 'AFH-DD'],
  ['OAR 411-360-0180', 'Staff records', 'What goes in each staff file: training, checks and their dates.', 'AFH-DD'],
  ['OAR 411-360-0185', 'Abuse and incident', 'How an incident is reported, to whom, and by when.', 'AFH-DD'],
];
/* The front page no longer prints the rules list — it is /library's own
   section — so a citation there goes to the chapter that has it, and on
   any other chapter it jumps to the list on the same page. The popover
   (js/pages/binderkit.js cites()) reads its rows from #bk-cites, which
   every chapter carries in its dialogs, so it explains a citation wherever
   the link points. */
export const cite = (text) => {
  const known = CITES.find((c) => c[0] === text);
  return known
    ? `<a class="cite" href="${CUR === '/' ? '/library#cites' : '#cites'}" data-cite="${esc(text)}">${esc(text)}</a>`
    : esc(text);
};
export const citesJson = () => `<script type="application/json" id="bk-cites">${JSON.stringify(CITES.map(([c, name, what]) => [c, name, what])).replace(/</g, '\\u003c')}</script>`;
export const citesBlock = (opts = {}) => {
  const groups = [...new Set(CITES.map((c) => c[3]))];
  return `<div class="cites" id="${esc(opts.id || 'cites')}">
  <span class="strip-l">${esc(opts.title || 'The rules on this page, in plain words')}</span>
  ${groups.map((g) => `<div class="cite-g">
    <p class="cite-gt"><b>${esc(g)}</b><span>${esc(TRACK_NAMES[g] || '')}</span></p>
    <dl class="cite-l">${CITES.filter((c) => c[3] === g).map(([c, name, what]) => `<div class="cite-r" data-cite-row="${esc(c)}"><dt><code>${esc(c.replace(/^OAR /, ''))}</code><b>${esc(name)}</b></dt><dd>${esc(what)}</dd></div>`).join('')}</dl>
  </div>`).join('')}
  <p class="cite-f">${esc(opts.foot || 'Every item on your plan carries one of these beside it, with a tag saying how sure we are: verified, derived or open.')}</p>
</div>`;
};

/* ── how it is sold: a subscription, or once ───────────────────────────
   Shared by the front page and the pricing chapter. js/pages/binderkit.js
   sell() swaps the note and the Pro price together. */
export const sellSwitch = () => `<div class="ptog" role="group" aria-label="How it is sold"><button class="tog" type="button" data-sell="sub" aria-pressed="true">Subscription</button><button class="tog" type="button" data-sell="once" aria-pressed="false">Buy once</button></div>
  <p class="sell-note" data-sell-note data-sub="Per facility, renewing monthly. Three-day trial, cancel in one tap." data-once="Per facility, once. For a binder you revise twice a year.">Per facility, renewing monthly. Three-day trial, cancel in one tap.</p>`;

/** The three tiers, with the Pro price switching between the two ways it is sold. */
export const tierGrid = (p) => `<div class="tiers">${p.pricing.rows.map(([name, price, d], i) => {
  const main = i === 1;
  const desc = main ? d.replace(/\s*Or \$\d+ once\.?$/, '') : d;
  const priceHtml = main && p.pricing.once
    ? `<span data-sell-p="sub">${priceParts(price)}</span><span data-sell-p="once" hidden>${esc(p.pricing.once)}<small> once</small></span>`
    : priceParts(price);
  return `<div class="tier ${main ? 'is-main' : ''}">${main ? '<span class="tier-flag">Most facilities</span>' : ''}<span class="tier-n">${esc(name)}</span><span class="tier-p">${priceHtml}</span><span class="tier-d">${esc(desc)}</span></div>`;
}).join('')}</div>`;

/* ── the four libraries, as one table ──────────────────────────────────
   Shared by the front page and /library. A library is defined by the rule
   it is read from, so a row whose inventory the data leaves open is
   described by that rule rather than by a date: the page says what the
   product is, not what is being built. */
const LIB_WHAT = {
  'AFH-APD': 'Facility records and resident records, with the rule beside each.',
  'AFH-OHA': 'The records the rule names, with the rule beside each.',
};
export const libTable = (s) => `<table class="lib"><thead><tr>${s.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${s.rows.map(([lib, auth, what]) => `<tr><th scope="row" data-col="${esc(s.cols[0])}">${esc(lib)}</th><td data-col="${esc(s.cols[1])}" class="is-auth"><code>${esc(auth)}</code></td><td data-col="${esc(s.cols[2])}">${esc(/^coming next/i.test(what) && LIB_WHAT[lib] ? LIB_WHAT[lib] : what)}</td></tr>`).join('')}</tbody></table>`;

/* ── the planner: the data, then the rule ─────────────────────────────── */
const TRACKS = [
  { id: 'AFH-DD', auth: 'OAR 411-360', ok: true },
  { id: 'AFH-APD', auth: 'OAR 411-050', notice: 'This page plans on the AFH-DD library. The AFH-APD library is read from OAR 411-050: facility records and resident records.' },
  { id: 'AFH-OHA', auth: 'OAR 309-040', notice: 'This page plans on the AFH-DD library. The AFH-OHA library is read from OAR 309-040.' },
  { id: 'Agency', auth: 'OAR 411-325', notice: 'The agency library follows OAR 411-325 and 411-323: one hundred and twenty-six items across the five binders. This page plans on the AFH-DD library.' },
];
const SKIP = ['skip', 'Skip'];
const YN = [['yes', 'Yes'], ['no', 'No'], SKIP];
export const QUESTIONS = [
  { id: 'q1', no: '1', text: intake.questions[1][1], options: YN, why: 'It decides whether a staff binder is in the plan.' },
  { id: 'q2', no: '2', text: intake.questions[2][1], options: YN, why: 'If not, someone other than the provider does the shifts.' },
  { id: 'q3', no: '3', text: intake.questions[3][1], options: [['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four'], ['5', 'Five'], SKIP], why: 'One resident binder per resident.' },
  { id: 'q4', no: '4', text: intake.questions[4][1], options: YN, why: 'It adds a tab to the resident binder.' },
  { id: 'q5', no: '5', text: intake.questions[5][1], options: [['provider', 'The provider'], ['agency', 'The agency'], SKIP], why: 'It decides whether a policy binder is in the plan.', agency: { text: 'How many homes do you operate?', options: [['1', 'One'], ['2', 'Two or three'], ['4', 'Four to nine'], ['10', 'Ten or more'], SKIP], why: 'Each library brings its own questions; on the agency track the fifth is this one.' } },
];
export const DEMO = { track: 'AFH-DD', q1: 'yes', q2: 'yes', q3: '5', q4: 'no', q5: 'provider' };
const SKIPPED = 'a skipped question resolves the most inclusive way';
export const PLAN_DATA = {
  demo: DEMO,
  tracks: TRACKS,
  questions: QUESTIONS,
  rows: S.rows,
  extra: ['Tab 6', 'Service plan and goals', 'OAR 411-360-0130', 'derived', ''],
  binders: {
    resident: { name: 'Resident binder', tabs: 5, auth: 'OAR 411-360-0170', code: 'RB', why: 'Because the licence is AFH-DD, and every AFH-DD home keeps one per resident.', whyExtra: 'A sixth tab, Service plan and goals, because a resident is on one-to-one support.' },
    staff: { name: 'Staff binder', tabs: 4, auth: 'OAR 411-360-0180', code: 'SB', why: 'Because you answered that the facility has staff other than the provider.', whyLive: 'Because the provider does not live in the home, so someone other than the provider does the shifts.', whySkip: `Because question 1 was skipped, and ${SKIPPED}.`, left: 'Not in this plan, because you answered that there is no staff other than the provider.' },
    facility: { name: 'Facility binder', tabs: 6, auth: 'OAR 411-360-0130', code: 'FB', why: 'Because every licence keeps the licence, the inspection letters and the house records somewhere.' },
    emergency: { name: 'Emergency binder', tabs: 0, posted: true, auth: 'OAR 411-360-0150', code: 'EB', why: 'Because emergency information is posted, not filed — so it prints as a gathered list at the end.' },
    policy: { name: 'Policy binder', tabs: 3, auth: 'OAR 411-360-0130', code: 'PB', why: 'Because you answered that the provider keeps the policy binder.', whySkip: `Because question 5 was skipped, and ${SKIPPED}.`, left: 'Not in this plan, because you answered that the agency keeps it.' },
  },
  versions: { v1: { control: S.control, printed: S.printed }, v2: { control: 'v2 · control no. RB-0418', printed: 'Not yet printed' } },
  title: S.paperTitle,
};

/* The rule. The same function, character for character, runs in the browser
   (js/pages/binderkit.js) — if you change one, change the other. */
export function computePlan(D, a) {
  const track = D.tracks.find((t) => t.id === a.track) || D.tracks[0];
  const B = D.binders;
  const same = Object.keys(D.demo).every((k) => D.demo[k] === a[k]);
  const out = { track: track.id, ok: Boolean(track.ok), notice: track.notice || '', same, binders: [], left: [], skipped: [], rows: D.rows.slice(), counts: null, version: same ? D.versions.v1 : D.versions.v2 };
  if (!track.ok) return out;
  const skip = (k) => a[k] === 'skip';
  const staffQ1 = a.q1 === 'yes' || skip('q1');
  const staffQ2 = a.q2 === 'no';
  const residents = skip('q3') ? 5 : Math.max(1, Math.min(5, Number(a.q3) || 5));
  const oneToOne = a.q4 === 'yes' || skip('q4');
  const policy = a.q5 === 'provider' || skip('q5');
  const rTabs = B.resident.tabs + (oneToOne ? 1 : 0);
  if (oneToOne) out.rows = out.rows.concat([D.extra]);
  out.binders.push({ key: 'resident', name: B.resident.name, copies: residents, tabs: rTabs, auth: B.resident.auth, code: B.resident.code, why: B.resident.why + (oneToOne ? ` ${B.resident.whyExtra}` : ''), fromSkip: skip('q3') || (oneToOne && skip('q4')) });
  if (staffQ1 || staffQ2) out.binders.push({ key: 'staff', name: B.staff.name, copies: 1, tabs: B.staff.tabs, auth: B.staff.auth, code: B.staff.code, why: a.q1 === 'yes' ? B.staff.why : skip('q1') ? B.staff.whySkip : B.staff.whyLive, fromSkip: !(a.q1 === 'yes') && skip('q1') });
  else out.left.push({ key: 'staff', name: B.staff.name, why: B.staff.left });
  out.binders.push({ key: 'facility', name: B.facility.name, copies: 1, tabs: B.facility.tabs, auth: B.facility.auth, code: B.facility.code, why: B.facility.why, fromSkip: false });
  out.binders.push({ key: 'emergency', name: B.emergency.name, copies: 1, tabs: 0, posted: true, auth: B.emergency.auth, code: B.emergency.code, why: B.emergency.why, fromSkip: false });
  if (policy) out.binders.push({ key: 'policy', name: B.policy.name, copies: 1, tabs: B.policy.tabs, auth: B.policy.auth, code: B.policy.code, why: a.q5 === 'provider' ? B.policy.why : B.policy.whySkip, fromSkip: skip('q5') });
  else out.left.push({ key: 'policy', name: B.policy.name, why: B.policy.left });
  for (const q of D.questions) if (skip(q.id)) out.skipped.push(`Q${q.no}`);
  const physical = out.binders.filter((b) => !b.posted).reduce((n, b) => n + b.copies, 0);
  const tabs = out.binders.reduce((n, b) => n + b.tabs, 0);
  const dividers = out.binders.reduce((n, b) => n + b.tabs * b.copies, 0);
  out.counts = { kinds: out.binders.length, physical, tabs, dividers };
  return out;
}

export const planText = (plan, a) => {
  const lines = [`Binderkit plan · ${plan.track}`];
  lines.push(`Answers: ${QUESTIONS.map((q) => `Q${q.no} ${labelOf(q, a[q.id], a.track)}`).join(' · ')}`);
  if (!plan.ok) { lines.push(plan.notice); return lines.join('\n'); }
  plan.binders.forEach((b, i) => lines.push(`${i + 1}. ${b.name}${b.copies > 1 ? ` ×${b.copies}` : ''} — ${b.posted ? 'posted' : `${b.tabs} tabs`} — ${b.auth} — ${b.why}`));
  plan.left.forEach((b) => lines.push(`— ${b.name}: ${b.why}`));
  lines.push(`To buy: ${plan.counts.physical} binders, ${plan.counts.dividers} dividers. ${plan.counts.tabs} tabs across ${plan.counts.kinds} binders.`);
  lines.push(plan.version.control);
  return lines.join('\n');
};
const labelOf = (q, v, track) => {
  const opts = track === 'Agency' && q.agency ? q.agency.options : q.options;
  const o = opts.find((x) => x[0] === v);
  return o ? o[1].replace(/ — .*$/, '') : v;
};

/* ── the plan, rendered ───────────────────────────────────────────────── */
export function planOut(plan) {
  if (!plan.ok) return `<div class="po"><div class="po-head"><span class="strip-l">The plan</span><span class="po-v" data-plan-version>${esc(plan.track)}</span></div><p class="po-notice">${esc(plan.notice)}</p></div>`;
  const c = plan.counts;
  return `<div class="po">
  <div class="po-head"><span class="strip-l">The plan, with its reasoning</span><span class="po-v" data-plan-version>${esc(plan.version.control)}</span></div>
  <ol class="po-l">${plan.binders.map((b, i) => `<li class="po-b" data-key="${esc(b.key)}"><span class="po-n">${i + 1}</span><div class="po-m"><b>${esc(b.name)}${b.copies > 1 ? ` <em>× ${b.copies}</em>` : ''}</b><span class="po-why">${esc(b.why)}${b.fromSkip ? ' <i class="po-skip">from a skipped question</i>' : ''}</span></div><span class="po-t">${b.posted ? 'posted' : `${b.tabs} tabs`}</span><span class="po-a">${cite(b.auth)}</span></li>`).join('')}</ol>
  ${plan.left.length ? `<ul class="po-left">${plan.left.map((b) => `<li><s>${esc(b.name)}</s> <span>${esc(b.why)}</span></li>`).join('')}</ul>` : ''}
  <dl class="po-counts"><div><dt>Binders</dt><dd>${c.kinds} kinds · ${c.physical} physical</dd></div><div><dt>Tabs</dt><dd>${c.tabs}</dd></div><div><dt>Dividers to buy</dt><dd>${c.dividers}</dd></div>${plan.skipped.length ? `<div><dt>Skipped</dt><dd>${esc(plan.skipped.join(', '))} — resolved the inclusive way</dd></div>` : ''}</dl>
  <p class="po-banner" data-plan-banner ${plan.same ? 'hidden' : ''}>${plan.same ? '' : 'Re-plan: v1 → v2. In the product this is an offer with a diff, and nothing changes until you accept it.'}</p>
</div>`;
}

/** The planner: the five questions as real controls, the plan beside them. */
export function planner(opts = {}) {
  const a = DEMO;
  const plan = computePlan(PLAN_DATA, a);
  const track = (t) => `<label class="seg-i"><input class="sr-only" type="radio" name="track" value="${esc(t.id)}" ${t.id === a.track ? 'checked' : ''}><span class="seg-t"><b>${esc(t.id)}</b><small>${esc(t.auth)}</small></span></label>`;
  const q = (x) => `<li class="pl-q"><label class="field"><span class="pl-t"><span class="pl-n">Q${esc(x.no)}</span> <span data-q-text="${esc(x.id)}">${esc(x.text)}</span></span><select name="${esc(x.id)}" data-q="${esc(x.id)}">${x.options.map(([v, l]) => `<option value="${esc(v)}" ${v === a[x.id] ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label><span class="pl-why" data-q-why="${esc(x.id)}">${esc(x.why)}</span></li>`;
  return `<div class="planner ${opts.cls || ''}" id="planner-w">
  <form class="pl" id="planner" aria-label="The planner">
    <fieldset class="pl-track"><legend><span class="pl-n">Q0</span> ${esc(intake.questions[0][1])}</legend><div class="seg">${TRACKS.map(track).join('')}</div><span class="pl-why">It selects the library, and the library is everything.</span></fieldset>
    <ol class="pl-qs">${QUESTIONS.map(q).join('')}</ol>
    <div class="pl-acts">
      <button type="button" class="btn sm" data-plan-reset>${ic('reset', 18)}<span>Reset the answers</span></button>
      <button type="button" class="btn sm" data-plan-copy data-copy="${esc(planText(plan, a))}" data-copied="Plan copied as text">${ic('copy', 18)}<span>Copy the plan as text</span></button>
    </div>
    ${opts.fine === false ? '' : '<p class="pl-fine">The same answers always produce the same plan. Change one, then change it back, and you are at v1 again.</p>'}
  </form>
  <div class="pl-out" id="plan-out" aria-live="polite">${planOut(plan)}</div>
  <script type="application/json" id="bk-plan-data">${JSON.stringify(PLAN_DATA).replace(/</g, '\\u003c')}</script>
</div>`;
}

/* ── the sheet: the contents page, live ───────────────────────────────── */
export function sheet(opts = {}) {
  const plan = computePlan(PLAN_DATA, DEMO);
  const row = ([no, item, auth, tag, pl]) => `<li class="cp-r" data-ev="${esc(tag || 'none')}"><span class="cp-n">${esc(no)}</span><span class="cp-i">${esc(item)}</span><span class="cp-a">${cite(auth)}${ev(tag)}${place(pl)}</span></li>`;
  return `<div class="cp ${opts.cls || ''}" data-mock data-sheet ${opts.print ? 'data-print-sheet' : ''} ${opts.label ? `role="img" aria-label="${esc(opts.label)}"` : ''}>
  <div class="cp-t">${esc(S.paperTitle)}</div>
  <div class="cp-h"><span>Facility ______</span><span>Resident ______</span></div>
  <ol class="cp-rows" data-sheet-rows>${plan.rows.map(row).join('')}</ol>
  <p class="cp-count" data-sheet-count hidden></p>
  <div class="cp-f"><span data-sheet-control>${esc(plan.version.control)}</span><span data-sheet-printed>${esc(plan.version.printed)}</span><span>by Provider Hub Oregon</span></div>
  <div class="cp-mark" aria-hidden="true">${mark('binderkit', 18, { label: false, mono: true, tile: '#17201F', glyph: '#fff' })}<span>Binderkit · binderkit.com</span></div>
</div>`;
}

/** The back of the leaf: the tab dividers, in the order the plan gives them. */
export function dividers() {
  return `<div class="divset" aria-hidden="true">${S.rows.map(([no, item], i) => `<div class="divset-t" style="--i:${i}"><span class="divset-n">${esc(no)}</span><span class="divset-l">${esc(item)}</span></div>`).join('')}<p class="divset-cap">Tab dividers · numbered and labelled for common divider stock</p></div>`;
}

/* ── the header: the top rule and the index tabs ──────────────────────── */
export function header(cfg, p, opts = {}) {
  const page = opts.page || 'home';
  const tabs = opts.tabs || (page === 'home' ? HOME.filter((s) => s.tab) : []);
  const chapter = CHAPTERS.find((c) => (page === 'home' ? c.path === '/' : c.path === `/${page}`)) || CHAPTERS[0];
  const ctl0 = opts.ctl || (page === 'home' ? HOME[0].ctl : `${chapter.ctl}-01`);
  const primary = '/#join';
  const tabList = tabs.length
    ? tabs.map((s, i) => `<li><a class="dtab" href="#${esc(s.id)}"><span class="dtab-l">${esc(s.tab || s.label)}</span><span class="dtab-n">${i + 1}</span></a></li>`).join('')
    : CHAPTERS.filter((c) => c.path !== '/privacy').map((c, i) => `<li><a class="dtab" href="${esc(c.path)}" ${c === chapter ? 'aria-current="page"' : ''}><span class="dtab-l">${esc(c.title)}</span><span class="dtab-n">${i + 1}</span></a></li>`).join('');
  const toc = `<div class="toc-sheet" id="contents" hidden>
    <div class="wrap toc-in">
      <div class="toc-head"><span class="toc-h">Contents</span>
        <div class="toc-tools">
          <button class="rb rb-i lamp" type="button" data-mode-toggle aria-pressed="false" aria-label="Turn the lamp on — warm paper for reading" data-theme-light="#FFFFFF" data-theme-dark="#F3EBDA">${lampIcon(20)}</button>
          <button class="rb rb-i" type="button" data-share data-share-title="${esc(p.name)} — ${esc(p.descriptor)}" aria-label="Share this page">${ic('share', 20)}</button>
          <button class="rb rb-i" type="button" data-close aria-label="Close the contents">${ic('close', 20)}</button>
        </div>
      </div>
      <ol class="toc toc-ch">${CHAPTERS.map((c, i) => `<li><a href="${esc(c.path)}" ${c === chapter ? 'aria-current="page"' : ''}><span class="toc-no">${i + 1}</span><span class="toc-t">${esc(c.title)}<small>${esc(c.sub)}</small></span><span class="toc-l" aria-hidden="true"></span><span class="toc-n">${esc(c.ctl)}</span></a></li>`).join('')}</ol>
      ${tabs.length ? `<span class="strip-l">In this chapter</span><ol class="toc toc-in-ch" data-spy>${tabs.map((s, i) => `<li><a href="#${esc(s.id)}"><span class="toc-no">${i + 1}</span><span class="toc-t">${esc(s.label)}</span><span class="toc-l" aria-hidden="true"></span><span class="toc-n">${esc(s.ctl)}</span></a></li>`).join('')}</ol>` : ''}
      <button class="toc-all" type="button" data-open-all data-close hidden>${ic('contents', 18)}<span>Open every section</span></button>
      <a class="btn pri toc-cta" href="${primary}" data-cta="contents">${esc(cfg.cta.primary)}</a>
    </div>
  </div>`;
  return `<header class="rule" id="top-bar">
  <div class="rule-in">
    <a class="bspine" href="/" aria-label="${esc(p.name)} — home">${mark(p.id, 22, { label: false, mono: true, tile: 'var(--ink)', glyph: 'var(--bg)' })}<span class="bspine-n">${esc(p.name)}</span></a>
    <button class="rule-where" type="button" aria-expanded="false" aria-controls="contents" data-lock data-focus="a" aria-label="Contents — you are on ${esc(chapter.title)}"><span class="rule-where-t">${esc(chapter.title)}</span><svg class="rule-where-c" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
    <span class="run"><span class="run-l">Control</span><span class="run-n" id="run-ctl" data-run="${esc(ctl0)}">${esc(ctl0)}</span></span>
    <div class="rule-r">
      <button class="rb rb-t" type="button" aria-expanded="false" aria-controls="contents" data-lock data-focus="a" aria-label="Open the contents — every chapter and section">${ic('contents', 20)}<span>Contents</span></button>
      <button class="rb" type="button" data-print aria-label="Print the contents page">${ic('print', 20)}<span>Print</span></button>
      <button class="rb rb-i" type="button" data-share data-share-title="${esc(p.name)} — ${esc(p.descriptor)}" aria-label="Share this page">${ic('share', 20)}</button>
      <button class="rb rb-i lamp" type="button" data-mode-toggle aria-pressed="false" aria-label="Turn the lamp on — warm paper for reading" data-theme-light="#FFFFFF" data-theme-dark="#F3EBDA">${lampIcon(20)}</button>
      <a class="btn pri sm rule-cta" href="${primary}" data-cta="rule">${esc(cfg.cta.nav)}</a>
    </div>
  </div>
  <nav class="tabs" aria-label="${tabs.length ? 'Sections' : 'Chapters'}" ${tabs.length ? 'data-spy' : ''}>
    <ol class="tabs-l" data-scrollx>${tabList}<li class="tabs-cta"><a class="dtab is-cta" href="${primary}" data-cta="strip">${esc(cfg.cta.nav)}</a></li></ol>
  </nav>
  ${toc}
</header>`;
}

/* ── the footer: the chapters, a colophon, the address, the byline ────────
   The previous/next cards are gone; the next chapter floats at the
   bottom-left as a small pill (shared.js nextFloat) once the reader is well
   into the page. The page's own section list is gone too: the tabs, the
   contents sheet and the phone fold already index it three times. */
export function footer(cfg, p, opts = {}) {
  const page = opts.page || 'home';
  const chapter = CHAPTERS.find((c) => (page === 'home' ? c.path === '/' : c.path === `/${page}`)) || CHAPTERS[0];
  const here = opts.tabs || (page === 'home' ? HOME : []);
  const at = CHAPTERS.indexOf(chapter);
  const after = CHAPTERS[at + 1];
  const next = after && after.path !== '/privacy' ? { href: after.path, label: after.title, gist: after.sub } : (page === 'privacy' || page === '404' ? { href: '/', label: 'The front page' } : null);
  const line = (c, i) => `<li><a href="${esc(c.path)}" ${c === chapter ? 'aria-current="page"' : ''}><span class="toc-no">${i + 1}</span><span class="toc-t">${esc(c.title)}<small>${esc(c.sub)}</small></span><span class="toc-l" aria-hidden="true"></span><span class="toc-n">${esc(c.ctl)}</span></a></li>`;
  /* Round 4: the shared footer shell (Firaol, family-wide: "make it state of
     the art footer"), in the binder's own ink and rule. The chapters are
     the two groups, current one marked; the colophon is the quiet thing it
     keeps — the control number and the day it was printed. */
  const group = (title, list) => ({ title, links: list.map((c) => [c.path, c.title]) });
  return `${footShell(cfg, p, {
    cls: 'foot',
    note: 'One inbox. A person answers within a working day.',
    fine: opts.fine || '',
    motif: `<p class="colo-t"><span class="colo-ctl">${esc(chapter.ctl)}</span> · you are on ${esc(chapter.title)} · printed <span data-clock="date">today</span></p>`,
    groups: [group('The binder', CHAPTERS.slice(0, 4)), group('The company', CHAPTERS.slice(4))],
  })}
<div class="footbar" aria-label="Page controls">
  <button class="fb-b" type="button" data-print aria-label="Print the contents page">${ic('print', 18)}<span>Print</span></button>
  <span class="fb-p" data-progress aria-live="off"><span data-page-n>p. 1</span><span class="fb-sep">/</span><span data-page-total>${here.length || 1}</span><span class="fb-w" data-page-name>${esc((here[0] || chapter).label || chapter.title)}</span></span>
  <a class="fb-b is-pri" href="/#join" data-cta="footbar">${ic('pen', 18)}<span>Join</span></a>
</div>
${nextFloat(next, { key: 'Next' })}
${dialogs(cfg, p, { tabs: here.filter((s) => s.tab !== ''), page })}`;
}

/* ── the dialogs every chapter carries: the lens, the keys, the palette ── */
function dialogs(cfg, p, { tabs, page }) {
  const verbs = [
    ['replan', 'Re-plan', 'Change an answer and watch the plan change'],
    ['print', 'Print the contents page', 'Only the sheet, at 8.5 × 11'],
    ['note', 'Add a note', 'A note to a person — the contact page'],
    ['compare', 'Compare versions', 'v1 against v2, with the diff'],
    ['lamp', 'Lamp', 'Warm paper under a lamp'],
    ['share', 'Share this page', 'Send the link'],
  ];
  const go = tabs.map((s) => [`go:${s.id}`, `Go to ${s.label}`, s.ctl]);
  const ch = CHAPTERS.filter((c) => c.path !== '/privacy').map((c) => [`chapter:${c.path}`, `Chapter · ${c.title}`, c.ctl]);
  /* Every section of every OTHER chapter, by name and by control number.
     The palette is this binder's index finger: typing "0170", "BK-LB" or
     "guardrails" reaches the one page that has it, from any route. The
     rows are plain buttons filtered on their own text, so the search is
     the shared filter and costs nothing new. */
  const here = `/${page}`.replace('/home', '/');
  const elsewhere = [];
  for (const c of CHAPTERS) {
    if (c.path === here || !BOOK[c.path]) continue;
    for (const s of BOOK[c.path]) {
      if (!s.tab) continue;
      elsewhere.push([`open:${c.path}#${s.id}`, `${c.title} · ${s.tab}`, s.ctl]);
    }
  }
  const all = [...verbs, ...go, ...ch, ...elsewhere];
  return `${citesJson()}
<dialog class="lens" id="lens" aria-label="The contents page at true size">
  <div class="lens-bar"><span class="lens-t">${esc(S.paperTitle)} · 8.5 × 11 in</span><button class="rb" type="button" data-lens-close aria-label="Close">${ic('close', 20)}</button></div>
  <div class="lens-scroll" data-scrollx><div class="lens-page"><div class="ruler ruler-x" aria-hidden="true">${[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `<i>${n}</i>`).join('')}</div><div class="ruler ruler-y" aria-hidden="true">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `<i>${n}</i>`).join('')}</div><div class="lens-sheet" data-lens-sheet></div></div></div>
</dialog>
<dialog class="keys" id="keys" aria-label="Keyboard shortcuts">
  <div class="keys-in">
    <div class="keys-h"><b>Keys</b><button class="rb" type="button" data-keys-close aria-label="Close">${ic('close', 20)}</button></div>
    <dl class="keys-l">
      <div><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Previous and next tab</dd></div>
      <div><dt><kbd>p</kbd></dt><dd>Print the contents page</dd></div>
      <div><dt><kbd>⌘</kbd> <kbd>K</kbd></dt><dd>The palette — the product’s verbs</dd></div>
      <div><dt><kbd>l</kbd></dt><dd>Lamp on or off</dd></div>
      <div><dt><kbd>?</kbd></dt><dd>This card</dd></div>
      <div><dt><kbd>Esc</kbd></dt><dd>Close whatever is open</dd></div>
    </dl>
  </div>
</dialog>
<dialog class="cmd" id="palette" aria-label="Command palette">
  <form class="cmd-in" data-pal>
    <label class="cmd-f"><span class="sr-only">Type a verb</span>${ic('search', 18)}<input type="search" name="q" placeholder="Re-plan, print, compare…" autocomplete="off" spellcheck="false" data-pal-q></label>
    <ol class="cmd-l" data-pal-list>${all.map(([id, t, d], i) => `<li><button type="button" class="cmd-r" data-verb="${esc(id)}" ${i === 0 ? 'aria-current="true"' : ''}><span>${esc(t)}</span><small>${esc(d)}</small></button></li>`).join('')}</ol>
    <p class="cmd-foot"><kbd>↑</kbd><kbd>↓</kbd> move · <kbd>↵</kbd> run · <kbd>esc</kbd> close</p>
  </form>
</dialog>`;
}
