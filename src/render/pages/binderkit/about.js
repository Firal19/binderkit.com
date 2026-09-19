// /about — the family, the three siblings, and why Binderkit ships first.

import { byline } from '../../shared.js';
import { PRODUCTS } from '../../../data/brand.js';
import { SIGNUP_FIVE } from '../../../data/page.js';
import { header, footer, section, title, number, find, esc, ic } from './chrome.js';

const SECS = number('BK-AB', [
  { id: 'top', label: 'One house. Four rooms. One ladder.', tab: '' },
  { id: 'family', label: 'The four rooms', tab: 'Family' },
  { id: 'first', label: 'Why Binderkit ships first', tab: 'First' },
  { id: 'ladder', label: 'The ladder', tab: 'Ladder' },
  { id: 'maker', label: 'Who makes it', tab: 'Maker' },
]);
const [TOP, FAMILY, FIRST, LADDER, MAKER] = SECS;

function render(cfg, p) {
  const pho = PRODUCTS.find((x) => x.id === 'pho');
  const minis = PRODUCTS.filter((x) => x.kind === 'mini');
  const next = find('boundary').cols[0].items;
  const ladder = find('ladder');
  const noBaa = find('evidence').blocks.find((b) => b.label === 'No business associate agreement');
  const hero = find('hero');
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'about', tabs: SECS.filter((x) => x.tab) })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light">
${title(TOP, { eyebrow: 'Chapter · About', h1: find('family').heading, lede: pho.lede, ctas: `<a class="btn pri lg" href="#family">${ic('house', 18)}<span>The four rooms</span></a><a class="btn lg" href="/contact">Write to a person</a>` })}
${section(FAMILY, `<h2 id="h-family">Four small, complete products, one house.</h2><p class="sub">${esc(pho.toneLine)} Each mini owns one domain and refuses the others; what belongs next door is sent next door.</p>
  <ol class="rooms">${minis.map((m) => `<li class="room ${m.id === p.id ? 'is-this' : ''}"><span class="room-n">${esc(m.owns)}</span><div><b>${esc(m.name)}</b><span>${esc(m.descriptor)}</span></div><span class="toc-l" aria-hidden="true"></span><span class="room-d"><code>${esc(m.domain)}</code>${m.id === p.id ? ' · this one' : ''}</span></li>`).join('')}</ol>
  <span class="strip-l">What Binderkit sends next door</span>
  <ol class="next">${next.map(([what, to, why]) => { const t = PRODUCTS.find((x) => x.id === to); return `<li><b>${esc(what)}</b><span>→ ${esc(t ? t.name : to)}</span><small>${esc(why)}</small></li>`; }).join('')}</ol>`)}
${section(FIRST, `<h2 id="h-first">Why Binderkit ships first.</h2><p class="sub">${esc(p.proof[0])}</p>
  <p class="closing">${esc(noBaa.text)}</p>
  <p class="closing">${esc(SIGNUP_FIVE.tail)}</p>
  <p class="fine">${esc(hero.fine)}</p>`)}
${section(LADDER, `<h2 id="h-ladder">${esc(ladder.heading)}</h2><p class="sub">${esc(ladder.footer)}</p>
  <ol class="toc is-ladder">${ladder.rows.map(([k, v]) => `<li><span class="toc-t">${esc(k)}</span><span class="toc-l" aria-hidden="true"></span><span class="toc-n is-text">${esc(v)}</span></li>`).join('')}</ol>
  <p class="boundary">${esc(ladder.pull)}</p>`)}
${section(MAKER, `<h2 id="h-maker">Who makes it.</h2><p class="sub">${esc(pho.name)} — ${esc(pho.descriptor.toLowerCase())}. ${esc(pho.proof[1])}</p>
  <div class="maker">${byline()}<p class="fine">${esc(cfg.legalLine)} Write to <a href="mailto:hello@${esc(cfg.domain)}">hello@${esc(cfg.domain)}</a>, or use <a href="/contact">the contact page</a>.</p></div>`)}
</main>
${footer(cfg, p, { page: 'about', tabs: SECS })}`;
}

export const aboutPage = { path: 'about', title: 'About', description: 'One house, four rooms, one ladder: the family Binderkit belongs to, its three siblings, and why the product that holds nothing about anyone ships first.', render };
