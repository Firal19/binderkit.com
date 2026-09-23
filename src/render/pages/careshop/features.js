// /features — everything CareShop does, and what it will not.
//
// The application host redirects /features here, so this page has to carry
// the whole answer. Every station, every column and every refusal is read
// from data/page.js — the loop, the rule layer and the boundary the product
// already publishes on its own front page. Explaining a rule is never a
// claim that a house meets it, and the rule section says so first.

import { esc, sec, h2 } from '../../shared.js';
import { PAGES } from '../../../data/page.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker, chip, directory } from './parts.js';
import { SURFACES } from '../../instruments.js';
import { byId } from '../../../data/brand.js';

/* ── the fold: below 640 a long aisle opens as an index ────────────────
   sec() lives in render/shared.js and takes no attribute bag, so the two
   attributes the shared folds() controller reads are stamped onto the
   section it returns. Nothing leaves the HTML: with scripting off, on a
   printer, or above 640px every section is open and whole. */
const fold = (html, gist) =>
  html.replace('<section class="sec ', `<section data-phone="fold" data-gist="${esc(gist)}" class="sec `);


const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);


/* ── THE BOUNDARY TEST, AS IT SHIPS IN SETTINGS ────────────────────────
   One question with four answers, and three of the four send you next
   door. It is the clearest thing an operator can show a partner: a
   product that knows what it is not. The wording is data/page.js's own
   (`boundary.strip`), and the closing note states, rather than hides,
   that two wordings of the sentence ship today and one has to go. */
const OWNERS = [
  ['What the house buys, stores, cooks or holds in reserve', 'careshop', 'Here. The household is this product’s whole domain.'],
  ['A resident’s care — diagnoses, medications, incidents, notes', '', 'Not here. CareShop holds diet tags, allergens and one texture level, and nothing clinical.'],
  ['The roster, a shift, a credential date', '', 'Not here. A shift never describes a resident, and CareShop schedules nobody.'],
  ['What goes in a binder, and in what order', '', 'Not here. CareShop holds the reserve; the binder tab it goes in is printed elsewhere.'],
];

/* ── the five origins. Each one is shown with the buy-queue line it
   actually produced, read off the instrument's own rows, so the
   demonstration and the screen on /shelf can never disagree. */
const ORIGIN_OF = {
  'Menu shortfall': 'The week’s menu is short of something. Planning offers the shortfall to the queue; it never adds it silently.',
  'Reserve gap': 'Days × licensed beds × the quantity per bed per day, against the last count. The gap files itself.',
  'Expiry Watch': 'A dated item is inside the window. Replace it, and the request carries the expiry origin.',
  'Par breach': 'A shelf fell below the par a person set. The count that found it is the thing that filed it.',
  'Diet tag': 'A resident’s tag needs something the house does not stock. The tag is a label, never a name.',
};

/* the closed vocabularies the product matches on, each stated in the
   specification. A match is exact rather than textual because both sides
   draw on one list — which is the whole reason these numbers are fixed. */
const VOCAB = [
  ['401', 'catalogue items', 'seeded before you add a single one of your own'],
  ['20 / 19 / 9', 'categories, aisles, zones', 'three different physical sequences, never merged'],
  ['18', 'diet tags', 'IDDSI-0 through IDDSI-7 among them'],
  ['9', 'standard allergens', 'checked on cook, and on the menu'],
  ['5', 'request origins', 'and no sixth'],
  ['6', 'roles', 'one of whom has no account at all'],
];

