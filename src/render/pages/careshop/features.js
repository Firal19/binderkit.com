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
import { page, pageHead, sticker, chip } from './parts.js';

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

export function featuresPage(cfg, p) {
  const loop = find('loop');
  const depth = find('depth');
  const boundary = find('boundary');
  const roles = find('roles');
  const next = boundary.cols.find((c) => c.kind === 'next');
  const never = boundary.cols.find((c) => c.kind === 'never');

  const inner = `${pageHead('The aisles', 'Everything CareShop does.', `${loop.nodes.length} stations on one loop, the rule layer beside them, and the list of what this product refuses. It is live today in real houses.`)}
${sec('stations', 'fst-s', `<div class="wrap">
  <div class="head">${sticker('box', 'The loop')}${h2('stations', loop.heading, loop.sub)}</div>
  <ol class="fst">${loop.nodes.map((n, i) => `<li class="fst-i"><span class="fst-n">${String(i + 1).padStart(2, '0')}</span><div><b>${esc(n.label)}</b><span>${esc(n.note)}</span></div></li>`).join('')}</ol>
  <p class="more"><a href="/loop">${ic('box', 16)}<span>Walk the loop, station by station</span>${ic('arrow', 16)}</a></p>
</div>`, { label: 'The stations' })}
${sec('rules', 'frl-s', `<div class="wrap">
  <div class="head">${sticker('label', 'The rule layer')}${h2('rules', depth.heading, depth.sub)}</div>
  <div class="ftab-w" data-scrollx><table class="ftab">
    <thead><tr>${depth.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${depth.rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td><td class="is-mono">${esc(r[2])}</td></tr>`).join('')}</tbody>
  </table></div>
  <p class="more"><a href="/rules">${ic('label', 16)}<span>The ten citations, and how sure we are about each</span>${ic('arrow', 16)}</a></p>
</div>`, { label: 'The rule layer' })}
${sec('seats', 'fse-s', `<div class="wrap">
  <div class="head">${sticker('tag', 'Who uses it')}${h2('seats', roles.heading, 'Six people, and the device each one holds.')}</div>
  <ul class="fseat">${roles.rows.map((r) => `<li class="fseat-i"><b>${esc(r[0])}</b><span class="fseat-w">${esc(r[1])}</span><span class="fseat-d">${ic('tag', 14)}${esc(r[3])}</span></li>`).join('')}</ul>
</div>`)}
${sec('elsewhere', 'fel-s', `<div class="wrap fel-g">
  <div>
    <div class="head">${h2('elsewhere', 'Next door, not here.', 'The kitchen is one room of four. These belong to a sibling, and the ladder moves your data there without re-typing.')}</div>
    <ul class="mv-l">${next.items.map(([t, who]) => `<li><div><b>${esc(t)}</b>${who ? `<span>${esc(who)}</span>` : ''}</div></li>`).join('')}</ul>
  </div>
  <div>
    <div class="head">${h2('never', 'Refused on principle.', 'Each one with the reason given for it. The same list prints on the front page.')}</div>
    <ol class="ref-l">${never.items.map(([t], i) => `<li><span class="ref-n">${String(i + 1).padStart(2, '0')}</span><div><b>${esc(t)}</b></div></li>`).join('')}</ol>
  </div>
</div>`)}
${sec('fjoin', 'fjoin-s', `<div class="wrap">
  <div class="head">${sticker('clock', 'Live today')}${h2('fjoin', 'It is running in real houses.', 'Start free with one house, three people, five hundred items. No card to begin.')}</div>
  <div class="ctas"><a class="btn pri lg" href="${esc(cfg.cta.primaryHref)}" data-cta="features">${esc(cfg.cta.primary)}${ic('arrow', 18)}</a><a class="btn lg" href="/pricing">${ic('tag', 18)}What it costs</a></div>
</div>`)}`;
  return page(cfg, p, 'features', inner);
}
