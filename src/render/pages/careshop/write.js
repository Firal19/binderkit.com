// /write — the contact page: the shared form, with CareShop's topics.

import { esc, sec, h2, contact, CONTACT, social, hello, mailto } from '../../shared.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker } from './parts.js';

export const TOPICS = ['Question', 'A house wants to switch', 'Pricing', 'Security and privacy', 'Press', 'Something else'];

export function writePage(cfg, p) {
  const inner = `${pageHead('The till', CONTACT.heading, CONTACT.sub)}
${sec('form', 'write-s', `<div class="wrap write-g">
  <div class="write-f">${contact(cfg, p, { topics: TOPICS, placeholder: 'Which house, which shelf, what happened — as much or as little as you like.', button: 'Send it', done: 'Sent. A receipt is on its way to you, and a person will answer from the same address.' })}</div>
  <aside class="write-a">
    <div class="rc rc-aside">
      <div class="rc-top"><b class="rc-store">WHAT TO EXPECT</b></div>
      <div class="rc-lines">
        <span class="rc-l"><span>READ BY</span><i aria-hidden="true"></i><b>A PERSON</b></span>
        <span class="rc-l"><span>ANSWERED FROM</span><i aria-hidden="true"></i><b>${esc(hello(cfg).toUpperCase())}</b></span>
        <span class="rc-l"><span>TICKET NUMBER</span><i aria-hidden="true"></i><b>NONE</b></span>
        <span class="rc-l"><span>NEWSLETTER</span><i aria-hidden="true"></i><b>NONE</b></span>
      </div>
      <div class="rc-tear" aria-hidden="true"></div>
      <p class="rc-thanks">${esc(CONTACT.fine.toUpperCase())}</p>
    </div>
    <div class="write-alt">
      ${sticker('mail', 'Or write straight to')}
      <a class="rc-addr" href="${mailto(cfg)}">${ic('mail', 18)}${esc(hello(cfg))}</a>
      <button type="button" class="rc-b" data-copy="${esc(hello(cfg))}" data-copied="Address copied">${ic('copy', 16)}Copy the address</button>
    </div>
  </aside>
</div>`)}
${sec('stickers', 'stickers-s', `<div class="wrap">
  <div class="head">${sticker('tag', 'Stickers')}${h2('stickers', 'Where else to find us.', 'The same people, the same handle, eight places. Peel one.')}</div>
  ${social(p.id, { cls: 'rc-soc is-big', size: 22, text: true, label: 'CareShop on social, with handles' })}
</div>`)}`;
  return page(cfg, p, 'write', inner);
}
