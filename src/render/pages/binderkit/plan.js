// /plan — the planner as a whole chapter: question zero to reset, with the
// reasoning at every step and the three guardrails.

import { iosShell } from '../../instruments.js';
import { header, footer, section, title, sheet, planner, citesBlock, number, find, esc, ic } from './chrome.js';

const SECS = number('BK-PL', [
  { id: 'top', label: 'Five answers in. A shelf of binders out.', tab: '' },
  { id: 'answers', label: 'The answers, and the plan', tab: 'Answers' },
  { id: 'steps', label: 'From question zero to reset', tab: 'Steps' },
  { id: 'guardrails', label: 'The three guardrails', tab: 'Guardrails' },
  { id: 'artefacts', label: 'What prints', tab: 'Prints' },
]);
const [TOP, ANSWERS, STEPS, GUARDRAILS, ARTS] = SECS;

const ARTEFACTS = [
  ['The contents page', 'One page per binder. The item, the authority beside it, the evidence tag, the control number in the footer.'],
  ['Tab dividers', 'Numbered and labelled for common divider stock, in the order the plan gives them.'],
  ['The brief', 'One page: why this binder exists, what goes in it, and what does not.'],
  ['The procedure', 'How the binder is kept, step by step, as a standard operating procedure rather than a policy.'],
];

function render(cfg, p) {
  const loop = find('loop');
  const screen = find('screen');
  return `<a class="skip" href="#main">Skip to content</a>
${header(cfg, p, { page: 'plan', tabs: SECS.filter((s) => s.tab) })}
<main id="main" class="page face canvas" data-product="binderkit" data-mode="light" data-printing="sheet">
${title(TOP, { eyebrow: 'Chapter · The plan', h1: loop.heading, lede: loop.sub, ctas: `<a class="btn pri lg" href="#answers">${ic('question', 18)}<span>Answer the five</span></a><a class="btn lg" href="/#join" data-cta="plan">${esc(cfg.cta.primary)}</a>` })}
${section(ANSWERS, `<h2 id="h-answers">The answers, and the plan they make.</h2><p class="sub">${esc(loop.pull)}</p>
  <div class="plan-g print-zone">
    ${planner({ cls: 'is-page' })}
    <div class="plan-sheet"><span class="strip-l">The resident binder’s contents page, as it would print</span>${sheet({ cls: 'is-page', print: true })}<div class="sheet-acts"><button class="btn sm" type="button" data-lens data-ruler>${ic('ruler', 18)}<span>Hold it at true size</span></button><button class="btn sm" type="button" data-print>${ic('print', 18)}<span>Print it</span></button><button class="sheet-tap is-inline" type="button" data-lens>${ic('zoom', 18)}<span>Magnify</span></button></div></div>
  </div>
  ${citesBlock()}`)}
${section(STEPS, `<h2 id="h-steps">From question zero to reset.</h2><p class="sub">Seven steps, each one a decision rather than a form. The quote at the fifth is the editor refusing in plain words.</p>
  <ol class="steps">${loop.nodes.map((n, i) => `<li class="step ${n.accent ? 'is-marked' : ''}"><span class="step-n">${String(i).padStart(2, '0')}</span><div><h3>${esc(n.label)}</h3><p>${esc(n.note)}</p>${i === loop.quote.at ? `<p class="refusal">“${esc(loop.quote.text)}”</p>` : ''}</div></li>`).join('')}</ol>
  <p class="closing">${esc(loop.closing)}</p>`)}
${section(GUARDRAILS, `<h2 id="h-guardrails">Three guardrails, and what a refusal owes you.</h2>
  <ol class="gates">${loop.gates.map((g) => { const [t, ...rest] = g.split(' — '); return `<li><b>${esc(t)}</b><span>${esc(rest.join(' — '))}</span></li>`; }).join('')}</ol>
  <p class="closing">${esc(loop.gateNote)}</p>
  <p class="cap">The guarded editor, at true size, is on the front page: <a href="/#editor">The editor</a>.</p>`)}
${section(ARTS, `<h2 id="h-artefacts">Four things print.</h2><p class="sub">${esc(screen.strip.foot)}</p>
  <div class="art-g">${ARTEFACTS.map(([t, d], i) => `<div class="art"><span class="art-n">${i + 1}</span><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div>
  <div class="phone-g">
    <div class="phone-w" data-scrollx><div class="phone-z">${iosShell('binderkit', { key: 'print', present: 'none' })}</div></div>
    <div class="phone-t"><span class="strip-l">On a phone</span><p>Each artefact is generated as a PDF inside the product and then downloaded or shared — never handed to the browser’s print dialog. On a phone it goes to the share sheet, so it can reach a printer, a laptop or a print shop.</p><p class="cap">Every print writes a row — version, control number, artefact, who and when — and the file is kept, so any past control number reproduces the identical sheet.</p></div>
  </div>`)}
</main>
${footer(cfg, p, { page: 'plan', tabs: SECS })}`;
}

export const planPage = { path: 'plan', title: 'The plan', description: 'A licence track and five answers go in; a shelf of binders comes out, with the reasoning beside each one. Deterministic, guarded, versioned.', render };
