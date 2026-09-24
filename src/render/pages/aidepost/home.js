// aidepost.com — the front page. The light half, then the page turns over.

import { esc, sec, fold, h2, eyebrow, faq, iosShell, ic, EVERY_PLAN, find, S, STEPS, NEVER, shell, boardTable, doors, rosterToy, credLife, timesheetToy, clockToy, distanceToy, fitQuiz, walletCards, flipRoles, tierBlock, annotatedBoard, joinBlock, ixNav } from './bits.js';
import { reach } from '../../shared.js';

function hero(cfg, p) {
  return `<section class="hero" id="top" aria-labelledby="h1">
    <div class="wrap">
      <div class="hero-g">
      <div class="hero-t">
        ${eyebrow('Open shifts and jobs in Oregon care homes')}
        <h1 id="h1">${esc(p.headline.text)}</h1>
        <p class="hero-live" data-live aria-live="polite"></p>
        <p class="lede"><b>${esc(p.descriptor)}.</b> ${esc(p.lede)}</p>
        <div class="ctas">
          <a class="btn pri lg" href="#join" data-cta="hero">${esc(cfg.cta.primary)}</a>
          <a class="btn lg" href="#caregivers" data-side-set="caregiver">${esc(cfg.cta.secondary)}</a>
        </div>
        <p class="hero-fine">${esc(find('hero').fine)}</p>
      </div>
      <div class="hero-dw" aria-hidden="true" data-scroll-p><div class="dev">${iosShell('aidepost', { key: 'board' })}</div></div>
      </div>
      ${boardTable({ domain: cfg.domain })}
      ${doors()}
    </div>
  </section>`;
}

const steps = () => sec('providers', 'steps', `<div class="wrap">
  <div class="head">${eyebrow('For providers')}${h2('providers', 'Inward first. Outward second.', 'A shift goes to your own staff before it goes anywhere else. The record shows you tried.')}</div>
  <ol class="step-g">${STEPS.map(([t, d, k], i) => `<li class="step"><span class="step-n">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p><div class="crop">${iosShell('aidepost', { key: k })}</div></li>`).join('')}</ol>
</div>`);

function board() {
  const s = find('screen');
  return fold('One row per shift: a name, or open. Then build the week yourself.', sec('board', 'boardsec', `<div class="wrap">
    <div class="head head-r"><div>${h2('board', s.heading, s.sub)}</div><button class="btn sm" type="button" data-print>${ic('print', 18, { pin: false })}Print this week</button></div>
    ${annotatedBoard()}
    ${rosterToy()}
  </div>`));
}

function credentials() {
  const s = find('screen');
  return fold('Thirty days out, seven, then expired. Shown on the roster, never blocking.', sec('credentials', 'creds', `<div class="wrap">
    <div class="head">${eyebrow('Credentials')}${h2('credentials', 'Surfaced, never enforced.', 'You are told at thirty days, at seven, and on the day. Then it is marked on the roster. Nothing is blocked, because the decision is yours.')}</div>
    ${credLife()}
  </div>`));
}

const hours = () => fold('Clock in at the house, approve, export. Hours are a record, never pay.', sec('hours', 'hours', `<div class="wrap">
  <div class="hrs-g">
    <div class="hrs-t">${eyebrow('Hours')}${h2('hours', 'Clock in at the house. Export, never calculate.', 'A daily total, a weekly total, and a flag at forty hours. A manager approves; you export.')}
      <ul class="facts"><li><b>Offline</b> a clock-in with no signal queues and lands once.</li><li><b>Forgotten clock-out</b> surfaces to her and the manager; either completes it, with a reason.</li><li><b>Read-only</b> if a payment fails, clocking still works. Hours are a legal record.</li></ul>
    </div>
    <div class="hrs-v" data-scroll-p><div class="dev">${iosShell('aidepost', { key: 'hours' })}</div></div>
  </div>
  <div class="hrs-toys">${clockToy()}${timesheetToy()}</div>
</div>`));

