// /library — the four libraries: what each draws on, what is in it, how much
// has been read against the rule, and the honest state of the content.

import { header, footer, section, title, number, find, esc, cite, ev, citesBlock } from './chrome.js';

const SECS = number('BK-LB', [
  { id: 'top', label: 'The library is the product', tab: '' },
  { id: 'libraries', label: 'Four tracks, four libraries', tab: 'Libraries' },
  { id: 'evidence', label: 'The evidence tags, and the four rules', tab: 'Evidence', foldName: 'The evidence tags', gist: 'Verified, derived or open, and the four rules behind a version.' },
  { id: 'written', label: 'What is written, and what is not', tab: 'Written', foldName: 'What is written', gist: 'The AFH-DD library counted rather than claimed.' },
  { id: 'never', label: 'Removed, and never', tab: 'Never', gist: 'Six taken out on purpose, and six this product will never do.' },
  { id: 'words', label: 'Three words', tab: 'Words' },
]);
const [TOP, LIBS, EVID, WRITTEN, NEVER, WORDS] = SECS;

const NEVER_ROWS = [
  ['BK-90', 'A quarterly review cycle with frozen records', 'It would reintroduce protected data via findings — records of what was missing, when, and whose fault. Reviews stay on paper.'],
  ['BK-91', 'Findings — free text about a person', 'A record about a person.'],
  ['BK-92', 'A readiness dashboard or score', 'Surface, never police. A claim about a home, derived from records the product would then need — a claim the product cannot support.'],
  ['BK-93', 'Electronic signature', 'A record of a named person’s assent. Binderkit does not collect one.'],
  ['BK-94', 'Document storage or upload', 'Binderkit prints tabs. Documents stay on paper, or in whatever system you already file them. A store implies retention, deletion and access obligations for content the product cannot inspect.'],
  ['BK-95', 'Tracking whether a document is actually filed', 'This is the review cycle, and it requires findings, which are records about people.'],
];
const REFUSED = [
  'Claiming that using the product produces compliance — it cannot be supported, and the terms say the opposite.',
  'Any deadline, countdown or review reminder — the product did not set the cadence and has no standing to enforce one.',
  'Printing an unconfirmed authority without saying so — the whole basis on which a printed citation can be trusted.',
  'Publishing a library item without an authority, or an explicit mark that it has none.',
  'Changing a published library version in place — a provider’s printed page must remain explicable.',
  'A public link to a plan — Binderkit has no share surface at all.',
  'Bulk editing — each edit is a judgement about one item.',
  'A refusal that offers no alternative — a refusal without an alternative is a defect.',
];
const STATE = [
  ['Libraries', 'Four, one per licence track — none written yet.'],
  ['Discovery pages', 'Four, one per track — they wait until a library exists.'],
  ['Items', 'Thirty-two observed and ninety-four derived. The items themselves are still being collected; what we have today are counts and notes about where they came from.'],
  ['The reading', 'Thirty to forty hours per library, each needing a provider inspected on that track or a consultant who has surveyed all four.'],
  ['The five questions', 'The exact set per track is established with a provider inspected on that track before that library is offered.'],
  ['Until then', 'Every plan and the first page of every print carries a banner saying the library has not been reviewed by a provider on your licence.'],
];

function render(cfg, p) {
  const s = find('depth');
  const screen = find('screen');
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'library', tabs: SECS.filter((x) => x.tab) })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light">
${title(TOP, { eyebrow: 'Chapter · The library', h1: s.heading, lede: s.sub, ctas: `<a class="btn pri lg" href="#libraries">The four libraries</a><a class="btn lg" href="#written">What is written</a>` })}
${section(LIBS, `<h2 id="h-libraries">Four tracks, four libraries.</h2><p class="sub">A facility has one track, chosen when you create it. Here is what each library draws on, what is in it, and how much of it has been read against the rule.</p>
  <table class="lib"><thead><tr>${s.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${s.rows.map((row) => `<tr><th scope="row" data-col="${esc(s.cols[0])}">${esc(row[0])}</th><td data-col="${esc(s.cols[1])}" class="is-auth"><code>${esc(row[1])}</code></td><td data-col="${esc(s.cols[2])}">${esc(row[2])}</td><td data-col="${esc(s.cols[3])}"><b>${esc(row[3])}</b></td></tr>`).join('')}</tbody></table>
  <p class="closing">${esc(s.closing)}</p>`)}
${section(EVID, `<h2 id="h-evidence">Every item prints its evidence tag.</h2><p class="sub">${esc(s.pull)}</p>
  <div class="tag-g"><div>${ev('verified')}<span>Someone inspected on this track read the primary source.</span></div><div>${ev('derived')}<span>Inferred from the rule chapter; prints that way, visibly, until confirmed.</span></div><div>${ev('open')}<span>No authority yet — marked as such, never hidden.</span></div></div>
  ${citesBlock()}
  <div class="banner-note"><span class="strip-l">${esc(screen.side.label)}</span><p>${esc(screen.side.text)}</p></div>`)}
${section(WRITTEN, `<h2 id="h-written">What is written, and what is not.</h2><p class="sub">The planner and the print are ready. The libraries themselves are still being read against the rule.</p>
  <dl class="ledger">${STATE.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  <p class="boundary">We would rather hand you a banner than a tidy page.</p>`)}
${section(NEVER, `<h2 id="h-never">Removed, and never.</h2><p class="sub">These stay out. Each one would have required a record about a person, or a claim the product cannot support.</p>
  <ol class="never">${NEVER_ROWS.map(([, t, why]) => `<li><div><b><s>${esc(t)}</s></b><span>${esc(why)}</span></div></li>`).join('')}</ol>
  <span class="strip-l">Refused on principle</span>
  <ol class="refused">${REFUSED.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>`)}
${section(WORDS, `<h2 id="h-words">${esc(s.struck.heading)}</h2>
  <div class="struck is-page"><p>${s.struck.words.map((w, i) => `<s class="strike" style="--d:${i * 260}ms">${esc(w)}</s>`).join('')}</p><span class="cap">${esc(s.struck.foot)}</span></div>
  <p class="cap">Every authority on this site is a chapter and a section: ${cite('OAR 411-360-0170')} is the one a resident binder is built from.</p>`)}
</main>
${footer(cfg, p, { page: 'library', tabs: SECS })}`;
}

export const libraryPage = { path: 'library', title: 'The library', description: 'Four licence tracks, four rule sets, four libraries — what each draws on, what is in it, and the honest count of citations read against the rule: none yet.', render };
