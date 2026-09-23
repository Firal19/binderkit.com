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
    <div class="head"><span class="eyebrow">Privacy</span><h1 id="h-priv">What ${esc(p.name)} holds, and what leaves it.</h1><p class="sub">In plain words. If this page and a screen in the product disagree, the screen is the bug.</p></div>

    <div class="pv-g">${cfg.privacy.holds.map(([label, text]) => `<div class="pv-c"><span class="strip-l">${esc(label)}</span><p>${esc(text)}</p></div>`).join('')}</div>

    <h3>Where it lives</h3>
    ${P('Records are held in Convex, in the United States, under a business associate agreement. Stripe takes payment and holds the card; we never see a number. Email goes through Resend. Those three are the only processors.')}
    ${P(cfg.privacy.baa
    ? 'Because it holds protected health information, you accept a customer business associate agreement at signup, presented in full.'
    : 'It holds no protected health information, so there is no customer business associate agreement to sign.')}

    <h3>What leaves the product</h3>
    <p>Channel by channel.</p>
    <dl class="pv-dl">${egress.map((b) => `<dt>${esc(b.label.replace(/^What (an |a |is )?/i, '').replace(/^\w/, (c) => c.toUpperCase()))}</dt><dd>${esc([b.quote ? `“${b.quote}” ` : '', b.text || ''].join('').trim())}</dd>`).join('')}
      <dt>Logs</dt><dd>The Convex dashboard only. No third-party log destination.</dd>
      <dt>URLs</dt><dd>Opaque short-codes. A link cannot be read for a name.</dd>
    </dl>

    <h3>This website</h3>
    ${P(primary.startsWith('/#') || primary === '#join'
    ? 'If you join the early-access list, this site keeps the email you typed, a phone number if you gave one, the licence track and house count you picked, and the time you sent it. No analytics script, no advertising pixel, no third-party tag. We write once, when the product opens. Reply and we delete the row.'
    : 'This page loads no analytics script, no advertising pixel and no third-party tag. Signing up takes you to the application, which presents its own terms and privacy notice.')}

    <h3 id="cookies">Cookies, and what is kept on your device</h3>
    ${P('Nothing is kept until you answer the cookie question, except the display choices you made in the header. Saying no keeps nothing but the no.')}
    <dl class="pv-dl">
      <dt>pho-consent</dt><dd>Your answer, as the word <code>all</code> or <code>min</code>. It lasts a year so you are not asked on every visit.</dd>
      <dt>pho-mode</dt><dd>Your dark-mode choice, and where offered your text-size choice as <code>pho-text</code>, in this browser’s local storage. Never sent to a server.</dd>
      <dt>pho-draft</dt><dd><b>Only if you said yes.</b> What you typed into a form and have not sent, so a refresh does not lose it. Deleted the moment the message sends.</dd>
    </dl>
    ${P('None of it identifies you to us or follows you anywhere. Clear this browser’s site data and you are simply asked again.')}

    <h3>Your rights</h3>
    ${P('Export everything the product holds for your organisation at any time, and after a cancellation. Ask us to delete a record and we delete it; the audit log of who did what is kept, because a record that can be quietly removed is not an audit log.')}
    ${P('The Terms of Service and, where one applies, the customer business associate agreement are presented at signup and kept in your account. This page summarises; it does not replace them.')}

    <p class="fine">${esc(cfg.legalLine)}</p>
    <div class="ctas"><a class="btn pri" href="/">Back to ${esc(p.name)}</a></div>
  </div></section>
</main>
${footer}`;
}

export default privacyPage;
