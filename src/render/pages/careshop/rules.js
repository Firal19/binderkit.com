// /rules — the ten Oregon citations the product explains today, how sure we
// are about each, and what was removed.
// Every line is read from the specification (data/page.js) or
// FEATURES_CARESHOP.md; explaining a rule is never a claim that a house
// meets it, and this page says so in its first breath.

import { esc, sec, h2 } from '../../shared.js';
import { iosShell } from '../../instruments.js';
import { PAGES } from '../../../data/page.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker, screen, showMe } from './parts.js';

/* ── the fold: below 640 a long aisle opens as an index ────────────────
   sec() lives in render/shared.js and takes no attribute bag, so the two
   attributes the shared folds() controller reads are stamped onto the
   section it returns. Nothing leaves the HTML: with scripting off, on a
   printer, or above 640px every section is open and whole. */
const fold = (html, gist) =>
  html.replace('<section class="sec ', `<section data-phone="fold" data-gist="${esc(gist)}" class="sec `);


const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

/* the ten, as FEATURES_CARESHOP.md §4.2.1 lists them */
const TEN = ['OAR 411-050-0715(5)', 'OAR 411-050-0715(8)(j)', 'OAR 411-050-0715(9)(c)', 'OAR 411-050-0715(10)(d)', 'OAR 411-050-0715(10)(f)', 'OAR 411-050-0720(12)', 'OAR 411-050-0720(15)', 'OAR 411-050-0725', 'OAR 411-050-0730(8)', 'OAR 309-040-0385'];

/* the legend: what each confidence means, in the specification's words */
const LEGEND = [
  ['confirmed', 'One of the ten citations explained inside the product today. These ten seed confirmed. A confirmed citation is still an explanation of a rule, not a finding about a house.'],
  ['inferred', 'Every other catalogue row carries the bare rule text and no explanation; those rows seed inferred, and an inferred citation adds “unreviewed” wherever it prints.'],
  ['unreviewed', 'A rule set no provider inspected on that track has reviewed. It carries a banner on the dashboard and on every export, including the one you hand a surveyor — until a provider inspected on that track has reviewed the set, every tenant on that track sees it.'],
];

/* §7.1 Removed, and not returning — as the document tables it */
const REMOVED = [
  ['Rule citations on items', 'never verified, jurisdiction unsettled — the largest unsupported claim in the product', 'kept, with a confidence on each'],
  ['A coverage grade across clinical risks', '“measured catalogue coverage and called it readiness”', 'not coming back'],
  ['Attestations and weekly compliance snapshots', '“compliance theatre once the citations are gone”', 'not coming back'],
  ['An evidence package for an inspector', '“the same, in a binder”', 'surveyor PDFs, with a banner'],
  ['Resident clinical notes', 'protected information with no kitchen purpose', 'removed, and stays removed'],
  ['Equipment and its inspection model', '“an extinguisher is not stock”', 'not coming back; a narrow inspection model is still open'],
  ['Per-tenant subdomains', '“the complexity buys nothing for a phone application”', 'removed; existing addresses redirect'],
];
const NEVER = ['Careshop Pay', 'QR shelf labels', 'Any inspection model', 'Resident clinical notes', 'The per-tenant subdomain layer', 'In-app purchase'];
const NEVER_MODULE = [
  ['Stock', 'Edit on-hand directly. Let a scan fail because a field is missing.'],
  ['Shop', 'Let an unapproved line be purchased under strict mode. Put a resident on a shopping list or a shared link.'],
  ['Residents', 'Store a diagnosis, a medication, an incident, or a clinical note.'],
  ['Time', 'There is no deadline anywhere in the product. Nothing expires unrecoverably, nothing must be done by a time, and no countdown exists.'],
];

const conf = (c) => `<span class="conf" data-c="${esc(c)}">${esc(c)}</span>`;

