// binderkit.com — the binder's furniture, shared by every chapter.
//
// The index tabs, the top rule with its running control number, the
// contents page that is the footer, the sheet that the planner fills, and the
// planner itself. Everything here is the site's — nothing is the product's
// except the rows it quotes from the instruments.

import { esc, mark, social, byline, hello, mailto } from '../../shared.js';
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
  { path: '/plan', title: 'The plan', sub: 'Five answers in, a shelf of binders out', ctl: 'BK-PL' },
  { path: '/library', title: 'The library', sub: 'Four tracks, four libraries', ctl: 'BK-LB' },
  { path: '/pricing', title: 'Pricing', sub: 'Priced in the open', ctl: 'BK-PR' },
  { path: '/about', title: 'About', sub: 'Who makes Binderkit', ctl: 'BK-AB' },
  { path: '/contact', title: 'Contact', sub: 'Write to a person', ctl: 'BK-CT' },
  { path: '/privacy', title: 'Privacy', sub: 'What it holds, and what leaves it', ctl: 'BK-PV' },
];

export const HOME = [
  { id: 'top', label: 'The title page', tab: '' },
  { id: 'plan', label: 'The plan', tab: 'Plan', gist: 'Question zero picks the library, and the library is everything.' },
  { id: 'page', label: 'The page', tab: 'Page' },
  { id: 'library', label: 'The library', tab: 'Library', gist: 'Four tracks, four libraries, an authority beside every item.' },
  { id: 'editor', label: 'The editor', tab: 'Editor', gist: 'A refusal names the rule that caused it and offers an alternative.' },
  { id: 'versions', label: 'Versions', tab: 'Versions', gist: 'An answer changes, the plan regenerates, and the diff is shown.' },
  { id: 'nothing', label: 'Nothing about anyone', tab: 'Nothing', gist: 'Six rules that keep every fact about a real person out.' },
  { id: 'roles', label: 'Roles', tab: 'Roles', gist: 'Who plans, who prints, and what each of them may see.' },
  { id: 'questions', label: 'Questions', tab: 'Questions', gist: 'The seven we are actually asked, answered in full.' },
  { id: 'pricing', label: 'Pricing', tab: 'Pricing', gist: 'Every plan sees every screen; nothing is silently blocked.' },
  { id: 'join', label: 'Join', tab: 'Join' },
].map((s, i) => ({ ...s, ctl: `BK-LP-${String(i + 1).padStart(2, '0')}` }));

/** A numbered section list for a chapter: [{id,label,tab}] → with control numbers. */
export const number = (prefix, list) => list.map((s, i) => ({ ...s, ctl: `${prefix}-${String(i + 1).padStart(2, '0')}` }));

/* ── small pieces ─────────────────────────────────────────────────────── */
export const eyebrow = (t) => `<span class="eyebrow">${esc(t)}</span>`;
export const h2 = (id, text, sub = '') => `<h2 id="h-${esc(id)}">${esc(text)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}`;
export const ev = (tag) => (tag ? `<i class="ev is-${esc(tag)}">${esc(tag)}</i>` : '');
export const place = (t) => (t ? `<i class="place">${esc(t)}</i>` : '');

/** A section of the document: the control number in the margin, the body beside it. */
export function section(s, inner, opts = {}) {
  const label = opts.label ? `aria-label="${esc(opts.label)}"` : `aria-labelledby="h-${esc(s.id)}"`;
  /* Below 640 a chapter opens as its own contents page. Three sections stay
     open — the title page, the one that carries the claim, and the closing
     call — and every other becomes one tappable line carrying its heading
     and its gist. site.js folds() does the rest; nothing is deleted, so
     print, find-in-page and the crawler still see the whole document. */
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
  return `<section class="sec ${opts.cls || ''}" id="${esc(s.id)}" ${label} data-ctl="${esc(s.ctl)}"${fold} data-reveal>
  <div class="wrap doc"><span class="ctl" aria-hidden="true">${esc(s.ctl)}</span><div class="doc-b">${inner}</div></div>
</section>`;
}

/** The title page of a chapter. */
export function title(s, { eyebrow: eb, h1, lede, ctas = '', fine = '', aside = '' }) {
  return `<section class="hero" id="${esc(s.id)}" aria-labelledby="h1" data-ctl="${esc(s.ctl)}">
  <div class="wrap doc"><span class="ctl" aria-hidden="true">${esc(s.ctl)}</span>
    <div class="doc-b hero-in ${aside ? 'has-aside' : ''}">
      <div class="hero-t">${eb ? eyebrow(eb) : ''}<h1 id="h1">${esc(h1)}</h1>${lede ? `<p class="lede">${esc(lede)}</p>` : ''}${ctas ? `<div class="ctas">${ctas}</div>` : ''}${fine ? `<p class="fine">${esc(fine)}</p>` : ''}</div>
      ${aside ? `<div class="hero-v">${aside}</div>` : ''}
    </div>
  </div>
</section>`;
}

