// The privacy page. Not a template bought by the yard: every line below is a
// fact about what this product is built to hold, read from the same data the
// landing page's record section is drawn from. Where a document has to be
// signed rather than described, the page says so and stops.

import { productOf, mark, esc } from '../kit.js';
import { PAGES } from '../data/page.js';
import { icon } from './instruments.js';

const P = (t) => `<p>${esc(t)}</p>`;

export function privacyPage(cfg) {
  const p = productOf(cfg.product);
  const spec = PAGES[p.id];
  const record = spec.sections.find((s) => s.key === 'evidence');
  const egress = (record && record.blocks || []).filter((b) => /^What an email|^What a push|^Analytics|^What is public|^The rest|^Printing/.test(b.label));

  return `<header class="lp-top" id="top-bar">
  <div class="lp-nav">
    <a class="lp-brand" href="/" aria-label="${esc(p.name)} — home">${mark(p.id, 26, { label: false })}<span class="lp-brand-n">${esc(p.name)}</span></a>
    <div class="lp-nav-r"><a class="lp-btn sm" href="/">${esc(icon('back', 15))} Back to ${esc(p.name)}</a></div>
  </div>
</header>
<main class="lp face canvas" id="main" data-product="${p.id}" data-mode="light">
  <section class="lp-sec" id="privacy" aria-labelledby="h-priv">
    <div class="lp-head">
      <span class="lp-eyebrow">Privacy</span>
      <h2 id="h-priv">What ${esc(p.name)} holds, and what leaves it.</h2>
      <p class="lp-sub">Written in the same words as the product. If a sentence here and a screen in the application disagree, the screen is the bug.</p>
    </div>

    <div class="lp-ev">
      ${cfg.privacy.holds.map(([label, text]) => `<div class="lp-ev-b"><span class="lp-strip-l">${esc(label)}</span><p>${esc(text)}</p></div>`).join('')}
    </div>

    <div class="lp-note" style="margin-top:30px">
      <h3>Where it lives</h3>
      ${P('Records are held in Convex, in the United States, under an executed business associate agreement. Payment is taken by Stripe, and Stripe holds the card — we never see a card number. Transactional email is sent through Resend. Those three, and nothing else, are the processors this product depends on.')}
      ${P(cfg.privacy.baa
    ? 'Because this product holds protected health information, you accept a Customer business associate agreement at signup, before the trial starts. It is part of the six-step signup and it is presented in full, not linked from a checkbox.'
    : 'This product holds no protected health information, so there is no Customer business associate agreement to sign — which is why its signup is five steps rather than six. There is nothing here to protect that would need one.')}
    </div>

    <div class="lp-head" style="margin-top:56px">
      <h2>What leaves the product</h2>
      <p class="lp-sub">Egress is the part of a privacy notice that usually goes unwritten. Here it is, channel by channel.</p>
    </div>
    <div class="lp-defs">
      <dl>${egress.map((b) => `<dt>${esc(b.label.replace(/^What (an |a |is )?/i, '').replace(/^\w/, (c) => c.toUpperCase()))}</dt><dd>${esc([b.quote ? `“${b.quote}” ` : '', b.text || ''].join('').trim())}</dd>`).join('')}
      <dt>Logs</dt><dd>The Convex dashboard only. No third-party log destination.</dd>
      <dt>URLs</dt><dd>Opaque short-codes. A link cannot be read for a name.</dd>
      </dl>
    </div>

    <div class="lp-head" style="margin-top:56px">
      <h2>The waitlist on this site</h2>
    </div>
    <div class="lp-note">
      ${P('If you join the early-access list, this site stores the email address you typed, the licence track and the house count you picked, the product you were reading about, and the time you sent it. Nothing else — there is no analytics script, no advertising pixel, no third-party tag and no cookie on this page.')}
      ${P('We write to you once, when the product opens. Reply to that message and we delete the row; there is nothing else to unsubscribe from, because there is nothing else to send.')}
    </div>

    <div class="lp-head" style="margin-top:56px">
      <h2>Your rights</h2>
    </div>
    <div class="lp-note">
      ${P('You can export everything the product holds for your organisation, at any time, from inside the product — and after a cancellation you can still sign in to export before anything is purged. Ask us to delete a record and we delete it; the audit log of who did what is retained, because a record that can be quietly removed is not an audit log.')}
      ${P('The full Terms of Service and Customer business associate agreement are presented at signup, in full, and a copy is kept in your account. This page summarises what the product does; it is not a substitute for those documents and it does not replace them.')}
    </div>

    <p class="lp-cap" style="margin-top:40px">${esc(cfg.legalLine)} Questions about this page: use the early-access form on the front page and say so — it reaches the same inbox.</p>
    <div class="lp-ctas" style="margin-top:22px"><a class="lp-btn pri" href="/">Back to ${esc(p.name)}</a></div>
  </section>
</main>`;
}

export default privacyPage;
