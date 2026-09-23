// /library — the four libraries: what each draws on, what is in it, the
// rules in plain words, and what stays out of the product.

import { header, footer, section, title, BOOK, atChapter, onThisPage, find, esc, cite, ev, citesBlock } from './chrome.js';

const SECS = BOOK['/library'];
const [TOP, LIBS, EVID, NEVER, WORDS] = SECS;

const NEVER_ROWS = [
  ['A review cycle with frozen records', 'It would bring records about people back in: what was missing, when, and whose fault.'],
  ['Findings, or free text about a person', 'A record about a person.'],
  ['A readiness dashboard or score', 'A claim about a home the product could not support.'],
  ['Electronic signature', 'A record of a named person’s assent.'],
  ['Document storage or upload', 'Binderkit prints the tab. The document stays on paper, or wherever you already file it.'],
  ['Tracking whether a document is filed', 'That is the review cycle, and it needs findings.'],
];

function render(cfg, p) {
  atChapter('/library');
  const s = find('depth');
  const screen = find('screen');
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'library', tabs: SECS.filter((x) => x.tab) })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light">
${title(TOP, { eyebrow: 'Chapter · The library', h1: s.heading, lede: s.sub, ctas: `<a class="btn pri lg" href="#libraries">The four libraries</a><a class="btn lg" href="#evidence">The rules, in plain words</a>`, index: onThisPage(SECS) })}
${section(LIBS, `<h2 id="h-libraries">Four tracks, four libraries.</h2><p class="sub">A facility has one track, chosen when you create it. Here is what each library draws on and what is in it.</p>
  <table class="lib"><thead><tr>${s.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${s.rows.map((row) => `<tr><th scope="row" data-col="${esc(s.cols[0])}">${esc(row[0])}</th><td data-col="${esc(s.cols[1])}" class="is-auth"><code>${esc(row[1])}</code></td><td data-col="${esc(s.cols[2])}">${esc(row[2])}</td></tr>`).join('')}</tbody></table>
  <p class="closing">${esc(s.closing)}</p>`)}
${section(EVID, `<h2 id="h-evidence">The rules, in plain words.</h2><p class="sub">${esc(s.pull)}</p>
  <div class="tag-g"><div>${ev('verified')}<span>A provider inspected on this track read the rule itself.</span></div><div>${ev('derived')}<span>Taken from the rule chapter. It prints that way until confirmed.</span></div><div>${ev('open')}<span>No rule yet. Marked as such, never hidden.</span></div></div>
  ${citesBlock()}
  <div class="banner-note"><span class="strip-l">${esc(screen.side.label)}</span><p>${esc(screen.side.text)}</p></div>`)}
${section(NEVER, `<h2 id="h-never">What stays out.</h2><p class="sub">Each of these would put a record about a person into the product, or make a claim it cannot support.</p>
  <ol class="never">${NEVER_ROWS.map(([t, why]) => `<li><div><b><s>${esc(t)}</s></b><span>${esc(why)}</span></div></li>`).join('')}</ol>`)}
${section(WORDS, `<h2 id="h-words">${esc(s.struck.heading)}</h2>
  <div class="struck is-page"><p>${s.struck.words.map((w, i) => `<s class="strike" style="--d:${i * 260}ms">${esc(w)}</s>`).join('')}</p><span class="cap">${esc(s.struck.foot)}</span></div>
  <p class="cap">Every rule on this site is a chapter and a section: ${cite('OAR 411-360-0170')} is the one a resident binder is built from.</p>`)}
</main>
${footer(cfg, p, { page: 'library', tabs: SECS })}`;
}

export const libraryPage = { path: 'library', title: 'The library', description: 'Four licence tracks, four libraries: what each draws on, what is in it, and the Oregon rules behind every item in plain words.', render };