/* ── citations: the five on this site, and what each one is ───────────── */
export const CITES = [
  ['OAR 411-360-0130', 'Standards', 'Chapter 411, division 360 — the AFH-DD track. Section 0130 is the standards section of that chapter.'],
  ['OAR 411-360-0140', 'Health care', 'Chapter 411, division 360 — the AFH-DD track. Section 0140 is the health-care section.'],
  ['OAR 411-360-0150', 'Emergency information', 'Chapter 411, division 360 — the AFH-DD track. Cited from the chapter for the items that are posted rather than filed.'],
  ['OAR 411-360-0170', 'Documentation and records', 'Chapter 411, division 360 — the AFH-DD track. Section 0170 is documentation and records, the section a resident binder is built from.'],
  ['OAR 411-360-0180', 'Staff records', 'Chapter 411, division 360 — the AFH-DD track. Cited from the chapter for the staff binder.'],
  ['OAR 411-360-0185', 'Abuse and incident', 'Chapter 411, division 360 — the AFH-DD track. Section 0185 is abuse and incident reporting.'],
];
const EV_LINE = 'Evidence: derived — cited from the rule chapter, not yet read against the rule by a provider inspected on this track. Today no citation on this site is verified.';
export const cite = (text) => {
  const known = CITES.find((c) => c[0] === text);
  return known
    ? `<a class="cite" href="#cites" data-cite="${esc(text)}">${esc(text)}</a>`
    : esc(text);
};
export const citesBlock = () => `<dl class="cites" id="cites">
  <span class="strip-l">The citations on this page, and what each one is</span>
  ${CITES.map(([c, name, what]) => `<div class="cite-r" data-cite-row="${esc(c)}"><dt><code>${esc(c)}</code> <b>${esc(name)}</b></dt><dd>${esc(what)} <span class="cite-ev">${esc(EV_LINE)}</span></dd></div>`).join('')}
</dl>`;

/* ── the planner: the data, then the rule ─────────────────────────────── */
const TRACKS = [
  { id: 'AFH-DD', auth: 'OAR 411-360', ok: true },
  { id: 'AFH-APD', auth: 'OAR 411-050', notice: 'The AFH-APD library is not in this release. On this track the plan screen says so plainly, and you are not charged for what you cannot use. Its authority, when it is written: OAR 411-050 — 0745 Facility Records, which is the rule’s own name for that set, and 0750 resident records, twenty to twenty-four types.' },
  { id: 'AFH-OHA', auth: 'OAR 309-040', notice: 'The AFH-OHA library is not written yet. On this track the plan screen says so plainly, and you are not charged for what you cannot use. Its authority, when it is written: OAR 309-040.' },
  { id: 'Agency', auth: 'OAR 411-325', notice: 'The agency library is one hundred and twenty-six items — the same thirty-two, plus ninety-four derived — with ninety-nine citations recorded, all of which must be re-verified against OAR 411-325 as amended 15 January 2026 before the first paying agency. This demonstration plans on the AFH-DD library only.' },
];
const SKIP = ['skip', 'Skip — resolves the inclusive way'];
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
  const lines = [`Binderkit plan — illustrative · ${plan.track}`];
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
  <p class="po-banner" data-plan-banner ${plan.same ? 'hidden' : ''}>${plan.same ? '' : 'Re-plan: v1 → v2. In the product this is an offer and a diff, and nothing changes until you accept it; here it is applied so you can see the page.'}</p>
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
      <button type="button" class="btn sm" data-plan-reset>${ic('reset', 18)}<span>Reset to the demonstration</span></button>
      <button type="button" class="btn sm" data-plan-copy data-copy="${esc(planText(plan, a))}" data-copied="Plan copied as text">${ic('copy', 18)}<span>Copy the plan as text</span></button>
    </div>
    <p class="pl-fine">Illustrative. This site plans on its own copy of the AFH-DD rule; the product’s libraries are not yet written. The same answers always produce the same plan — change one, then change it back, and you are back at v1.</p>
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
          <button class="rb rb-i lamp" type="button" data-mode-toggle aria-pressed="false" aria-label="Switch to the lamp" data-theme-light="#FFFFFF" data-theme-dark="#F3EBDA">${lampIcon(20)}</button>
          <button class="rb rb-i" type="button" data-share data-share-title="${esc(p.name)} — ${esc(p.descriptor)}" aria-label="Share this page">${ic('share', 20)}</button>
          <button class="rb rb-i" type="button" data-close aria-label="Close the contents">${ic('close', 20)}</button>
        </div>
      </div>
      <ol class="toc toc-ch">${CHAPTERS.map((c, i) => `<li><a href="${esc(c.path)}" ${c === chapter ? 'aria-current="page"' : ''}><span class="toc-no">${i + 1}</span><span class="toc-t">${esc(c.title)}<small>${esc(c.sub)}</small></span><span class="toc-l" aria-hidden="true"></span><span class="toc-n">${esc(c.ctl)}</span></a></li>`).join('')}</ol>
      ${tabs.length ? `<span class="strip-l">In this chapter</span><ol class="toc toc-in-ch">${tabs.map((s, i) => `<li><a href="#${esc(s.id)}"><span class="toc-no">${i + 1}</span><span class="toc-t">${esc(s.label)}</span><span class="toc-l" aria-hidden="true"></span><span class="toc-n">${esc(s.ctl)}</span></a></li>`).join('')}</ol>` : ''}
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
      <button class="rb rb-t" type="button" aria-expanded="false" aria-controls="contents" data-lock data-focus="a" aria-label="Open the contents">${ic('contents', 20)}<span>Contents</span></button>
      <button class="rb" type="button" data-print aria-label="Print">${ic('print', 20)}<span>Print</span></button>
      <button class="rb rb-i" type="button" data-share data-share-title="${esc(p.name)} — ${esc(p.descriptor)}" aria-label="Share this page">${ic('share', 20)}</button>
      <button class="rb rb-i lamp" type="button" data-mode-toggle aria-pressed="false" aria-label="Switch to the lamp" data-theme-light="#FFFFFF" data-theme-dark="#F3EBDA">${lampIcon(20)}</button>
      <a class="btn pri sm rule-cta" href="${primary}" data-cta="rule">${esc(cfg.cta.nav)}</a>
    </div>
  </div>
  <nav class="tabs" aria-label="${tabs.length ? 'Sections' : 'Chapters'}" ${tabs.length ? 'data-spy' : ''}>
    <ol class="tabs-l" data-scrollx>${tabList}<li class="tabs-cta"><a class="dtab is-cta" href="${primary}" data-cta="strip">${esc(cfg.cta.nav)}</a></li></ol>
  </nav>
  ${toc}
