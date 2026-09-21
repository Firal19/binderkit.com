// The privacy page. Every line below is a fact about what this product is
// built to hold, read from the same data the landing page's record section
// is drawn from. Where a document has to be signed rather than described,
// the page says so and stops.

import { productOf, mark, esc } from '../kit.js';
import { PAGES } from '../data/page.js';
import { byline } from './shared.js';

const P = (t) => `<p>${esc(t)}</p>`;

export function privacyPage(cfg, chrome = {}) {
  const p = productOf(cfg.product);
  const spec = PAGES[p.id];
  const record = spec.sections.find((s) => s.key === 'evidence');
  const egress = ((record && record.blocks) || []).filter((b) => /^What an email|^What a push|^Analytics|^What is public|^The rest|^Printing/.test(b.label));
  const primary = cfg.cta.primaryHref || '/#join';

  const header = chrome.header
    ? chrome.header(cfg, p, { page: 'privacy', title: 'Privacy' })
    : `<header class="nav" id="top-bar"><div class="wrap nav-in">
    <a class="brand" href="/" aria-label="${esc(p.name)} — home">${mark(p.id, 28, { label: false })}<span class="brand-n">${esc(p.name)}</span></a>
    <div class="nav-r" style="margin-left:auto"><a class="btn sm" href="/">Back to ${esc(p.name)}</a></div>
  </div></header>`;
  const footer = chrome.footer
    ? chrome.footer(cfg, p, { page: 'privacy' })
    : `<footer class="foot"><div class="wrap foot-b">${byline()}<p class="foot-fine">${esc(cfg.legalLine)}</p></div></footer>`;

  return `<a class="skip" href="#main">Skip to content</a>
${header}
<main class="page face canvas pv" id="main" data-product="${p.id}" data-mode="light">
  <section class="sec" id="privacy" aria-labelledby="h-priv"><div class="wrap pv-w">
    <div class="head"><span class="eyebrow">Privacy</span><h1 id="h-priv">What ${esc(p.name)} holds, and what leaves it.</h1><p class="sub">Written in the same words as the product. If a sentence here and a screen in the application disagree, the screen is the bug.</p></div>

    <div class="pv-g">${cfg.privacy.holds.map(([label, text]) => `<div class="pv-c"><span class="strip-l">${esc(label)}</span><p>${esc(text)}</p></div>`).join('')}</div>

    <h3>Where it lives</h3>
    ${P('Records are held in Convex, in the United States, under an executed business associate agreement. Payment is taken by Stripe, and Stripe holds the card — we never see a card number. Transactional email is sent through Resend. Those three, and nothing else, are the processors this product depends on.')}
    ${P(cfg.privacy.baa
    ? 'Because this product holds protected health information, you accept a Customer business associate agreement at signup, before the trial starts. It is part of the signup and it is presented in full, not linked from a checkbox.'
    : 'This product holds no protected health information, so there is no Customer business associate agreement to sign — which is why its signup is five steps rather than six. There is nothing here to protect that would need one.')}

    <h3>What leaves the product</h3>
    <p>Egress is the part of a privacy notice that usually goes unwritten. Here it is, channel by channel.</p>
    <dl class="pv-dl">${egress.map((b) => `<dt>${esc(b.label.replace(/^What (an |a |is )?/i, '').replace(/^\w/, (c) => c.toUpperCase()))}</dt><dd>${esc([b.quote ? `“${b.quote}” ` : '', b.text || ''].join('').trim())}</dd>`).join('')}
      <dt>Logs</dt><dd>The Convex dashboard only. No third-party log destination.</dd>
      <dt>URLs</dt><dd>Opaque short-codes. A link cannot be read for a name.</dd>
    </dl>

    <h3>This website</h3>
    ${P(primary.startsWith('/#') || primary === '#join'
    ? 'If you join the early-access list, this site stores the email address you typed, a phone number if you gave one, the licence track and the house count you picked, the product you were reading about, and the time you sent it. There is no analytics script, no advertising pixel and no third-party tag on this page. We write to you once, when the product opens. Reply to that message and we delete the row.'
    : 'This page loads no analytics script, no advertising pixel and no third-party tag. Signing up takes you to the application, whose own terms and privacy notice are presented there in full.')}

    <h3 id="cookies">Cookies, and what is kept on your device</h3>
    ${P('Before you answer, one thing can be kept: the theme or text size you picked, if you changed either. Everything else below waits for a yes, and saying no keeps nothing but the no.')}
    <dl class="pv-dl">
      <dt>pho-consent</dt><dd>A cookie holding your answer to that question and nothing else &mdash; the word <code>all</code> or the word <code>min</code>. It lasts a year so you are not asked on every visit, and it is set whichever way you answer, because a site that forgot your refusal would have to ask again.</dd>
      <dt>pho-mode &middot; pho-text</dt><dd>Your dark-mode and text-size choices, kept in this browser's local storage so the page opens the way you left it. Not cookies, and never sent to a server.</dd>
      <dt>pho-draft</dt><dd><b>Only if you said yes.</b> A copy of whatever you have typed into a form and not yet sent, so a refresh or a wrong tap does not lose it. It stays in this browser, is never sent anywhere on its own, and is deleted the moment the message sends. Say no and it is never written.</dd>
    </dl>
    ${P('None of it identifies you to us, follows you to another site, or is shared with anyone. Clearing this browser’s site data removes all of it, and you are simply asked again.')}

    <h3>Your rights</h3>
    ${P('You can export everything the product holds for your organisation, at any time, from inside the product — and after a cancellation you can still sign in to export before anything is purged. Ask us to delete a record and we delete it; the audit log of who did what is retained, because a record that can be quietly removed is not an audit log.')}
    ${P('The full Terms of Service and, where one applies, the Customer business associate agreement are presented at signup, in full, and a copy is kept in your account. This page summarises what the product does; it does not replace those documents.')}

    <p class="fine">${esc(cfg.legalLine)}</p>
    <div class="ctas"><a class="btn pri" href="/">Back to ${esc(p.name)}</a></div>
  </div></section>
</main>
${footer}`;
}

export default privacyPage;
