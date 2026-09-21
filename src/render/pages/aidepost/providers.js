// /providers — the provider side at depth: four screens, each doing work,
// and the flows from the feature document told step by step.

import { esc, sec, fold, h2, eyebrow, iosShell, webShell, ic, find, S, screen, shell, rosterToy, credTimeline, timesheetToy, clockToy, joinBlock, ixNav, pager, deepLink } from './bits.js';

const CHAPTERS = [['board', 'The board'], ['credentials', 'Credentials'], ['hours', 'Hours'], ['hiring', 'Hiring']];

const flow = (title, steps, note) => `<div class="flow"><h3>${esc(title)}</h3><ol class="flow-l">${steps.map(([t, d, k]) => `<li class="${k ? `is-${k}` : ''}"><b>${esc(t)}</b>${d ? `<span>${esc(d)}</span>` : ''}</li>`).join('')}</ol>${note ? `<p class="fine">${esc(note)}</p>` : ''}</div>`;

const trans = (title, rows) => `<div class="trans"><h3>${esc(title)}</h3><div class="trans-t" role="table" aria-label="${esc(title)}"><div class="trans-h" role="row"><span role="columnheader">From</span><span role="columnheader">Trigger</span><span role="columnheader">To</span></div>${rows.map(([a, b, c, k]) => `<div class="trans-r" role="row"><span role="cell">${esc(a)}</span><span role="cell">${esc(b)}</span><b role="cell" class="${k ? `is-${k}` : ''}">${esc(c)}</b></div>`).join('')}</div></div>`;

function strip() {
  return `<nav class="chap" aria-label="Chapters" data-spy data-chap><ul data-scrollx>${CHAPTERS.map(([id, t], i) => `<li><a href="#${id}"><span class="chap-n">${i + 1}</span>${esc(t)}</a></li>`).join('')}</ul></nav>`;
}

function top(cfg, p) {
  const proof = find('proof');
  return `<section class="hero hero-p" id="top" aria-labelledby="h1">
    <div class="wrap hero-pg">
      <div class="hero-t">${eyebrow('For providers · at depth')}<h1 id="h1">Covered, or not — and the record that you tried.</h1></div>
      <div class="hero-s2">
        <p class="lede">${esc(find('loop').sub)}</p>
        <div class="ctas"><a class="btn pri lg" href="#join">${esc(cfg.cta.primary)}</a><a class="btn lg" href="#board">${ic('board', 18)}Start at the board</a></div>
      </div>
      <ul class="proof">${proof.items.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ul>
    </div>
  </section>`;
}

function chBoard() {
  const s = find('screen');
  const loop = find('loop');
  return sec('board', 'ch', `<div class="wrap">
    <div class="ch-head head-r"><div>${eyebrow('1 · The board')}${h2('board', s.heading, s.sub)}</div>${deepLink('/providers#board', 'the board')}</div>
    <div class="shell" tabindex="0" role="group" aria-label="The desktop board — scroll sideways for the rest">${webShell('aidepost', { key: 'board' })}</div>
    <span class="shell-cap">Drag sideways — the board goes on past the edge.</span>
    <div class="ch-g">
      ${flow('Saturday night is open', [
    ['Friday morning', 'the board shows Saturday night open at one house.', 'open'],
    ['Offer to own staff', 'everyone eligible is listed; two carry markers — one certificate expired, one already assigned that night. Neither is removed and neither requires an override.'],
    ['Nobody accepts by Friday evening', 'the shift is within the escalation window; the manager and the provider are both notified.'],
    ['Decide', 'assign someone carrying a marker, or post outward?'],
    ['Post outward', 'relief workers whose area covers the house and whose availability includes nights see it, with distance and any credential marker.'],
    ['One claims; the manager confirms', 'the worker is notified and can now clock in.', 'covered'],
    ['Sunday', 'the manager records that she showed. That fact is the employer’s own — no other employer will ever see it.'],
  ], 'If two workers claim at once, the first stands and the second is told immediately. If nobody claims, the shift stays open, the escalation repeats, and the provider works the phone as she did before — but now with a record of having tried.')}
      <div class="ch-side">
        <div class="gates"><h3>Two gates, and nothing else blocks</h3><ul>${loop.gates.map((g) => `<li>${ic('check', 16)}${esc(g)}</li>`).join('')}</ul><p class="fine">${esc(loop.gateNote)}</p></div>
        <p class="pull">${esc(loop.quote.text)}</p>
      </div>
    </div>
    ${rosterToy()}
  </div>`);
}