export function featuresPage(cfg, p) {
  const loop = find('loop');
  const depth = find('depth');
  const boundary = find('boundary');
  const roles = find('roles');
  const next = boundary.cols.find((c) => c.kind === 'next');
  const BUY = SURFACES.careshop.screens.find((x) => x.key === 'buy');
  const never = boundary.cols.find((c) => c.kind === 'never');

  const inner = `${pageHead('The aisles', 'Everything CareShop does.', `${loop.nodes.length} stations on one loop, the rule layer beside them, and the list of what this product refuses. It is live today in real houses.`)}
${directory([['stations', 'The loop', '7 stations'], ['rules', 'The rule layer', '6 topics'], ['seats', 'Who uses it', '6 people'], ['test', 'The boundary test', '4 answers'], ['origins', 'The five origins', 'no sixth'], ['vocab', 'The closed lists', '6 counts'], ['elsewhere', 'Next door, and never', '12 refusals']], { title: 'On this page' })}
${sec('stations', 'fst-s', `<div class="wrap">
  <div class="head">${sticker('box', 'The loop')}${h2('stations', loop.heading, loop.sub)}</div>
  <ol class="fst">${loop.nodes.map((n, i) => `<li class="fst-i"><span class="fst-n">${String(i + 1).padStart(2, '0')}</span><div><b>${esc(n.label)}</b><span>${esc(n.note)}</span></div></li>`).join('')}</ol>
  <a class="more" href="/loop">${ic('box', 16)}<span>Walk the loop, station by station</span>${ic('arrow', 16)}</a>
</div>`, { label: 'The stations' })}
${fold(sec('rules', 'frl-s', `<div class="wrap">
  <div class="head">${sticker('label', 'The rule layer')}${h2('rules', depth.heading, depth.sub)}</div>
  <div class="ftab-w" data-scrollx><table class="ftab">
    <thead><tr>${depth.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${depth.rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td><td class="is-mono">${esc(r[2])}</td></tr>`).join('')}</tbody>
  </table></div>
  <a class="more" href="/rules">${ic('label', 16)}<span>The ten citations, and how sure we are about each</span>${ic('arrow', 16)}</a>
</div>`, { label: 'The rule layer' }), 'Eight purchasing rules, and the twelve refusals beside them.')}
${sec('seats', 'fse-s', `<div class="wrap">
  <div class="head">${sticker('tag', 'Who uses it')}${h2('seats', roles.heading, 'Six people, and the device each one holds.')}</div>
  <ul class="fseat">${roles.rows.map((r) => `<li class="fseat-i"><b>${esc(r[0])}</b><span class="fseat-w">${esc(r[1])}</span><span class="fseat-d">${ic('tag', 14)}${esc(r[3])}</span></li>`).join('')}</ul>
</div>`)}
${fold(sec('elsewhere', 'fel-s', `<div class="wrap fel-g">
  <div>
    <div class="head">${h2('elsewhere', 'Next door, not here.', 'The kitchen is one room of four. These belong to a sibling, and the ladder moves your data there without re-typing.')}</div>
    <ul class="mv-l">${next.items.map(([t]) => `<li><div><b>${esc(t)}</b></div></li>`).join('')}</ul>
  </div>
  <div>
    <div class="head">${h2('never', 'Refused on principle.', 'Each one with the reason given for it. The same list prints on the front page.')}</div>
    <ol class="ref-l">${never.items.map(([t], i) => `<li><span class="ref-n">${String(i + 1).padStart(2, '0')}</span><div><b>${esc(t)}</b></div></li>`).join('')}</ol>
  </div>
</div>`), 'What the loop does not do.')}
${sec('test', 'test-s', `<div class="wrap">
  <div class="head">${sticker('scale', 'The boundary test')}${h2('test', boundary.strip.cells[0], 'The question is in Settings, in the product. Three of the four answers send you next door, and that is the point: a room with walls is a room you can finish.')}</div>
  <ul class="own">${OWNERS.map(([q, who, a]) => `<li class="own-i${who === 'careshop' ? ' is-here' : ''}"><span class="own-q">${esc(q)}</span><span class="own-w">${who === 'careshop' ? `${ic('check', 18)}<b>${esc(byId[who].name)}</b>` : `${ic('arrow', 18)}<b>Not here</b>`}</span><span class="own-a">${esc(a)}</span></li>`).join('')}</ul>
  <p class="demo-f">${esc(boundary.strip.foot)}</p>
</div>`)}
${sec('origins', 'origins-s', `<div class="wrap">
  <div class="head">${sticker('cart', 'Five, and no sixth')}${h2('origins', 'Every buy request says where it came from.', 'Without the origin the queue is a list; with it, the queue is diagnosable. Open one and see the line it actually produced on the buy queue screen.')}</div>
  <div class="orig" data-origins>${BUY.rows.slice(0, 5).map((r, i) => {
    const o = r.origin.split(' · ')[0];
    return `<details class="orig-d" name="careshop-origin"${i === 0 ? ' open' : ''}>
      <summary><span class="orig-n">${String(i + 1).padStart(2, '0')}</span><b>${esc(o)}</b><span class="orig-s">${esc((ORIGIN_OF[o] || '').split('.')[0])}</span>${ic('down', 14)}</summary>
      <div class="orig-b">
        <p>${esc(ORIGIN_OF[o] || '')}</p>
        <div class="orig-row"><span class="orig-rt"><b>${esc(r.item)}</b><span>${esc(r.origin)} · asked by ${esc(r.asked)}</span></span>${chip(r.state, r.stage)}<span class="orig-rp">${esc(r.store)}</span></div>
      </div>
    </details>`;
  }).join('')}</div>
  <p class="demo-f">Each request carries exactly one origin, and it is preserved through approval, the shop and the receipt. Anything unticked at the till returns to the queue as still needed, with its origin intact.</p>
</div>`)}
${sec('vocab', 'vocab-s', `<div class="wrap">
  <div class="head">${sticker('book', 'Counted, not rounded')}${h2('vocab', 'The closed lists it matches on.', 'An allergen check is exact rather than textual, because the resident’s tag and the catalogue item draw on one vocabulary. These are the sizes of those lists — every one of them stated in the specification this page is built from.')}</div>
  <ul class="vocab">${VOCAB.map(([n, l, d]) => `<li><span class="vocab-n">${esc(n)}</span><b>${esc(l)}</b><span>${esc(d)}</span></li>`).join('')}</ul>
  <p class="demo-f">Nothing on this page is a projection or a customer count. They are the sizes of lists inside the product, and a house can open the catalogue on day one and count them.</p>
</div>`)}
${sec('fjoin', 'fjoin-s', `<div class="wrap">
  <div class="head">${sticker('clock', 'Live today')}${h2('fjoin', 'It is running in real houses.', 'Start free with one house, three people, five hundred items. No card to begin.')}</div>
  <div class="ctas"><a class="btn pri lg" href="${esc(cfg.cta.primaryHref)}" data-cta="features">${esc(cfg.cta.primary)}${ic('arrow', 18)}</a><a class="btn lg" href="/pricing">${ic('tag', 18)}What it costs</a></div>
</div>`)}`;
  return page(cfg, p, 'features', inner);
}
