// The family, as the vault states it. Every string here is read from the
// system document (September 2026) or the boards; where the board proposes
// something the vault has not decided, the entry says so.

import { MARKS } from '../marks.js';

export { MARKS };

export const PRODUCTS = [
  {
    id: 'pho', name: 'Provider Hub Oregon', short: 'PHO', kind: 'umbrella',
    domain: 'providerhub.us', descriptor: 'The enterprise platform for licensed Oregon care homes',
    owns: 'The whole house', domainWord: 'every domain, plus the enterprise layer',
    accent: 'teal', accentText: 'teal', tone: 'The family voice', toneLine: 'One house. Four rooms. One ladder.',
    status: 'Spec-first · ~3% built', statusKind: 'spec',
    headline: { text: 'One house. Four rooms. One ladder.', status: 'proposed', note: 'The family line is proposed in the design, not read from the vault.' },
    lede: 'A family of software for licensed Oregon care homes: four small, complete products a provider can buy on a Tuesday, and one enterprise platform they lead to.',
    signature: 'The organisation roll-up',
    handle: 'providerhuboregon',
    cta: { primary: 'Talk to us', secondary: 'See the four rooms', trial: false },
    tabs: ['Home', 'Residents', 'Staff', 'Binder', 'More'],
    nav: [
      { group: 'Operate', items: ['Dashboard', 'Resident Management', 'Staff & Workforce', 'Workspace', 'Communication'] },
      { group: 'Records', items: ['Digital Binder', 'Reports & Analytics', 'Quality Assurance', 'Regulatory Intelligence'] },
      { group: 'Business', items: ['Inventory & Supplies', 'Business Portal', 'Training', 'Job Board'] },
      { group: 'Organisation', items: ['Settings & Admin', 'Help & Support'] },
    ],
    firstTen: null,
    proof: [
      'Four applications on providerhub.us: the Customer app, Super Admin, External Portals and the Job Board.',
      'Twenty-seven modules designed; production is rebuilt from the specs, not patched from the sandbox.',
      'Each product graduates by export → import; the record is already in PHO’s shape.',
    ],
    pricing: { unit: 'organisation + house', rows: [['Aspiring', '$99 one-time', 'Pre-licensed; credits toward a subscription'], ['Basic', '$129 / mo', 'One-house AFH · 5 users'], ['Professional', '$299 / mo', 'Two- to three-house AFH · 25 users'], ['Enterprise', '$350+ / mo', 'Multi-house operators and agencies']], note: 'Locked (#60–69). +$50 per additional house · $25 per job-board hire · no trial (D13).' },
  },
  {
    id: 'cohort', name: 'Cohort', short: 'Cohort', kind: 'mini',
    domain: 'cohorthome.app', descriptor: 'Daily operations for care homes',
    owns: 'The residents', domainWord: 'the residents',
    accent: 'coral', accentText: 'coralText', tone: 'Calm and factual', toneLine: '“4 meds due” — never “⚠ MEDICATIONS OVERDUE”.',
    status: 'Draft v2.1 · not built · pilot named', statusKind: 'pilot',
    headline: { text: 'Run every shift, in every house.', status: 'reserved', note: 'Reserved for the homepage in the naming register — the only written headline of the four.' },
    lede: 'The app a care home’s staff use on the house phone to run the residents’ day: the MAR, care documentation, incidents, plans, house tasks and the shift handoff. One record, timestamped, attributed, never deleted.',
    signature: 'Today',
    handle: 'cohorthome',
    cta: { primary: 'Start the 3-day trial', secondary: 'See Today', trial: true },
    tabs: ['Today', 'Residents', 'MAR', 'Notes', 'More'],
    nav: [{ group: 'The house', items: ['Today', 'Residents', 'MAR', 'Documentation', 'Incidents', 'Tasks'] }, { group: 'Organisation', items: ['People & access', 'Settings'] }],
    firstTen: ['Name the house.', 'Add one resident with an allergy.', 'Enter one medication order.', 'Sign one dose behind the Six Rights dialog and see “Logged by · at” appear.'],
    proof: ['The pilot home is named — an AFH-DD in Eugene — and the exit criterion is fourteen consecutive days of medication passes without paper; no real resident may enter until the agreement is executed.', 'Two physical-harm gates — a medication that matches a recorded allergy, an as-needed dose given too soon — and nothing else that blocks.', 'Append-only: corrections are addenda under the original; nothing is deleted.'],
    doesNot: ['schedule staff, track clock-in or hold credentials', 'run the kitchen', 'generate binders', 'hold resident funds, author ISPs or bill the state (PHO)', 'police compliance (nowhere)'],
    pricing: { unit: 'house', rows: [['3-day trial', 'Card on file', 'Everything Pro shows; one-tap cancel'], ['Pro', 'Open (#8)', 'AFH operator, up to 3 houses'], ['Scale', 'Open (#8)', 'Agency or multi-home: roll-ups, agency roles, exports']], note: 'Prices are not set yet. The prior $10 per house may survive as the metered add-on.' },
  },
  {
    id: 'careshop', name: 'CareShop', short: 'CareShop', kind: 'mini',
    domain: 'careshop.app', descriptor: 'The kitchen software for care homes',
    owns: 'The household', domainWord: 'the household',
    accent: 'amber', accentText: 'amberText', tone: 'Practical', toneLine: 'What to buy, what’s expiring, what’s for dinner — and how sure we are.',
    status: 'Live', statusKind: 'live',
    headline: { text: 'What to buy, what’s expiring, what’s for dinner.', status: 'proposed', note: 'Unwritten in the vault; this line is the specification’s voice line, offered as the headline.' },
    lede: 'Stock by zone, dated perishables, a weekly menu checked against who lives there, a buy queue under the provider’s policy, receipts that land prices and stock back on the shelves. The loop closes by itself.',
    signature: 'The buy queue',
    handle: 'careshopapp',
    cta: { primary: 'Start free', secondary: 'See Today', trial: false },
    tabs: ['Stock', 'Shop', 'Today', 'Cook', 'Comply'],
    nav: [{ group: 'The kitchen', items: ['Today', 'Cook', 'Stock', 'Shop', 'Menu'] }, { group: 'Organisation', items: ['Houses', 'Residents', 'Reserves', 'Compliance', 'Settings'] }],
    firstTen: ['Add a zone and scan five items from the pantry.', 'Set a par on one and watch it become a buy request.', 'Add a resident with a tree-nut allergy and see the menu warn.', 'Open Today and see what the house needs — restock, expiry, dinner.'],
    proof: ['Live at careshop.app and used by real houses; a caregiver scans groceries into it at the store today.', 'Ten Oregon citations are explained in the product today and every other catalogue row carries the bare rule text. A banner stays on a rule set no provider has reviewed.', 'Residents stay a label, never a name: diet tags, allergens, one texture level.'],
    doesNot: ['store diagnoses, medications, incidents or clinical notes', 'schedule anyone', 'print the tab where a reserve record goes', 'store a tray note, or rank one house against another (never)'],
    pricing: { unit: 'house', rows: [['Free', '$0', 'One house, three people, five hundred items'], ['Pro', '$19 / mo', 'Up to five houses'], ['Scale', '$37 / mo', 'Unlimited houses, cross-house spend, catalogue import and copying between houses']], note: 'Sold on the web. Free, Pro at $19, Scale at $37.' },
  },
  {
    id: 'binderkit', name: 'Binderkit', short: 'Binderkit', kind: 'mini',
    domain: 'binderkit.com', descriptor: 'Binder setup for care homes',
    owns: 'The paperwork', domainWord: 'the paperwork',
    accent: 'peri', accentText: 'periText', tone: 'Orderly and instructional', toneLine: 'Numbered, calm, nothing decorative. Never “ready”, “compliant” or “audit-proof”.',
    status: 'Draft v1.1 · no repo yet', statusKind: 'draft',
    headline: { text: 'Exactly what goes in each binder, in what order.', status: 'proposed', note: 'Unwritten in the vault; drawn from the messaging table.' },
    lede: 'The licence track and five answers go in; printable binder plans come out — tabs, a contents page with the authority beside each item, a brief and an SOP — versioned with control numbers. It holds nothing about any real person.',
    signature: 'The printed contents page',
    handle: 'binderkit',
    cta: { primary: 'Start the 3-day trial', secondary: 'See a contents page', trial: true },
    tabs: ['Plan', 'Binders', 'Versions', 'Notes', 'More'],
    nav: [{ group: 'The binders', items: ['Plan', 'Binders', 'Versions', 'Notes'] }, { group: 'Organisation', items: ['Facilities', 'Settings'] }],
    firstTen: ['Pick the licence track.', 'Answer five questions.', 'See the plan and why each binder exists.', 'Print the resident-binder contents page and hold it.'],
    proof: ['Zero PHI by design: identity fields blank and hand-filled, plans keyed by a facility code — so it needs no BAA and can ship first.', 'Deterministic: the same answers always produce the same plan, with the reasoning shown.', 'Every item prints its authority citation and its evidence tag; derived items say so until verified.'],
    doesNot: ['store documents or scans (PHO M06, later)', 'record policy acknowledgments or credential dates', 'hold emergency stock', 'certify readiness or score compliance (nowhere)'],
    pricing: { unit: 'facility', rows: [['3-day trial', 'Card on file', 'Prints on day one'], ['Pro', 'Open (#9)', 'Or a single purchase — used twice a year'], ['Scale', 'Open (#9)', 'Multi-facility, the agency library, shared viewer seats']], note: 'Whether Binderkit is a subscription or a single purchase is not decided yet.' },
  },
  {
    id: 'aidepost', name: 'Aidepost', short: 'Aidepost', kind: 'mini',
    domain: 'aidepost.com', descriptor: 'Open shifts and jobs in care homes',
    owns: 'The workforce', domainWord: 'the workforce',
    accent: 'orchid', accentText: 'orchidText', tone: 'Direct; warmer on the caregiver side', toneLine: 'Covered or not. Shifts near you, tonight.',
    status: 'Draft v1.1 · no repo yet', statusKind: 'draft',
    headline: { text: 'Someone for Saturday night.', status: 'proposed', note: 'Unwritten in the vault; the provider-side line from the messaging table. The caregiver side reads “Shifts near you, tonight.”' },
    lede: 'The staff list and their credential dates, the roster, the open-shift board, clock-in and timesheets — and, outward, job posts and a relief pool of caregivers who find work on their phones, free.',
    signature: 'The open-shift board',
    handle: 'aidepost',
    cta: { primary: 'Start the 3-day trial', secondary: 'Caregivers: find shifts', trial: true },
    tabs: ['Shifts', 'Staff', 'Credentials', 'Posts', 'More'],
    nav: [{ group: 'The workforce', items: ['Shifts', 'Staff', 'Credentials', 'Onboarding', 'Timesheets', 'Posts'] }, { group: 'Organisation', items: ['Houses', 'Settings'] }],
    firstTen: ['Add six staff and their CPR dates.', 'See the one that expires Friday turn coral.', 'Build next week’s roster.', 'See Saturday night open — offer it to own staff, then post outward.'],
    proof: ['Two-sided: providers buy it; caregivers use it free, without an organisation or a card.', 'Credentials are surfaced, never enforced: thirty-day and seven-day notices; expired turns coral on the roster.', 'A shift never describes a person: the shift schema has no field that can reference a resident.'],
    doesNot: ['run payroll or background checks (the provider does; Aidepost records status and dates)', 'describe a resident in a posting (never)', 'hold resident care, MAR or incidents', 'write the house rules'],
    pricing: { unit: 'house + per post', rows: [['3-day trial', 'Card on file', 'Posting available on every tier, including the trial'], ['Pro', 'Open (#8)', 'Directory, credentials, roster, clock-in, timesheets'], ['Scale', 'Open (#8)', 'Unlimited houses; agency roles and CBTP items'], ['Job post', 'One charge per post', 'Publishes the listing when paid']], note: 'Caregivers pay nothing. Providers buy Aidepost.' },
  },
];

export const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
export const MINIS = PRODUCTS.filter((p) => p.kind === 'mini');
export const markFor = (id) => MARKS[PRODUCTS.findIndex((p) => p.id === id)];

/* Card copy for the marks grid. Longer drawing notes live on MARKS; these
   are the one-breath lines a specimen can carry. Small-size lines match
   what the drawings actually trade below the 32px crossover, not the older
   “loses its dots” claim the house no longer does. */