function chCredentials() {
  const s = screen('credentials');
  return fold('Entered with an expiry — then thirty days, seven, and the day itself.', sec('credentials', 'ch', `<div class="wrap">
    <div class="ch-head">${eyebrow('2 · Credentials')}${h2('credentials', 'Entered with an expiry. Then thirty days, seven, the day itself.', s.foot)}</div>
    <div class="ch-g is-phone">
      <div class="ch-dev"><div class="dev">${iosShell('aidepost', { key: 'credentials' })}</div></div>
      <div>
        ${flow('A credential lapses', [
    ['Thirty days out', 'the holder is notified; the manager sees a count.'],
    ['Seven days out', 'both again.'],
    ['It expires', 'her row is marked on the roster and in the eligibility list, naming the credential.', 'open'],
    ['Decide', 'the manager assigns her anyway — permitted, marked, recorded — or does not.'],
    ['Renewed', 'the marker clears; the expired record remains as history.', 'covered'],
  ])}
        ${trans('The lifecycle — nothing in this table blocks an assignment', [
    ['—', 'Recorded with dates', 'current'],
    ['current', '30 days before expiry', 'expiring', 'open'],
    ['expiring', '7 days before', 'expiring · second alert', 'open'],
    ['expiring', 'Expiry passes', 'expired · marked on the roster', 'open'],
    ['any', 'New row recorded', 'current · prior retained', 'covered'],
    ['current', '14 days before the next screening', 'rescreen due'],
  ])}
      </div>
    </div>
    ${credTimeline()}
  </div>`));
}

function chHours() {
  const s = screen('hours');
  return fold('Clock in, approve, export. The overtime flag is weekly, never daily.', sec('hours', 'ch', `<div class="wrap">
    <div class="ch-head">${eyebrow('3 · Hours')}${h2('hours', 'Clock in at the house. Approve one person at a time. Export.', s.desktopSub)}</div>
    <div class="ch-g is-phone">
      <div class="ch-dev"><div class="dev">${iosShell('aidepost', { key: 'hours' })}</div></div>
      <div>
        ${flow('A caregiver’s week', [
    ['Clocks in at the house', 'no connectivity? The event queues, marked pending; she carries on.'],
    ['Forgets to clock out', 'the incomplete record surfaces to her and the manager; either completes it with a time and a reason.'],
    ['Crosses forty hours', 'an overtime indication appears. No daily indication appears, at any point.', 'open'],
    ['Her manager approves', 'one person at a time; bulk approval is forbidden. The week locks.', 'covered'],
    ['The provider exports', 'CSV — person, employee reference, house, date, hours, overtime hours, shift type and the rate where one was recorded. No calculated pay. Exporting is recorded.'],
  ])}
        ${trans('Clock → timesheet → export', [
    ['—', 'Clock in', 'open day'],
    ['open day', 'Clock out', 'hours computed'],
    ['open day', 'No clock-out two hours after shift end', 'flagged · correctable with a reason', 'open'],
    ['week', 'Sunday boundary', 'submitted'],
    ['submitted', 'Approve', 'approved · locked', 'covered'],
    ['approved', 'Correction', 'approved + addendum, re-approved'],
    ['approved', 'Export', 'logged — no state change'],
  ])}
      </div>
    </div>
    <div class="hrs-toys">${clockToy()}${timesheetToy()}</div>
    <p class="pull">${esc(find('loop').closing)}</p>
  </div>`));
}

