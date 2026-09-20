// aidepost.com — the front page. The light half, then the page turns over.

import { esc, sec, fold, h2, eyebrow, faq, iosShell, ic, SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, spec, find, S, STEPS, BOUNDARY, shell, boardTable, doors, rosterToy, credTimeline, timesheetToy, clockToy, distanceToy, walletCards, deck, flipRoles, tierBlock, annotatedBoard, joinBlock } from './bits.js';

function hero(cfg, p) {
  return `<section class="hero" id="top" aria-labelledby="h1">
    <div class="wrap">
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
      ${boardTable({ domain: cfg.domain })}
      ${doors()}
    </div>
  </section>`;
}

const steps = () => sec('providers', 'steps', `<div class="wrap">
  <div class="head">${eyebrow('For providers')}${h2('providers', 'Inward first. Outward second.', 'The order is the product. A shift goes to your own staff before it goes anywhere near the outside — and the record shows you tried.')}</div>
  <ol class="step-g">${STEPS.map(([t, d, k], i) => `<li class="step"><span class="step-n">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p><div class="crop">${iosShell('aidepost', { key: k })}</div></li>`).join('')}</ol>
</div>`);

function board() {
  const s = find('screen');
  return fold('One row per shift — covered with a name, or open — and the desktop board at true size.', sec('board', 'boardsec', `<div class="wrap">
    <div class="head head-r"><div>${h2('board', s.heading, s.sub)}</div><button class="btn sm" type="button" data-print>${ic('print', 18, { pin: false })}Print this week</button></div>
    ${annotatedBoard()}
    ${rosterToy()}
  </div>`));
}

function credentials() {
  const s = find('screen');
  return fold('Thirty days out, seven, then expired — surfaced on the roster and never blocking.', sec('credentials', 'creds', `<div class="wrap cred-g">
    <div class="cred-t">${eyebrow('Credentials')}${h2('credentials', 'Surfaced, never enforced.', 'Thirty days out, the holder and the manager are told. Seven days out, both again. Then it expires and is marked on the roster, naming the credential. Nothing is ever blocked, because the decision is yours.')}
      <ol class="ladder"><li><b>30 days</b><span>a notice to the holder; the manager sees a count</span></li><li><b>7 days</b><span>both, again</span></li><li><b>Expired</b><span>marked on the roster and in the eligible list — assignable, marked, recorded</span></li><li><b>Renewed</b><span>a new row; the old one stays as history</span></li></ol>
      <p class="side-note"><b>${esc(s.side.label)}</b> ${esc(s.side.text)}</p>
    </div>
    ${credTimeline()}
  </div>`));
}

const hours = () => fold('Clock in at the house, approve, export — hours are a record, never arithmetic on pay.', sec('hours', 'hours', `<div class="wrap">
  <div class="hrs-g">
    <div class="hrs-v"><div class="dev">${iosShell('aidepost', { key: 'hours' })}</div></div>
    <div class="hrs-t">${eyebrow('Hours')}${h2('hours', 'Clock in at the house. Export, never calculate.', 'A daily total, a weekly total, the overtime flag at forty hours — weekly, because Oregon has no daily flag for this work. A manager approves; the provider exports. A correction is an addendum with a reason; the original stays.')}
      <ul class="facts"><li><b>Offline</b> a clock-in with no signal queues, marked pending, and catches up.</li><li><b>Forgotten clock-out</b> surfaces to her and the manager; either completes it with a time and a reason.</li><li><b>Read-only</b> if a payment fails, clocking still works — hours are a legal record.</li></ul>
    </div>
  </div>
  <div class="hrs-toys">${clockToy()}${timesheetToy()}</div>
</div>`));

