// /about — Binderkit, and who makes it.

import { byline, hello, mailto } from '../../shared.js';
import { SIGNUP_FIVE } from '../../../data/page.js';
import { header, footer, section, title, BOOK, atChapter, onThisPage, find, esc, ic } from './chrome.js';

const SECS = BOOK['/about'];
const [TOP, FIRST, MAKER] = SECS;

function render(cfg, p) {
  atChapter('/about');
  const noBaa = find('evidence').blocks.find((b) => b.label === 'No customer agreement');
  const hero = find('hero');
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'about', tabs: SECS.filter((x) => x.tab) })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light">
${title(TOP, { eyebrow: 'Chapter · About', h1: 'Binder setup for Oregon care homes.', lede: p.lede, ctas: `<a class="btn pri lg" href="/#join">${ic('page', 18)}<span>Get early access</span></a><a class="btn lg" href="/contact">Write to a person</a>`, index: onThisPage(SECS) })}
${section(FIRST, `<h2 id="h-first">It holds nothing about anyone.</h2><p class="sub">${esc(p.proof[0])}</p>
  <p class="closing">${esc(noBaa.text)} ${esc(SIGNUP_FIVE.tail)}</p>
  <p class="fine">${esc(hero.fine)}</p>`)}
${section(MAKER, `<h2 id="h-maker">Who makes it.</h2><p class="sub">Made in Oregon, for Oregon care homes, by people who have stood in front of a surveyor with a binder.</p>
  <div class="maker">${byline()}<p class="fine">${esc(cfg.legalLine)} Write to <a href="${mailto(cfg, 'About Binderkit')}">${esc(hello(cfg))}</a>, or use <a href="/contact">the contact page</a>.</p></div>`)}
</main>
${footer(cfg, p, { page: 'about', tabs: SECS })}`;
}

export const aboutPage = { path: 'about', title: 'About', description: 'Binderkit plans and prints binders for Oregon care homes. It holds nothing about any person. Made in Oregon.', render };