function caregivers() {
  const s = find('caregiver');
  return `<div class="dark-half" data-dark-half>
  <div class="care-pivot"><span class="eyebrow">For caregivers</span><b>Free, for ever. The next three sections are the caregiver app.</b></div>
  <section class="sec care" id="caregivers" aria-labelledby="h-caregivers" data-reveal data-phone="fold" data-gist="Shifts near you, soonest first and then nearest. And whether one fits you.">
    <div class="wrap care-g">
      <div class="care-t">
        ${eyebrow('For caregivers')}
        <h2 id="h-caregivers">${esc(s.heading)}</h2>
        <p class="sub">${esc(s.sub)}</p>
        <ul class="care-l">${s.lines.slice(0, 3).map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
        ${distanceToy('dist-home')}
      </div>
      <div class="care-v" data-scroll-p><div class="dev">${iosShell('aidepost', { key: 'caregiver', mode: 'dark' })}</div></div>
      <div class="care-q">${fitQuiz()}</div>
    </div>
  </section>
  <section class="sec care wallet-s" id="wallet" aria-labelledby="h-wallet" data-reveal data-phone="fold" data-gist="Your credential dates in your pocket, carried from one employer to the next.">
    <div class="wrap wallet-g">
      <div class="wallet-t">${eyebrow('Your wallet')}<h2 id="h-wallet">Your dates, in your pocket.</h2><p class="sub">Your own credential dates, in one place, carried from one employer to the next. A notice at thirty days and at seven, to you by name.</p>
        <ul class="care-l">${s.lines.slice(3, 5).map((l) => `<li>${esc(l)}</li>`).join('')}</ul></div>
      ${walletCards()}
      <p class="cap wallet-c">The same dates show on the provider’s side, beside the shift. Never used to remove anyone from a list. <a href="/caregivers#wallet">The wallet, at depth ${ic('arrow', 14, { pin: false })}</a></p>
    </div>
  </section>
  <section class="sec care free-s" id="free" aria-labelledby="h-free" data-reveal data-phone="fold" data-gist="Free for ever, and the four things Aidepost never does to a caregiver.">
    <div class="wrap free-g">
      <div class="free-t">${eyebrow('Free, for ever')}<h2 id="h-free">You are not the product.</h2><p class="promise">${esc(s.promise)}</p>
        <div class="ctas">${s.ctas.map(([label, href], i) => `<a class="btn ${i === 0 ? 'pri' : ''} lg" href="${esc(href)}" data-cta="caregiver">${esc(label)}</a>`).join('')}</div>
        <p class="fine">${esc(s.fine)}</p></div>
      <ul class="free-l" aria-label="What Aidepost never does to a caregiver">
        ${NEVER.map(([t, d]) => `<li>${ic('x', 18, { pin: 'open' })}<span><b>${esc(t)}</b> — ${esc(d)}</span></li>`).join('')}
      </ul>
    </div>
  </section>
  </div>`;
}

function rules() {
  const s = find('depth');
  return fold('Every rule with the Oregon citation behind it, and how sure we are.', sec('rules', 'rules', `<div class="wrap">
    <div class="head">${h2('rules', s.heading, s.sub)}</div>
    <div class="rule-l" role="table" aria-label="${esc(s.cols.join(', '))}">
      <div class="rule-h" role="row">${s.cols.map((c) => `<span role="columnheader">${esc(c)}</span>`).join('')}</div>
      ${s.rows.map(([t, w, where, sure]) => `<div class="rule-r" role="row"><b role="cell">${esc(t)}</b><span role="cell">${esc(w)}</span><em role="cell">${esc(where)}</em><i role="cell" class="${/^Verified/.test(sure) ? 'is-ok' : ''}">${esc(sure)}</i></div>`).join('')}
    </div>
    <p class="pull">${esc(s.pull)}</p>
  </div>`));
}

function roles() {
  const s = find('roles');
  return fold('Five roles, and exactly what each one may do. Turn a card over.', sec('roles', 'roles', `<div class="wrap">
    <div class="head">${h2('roles', s.heading, 'Turn a card over to see what the role may do.')}</div>
    ${flipRoles()}
  </div>`));
}

const questions = (cfg, p) => fold('The ones we are actually asked, and how to reach a person.', sec('questions', 'questions', `<div class="wrap"><div class="q-g"><div class="head">${h2('questions', 'The questions we get.')}</div>${faq(find('objections').rows)}</div>${reach(cfg, p)}</div>`));

function pricing(cfg, p) {
  const s = find('pricing');
  return sec('pricing', 'pricing', `<div class="wrap">
    <div class="head">${h2('pricing', s.heading, EVERY_PLAN)}</div>
    ${tierBlock(p)}
    <p class="fine">${esc(s.note)} Signing up takes five minutes: email, licence track, your first house, the agreements, a card. <a href="/pricing">Pricing at depth ${ic('arrow', 14, { pin: false })}</a></p>
  </div>`);
}

const join = (cfg, p) => sec('join', 'join', joinBlock(cfg, p));

export const HOME_IX = [
  ['providers', 'Inward, then outward', 'prov'],
  ['board', 'The board', 'prov'],
  ['credentials', 'Credentials', 'prov'],
  ['hours', 'Hours', 'prov'],
  ['caregivers', 'Shifts near you', 'care'],
  ['wallet', 'Your wallet', 'care'],
  ['questions', 'Questions', 'both'],
  ['pricing', 'Pricing', 'both'],
];

export const HOME_IDS = new Set(['top', 'providers', 'board', 'credentials', 'hours', 'caregivers', 'wallet', 'free', 'rules', 'roles', 'questions', 'pricing', 'join', 'claim', 'reach']);

export function home(cfg, p) {
  return shell(cfg, p, { page: 'home', ids: HOME_IDS }, `${hero(cfg, p)}
${ixNav(HOME_IX, { tail: { href: '/screens', label: 'All five screens' } })}
${steps()}
${board()}
${credentials()}
${hours()}
${caregivers()}
${rules()}
${roles()}
${questions(cfg, p)}
${pricing(cfg, p)}
${join(cfg, p)}`);
}

export { S };
