// aidepost.com — covered or not.
//
// Two audiences, one page. The provider's half is dense and administrative:
// the board, three steps to a covered week, credentials, hours. The
// caregiver's half turns the page over — dark, sparse, single column, a phone
// held in one hand. One accent, orchid, and it means exactly two things:
// open, and expired.

import { esc, nav, foot, waitlist, faq, tiers, sec, h2, eyebrow, ICON } from '../shared.js';
import { iosShell, webShell, SURFACES } from '../instruments.js';
import { PAGES, SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, JOIN } from '../../data/page.js';

const spec = PAGES.aidepost;
const find = (k) => spec.sections.find((s) => s.key === k);
const S = SURFACES.aidepost;

const STEPS = [
  ['Build the week', 'A pattern per house generates the roster. Every shift is a row: covered, with a name — or open.', 'board'],
  ['Offer inward first', 'Everyone eligible on staff is listed. Two carry markers — a lapsed certificate, an overlapping shift — and neither is removed.', 'credentials'],
  ['Post outward second', 'Nobody on staff took it. Relief workers whose area covers the house and whose availability includes nights see it, with distance.', 'hire'],
];

const WALLET = [
  ['CPR', 'Mar 2027', 'covered', 'Current'],
  ['First Aid', 'Fri', 'open', 'Seven-day notice'],
  ['Medication-certified', 'Jan 2027', 'covered', 'Current'],
  ['Abuse-reporter training', '21 days', 'pending', 'Thirty-day notice'],
];

const REFUSED = [
  ['Running or receiving background checks', 'FCRA territory — it changes the legal character of the business. The provider runs ORCHARDS; Aidepost holds the status she types.'],
  ['Verifying a credential with its issuer', 'The product records that a card was seen. It never claims a verification it did not perform.'],
  ['Sharing attendance facts between employers', 'Supplying assessments of a person to third parties is a regulated activity.'],
  ['Ratings, stars, or opinions about a worker', 'The same regulated activity in a friendlier costume. There is no field anywhere for an opinion about a person.'],
  ['Computing pay', 'One arithmetic error becomes a wage claim. Hours are exported, never calculated.'],
  ['Any resident-referencing field on a shift or a posting', 'Structural, not a policy — the field must not exist.'],
  ['Blocking an assignment for a credential, an age, or incomplete onboarding', 'The employer is responsible; the system informs.'],
];

function hero(cfg, p) {
  return `<section class="hero" id="top" aria-labelledby="h1">
    <div class="wrap">
      <div class="hero-t">
        ${eyebrow('Open shifts and jobs in Oregon care homes')}
        <h1 id="h1">${esc(p.headline.text)}</h1>
        <p class="lede"><b>${esc(p.descriptor)}.</b> ${esc(p.lede)}</p>
        <div class="ctas">
          <a class="btn pri lg" href="#join" data-cta="hero">${esc(cfg.cta.primary)}</a>
          <a class="btn lg" href="#caregivers">${esc(cfg.cta.secondary)}</a>
        </div>
      </div>
      <div class="board-w" role="group" aria-label="This week’s shift board — scroll sideways on a phone">
        <table class="board"><caption class="sr-only">Shift coverage for the week, by house</caption>
          <thead><tr><th><span class="sr-only">Shift</span></th>${S.week.days.map((d) => `<th scope="col">${esc(d)}</th>`).join('')}</tr></thead>
          <tbody>${S.week.rows.map(([name, cells]) => `<tr><th scope="row">${esc(name)}</th>${cells.map((c) => `<td><span class="cell ${c ? 'is-covered' : 'is-open'}">${c ? esc(c) : 'Open'}</span></td>`).join('')}</tr>`).join('')}</tbody>
        </table>
        <p class="board-c"><b>${esc(S.detail[0])}</b> · ${esc(S.detail[1])} — ${esc(S.detail[2])}</p>
      </div>
      <div class="sides">
        <a class="side" href="#providers"><span class="side-k">I run a house</span><b>Staff, credentials, the roster, hours — and the board that shows what is not covered.</b><span class="side-go">${ICON.arrow}For providers</span></a>
        <a class="side is-dark" href="#caregivers"><span class="side-k">I’m a caregiver</span><b>Open shifts near you, your own credential dates, your own hours. Free, for ever.</b><span class="side-go">${ICON.arrow}For caregivers</span></a>
      </div>
    </div>
  </section>`;
}