function chHiring() {
  const s = screen('hire');
  return fold('Draft, publish, apply, screen, offer, hire — the whole thing, end to end.', sec('hiring', 'ch', `<div class="wrap">
    <div class="ch-head">${eyebrow('4 · Hiring')}${h2('hiring', 'A post is drafted, paid, published.', s.desktopSub)}</div>
    <div class="ch-g is-phone">
      <div class="ch-dev"><div class="dev">${iosShell('aidepost', { key: 'hire' })}</div></div>
      <div>
        ${flow('Hiring, end to end', [
    ['Draft', 'role, schedule in words, rate, credentials, description. The house by its identifier, by default.'],
    ['The warning', '“one-to-one for a resident who…” is flagged: a posting describes work, not a person. She rewrites it; the warning and her decision are recorded.', 'open'],
    ['Pay, publish', 'live publicly and to workers. A worker finds it in an ordinary search, without an account; applying asks her to create one — three screens, no payment.'],
    ['An application arrives', 'with her self-attested credentials. The manager is told an application was received at a house identifier.'],
    ['Screened, offered, accepted, hired', 'a staff record is created, her account attached, her credentials copied in as self-attested, and onboarding opens for that house’s track.', 'covered'],
    ['Three items outstanding', 'she may be rostered before they are complete; the eligibility list marks it; the provider decides.'],
  ], s.foot)}
        ${trans('Application → hire', [
    ['draft', 'Publish — the charge is paid', 'live', 'covered'],
    ['live', 'Apply, with an account', 'received'],
    ['received', 'Screen', 'screened'],
    ['screened', 'Offer', 'offered'],
    ['offered', 'Accept / decline', 'accepted / declined'],
    ['accepted', 'Hire — the provider', 'staff row, onboarding opened', 'covered'],
    ['any', 'Reject, with an optional reason', 'rejected'],
  ])}
      </div>
    </div>
  </div>`));
}

function machines() {
  const loop = find('loop');
  return fold('The four machines: what happens, in order, every single time.', sec('machines', 'mach', `<div class="wrap">
    <div class="head">${eyebrow('Four machines')}${h2('machines', 'What happens, in order, every time.')}</div>
    <div class="mach-g">${loop.machines.map(([t, d]) => `<details class="mach-i"><summary><h3>${esc(t)}</h3><span class="faq-x" aria-hidden="true"></span></summary><p>${esc(d)}</p></details>`).join('')}</div>
  </div>`));
}

function failed() {
  return fold('If a payment fails your workers see nothing, and clocking continues.', sec('payment', 'pay', `<div class="wrap pay-g">
    <div>${eyebrow('If a payment fails')}${h2('payment', 'Your workers see nothing. Clocking continues.')}</div>
    <ol class="flow-l">${[
    ['Overdue', 'full access; a notice to the provider alone.'],
    ['Reminders', 'day 0, day 7, day 14.'],
    ['Read-only', 'rosters cannot be built and shifts cannot be assigned. Clocking continues, and the notice says so, because hours worked are a legal record.', 'open'],
    ['Live postings', 'unaffected until cancellation; on cancellation they are withdrawn.'],
    ['Resolved', 'full access immediately.', 'covered'],
  ].map(([t, d, k]) => `<li class="${k ? `is-${k}` : ''}"><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ol>
  </div>`));
}

export const PROVIDERS_IDS = new Set(['top', 'board', 'credentials', 'hours', 'hiring', 'machines', 'payment', 'join']);

/* .chap is the desktop chapter strip and is hidden below 900, where 50px of
   permanent chrome under a 60px header is 21% of the viewport. .ix is the
   same four destinations for a phone, in the page rather than stuck to it —
   CSS shows exactly one of the two, never both. */
const PROV_IX = [['board', 'The board', 'prov'], ['credentials', 'Credentials', 'prov'], ['hours', 'Hours', 'prov'], ['hiring', 'Hiring', 'prov'], ['machines', 'The machines', 'prov'], ['payment', 'If a payment fails', 'prov'], ['join', 'Join', 'both']];

export const providersPage = {
  path: 'providers',
  title: 'For providers',
  description: 'The provider side at depth: the open-shift board, credentials surfaced and never enforced, hours exported and never computed into pay, and hiring end to end.',
  render(cfg, p) {
    return shell(cfg, p, { page: 'providers', ids: PROVIDERS_IDS }, `${top(cfg, p)}
${strip()}
${ixNav(PROV_IX)}
${chBoard()}
${chCredentials()}
${chHours()}
${chHiring()}
${machines()}
${failed()}
${sec('join', 'join', joinBlock(cfg, p))}
${pager('/providers')}`);
  },
};