</header>`;
}

/* ── the footer: a contents page, a colophon, the stamps ──────────────── */
export function footer(cfg, p, opts = {}) {
  const page = opts.page || 'home';
  const chapter = CHAPTERS.find((c) => (page === 'home' ? c.path === '/' : c.path === `/${page}`)) || CHAPTERS[0];
  const here = opts.tabs || (page === 'home' ? HOME : []);
  const line = (href, no, t, ctl, sub = '', cur = false) => `<li><a href="${esc(href)}" ${cur ? 'aria-current="page"' : ''}><span class="toc-no">${esc(no)}</span><span class="toc-t">${esc(t)}${sub ? `<small>${esc(sub)}</small>` : ''}</span><span class="toc-l" aria-hidden="true"></span><span class="toc-n">${esc(ctl)}</span></a></li>`;
  const tabbed = here.filter((s) => s.tab);
  const sections = here.length ? `<ol class="toc">${here.map((s) => line(`#${s.id}`, s.tab ? String(tabbed.indexOf(s) + 1) : '—', s.label, s.ctl)).join('')}</ol>` : '';
  const chapters = `<ol class="toc toc-ch">${CHAPTERS.map((c, i) => line(c.path, i + 1, c.title, c.ctl, c.sub, c === chapter)).join('')}</ol>`;
  return `<footer class="foot" id="foot">
  <div class="wrap doc"><span class="ctl" aria-hidden="true">Contents</span>
    <div class="doc-b">
      <h2 class="foot-h">Contents</h2>
      <div class="foot-g">
        <div class="foot-here"><span class="strip-l">${page === 'home' ? 'This page' : `This chapter · ${esc(chapter.title)}`}</span>${sections || '<p class="fine">One section.</p>'}</div>
        <div class="foot-ch"><span class="strip-l">Chapters</span>${chapters}</div>
      </div>
      <div class="colophon">
        <span class="colo-mark">${mark(p.id, 80, { label: false, mono: true, tile: 'var(--ink)', glyph: 'var(--bg)' })}</span>
        <p class="colo-t"><span class="colo-ctl">Binderkit</span> · printed <span data-clock="date">today</span>.</p>
      </div>
      <div class="stamps-row">
        <a class="stamp" href="${mailto(cfg)}">${ic('mail', 18)}<span>${esc(hello(cfg))}</span></a>
        <button class="stamp" type="button" data-copy="${esc(hello(cfg))}" data-copied="Address copied">${ic('copy', 18)}<span>Copy the address</span></button>
        <button class="stamp" type="button" data-share data-share-title="${esc(p.name)} — ${esc(p.descriptor)}">${ic('share', 18)}<span>Share this page</span></button>
        <button class="stamp" type="button" data-print>${ic('print', 18)}<span>Print</span></button>
      </div>
      ${social(p.id, { size: 16, cls: 'stamps', text: true, label: 'Binderkit elsewhere' })}
      <div class="foot-b">${byline()}<p class="foot-fine">${opts.fine ? `${esc(opts.fine)} ` : ''}${esc(cfg.legalLine)}</p></div>
    </div>
  </div>
</footer>
<div class="footbar" aria-label="Page controls">
  <button class="fb-b" type="button" data-print>${ic('print', 18)}<span>Print</span></button>
  <span class="fb-p" data-progress aria-live="off"><span data-page-n>p. 1</span><span class="fb-sep">/</span><span data-page-total>${here.length || 1}</span></span>
  <a class="fb-b is-pri" href="/#join" data-cta="footbar">${ic('pen', 18)}<span>Join</span></a>
</div>
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
  const all = [...verbs, ...go, ...ch];
  return `<dialog class="lens" id="lens" aria-label="The contents page at true size">
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