export function rulesPage(cfg, p) {
  const depth = find('depth');
  const buy = screen('buy');
  const who = find('objections').rows.find(([q]) => /Who checks/.test(q));
  const citationRow = depth.rows.find(([t]) => t === 'The rule citations');
  const confRow = depth.rows.find(([t]) => t === 'The confidence on a citation');

  const inner = `${pageHead('Aisle 3 · the rules', 'Ten citations, explained. How sure we are, printed beside each.', 'Explaining a rule is not a claim that a house meets it. CareShop reads a house against its own counts; it never ranks one house against another, and it never says a house is compliant.')}
${sec('cites', 'cites-s', `<div class="wrap">
  <div class="head">${sticker('book', 'Explained in the product today')}${h2('cites', 'The ten.', citationRow[1])}</div>
  <div class="ten-g">
    <ol class="cites">${TEN.map((c) => `<li class="cite"><span class="cite-n">${esc(c)}</span>${conf('confirmed')}<span class="cite-w">one line, inside the product</span></li>`).join('')}</ol>
    <div class="legend" data-conf-legend>
      <span class="strip-l">How sure we are · tap a tag</span>
      ${LEGEND.map(([c, meaning]) => `<details class="conf-d" data-c="${esc(c)}"><summary>${conf(c)}<span class="conf-s">what it means</span>${ic('down', 14)}</summary><p>${esc(meaning)}</p></details>`).join('')}
      <p class="demo-f">${esc(confRow[1])} <em class="today">${esc(confRow[2])}</em></p>
    </div>
  </div>
</div>`)}
${sec('banner', 'banner-s', `<div class="wrap aisle-g">
  <div class="aisle-ph"><div class="crop"><div class="ph" data-phone="buy">${iosShell('careshop', { key: 'buy' })}</div></div></div>
  <div class="aisle-d">${sticker('tag', 'The banner')}${h2('banner', 'Until a provider has reviewed the set, every screen says so.', buy.banner)}<p class="st-p">${esc(who[1])}</p><div class="shows">${showMe('Bottled water', 'An inferred citation')}${showMe('Applesauce', 'A confirmed one')}</div></div>
</div>`)}
${fold(sec('posture', 'posture', `<div class="wrap">
  <div class="head">${sticker('scale', 'How sure we are')}${h2('posture', 'A citation is an explanation, never a finding.', depth.sub)}</div>
  <p class="closing">${esc(depth.closing)}</p>
  <div class="res-l is-page">${depth.rows.map(([t, w, where]) => `<div class="res-r"><span class="res-k">${ic('tag', 16)}<b>${esc(t)}</b></span><span>${esc(w)}</span><em>${esc(where)}</em></div>`).join('')}</div>
</div>`), 'A citation explains a rule. It is never a finding about a house.')}
${fold(sec('removed', 'removed', `<div class="wrap">
  <div class="head">${sticker('x', 'Removed, and never')}${h2('removed', 'What came out, and what will not go in.', 'A compliance layer was built, shipped, used by nobody, and taken out. What came back is a confidence mark on every citation — an explanation of a rule, never a finding about a house.')}</div>
  <div class="void">
    <span class="rc-h">VOID</span>
    ${REMOVED.map(([t, why, now]) => `<div class="void-r"><b>${esc(t)}</b><span>${esc(why)}</span><em>${esc(now)}</em></div>`).join('')}
  </div>
  <div class="never-g">
    <div class="never"><span class="strip-l">Never</span><ul>${NEVER.map((n) => `<li>${ic('x', 16)}<span>${esc(n)}</span></li>`).join('')}</ul></div>
    <div class="never"><span class="strip-l">Never, module by module</span><ul>${NEVER_MODULE.map(([m, n]) => `<li>${ic('x', 16)}<span><b>${esc(m)} ·</b> ${esc(n)}</span></li>`).join('')}</ul></div>
  </div>
  <div class="ctas"><a class="btn lg" href="/write">${ic('mail', 18)}Ask us about a rule</a><a class="btn pri lg tagcta" href="${esc(cfg.cta.primaryHref)}" data-cta="rules"><span class="tagcta-hole" aria-hidden="true"></span>${esc(cfg.cta.primary)}${ic('arrow', 18)}</a></div>
</div>`), 'A compliance layer was built, shipped, used by nobody, removed.')}`;
  return page(cfg, p, 'rules', inner);
}
