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
    lede: 'Your staff run the whole shift from the house phone: medications, care notes, incidents, tasks and the handoff. One record, stamped and never deleted.',
    signature: 'Today',
    handle: 'cohorthome',
    cta: { primary: 'Start the 3-day trial', secondary: 'See Today', trial: true },
    tabs: ['Today', 'Residents', 'MAR', 'Notes', 'More'],
    nav: [{ group: 'The house', items: ['Today', 'Residents', 'MAR', 'Documentation', 'Incidents', 'Tasks'] }, { group: 'Organisation', items: ['People & access', 'Settings'] }],
    firstTen: ['Name the house.', 'Add one resident with an allergy.', 'Enter one medication order.', 'Sign one dose behind the Six Rights dialog and see “Logged by · at” appear.'],
    proof: ['Built for the house phone: one shared device, staff codes, and entries that queue when the signal drops.', 'Two safety stops — a medication that matches a recorded allergy, an as-needed dose given too soon — and nothing else that blocks.', 'Append-only: corrections go under the original; nothing is deleted.'],
    doesNot: ['schedule staff, track clock-in or hold credentials', 'run the kitchen', 'generate binders', 'hold resident funds, author ISPs or bill the state', 'police compliance'],
    pricing: { unit: 'house', rows: [['3-day trial', 'Card on file', 'Everything Pro shows. Cancel in one tap.'], ['Pro', '$39 / house / mo', 'One to three houses. The MAR, notes, incidents, tasks and the handoff.'], ['Scale', '$79 / house / mo', 'Agencies and multi-home operators. Roll-ups, agency roles, exports.']], note: 'Per house. Not per seat, not per resident, not per bed.' },
  },
  {
    id: 'careshop', name: 'CareShop', short: 'CareShop', kind: 'mini',
    domain: 'careshop.app', descriptor: 'The kitchen software for care homes',
    owns: 'The household', domainWord: 'the household',
    accent: 'amber', accentText: 'amberText', tone: 'Practical', toneLine: 'What to buy, what’s expiring, what’s for dinner — and how sure we are.',
    status: 'Live', statusKind: 'live',
    headline: { text: 'What to cook, what to buy, and what it costs.', status: 'proposed', note: 'Round 4 (Firaol): the caregiver who does not know what to cook, the provider who sends her shopping, the shop, the price. Offered as the headline; the vault has none.' },
    lede: 'Today tells the caregiver what to cook. The shopping list writes itself, you approve it from anywhere, and in the shop it goes aisle by aisle, with the price.',
    signature: 'The buy queue',
    handle: 'careshopapp',
    cta: { primary: 'Start free', secondary: 'See Today', trial: false },
    tabs: ['Stock', 'Shop', 'Today', 'Cook', 'Comply'],
    nav: [{ group: 'The kitchen', items: ['Today', 'Cook', 'Stock', 'Shop', 'Menu'] }, { group: 'Organisation', items: ['Houses', 'Residents', 'Reserves', 'Compliance', 'Settings'] }],
    firstTen: ['Add a zone and scan five items from the pantry.', 'Set a par on one and watch it become a buy request.', 'Add a resident with a tree-nut allergy and see the menu warn.', 'Open Today and see what the house needs — restock, expiry, dinner.'],
    proof: ['Live at careshop.app: a caregiver scans groceries into it at the store today.', 'Ten Oregon citations explained in the product, and the reserve target computed from your bed count.', 'Residents stay a label, never a name: diet tags, allergens, one texture level.'],
    doesNot: ['store diagnoses, medications, incidents or clinical notes', 'schedule anyone', 'print the tab where a reserve record goes', 'store a tray note, or rank one house against another'],
    pricing: { unit: 'house', rows: [['Free', '$0', 'One house, three people, five hundred items'], ['Pro', '$19 / house / mo', 'Up to five houses'], ['Scale', '$37 / house / mo', 'Unlimited houses, spend across houses, catalogue import and copying between houses']], note: 'Sold on the web. Free, Pro at $19, Scale at $37.' },
  },
  {
    id: 'binderkit', name: 'Binderkit', short: 'Binderkit', kind: 'mini',
    domain: 'binderkit.com', descriptor: 'Binder setup for care homes',
    owns: 'The paperwork', domainWord: 'the paperwork',
    accent: 'peri', accentText: 'periText', tone: 'Orderly and instructional', toneLine: 'Numbered, calm, nothing decorative. Never “ready”, “compliant” or “audit-proof”.',
    status: 'Draft v1.1 · no repo yet', statusKind: 'draft',
    headline: { text: 'Exactly what goes in each binder, in what order.', status: 'proposed', note: 'Unwritten in the vault; drawn from the messaging table.' },
    lede: 'Your licence track and five answers go in. Printable binder plans come out: tabs, a contents page with the rule beside each item, a brief and a procedure. Nothing about any person is stored.',
    signature: 'The printed contents page',
    handle: 'binderkit',
    cta: { primary: 'Start the 3-day trial', secondary: 'See a contents page', trial: true },
    tabs: ['Plan', 'Binders', 'Versions', 'Notes', 'More'],
    nav: [{ group: 'The binders', items: ['Plan', 'Binders', 'Versions', 'Notes'] }, { group: 'Organisation', items: ['Facilities', 'Settings'] }],
    firstTen: ['Pick the licence track.', 'Answer five questions.', 'See the plan and why each binder exists.', 'Print the resident-binder contents page and hold it.'],
    proof: ['Nothing about anyone: identity fields print blank, plans are keyed by a facility code.', 'The same answers always produce the same plan, with the reasoning shown.', 'Every item prints its rule and how sure we are of it.'],
    doesNot: ['store documents or scans', 'record policy acknowledgments or credential dates', 'hold emergency stock', 'certify readiness or score compliance'],
    pricing: { unit: 'facility', rows: [['3-day trial', 'Card on file', 'Prints on day one. Cancel in one tap.'], ['Pro', '$29 / facility / mo', 'Every binder, every print, every version. Or $149 once.'], ['Scale', '$69 / mo', 'Many facilities, the agency library, shared viewer seats.']], note: 'Per facility. Pro is a subscription, or a single purchase of $149 if you revise the binder twice a year.', once: '$149' },
  },
  {
    id: 'aidepost', name: 'Aidepost', short: 'Aidepost', kind: 'mini',
    domain: 'aidepost.com', descriptor: 'Open shifts and jobs in care homes',
    owns: 'The workforce', domainWord: 'the workforce',
    accent: 'orchid', accentText: 'orchidText', tone: 'Direct; warmer on the caregiver side', toneLine: 'Covered or not. Shifts near you, tonight.',
    status: 'Draft v1.1 · no repo yet', statusKind: 'draft',
    headline: { text: 'Someone for Saturday night.', status: 'proposed', note: 'Unwritten in the vault; the provider-side line from the messaging table. The caregiver side reads “Shifts near you, tonight.”' },
    lede: 'Your staff and their credential dates, the roster, the open-shift board, clock-in and timesheets. Outward, job posts and a relief pool of caregivers, free for them.',
    signature: 'The open-shift board',
    handle: 'aidepost',
    cta: { primary: 'Start the 3-day trial', secondary: 'Caregivers: find shifts', trial: true },
    tabs: ['Shifts', 'Staff', 'Credentials', 'Posts', 'More'],
    nav: [{ group: 'The workforce', items: ['Shifts', 'Staff', 'Credentials', 'Onboarding', 'Timesheets', 'Posts'] }, { group: 'Organisation', items: ['Houses', 'Settings'] }],
    firstTen: ['Add six staff and their CPR dates.', 'See the one that expires Friday turn coral.', 'Build next week’s roster.', 'See Saturday night open — offer it to own staff, then post outward.'],
    proof: ['Two-sided: providers buy it; caregivers use it free, without an organisation or a card.', 'Credentials are surfaced, never enforced: thirty-day and seven-day notices; expired turns coral on the roster.', 'A shift never describes a person: the shift schema has no field that can reference a resident.'],
    doesNot: ['run payroll or background checks', 'describe a resident in a posting', 'hold resident care, the MAR or incidents', 'write the house rules'],
    pricing: { unit: 'house + per post', rows: [['3-day trial', 'Card on file', 'Posting works on every plan, the trial included.'], ['Pro', '$29 / house / mo', 'Staff, credentials, the roster, clock-in, timesheets.'], ['Scale', '$59 / house / mo', 'Unlimited houses, agency roles, training-plan items.'], ['Job post', '$25 / post', 'Publishes when paid.']], note: 'Caregivers pay nothing. Providers buy Aidepost.' },
  },
];

export const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
export const MINIS = PRODUCTS.filter((p) => p.kind === 'mini');
export const markFor = (id) => MARKS[PRODUCTS.findIndex((p) => p.id === id)];

/* Card copy for the marks grid. Longer drawing notes live on MARKS; these
   are the one-breath lines a specimen can carry. Small-size lines match
   what the drawings actually trade below the 32px crossover, not the older
   “loses its dots” claim the house no longer does. */
