// /library — the four libraries: what each draws on, what is in it, and
// the rules in plain words. The product's edge is one sentence under the
// rules; the six-item list of what it would never hold described other
// products' jobs and is gone.

import { header, footer, section, title, BOOK, atChapter, onThisPage, find, esc, cite, citesBlock, libTable, wordsList } from './chrome.js';

const SECS = BOOK['/library'];
const [TOP, LIBS, EVID, WORDS] = SECS;

function render(cfg, p) {
  atChapter('/library');
  const s = find('depth');
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'library', tabs: SECS.filter((x) => x.tab) })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light">
${title(TOP, { eyebrow: 'Chapter · The library', h1: s.heading, lede: s.sub, ctas: `<a class="btn pri lg" href="#libraries">The four libraries</a><a class="btn lg" href="#evidence">The rules, in plain words</a>`, index: onThisPage(SECS) })}
${section(LIBS, `<h2 id="h-libraries">Four tracks, four libraries.</h2><p class="sub">A facility has one track, chosen when you create it. Here is what each library draws on and what is in it.</p>
  ${libTable(s)}`)}
${section(EVID, `<h2 id="h-evidence">The rules, in plain words.</h2><p class="sub">${esc(s.pull)}</p>
  ${wordsList()}
  ${citesBlock()}
  <p class="cap">The product stops at the printed tab: it keeps no document, records no finding, and holds nothing about a person.</p>`)}
${section(WORDS, `<h2 id="h-words">${esc(s.struck.heading)}</h2>
  <div class="struck is-page"><p>${s.struck.words.map((w, i) => `<s class="strike" style="--d:${i * 260}ms">${esc(w)}</s>`).join('')}</p><span class="cap">${esc(s.struck.foot)}</span></div>
  <p class="cap">Every rule on this site is a chapter and a section: ${cite('OAR 411-360-0170')} is the one a resident binder is built from.</p>`)}
</main>
${footer(cfg, p, { page: 'library', tabs: SECS })}`;
}

export const libraryPage = { path: 'library', title: 'The library', description: 'Four licence tracks, four libraries: what each draws on, what is in it, and the Oregon rules behind every item in plain words.', render };