const steps = () => sec('providers', 'steps', `<div class="wrap">
  <div class="head">${eyebrow('For providers')}${h2('providers', 'Inward first. Outward second.', 'The order is the product. A shift goes to your own staff before it goes anywhere near the outside — and the record shows you tried.')}</div>
  <ol class="step-g">${STEPS.map(([t, d, k], i) => `<li class="step"><span class="step-n">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p><div class="crop">${iosShell('aidepost', { key: k })}</div></li>`).join('')}</ol>
</div>`);

function board() {
  const s = find('screen');
  const on = (fn) => (typeof fn === 'function' ? fn(S) : fn);
  return sec('board', 'boardsec', `<div class="wrap">
    <div class="head">${h2('board', s.heading, s.sub)}</div>
    <div class="shell" tabindex="0" role="group" aria-label="The desktop board, at true size — scroll sideways for the rest">${webShell('aidepost', { key: 'board' })}</div>
    <ol class="annot">${s.callouts.map(([t, d]) => `<li><b>${esc(on(t))}</b><span>${esc(d)}</span></li>`).join('')}</ol>
  </div>`);
}

function credentials() {
  return sec('credentials', 'creds', `<div class="wrap cred-g">
    <div class="cred-t">${eyebrow('Credentials')}${h2('credentials', 'Surfaced, never enforced.', 'Thirty days out, the holder and the manager are told. Seven days out, both again. Then it expires and is marked on the roster, naming the credential. Nothing is ever blocked, because the decision is yours.')}
      <ol class="ladder"><li><b>30 days</b><span>a notice to the holder; the manager sees a count</span></li><li><b>7 days</b><span>both, again</span></li><li><b>Expired</b><span>marked on the roster and in the eligible list — assignable, marked, recorded</span></li><li><b>Renewed</b><span>a new row; the old one stays as history</span></li></ol>
    </div>
    <div class="wallet" aria-label="A caregiver’s credentials, as cards">${WALLET.map(([t, when, st, label]) => `<div class="wcard is-${esc(st)}"><span class="wcard-k">${esc(label)}</span><b>${esc(t)}</b><span class="wcard-w">${esc(when)}</span></div>`).join('')}</div>
  </div>`);
}

const hours = () => sec('hours', 'hours', `<div class="wrap hrs-g">
  <div class="hrs-v"><div class="dev">${iosShell('aidepost', { key: 'hours' })}</div></div>
  <div class="hrs-t">${eyebrow('Hours')}${h2('hours', 'Clock in at the house. Export, never calculate.', 'A daily total, a weekly total, the overtime flag at forty hours — weekly, because Oregon has no daily flag for this work. A manager approves; the provider exports. A correction is an addendum with a reason; the original stays.')}
    <ul class="facts"><li><b>Offline</b> a clock-in with no signal queues, marked pending, and catches up.</li><li><b>Forgotten clock-out</b> surfaces to her and the manager; either completes it with a time and a reason.</li><li><b>Read-only</b> if a payment fails, clocking still works — hours are a legal record.</li></ul>
  </div>
</div>`);

