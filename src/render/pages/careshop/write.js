// /write — the contact page: the shared form, with CareShop's topics.

import { esc, sec, h2, contact, CONTACT, social, hello, mailto } from '../../shared.js';
import { ic } from '../../icons/careshop.js';
import { page, pageHead, sticker } from './parts.js';

export const TOPICS = ['Question', 'A house wants to switch', 'Pricing', 'Security and privacy', 'Press', 'Something else'];

export function writePage(cfg, p) {
  const inner = `${pageHead('The till', CONTACT.heading, CONTACT.sub)}
${sec('form', 'write-s', `<div class="wrap write-g">
  <div class="write-f">${contact(cfg, p, { topics: TOPICS, placeholder: 'Which house, which shelf, what happened — as much or as little as you like.', button: 'Send it', done: 'Sent. A receipt is on its way to you, and a person will answer from the same inbox.' })}</div>
  <aside class="write-a">
    <div class="expect">
      <p class="expect-h">What to expect</p>
      <dl class="expect-l">
        <div><dt>Write to</dt><dd>${esc(hello(cfg))}</dd></div>
        <div><dt>Read by</dt><dd>A person</dd></div>
        <div><dt>Ticket number</dt><dd>None</dd></div>
        <div><dt>Newsletter</dt><dd>None</dd></div>
      </dl>
      <p class="expect-f">${esc(CONTACT.fine)}</p>
    </div>
    <div class="write-alt">
      ${sticker('mail', 'Or write straight to')}
      <a class="rc-addr" href="${mailto(cfg)}">${ic('mail', 18)}${esc(hello(cfg))}</a>
      <button type="button" class="rc-b" data-copy="${esc(hello(cfg))}" data-copied="Address copied">${ic('copy', 16)}Copy the address</button>
      <p class="fine">Locked out at the shelf, or a count that is wrong — write here too, and say which house and which shelf.</p>
    </div>
  </aside>
</div>`)}
${sec('stickers', 'stickers-s', `<div class="wrap">
  <div class="head">${sticker('tag', 'Stickers')}${h2('stickers', 'Where else to find us.', 'The same people, the same handle, eight places. Peel one.')}</div>
  ${social(p.id, { cls: 'rc-soc is-big', size: 22, text: true, label: 'CareShop on social, with handles' })}
</div>`)}`;
  return page(cfg, p, 'write', inner);
}
