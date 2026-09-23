// /rules — the ten Oregon citations the product explains today, how sure we
// are about each, and what was removed.
// Every line is read from the specification (data/page.js) or
// FEATURES_CARESHOP.md; explaining a rule is never a claim that a house
// meets it, and this page says so in its first breath.

import { esc, sec, h2 } from '../../shared.js';
import { iosShell } from '../../instruments.js';
import { PAGES } from '../../../data/page.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker, screen, showMe, directory } from './parts.js';

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
  ['Equipment and its inspection model', '“an extinguisher is not stock”', 'not coming back'],
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


/* ── THE TWELVE GOVERNING RULES ────────────────────────────────────────
   The product's own constitution, condensed from FEATURES_CARESHOP.md §2
   — eleven from the architecture document's cross-module rules and a
   twelfth the vault added on 2026-09-13. These are rules CareShop applies
   to ITSELF. None of them is a regulation, and stating one is never a
   claim that a house meets anything: that distinction is the whole
   subject of this page and it is why they sit here.

   The third column is the honest one. A rule the product enforces today
   says so; a rule the rebuild is repairing says so; a rule that exists
   only in the specification says that loudest of all. */
const TWELVE = [
  ['The ledger rule', 'On-hand is derived from recorded movements. Nothing types a quantity directly, every movement carries a person, a reason and a guard that records it exactly once, and a correction is a further movement.', 'in the product'],
  ['The three-axes rule', 'Zone is where it sits in the house, aisle is the route through a shop, category is the catalogue facet. Never conflated, never derived from one another, never merged into one ordering.', 'in the product'],
  ['The minimum-resident rule', 'Only what allows a tray to be prepared safely. No diagnosis, no medication, no incident, no clinical note — and any proposal to add one is a boundary change rather than a feature request.', 'in the product'],
  ['The rendered-tray-note rule', 'A tray note is produced at the moment of viewing and stored on no menu, no list, no print, no snapshot and no export.', 'in the product'],
  ['The citation-confidence rule', 'A citation appears only with its confidence; short of confirmed it prints its state, and a rule set no provider has reviewed carries a banner.', 'specified'],
  ['The origin rule', 'Every buy request records what produced it. Without the origin the queue is a list; with it, the queue is diagnosable.', 'in the product'],
  ['The one-contract rule', 'Every route into the queue produces the same kind of request under the same purchasing rules. There is no privileged door.', 'in the product'],
  ['The typed-count rule', 'A house’s licensed bed count is typed by a person and never derived from the resident list. It is the one regulated number in the product.', 'in the product'],
  ['The no-deletion rule', 'Residents are archived, items merged or deactivated, houses deactivated, runs closed — each with a reason. Movements are never removed.', 'being repaired'],
  ['The notification-content rule', 'A message leaving the system carries a house code and a count. Never a resident, a diet, an allergen or an item name.', 'being repaired'],
  ['The snapshot rule', 'Any view built for someone outside the system comes from a source that cannot read resident information. Structural, not remembered.', 'in the product'],
  ['The curation rule', 'An item a house has switched off is skipped in every count, every gap and every reading.', 'being repaired'],
];
const RULE_STATE = { 'in the product': 'stocked', 'being repaired': 'expiring', specified: 'short' };

/* The count of rules not fully in force is read off TWELVE rather than
   typed, so the sentence under the list and the ticket in the entrance
   board can never drift from the third column the way they once did.
   'being repaired' is partly in force; 'specified' is not built at all,
   and the copy names that difference rather than averaging it away. */
const NOT_IN_FORCE = TWELVE.filter(([, , st]) => st !== 'in the product');
const REPAIRING = NOT_IN_FORCE.filter(([, , st]) => st === 'being repaired').length;
const SPECIFIED = NOT_IN_FORCE.filter(([, , st]) => st === 'specified').length;
const NUM = ['no', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

export function rulesPage(cfg, p) {
  const depth = find('depth');
  const buy = screen('buy');
  const who = find('objections').rows.find(([q]) => /Who checks/.test(q));
  const citationRow = depth.rows.find(([t]) => t === 'The rule citations');
  const confRow = depth.rows.find(([t]) => t === 'The confidence on a citation');
  const ev = find('evidence').blocks;
  const leaves = ev.find((b) => b.label === 'What leaves the house');
  const shortCode = ev.find((b) => b.label === 'The house short code');

  const inner = `${pageHead('Aisle 3 · the rules', 'Ten citations, explained. How sure we are, printed beside each.', 'Explaining a rule is not a claim that a house meets it. CareShop reads a house against its own counts; it never ranks one house against another, and it never says a house is compliant.')}
${directory([['cites', 'The ten', '10 citations'], ['banner', 'The banner', '1 line'], ['twelve', 'Twelve governing rules', `${NOT_IN_FORCE.length} not in force`], ['egress', 'What leaves the house', '22 templates'], ['posture', 'How sure we are', '6 topics'], ['removed', 'Removed, and never', '7 and 6']], { title: 'On this page' })}
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
${fold(sec('twelve', 'twelve-s', `<div class="wrap">
  <div class="head">${sticker('book', 'The product’s own constitution')}${h2('twelve', 'Twelve rules it applies to itself.', 'None of these is a regulation. They are the rules CareShop is built to — and the third column says, for each one, whether the product enforces it today, whether the rebuild is repairing it, or whether it exists only in the specification.')}</div>
  <ol class="gov">${TWELVE.map(([t, d, state]) => `<li class="gov-i"><span class="gov-t"><b>${esc(t)}</b><span class="st" data-state="${esc(RULE_STATE[state])}"><i aria-hidden="true"></i>${esc(state)}</span></span><p>${esc(d)}</p></li>`).join('')}</ol>
</div>`), 'Twelve rules the product applies to itself, and which are in force.')}
${fold(sec('egress', 'egress-s', `<div class="wrap">
  <div class="head">${sticker('mail', 'What leaves the house')}${h2('egress', 'A message carries a code and a count.', 'The hardest thing to keep out of a kitchen product is a resident’s name in an email. It is kept out structurally: there is no free-text body parameter anywhere in the system.')}</div>
  <div class="two-up">
    <div class="two-c"><b>${esc(leaves.label)}</b><p>${esc(leaves.text)}</p></div>
    <div class="two-c"><b>${esc(shortCode.label)}</b><p>${esc(shortCode.text)}</p></div>
  </div>
  <p class="demo-f">Two of the twenty-two templates send today. The rest are written and not wired, and this page would rather say that than round it up.</p>
</div>`), 'No free-text body parameter exists anywhere in the system.')}
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
