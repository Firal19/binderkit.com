// /screens — the whole product, at the size it ships.
//
// The home page argues; this route hands over the controls. Five real
// screens in one rail you can drag, flick, arrow through or link straight
// into; the desktop hiring screen with five numbered pins that light the
// thing they quote; the four words the product uses; and the field list of
// a shift, which exists to show what is NOT on it.
//
// It lives on its own route because a five-screen strip is 30 kB of HTML
// and only index.html is measured — and because "see the whole product" is
// the link a partner actually clicks.

import { esc, sec, h2, eyebrow, ic, find, shell, filmStrip, screenSwitch, callouts, webShell, stateLegend, schemaBlock, ixNav, pager, deepLink, messages, firstTen, productMap, sampleNote } from './bits.js';

/* Every caption here is the screen's own vault line or a sentence this
   product has already committed to in writing. “What this proves” is the
   investor's question, answered once per screen and never with a number. */
const NOTES = {
  board: {
    tab: 'The board', title: 'Open shifts · WH-1',
    cap: 'One row per shift, covered with a name or open in the accent. Saturday night is the only open cell this week.',
    proves: 'A shift describes the work and nothing else. The schema has no field that can reference a resident, and the schema check asserts it.',
  },
  credentials: {
    tab: 'Credentials', title: 'Surfaced, never enforced',
    cap: 'Entered with an expiry, then a thirty-day notice, a seven-day notice, and the day itself.',
    proves: 'An expired card is marked on the roster and in the eligible list — and the assignment still proceeds on a single action. The employer decides; the system informs.',
  },
  caregiver: {
    tab: 'Her side', title: 'Shifts near you, tonight',
    cap: 'Soonest first, then nearest: the work, the schedule in words, the rate, the credentials asked for and the distance.',
    proves: 'The same product, free, with no organisation and no card. The supply side acquires itself — that is the wedge, and it is one screen.',
    shell: { mode: 'dark' },
  },
  hours: {
    tab: 'Timesheets', title: 'Hours, exported',
    cap: 'A daily total, a weekly total, and the overtime flag at forty hours — weekly, because Oregon has no daily flag for this work.',
    proves: 'Hours leave as hours. One arithmetic error becomes a wage claim, so the product does no arithmetic on pay.',
  },
  hire: {
    tab: 'Posts', title: 'Drafted, paid, published',
    cap: 'A post goes live when it is paid. Applications arrive with her profile and her credentials as self-attested.',
    proves: 'The only per-event charge in the product, and it is on the side that has the money. A caregiver applies without paying anything, ever.',
  },
};

/* Five pins on five elements a reader can tell apart. Two of them used to
   sit 20px from each other on a 288px stage — a pin that lands on top of
   another pin is worse than no pin, because it says the screen has one
   fewer thing worth looking at than it does. */
const PINS = [
  { n: 1, sel: '.page-main .tbl-a tbody', text: 'One application per person per posting, never ranked and never scored. Credentials arrive self-attested, and the word self-attested is on the screen and in the export.' },
  { n: 2, sel: '.page-main .receipt-a', text: 'A posting describes work, not a person. A description matching the patterns raises a warning that explains why; you may proceed, and the warning and your decision are both recorded.' },
  { n: 3, sel: '.page-side .tile-a', text: 'On hire: a staff record, her account attached, her credentials copied in as self-attested, and onboarding opened for that house’s track.' },
  { n: 4, sel: '.page-side .btn-a', text: 'Publishing is the only thing in Aidepost that is charged per event, it is available on every tier including the trial, and an unpaid post stays a draft.' },
  { n: 5, x: 26, y: 7, text: 'One house, by its identifier. A second house is another row on the board — never a second product, and never a second price beyond the per-house line.' },
];

/* tools/shots.mjs exempts a sideways scroller from its overflow check by
   one marker — [data-scrollx] — and its list of class names predates the
   shared demo primitives, so .fs-rail, .fs-jump and .swx-tabs are reported
   as overflow even though scrolling sideways is the whole point of all
   three. The attribute is the kit's own word for exactly this, so it is
   added here rather than by editing a shared tool or a shared renderer.
   It is inert: nothing in site.js or in this site's CSS reads it. */
const sx = (html) => html
  .replace('class="fs-rail"', 'data-scrollx class="fs-rail"')
  .replace('class="fs-jump"', 'data-scrollx class="fs-jump"')
  .replace('class="swx-tabs"', 'data-scrollx class="swx-tabs"');

