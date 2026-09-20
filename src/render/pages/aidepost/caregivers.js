// /caregivers — the dark page. Shifts near you, the wallet, your hours,
// free for ever, and the rules that protect a worker.

import { esc, sec, fold, h2, eyebrow, iosShell, ic, find, screen, shell, distanceToy, walletCards, clockToy, timesheetToy, joinBlock } from './bits.js';

const PROTECT = [
  ['No background check is run on you', 'The provider runs ORCHARDS herself. Aidepost holds only a status she types — never a result, never the content.'],
  ['No opinion about you exists anywhere', 'Attendance is exactly one of showed, did not show, or late with a number of minutes. No rating, no comment, no free text. There is no field in the schema for an opinion about a person.'],
  ['Your pay is never computed here', 'Hours are exported as hours. One arithmetic error becomes a wage claim, so the product does not do arithmetic on your pay.'],
  ['You are never charged', 'The supply side is free, permanently. No organisation, no card, nothing to cancel.'],
  ['No address before a relationship exists', 'A shift shows the work, the time and the distance. The house’s address arrives when you are confirmed.'],
  ['Your hours record cannot be deleted', 'It is a legal record. A correction is a new record beside the original, and both stay visible.'],
  ['What one employer records stays theirs', 'Attendance facts are never shared between employers. You see your own facts and can correct everything recorded about you.'],
  ['You are asked which side you are on once', 'In plain language, and never again. Your side is remembered; your schedule is the first screen.'],
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
  </div>`);
}

function wallet() {
  return fold('Your dates in your pocket, and a notice at thirty days and at seven.', sec('wallet', 'care wallet-s', `<div class="wrap wallet-g">
    <div class="wallet-t">${eyebrow('Your wallet')}${h2('wallet', 'Your dates, in your pocket.', 'A CPR card photo and its date. A notice at thirty days and at seven — to you, by name. A manager sees a count, never your name in the message. Renew, and the old record stays as history.')}
      <ul class="care-l"><li>${esc(find('caregiver').lines[0])}</li><li>${esc(find('caregiver').lines[2])}</li></ul></div>
    ${walletCards()}
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
      <div class="ctas"><a class="btn pri lg" href="#join">${esc(s.ctas[0][0])}</a><a class="btn lg" href="/providers">${ic('house', 18, { pin: false })}I run a house, actually</a></div></div>
    <div class="free-first"><span class="strip-l">${ic('phone', 16, { pin: 'open' })}The first ten minutes</span><ol>${find('start').columns[1].steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="cap">${esc(find('start').columns[1].foot)}</p></div>
  </div>`));
}

export const CAREGIVERS_IDS = new Set(['top', 'caregivers', 'wallet', 'hours', 'protect', 'free', 'join']);

export const caregiversPage = {
  path: 'caregivers',
  title: 'For caregivers',
  description: 'Shifts near you, tonight. Your own credential dates and hours, free for ever — and the rules that protect a worker: no ratings, no background checks, no charge.',
  render(cfg, p) {
    return shell(cfg, p, { page: 'caregivers', ids: CAREGIVERS_IDS }, `<div class="dark-half is-page" data-dark-half>
${top(cfg, p)}
${shifts()}
${wallet()}
${hours()}
${protect()}
${free(cfg, p)}
${sec('join', 'join care-join', joinBlock(cfg, p))}
</div>`);
  },
};