function caregivers() {
  const s = find('caregiver');
  return `<section class="sec care" id="caregivers" aria-labelledby="h-caregivers" data-reveal>
    <div class="wrap care-g">
      <div class="care-t">
        ${eyebrow('For caregivers')}
        <h2 id="h-caregivers">${esc(s.heading)}</h2>
        <p class="sub">${esc(s.sub)}</p>
        <ul class="care-l">${s.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
        <p class="promise">${esc(s.promise)}</p>
        <div class="ctas">${s.ctas.map(([label, href], i) => `<a class="btn ${i === 0 ? 'pri' : ''} lg" href="${esc(href)}" data-cta="caregiver">${esc(label)}</a>`).join('')}</div>
        <p class="fine">${esc(s.fine)}</p>
      </div>
      <div class="care-v"><div class="dev">${iosShell('aidepost', { key: 'caregiver', mode: 'dark' })}</div></div>
    </div>
  </section>`;
}

function rules() {
  const s = find('depth');
  return sec('rules', 'rules', `<div class="wrap">
    <div class="head">${h2('rules', s.heading, s.sub)}</div>
    <div class="rule-l">${s.rows.map(([t, w, where]) => `<div class="rule-r"><b>${esc(t)}</b><span>${esc(w)}</span><em>${esc(where)}</em></div>`).join('')}</div>
    <p class="pull">${esc(s.pull)}</p>
  </div>`);
}

const refuses = () => sec('refuses', 'refuse', `<div class="wrap">
  <div class="head">${eyebrow('The line')}${h2('refuses', 'What Aidepost will not do.', 'Each is a position, not a missing feature.')}</div>
  <ol class="ref-l">${REFUSED.map(([t, why]) => `<li><b>${esc(t)}</b><span>${esc(why)}</span></li>`).join('')}</ol>
  <p class="boundary">Aidepost is the workforce record. It does not keep residents’ records, run the kitchen, build binders, process payroll, or run background checks.</p>
</div>`);

function roles() {
  const s = find('roles');
  return sec('roles', 'roles', `<div class="wrap">
    <div class="head">${h2('roles', s.heading)}</div>
    <div class="role-g">${s.rows.map(([r, who, does, dev, wash]) => `<div class="role ${wash ? 'is-free' : ''}"><span class="role-n">${esc(r)}</span><p class="role-w">${esc(who)}</p><p class="role-d">${esc(does)}</p><span class="role-r">${esc(dev)}</span></div>`).join('')}</div>
  </div>`);
}

const questions = () => sec('questions', 'questions', `<div class="wrap q-g"><div class="head">${h2('questions', 'The questions we get.')}</div>${faq(find('objections').rows)}</div>`);

function pricing(cfg, p) {
  const s = find('pricing');
  return sec('pricing', 'pricing', `<div class="wrap">
    <div class="head">${h2('pricing', s.heading, EVERY_PLAN)}</div>
    ${tiers(p, 1)}
    <p class="fine">${esc(s.note)}</p>
    <div class="subs">
      <div class="note"><h3>${esc(find('start').signupHeading)}</h3><ol class="arrow">${SIGNUP_SIX.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>
      <div class="note"><h3>${esc(BILLING_STATES.heading)}</h3><dl class="defs">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
    </div>
  </div>`);
}

function join(cfg, p) {
  const s = find('start');
  return sec('join', 'join', `<div class="wrap join-g">
    <div class="join-t">${eyebrow(JOIN.eyebrow)}<h2 id="h-join">${esc(JOIN.heading)}</h2><p class="sub">${esc(JOIN.sub)}</p>
      <div class="two">${s.columns.map((c) => `<div class="two-c ${c.wash ? 'is-free' : ''}"><span class="strip-l">${esc(c.label)}</span><ol>${c.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>${c.foot ? `<p class="cap">${esc(c.foot)}</p>` : ''}</div>`).join('')}</div>
    </div>
    <div class="join-f">${waitlist(cfg, p, { housesLabel: 'You are' })}<p class="fine">${esc(JOIN.fine)}</p></div>
  </div>`);
}

export function render(cfg, p) {
  return `${nav(cfg, p)}
<main id="main" class="page face canvas" data-product="aidepost" data-mode="light">
${hero(cfg, p)}
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
${join(cfg, p)}
</main>
${foot(cfg, p, { fine: find('foot').disclaimer })}`;
}