function caregivers() {
  const s = find('caregiver');
  /* THE PIVOT HAS TO SURVIVE THE FOLD, AND IN DARK MODE THE GROUND DOES NOT.
     Before the fold each of these three sections carried its own eyebrow, its
     own h2 and its own hero on a near-black ground, and the ground was
     reinforcement. Folded, the ground is the only carrier left — and measured
     at 390px it is rgb(35,27,42) on a rgb(28,22,32) page in dark mode, a shift
     of 7 in 255. So a dark-mode reader scrolling the middle of the home page
     meets ten identical rows and is never told that three of them are a
     different product, free, for a different person. This says it in words,
     once, where the eyebrows used to. Phone only: above 640 the three heroes
     are back and they say it better. */
  return `<div class="dark-half" data-dark-half>
  <div class="care-pivot"><span class="eyebrow">For caregivers</span><b>Free, for ever. The next three sections are the caregiver app.</b></div>
  <section class="sec care" id="caregivers" aria-labelledby="h-caregivers" data-reveal data-phone="fold" data-gist="Shifts near you, soonest first and then nearest, with the distance.">
    <div class="wrap care-g">
      <div class="care-t">
        ${eyebrow('For caregivers')}
        <h2 id="h-caregivers">${esc(s.heading)}</h2>
        <p class="sub">${esc(s.sub)}</p>
        <ul class="care-l">${s.lines.slice(0, 5).map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
        ${distanceToy('dist-home')}
      </div>
      <div class="care-v"><div class="dev">${iosShell('aidepost', { key: 'caregiver', mode: 'dark' })}</div></div>
    </div>
  </section>
  <section class="sec care wallet-s" id="wallet" aria-labelledby="h-wallet" data-reveal data-phone="fold" data-gist="Your credential dates in your pocket, carried from one employer to the next.">
    <div class="wrap wallet-g">
      <div class="wallet-t">${eyebrow('Your wallet')}<h2 id="h-wallet">Your dates, in your pocket.</h2><p class="sub">Keep your own credential dates in one place, and carry them from one employer to the next. A notice at thirty days and at seven — to you, by name; to a manager, only as a count.</p>
        <ul class="care-l">${s.lines.slice(5).map((l) => `<li>${esc(l)}</li>`).join('')}</ul></div>
      ${walletCards()}
    </div>
  </section>
  <section class="sec care free-s" id="free" aria-labelledby="h-free" data-reveal data-phone="fold" data-gist="Free for ever — and the four things Aidepost will never do to a caregiver.">
    <div class="wrap free-g">
      <div class="free-t">${eyebrow('Free, for ever')}<h2 id="h-free">You are not the product.</h2><p class="promise">${esc(s.promise)}</p>
        <div class="ctas">${s.ctas.map(([label, href], i) => `<a class="btn ${i === 0 ? 'pri' : ''} lg" href="${esc(href)}" data-cta="caregiver">${esc(label)}</a>`).join('')}</div>
        <p class="fine">${esc(s.fine)}</p></div>
      <ul class="free-l" aria-label="What Aidepost never does to a caregiver">
        <li>${ic('x', 18, { pin: 'open' })}<span><b>No background check</b> — the provider runs ORCHARDS; Aidepost holds a status she types.</span></li>
        <li>${ic('x', 18, { pin: 'open' })}<span><b>No rating</b> — attendance is showed, did not show, or late with a number of minutes. No stars, no comment, no free text.</span></li>
        <li>${ic('x', 18, { pin: 'open' })}<span><b>No pay computed</b> — hours are exported, never calculated.</span></li>
        <li>${ic('x', 18, { pin: 'open' })}<span><b>No charge</b> — the supply side is free, permanently.</span></li>
      </ul>
    </div>
  </section>
  </div>`;
}

function rules() {
  const s = find('depth');
  return fold('Every rule with the Oregon citation behind it — or the note that there is none.', sec('rules', 'rules', `<div class="wrap">
    <div class="head">${h2('rules', s.heading, s.sub)}</div>
    <div class="rule-l" role="table" aria-label="${esc(s.cols.join(', '))}">
      <div class="rule-h" role="row">${s.cols.map((c) => `<span role="columnheader">${esc(c)}</span>`).join('')}</div>
      ${s.rows.map(([t, w, where, sure]) => `<div class="rule-r" role="row"><b role="cell">${esc(t)}</b><span role="cell">${esc(w)}</span><em role="cell">${esc(where)}</em><i role="cell" class="${/^Verified/.test(sure) ? 'is-ok' : /^No citation/.test(sure) ? 'is-none' : ''}">${esc(sure)}</i></div>`).join('')}
    </div>
    <p class="pull">${esc(s.pull)}</p>
    <p class="fine rules-c">${esc(s.closing)}</p>
  </div>`));
}

const refuses = () => fold('Seven refusals, each one a position rather than a missing feature.', sec('refuses', 'refuse', `<div class="wrap">
  <div class="head">${h2('refuses', 'What Aidepost will not do.', 'Each is a position, not a missing feature.')}</div>
  ${deck()}
  <p class="boundary">${esc(BOUNDARY)}</p>
</div>`));

function roles() {
  const s = find('roles');
  return fold('Five roles, and exactly what each one may do. Turn a card over.', sec('roles', 'roles', `<div class="wrap">
    <div class="head">${h2('roles', s.heading, 'Turn a card over to see what the role may do.')}</div>
    ${flipRoles()}
    <p class="fine roles-c">${esc(s.closing)}</p>
  </div>`));
}

const questions = () => fold('The ones we are actually asked — Facebook, the per-post charge, the trial.', sec('questions', 'questions', `<div class="wrap q-g"><div class="head">${h2('questions', 'The questions we get.')}</div>${faq(find('objections').rows)}</div>`));

function pricing(cfg, p) {
  const s = find('pricing');
  return sec('pricing', 'pricing', `<div class="wrap">
    <div class="head">${h2('pricing', s.heading, EVERY_PLAN)}</div>
    ${tierBlock(p)}
    <p class="fine">${esc(s.note)}</p>
    <div class="subs">
      <div class="note"><h3>${esc(find('start').signupHeading)}</h3><ol class="arrow">${SIGNUP_SIX.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>
      <div class="note"><h3>${esc(BILLING_STATES.heading)}</h3><dl class="defs">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
    </div>
    <p class="fine"><a href="/pricing">Pricing, at depth ${ic('arrow', 14, { pin: false })}</a></p>
  </div>`);
}

const join = (cfg, p) => sec('join', 'join', joinBlock(cfg, p));

export const HOME_IDS = new Set(['top', 'providers', 'board', 'credentials', 'hours', 'caregivers', 'wallet', 'free', 'rules', 'refuses', 'roles', 'questions', 'pricing', 'join', 'claim']);

export function home(cfg, p) {
  return shell(cfg, p, { page: 'home', ids: HOME_IDS }, `${hero(cfg, p)}
${steps()}
${board()}
${credentials()}
${hours()}
${caregivers()}
${rules()}
${refuses()}
${roles()}
${questions()}
${pricing(cfg, p)}
${join(cfg, p)}`);
}

export { spec, S };
