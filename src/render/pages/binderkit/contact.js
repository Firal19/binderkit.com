// /contact — write to a person.

import { contact, CONTACT, social, hello, mailto } from '../../shared.js';
import { header, footer, section, title, number, esc, ic } from './chrome.js';

const SECS = number('BK-CT', [
  { id: 'top', label: 'Write to a person', tab: '' },
  { id: 'write', label: 'The message', tab: 'Write' },
  { id: 'elsewhere', label: 'Elsewhere', tab: 'Elsewhere' },
]);
const [TOP, WRITE, ELSE] = SECS;
const TOPICS = ['Question', 'Early access', 'Which track?', 'Pricing', 'Press', 'Something else'];

function render(cfg, p) {
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'contact', tabs: SECS.filter((x) => x.tab) })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light">
${title(TOP, { eyebrow: 'Chapter · Contact', h1: CONTACT.heading, lede: CONTACT.sub, ctas: `<a class="btn pri lg" href="#write">${ic('pen', 18)}<span>Write the message</span></a><a class="btn lg" href="${mailto(cfg)}">${ic('mail', 18)}<span>${esc(hello(cfg))}</span></a>` })}
${section(WRITE, `<h2 id="h-write">The message.</h2><p class="sub">Tell us the facility code, not the resident’s name. There is nothing about a person here, and nothing you send should change that.</p>
  <div class="join-f is-contact">${contact(cfg, p, { topics: TOPICS, placeholder: 'What would you like to know? A facility code is enough to find your plan; a resident’s name is never needed.' })}</div>
  <p class="fine">${esc(CONTACT.fine)}</p>`)}
${section(ELSE, `<h2 id="h-elsewhere">Elsewhere.</h2><p class="sub">The same address on every platform, drawn as stamps. Every one links to the profile under this handle.</p>
  <div class="stamps-row"><a class="stamp" href="${mailto(cfg)}">${ic('mail', 18)}<span>${esc(hello(cfg))}</span></a><button class="stamp" type="button" data-copy="${esc(hello(cfg))}" data-copied="Address copied">${ic('copy', 18)}<span>Copy the address</span></button></div>
  ${social(p.id, { text: true, size: 16, cls: 'stamps is-text', label: 'Binderkit elsewhere' })}`)}
</main>
${footer(cfg, p, { page: 'contact', tabs: SECS })}`;
}

export const contactPage = { path: 'contact', title: 'Contact', description: 'Write to a person: one inbox, answered from the same address. Tell us the facility code, never a resident’s name.', render };