const IX = [
  ['strip', 'All five screens', 'both'],
  ['words', 'The four words', 'both'],
  ['hiring', 'Hiring, annotated', 'prov'],
  ['schema', 'What it holds, what it says', 'both'],
  ['map', 'The whole product', 'both'],
];

export const SCREENS_IDS = new Set(['top', 'strip', 'words', 'hiring', 'schema', 'map']);

export const screensPage = {
  path: 'screens',
  title: 'The screens',
  description: 'All five Aidepost screens at the size they ship: the board, credentials, the caregiver’s side, timesheets and posts — with what each one proves.',
  render(cfg, p) {
    return shell(cfg, p, { page: 'screens', ids: SCREENS_IDS, ix: IX }, `<section class="hero hero-s hero-sc" id="top" aria-labelledby="h1">
  <div class="wrap hero-cg">
    <div>${eyebrow('The working demo')}<h1 id="h1">Both sides, screen by screen.</h1>
      <p class="lede">Five screens, no sign-up, nothing to install. Press a side and the device answers; drag the rail below, or jump straight to one screen and send the link. Every screen is drawn from the specification and carries sample data — nothing here is a real house or a real person.</p>
      <div class="ctas"><a class="btn pri lg" href="#strip">${ic('board', 18)}All five, in the rail</a><a class="btn lg" href="/providers">${ic('house', 18)}The provider side, at depth</a></div>
    </div>
    <div class="hero-dw is-live">${sx(screenSwitch('aidepost', {
      id: 'sw-sides', only: ['board', 'caregiver'], on: 0,
      label: 'Which side are you looking at?',
      notes: {
        board: { tab: 'I run a house', cap: 'Your board: one row per shift — covered with a name, or open.' },
        caregiver: { tab: 'I’m a caregiver', cap: 'Her side, free: shifts near you, soonest first and then nearest.', shell: { mode: 'dark' } },
      },
    }))}</div>
  </div>
</section>
${ixNav(IX)}
${sec('strip', 'strp', `<div class="wrap">
  <div class="head head-r"><div>${eyebrow('All five')}${h2('strip', 'The product, at the size it ships.', 'Drag it, flick it, or press the arrow keys. Each card is addressable on its own — copy the link and it opens on that screen.')}</div>${deepLink('/screens#strip', 'the screen strip')}</div>
  ${sx(filmStrip('aidepost', {
      id: 'strip', notes: NOTES, jump: true,
      label: 'Every screen in Aidepost, at the size it ships',
      hint: 'Drag it, scroll it, or use the arrow keys. Five screens: four the provider sees, one the caregiver does — and the caregiver’s is the one nobody pays for.',
    }))}
  <div class="strp-u">${sampleNote()}${firstTen(p)}</div>
</div>`)}
${sec('words', 'words', `<div class="wrap words-g">
  <div>${eyebrow('The state words')}${h2('words', 'Four words, and no fifth.', 'Every state in Aidepost is one of these. Coral means exactly two things on this site: a shift nobody is on, and a credential that has run out.')}
    </div>
  ${stateLegend()}
</div>`)}
${sec('hiring', 'hiring', `<div class="wrap">
  <div class="head">${eyebrow('Annotated')}${h2('hiring', 'Hiring, with the five things worth pointing at.', 'Point at a pin, or move through the list with a keyboard — each one rings the thing it quotes on the screen itself. A pin whose element is not there hides rather than pointing at nothing.')}</div>
  ${callouts(webShell('aidepost', { key: 'hire' }), PINS, { id: 'cal-hire', label: 'What the hiring screen does' })}
</div>`)}
${sec('schema', 'schema', `<div class="wrap schema-g">
  <div>${eyebrow('The record')}${h2('schema', 'A shift describes the work, never the person.')}
    <p class="sub">This is the load-bearing structural claim in Aidepost, and it is not a policy that can be relaxed later: the field must not exist. The same discipline applies to what the product is able to say out loud.</p>
    ${schemaBlock()}</div>
  ${messages()}
</div>`)}
${sec('map', 'pmap-s', `<div class="wrap">
  <div class="head head-r"><div>${eyebrow('The whole thing')}${h2('map', 'Eight destinations. That is the product.', 'There is no second Aidepost behind a sales call — this is the entire information architecture, and the five screens above are five of these.')}</div>${deepLink('/screens#map', 'the product map')}</div>
  ${productMap(p)}
</div>`)}
${pager('/screens')}`);
  },
};

export default screensPage;
