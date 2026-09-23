// /caregivers — the dark page. Shifts near you, the wallet, your hours,
// free for ever, and the rules that protect a worker.

import { esc, sec, fold, h2, eyebrow, iosShell, ic, find, screen, shell, distanceToy, fitQuiz, walletCards, clockToy, timesheetToy, joinBlock, ixNav } from './bits.js';
import { hello, mailto, subjectAt } from '../../shared.js';

const PROTECT = [
  ['No background check is run on you', 'The house runs it. Aidepost holds a status and a date, never a result.'],
  ['No opinion about you exists anywhere', 'Attendance is showed, did not show, or late by a number of minutes. No rating, no comment.'],
  ['Your pay is never computed here', 'Hours are exported as hours.'],
  ['You are never charged', 'No organisation, no card, nothing to cancel.'],
  ['No address before a relationship exists', 'A shift shows the work, the time and the distance. The address arrives when you are confirmed.'],
  ['Your hours cannot be deleted', 'A correction sits beside the original, and both stay visible.'],
  ['What one employer records stays theirs', 'Attendance facts are never shared between employers.'],
  ['You are asked which side you are on once', 'Your side is remembered; your schedule is the first screen.'],
];

function top(cfg, p) {
  const s = find('caregiver');
  return `<section class="hero hero-c" id="top" aria-labelledby="h1">
    <div class="wrap hero-cg">
      <div>
        ${eyebrow('For caregivers · free, for ever')}
        <h1 id="h1">${esc(s.heading)}</h1>
        <p class="lede">${esc(s.sub)} ${esc(s.lines[1])}</p>
        <div class="ctas">${s.ctas.map(([label, href], i) => `<a class="btn ${i === 0 ? 'pri' : ''} lg" href="${i === 0 ? '#join' : '#protect'}" data-cta="caregiver">${esc(label)}</a>`).join('')}</div>
        <p class="hero-fine">${esc(s.fine)}</p>
      </div>
      <div class="care-v"><div class="dev">${iosShell('aidepost', { key: 'caregiver', mode: 'dark' })}</div></div>
    </div>
  </section>`;
}

function shifts() {
  const c = screen('caregiver');
  return sec('caregivers', 'care', `<div class="wrap care-g">
    <div class="care-t">${eyebrow('Shifts near you')}${h2('caregivers', 'Soonest first. Then nearest.', c.foot)}${distanceToy('dist-page')}</div>
    <div class="care-side">
      <div class="care-card"><h3>What a listing says</h3><ul class="tick"><li>${ic('check', 16)}The work, the schedule in words, the rate</li><li>${ic('check', 16)}The credentials asked for — surfaced, not required</li><li>${ic('check', 16)}The distance from you</li></ul><h3>What it never says</h3><ul class="tick is-x"><li>${ic('x', 16, { pin: 'open' })}A resident, or anything about one</li><li>${ic('x', 16, { pin: 'open' })}Another caregiver</li><li>${ic('x', 16, { pin: 'open' })}A house’s address, before a relationship exists</li></ul></div>
      <p class="fine">${esc(find('caregiver').lines[6])}</p>
    </div>
  </div>
  <div class="wrap">${fitQuiz()}</div>`);
}

function wallet() {
  return fold('Your dates in your pocket, and a notice at thirty days and at seven.', sec('wallet', 'care wallet-s', `<div class="wrap wallet-g">
    <div class="wallet-t">${eyebrow('Your wallet')}${h2('wallet', 'Your dates, in your pocket.', 'A CPR card photo and its date. A notice at thirty days and at seven — to you, by name. A manager sees a count, never your name in the message. Renew, and the old record stays as history.')}
      <ul class="care-l"><li>${esc(find('caregiver').lines[0])}</li><li>${esc(find('caregiver').lines[2])}</li></ul></div>
    ${walletCards()}
    <div class="sec-dev"><div class="dev">${iosShell('aidepost', { key: 'credentials' })}</div>
      <p class="cap">The same dates on the provider’s side: surfaced with the shift, never used to remove anyone from the list.</p></div>
  </div>`));
}

function hours() {
  return fold('Your schedule is the first screen, and your own weekly total accrues on it.', sec('hours', 'care hours-c', `<div class="wrap">
    <div class="head">${eyebrow('Your hours')}${h2('hours', 'Clock in, clock out, see your own weekly total.', 'Your schedule is the first screen. Your week accrues; at forty hours an indication appears — weekly, never daily. Your manager approves, and you are told.')}</div>
    <div class="hrs-toys">${clockToy()}${timesheetToy()}</div>
  </div>`));
}

function protect() {
  return fold('Eight rules that protect a worker — positions, not missing features.', sec('protect', 'care protect', `<div class="wrap">
    <div class="head">${eyebrow('The rules that protect a worker')}${h2('protect', 'Positions, not missing features.')}</div>
    <ol class="prot-g">${PROTECT.map(([t, d], i) => `<li><span class="prot-n">${String(i + 1).padStart(2, '0')}</span><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ol>
  </div>`));
}

function free(cfg, p) {
  const s = find('caregiver');
  return fold('No organisation, no card, nothing to cancel — and the first ten minutes.', sec('free', 'care free-s', `<div class="wrap free-g">
    <div class="free-t">${eyebrow('Free, for ever')}${h2('free', 'You are not the product.')}<p class="promise">${esc(s.promise)}</p>
      <p class="fine free-write">Write first, if you like — <a href="${mailto(cfg, `${subjectAt(cfg, '/caregivers')} — ${p.name}`, 'caregivers')}">${esc(hello(cfg, 'caregivers'))}</a>. You will never be charged, and we will never ask for a card.</p>
      <div class="ctas"><a class="btn pri lg" href="#join">${esc(s.ctas[0][0])}</a><a class="btn lg" href="/providers">${ic('house', 18, { pin: false })}I run a house, actually</a></div></div>
    <div class="sec-dev"><div class="dev">${iosShell('aidepost', { key: 'hire' })}</div>
      <p class="cap">What a relief caregiver sees when a shift goes outward: the work, the distance, and nothing about a resident.</p></div>
    <div class="free-first"><span class="strip-l">${ic('phone', 16, { pin: 'open' })}The first ten minutes</span><ol>${find('start').columns[1].steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="cap">${esc(find('start').columns[1].foot)}</p></div>
  </div>`));
}

export const CAREGIVERS_IDS = new Set(['top', 'caregivers', 'wallet', 'hours', 'protect', 'free', 'join']);

const CARE_IX = [['caregivers', 'Shifts near you', 'care'], ['wallet', 'Your wallet', 'care'], ['hours', 'Your hours', 'care'], ['protect', 'What protects you', 'care'], ['free', 'Free, for ever', 'care'], ['join', 'Join', 'care']];

export const caregiversPage = {
  path: 'caregivers',
  title: 'For caregivers',
  description: 'Shifts near you, tonight. Your own credential dates and hours, free for ever — and the rules that protect a worker: no ratings, no background checks, no charge.',
  render(cfg, p) {
    /* box: 'caregivers' names this route's address explicitly. chrome.js
       derives the same key from the route on its own, so the two agree and
       neither depends on the stored side. */
    return shell(cfg, p, { page: 'caregivers', ids: CAREGIVERS_IDS, box: 'caregivers' }, `<div class="dark-half is-page" data-dark-half>
${top(cfg, p)}
${ixNav(CARE_IX)}
${shifts()}
${wallet()}
${hours()}
${protect()}
${free(cfg, p)}
${sec('join', 'join care-join', joinBlock(cfg, p))}
</div>`);
  },
};
