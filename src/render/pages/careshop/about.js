// /about — the live product line and the family it belongs to.

import { esc, sec, h2, mark, hello, mailto, byline } from '../../shared.js';
import { PAGES } from '../../../data/page.js';
import { MINIS, byId } from '../../../data/brand.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker } from './parts.js';

const spec = PAGES.careshop;
const find = (k) => spec.sections.find((s) => s.key === k);

export function aboutPage(cfg, p) {
  const fam = find('family');
  const ladder = find('ladder');
  const boundary = find('boundary');
  const next = boundary.cols.find((c) => c.kind === 'next');
  const pho = byId.pho;

  const inner = `${pageHead('About the store', 'The kitchen software for care homes.', `${p.proof[0]} ${p.lede}`)}
${sec('live', 'live', `<div class="wrap">
  <div class="head">${sticker('store', p.status)}${h2('live', 'What is true today.', p.toneLine)}</div>
  <ul class="proofs">${p.proof.map((t, i) => `<li>${ic(['store', 'book', 'person'][i], 20)}<p>${esc(t)}</p></li>`).join('')}</ul>
</div>`)}
${sec('family', 'family', `<div class="wrap">
  <div class="head">${sticker('house', fam.byline)}${h2('family', fam.heading, pho.lede)}</div>
  <div class="rooms">${MINIS.map((m) => `<a class="room ${m.id === p.id ? 'is-here' : ''}" href="https://${esc(m.domain)}" rel="noopener">
    <span class="room-mk">${mark(m.id, 40, { label: false })}</span>
    <span class="room-t"><b>${esc(m.name)}</b><span>${esc(m.descriptor)}</span></span>
    <span class="room-o">${esc(m.owns)}</span>
    <span class="room-s">${m.id === p.id ? ic('check', 14) + 'Live · you are here' : esc(m.status)}</span>
  </a>`).join('')}</div>
  <p class="st-p">${esc(pho.proof[2])}</p>
</div>`)}
${sec('nextdoor', 'nextdoor', `<div class="wrap aisle-g">
  <div class="aisle-d">${sticker('back', 'Next door')}${h2('nextdoor', boundary.heading, boundary.pull)}
    <ul class="next-l">${next.items.map(([t, id]) => `<li>${ic('x', 16)}<span>${esc(t)}</span><b>${esc(byId[id].name)}</b></li>`).join('')}${p.doesNot.slice(3).map((t) => `<li>${ic('x', 16)}<span>${esc(t)}</span></li>`).join('')}</ul>
  </div>
  <div class="aisle-ph"><div class="test"><span class="strip-l">${esc(boundary.strip.label)}</span><div class="test-c">${boundary.strip.cells.map((c, i) => `<span class="${i === 0 ? 'is-q' : ''}">${esc(c)}</span>`).join('')}</div><p>${esc(boundary.strip.foot)}</p></div></div>
</div>`)}
${sec('ladder', 'ladder-s', `<div class="wrap">
  <div class="head">${sticker('up', 'The ladder')}${h2('ladder', ladder.heading, ladder.sub)}</div>
  <div class="lad-map">${ladder.rows.map(([from, to]) => `<div class="lad-m"><span>${esc(from)}</span>${ic('arrow', 16)}<b>${esc(to)}</b></div>`).join('')}</div>
  <p class="demo-f">${esc(ladder.footer)}</p>
</div>`)}
${sec('who', 'who', `<div class="wrap who-in">
  ${sticker('person', 'Who makes this')}
  ${h2('who', 'Bareeda LLC, doing business as Providerhub Oregon.', `${pho.descriptor}. ${pho.lede}`)}
  <div class="who-r">${byline()}<a class="btn" href="https://providerhub.us" rel="noopener">${ic('store', 18)}providerhub.us</a><a class="btn" href="${mailto(cfg)}">${ic('mail', 18)}${esc(hello(cfg))}</a><a class="btn pri" href="/write">${ic('receipt', 18)}Write to a person</a></div>
</div>`)}`;
  return page(cfg, p, 'about', inner);
}
