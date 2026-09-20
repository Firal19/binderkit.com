// /about — the live product, and who makes it.

import { esc, sec, h2, hello, mailto, byline } from '../../shared.js';
import { byId } from '../../../data/brand.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker } from './parts.js';

export function aboutPage(cfg, p) {
  const pho = byId.pho;

  const inner = `${pageHead('About the store', 'The kitchen software for care homes.', `${p.proof[0]} ${p.lede}`)}
${sec('live', 'live', `<div class="wrap">
  <div class="head">${sticker('store', 'Live at careshop.app')}${h2('live', 'What is true today.', p.toneLine)}</div>
  <ul class="proofs">${p.proof.map((t, i) => `<li>${ic(['store', 'book', 'person'][i], 20)}<p>${esc(t)}</p></li>`).join('')}</ul>
</div>`)}
${sec('who', 'who', `<div class="wrap who-in">
  ${sticker('person', 'Who makes this')}
  ${h2('who', 'Made in Oregon.', `${pho.descriptor}. For Oregon houses.`)}
  <div class="who-r">${byline()}<a class="btn" href="https://providerhub.us" rel="noopener">${ic('store', 18)}providerhub.us</a><a class="btn" href="${mailto(cfg)}">${ic('mail', 18)}${esc(hello(cfg))}</a><a class="btn pri" href="/write">${ic('receipt', 18)}Write to a person</a></div>
</div>`)}`;
  return page(cfg, p, 'about', inner);
}
