// /rules — the ten Oregon citations the product explains, how sure it is
// about each, the rules it applies to itself, and what leaves the house.
// Explaining a rule is never a claim that a house meets it, and this page
// says so in its first breath.

import { esc, sec, h2, reach } from '../../shared.js';
import { iosShell } from '../../instruments.js';
import { PAGES } from '../../../data/page.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker, screen, showMe, directory } from './parts.js';

/* the fold: below 640 a long aisle opens as an index */
const fold = (html, gist) =>
  html.replace('<section class="sec ', `<section data-phone="fold" data-gist="${esc(gist)}" class="sec `);

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

/* the ten, as the product explains them */
const TEN = ['OAR 411-050-0715(5)', 'OAR 411-050-0715(8)(j)', 'OAR 411-050-0715(9)(c)', 'OAR 411-050-0715(10)(d)', 'OAR 411-050-0715(10)(f)', 'OAR 411-050-0720(12)', 'OAR 411-050-0720(15)', 'OAR 411-050-0725', 'OAR 411-050-0730(8)', 'OAR 309-040-0385'];

/* the legend: what each confidence means */
const LEGEND = [
  ['confirmed', 'Explained in one line inside the product. Still an explanation of a rule, never a finding about a house.'],
  ['inferred', 'The bare rule text, without an explanation. It prints as inferred wherever it appears.'],
  ['unreviewed', 'A rule set no provider on that track has reviewed yet. It carries a banner on the dashboard and on every export.'],
];

/* the rules the product applies to itself — one clause each, because a
   card that needs a second sentence is a card that has two rules on it */
const TWELVE = [
  ['The ledger rule', 'On hand comes from movements, never typed.'],
  ['The three-axes rule', 'Zone, aisle and category are never merged.'],
  ['The minimum-resident rule', 'Only what a safe tray needs. Nothing clinical.'],
  ['The rendered-tray-note rule', 'Drawn at viewing, stored nowhere.'],
  ['The citation-confidence rule', 'A citation always shows how sure we are.'],
  ['The origin rule', 'Every buy request records what produced it.'],
  ['The one-contract rule', 'One kind of request, whatever the route.'],
  ['The typed-count rule', 'The bed count is typed, never derived.'],
  ['The no-deletion rule', 'Archive, merge, deactivate, close. Never delete.'],
  ['The notification rule', 'A message carries a code and a count.'],
  ['The snapshot rule', 'An outside view never reads resident data.'],
  ['The curation rule', 'A switched-off item is skipped in every count.'],
];

const conf = (c) => `<span class="conf" data-c="${esc(c)}">${esc(c)}</span>`;

export function rulesPage(cfg, p) {
  const depth = find('depth');
  const buy = screen('buy');
  const citationRow = depth.rows.find(([t]) => t === 'The rule citations');
  const leaves = find('evidence').blocks.find((b) => b.label === 'What leaves the house');

  const inner = `${pageHead('Aisle 3 · the rules', 'Ten citations, explained. How sure we are, printed beside each.', 'Explaining a rule is not a claim that a house meets it. CareShop reads a house against its own counts and never says a house is compliant.')}
${directory([['cites', 'The ten', '10 citations'], ['banner', 'The banner', '1 line'], ['twelve', 'The rules it keeps', '12 rules'], ['egress', 'What leaves the house', 'a code and a count'], ['posture', 'How sure we are', `${depth.rows.length} topics`]], { title: 'On this page' })}
${sec('cites', 'cites-s', `<div class="wrap">
  <div class="head">${sticker('book', 'Explained in the product')}${h2('cites', 'The ten.', citationRow[1])}</div>
  <div class="ten-g">
    <ol class="cites">${TEN.map((c) => `<li class="cite"><span class="cite-n">${esc(c)}</span>${conf('confirmed')}<span class="cite-w">one line, inside the product</span></li>`).join('')}</ol>
    <div class="legend" data-conf-legend>
      <span class="strip-l">How sure we are · tap a tag</span>
      ${LEGEND.map(([c, meaning]) => `<details class="conf-d" data-c="${esc(c)}"><summary>${conf(c)}<span class="conf-s">what it means</span>${ic('down', 14)}</summary><p>${esc(meaning)}</p></details>`).join('')}
    </div>
  </div>
</div>`)}
${sec('banner', 'banner-s', `<div class="wrap aisle-g">
  <div class="aisle-ph"><div class="crop"><div class="ph" data-phone="buy">${iosShell('careshop', { key: 'buy' })}</div></div></div>
  <div class="aisle-d">${sticker('tag', 'The banner')}${h2('banner', 'Until a provider has reviewed the set, every screen says so.', buy.banner)}<p class="st-p">You always know which of the two you are reading: a citation explained in the product, or the bare rule text.</p><div class="shows">${showMe('Bottled water', 'An inferred citation')}${showMe('Applesauce', 'A confirmed one')}</div></div>
</div>`)}
${fold(sec('twelve', 'twelve-s', `<div class="wrap">
  <div class="head">${sticker('book', 'The product’s own rules')}${h2('twelve', 'Twelve rules it applies to itself.', 'Not regulations. The rules CareShop is built to.')}</div>
  <ol class="gov">${TWELVE.map(([t, d]) => `<li class="gov-i"><span class="gov-t"><b>${esc(t)}</b></span><p>${esc(d)}</p></li>`).join('')}</ol>
</div>`), 'Twelve rules the product applies to itself.')}
${fold(sec('egress', 'egress-s', `<div class="wrap">
  <div class="head">${sticker('mail', 'What leaves the house')}${h2('egress', 'A message carries a code and a count.', 'The hardest thing to keep out of a kitchen product is a resident’s name in an email. It is kept out by structure: there is no free-text body anywhere in the system.')}</div>
  <div class="two-up">
    <div class="two-c"><b>${esc(leaves.label)}</b><p>${esc(leaves.text)}</p></div>
    <div class="two-c"><b>The house short code</b><p>A house is named in an email or a push by its short code, WH-1, and by nothing else. No code can equal or contain a resident’s label.</p></div>
  </div>
</div>`), 'No free-text body exists anywhere in the system.')}
${fold(sec('posture', 'posture', `<div class="wrap">
  <div class="head">${sticker('scale', 'How sure we are')}${h2('posture', 'A citation is an explanation, never a finding.', 'Where each rule shows in the product, and how sure we are of it.')}</div>
  <div class="res-l is-page">${depth.rows.map(([t, w, where]) => `<div class="res-r"><span class="res-k">${ic('tag', 16)}<b>${esc(t)}</b></span><span>${esc(w)}</span><em>${esc(where)}</em></div>`).join('')}</div>
  <p class="closing">${esc(depth.closing)}</p>
  ${reach(cfg, p, { formHref: '/write', id: 'reach-rules', heading: 'Ask us about a rule.', subject: 'A rule — CareShop' })}
</div>`), 'A citation explains a rule. It is never a finding about a house.')}`;
  return page(cfg, p, 'rules', inner);
}
