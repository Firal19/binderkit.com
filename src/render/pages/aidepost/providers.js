// /providers — the provider side at depth: four screens, each doing work,
// and the flows from the feature document told step by step. The flows
// carry the story on their own: the From/Trigger/To tables that used to
// follow two of them said the same thing a second time in a grid.

import { esc, sec, fold, h2, eyebrow, iosShell, ic, find, screen, shell, rosterToy, credRail, credTimeline, annotatedBoard, joinBlock, ixNav, deepLink } from './bits.js';

const flow = (title, steps, note) => `<div class="flow"><h3>${esc(title)}</h3><ol class="flow-l">${steps.map(([t, d, k]) => `<li class="${k ? `is-${k}` : ''}"><b>${esc(t)}</b>${d ? `<span>${esc(d)}</span>` : ''}</li>`).join('')}</ol>${note ? `<p class="fine">${esc(note)}</p>` : ''}</div>`;


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
    ${annotatedBoard({ annot: false, live: false })}
    <div class="ch-g">
      ${flow('Saturday night is open', [
    ['Friday morning', 'the board shows Saturday night open at one house.', 'open'],
    ['Offer to own staff', 'everyone eligible is listed; two carry markers and both stay on the list.'],
    ['Nobody accepts by Friday evening', 'the shift is within the escalation window; the manager and the provider are both notified.'],
    ['Decide', 'assign someone carrying a marker, or post outward?'],
    ['Post outward', 'relief caregivers near the house see the work, the hours and the distance.'],
    ['One claims; the manager confirms', 'the worker is notified and can now clock in.', 'covered'],
    ['Sunday', 'the manager records that she showed. That fact is yours and no other employer’s.'],
  ], 'If two people claim at once, the first stands and the second is told. If nobody claims, the shift stays open and you work the phone as before, now with a record of having tried.')}
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
    ${credRail()}
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
    ['Her manager approves', 'one person at a time. The week locks.', 'covered'],
    ['The provider exports', 'a CSV of hours by person, house and day. No calculated pay. Exporting is recorded.'],
  ])}
      </div>
    </div>
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
    ['Pay, publish', 'live to the public and to caregivers. Applying takes a caregiver account: three screens, no payment.'],
    ['An application arrives', 'with her self-attested credentials. The manager is told an application was received at a house identifier.'],
    ['Screened, offered, accepted, hired', 'a staff record, her account attached, and onboarding for that house’s track.', 'covered'],
    ['Three items outstanding', 'she may be rostered before they are complete; the eligibility list marks it; the provider decides.'],
  ], s.foot)}
      </div>
    </div>
  </div>`));
}

/* One line per machine. Three of the four are told step by step in the
   chapters above; this is the index, not a second telling. */
const MACHINES = [
  ['Credential', 'Dated, noticed at thirty days and seven, marked when expired, renewed as a new row.'],
  ['Hire', 'Drafted, paid, published, applied for, screened, offered, hired.'],
  ['Hours', 'Clock in, clock out, a week, a flag at forty, approve, export.'],
  ['Policy signature', 'Register a version; everyone signs by name; a new version resets the signatures.'],
];
function machines() {
  return fold('Four machines, one line each: what happens, in order, every time.', sec('machines', 'mach', `<div class="wrap">
    <div class="head">${eyebrow('Four machines')}${h2('machines', 'What happens, in order, every time.')}</div>
    <dl class="mach-l">${MACHINES.map(([t, d]) => `<div class="mach-i"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
  </div>`));
}

/* One sentence. The billing states themselves are on /pricing. */
function failed() {
  return fold('Your workers can still clock in and out; you see the notice, they see nothing.', sec('payment', 'pay', `<div class="wrap pay-g">
    <div>${eyebrow('Billing')}${h2('payment', 'If a payment fails.')}</div>
    <p class="pay-one">If a payment fails, your workers can still clock in and out; you see the notice, they see nothing.</p>
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
${ixNav(PROV_IX, { tail: { href: '/screens', label: 'All five screens' } })}
${chBoard()}
${chCredentials()}
${chHours()}
${chHiring()}
${machines()}
${failed()}
${sec('join', 'join', joinBlock(cfg, p))}`);
  },
};
