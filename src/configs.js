// One entry per site. The page itself lives in render/pages/<id>.js and its
// look in css/pages/<id>.css; this is the small set of facts the shared
// pieces need — the domain, the nav, the buttons, the head, the social card.

import { BOXES, ROUTES, SUBJECTS } from '../lib/boxes.js';

const LEGAL = '© 2026 Bareeda LLC · Providerhub Oregon · Oregon';

export const CONFIGS = {
  cohort: {
    product: 'cohort',
    domain: 'cohorthome.app',
    description: 'Run the shift from the house phone: the MAR, care notes, incidents, tasks and the handoff. One record, stamped and never deleted. For Oregon care homes.',
    preloadFonts: ['fraunces.woff2', 'instrument-sans.woff2'],
    legalLine: LEGAL,
    cta: { primary: 'Get early access', nav: 'Early access', secondary: 'See a shift' },
    signIn: { label: 'Sign in', href: 'https://app.cohorthome.app' },
    nav: [
      { id: 'shift', label: 'The shift' },
      { id: 'stops', label: 'Two stops' },
      { id: 'record', label: 'The record' },
      { id: 'house', label: 'Your house' },
      { id: 'pricing', label: 'Pricing' },
    ],
    og: { bg: '#F9F4EC', bgDark: '#0E1F1E', ink: '#17201F', accent: '#E0704F', tile: '#0F5C5A', glyph: '#F9F4EC', display: 'Fraunces', displayFile: 'fraunces.woff2', body: 'Instrument Sans', bodyFile: 'instrument-sans.woff2', weight: 500 },
    faq: [
      ['Will Cohort stop my caregiver mid-shift?', 'Twice, ever: a medication that matches a recorded allergy, and an as-needed dose given too soon. Everything else informs and steps aside. There are no countdown timers.'],
      ['Does Cohort work when the house wifi is bad?', 'Yes. Doses, notes, tasks and incident drafts queue on the phone and catch up when the signal returns. Nothing is lost and nothing is recorded twice.'],
      ['Can I take my data out of Cohort?', 'Yes, at any time, without asking anyone. The export is a ZIP you can read without Cohort, and a cancelled account can still sign in to export.'],
      ['How is Cohort different from Therap?', 'Therap and the other large systems are built for agencies with a compliance department. Cohort is built for a house: it runs on the phone your staff already carry, sets up in an afternoon, and is priced per house.'],
      ['Is Cohort an electronic health record?', 'No. It runs the shift: medications, notes, incidents, tasks and the handoff. It does not author care plans or bill the state.'],
    ],
    privacy: {
      holds: [
        ['Protected health information', 'Fourteen tables. Residents, their allergies and diagnoses, medication orders and doses, care notes, incidents and plan versions — everything a shift is run from.'],
        ['Personal information', 'Two tables: the people who sign in, and their membership of an organisation and its houses.'],
        ['Public', 'Three tables, holding nothing about any person.'],
      ],
      baa: true,
    },
  },

  careshop: {
    product: 'careshop',
    domain: 'careshop.app',
    description: 'Kitchen software for care homes. Stock by zone, dated food, a menu checked against who lives there, and a buy list that writes itself. Free to start.',
    preloadFonts: ['fraunces.woff2', 'hanken-grotesk.woff2'],
    legalLine: LEGAL,
    cta: { primary: 'Start free', primaryHref: 'https://app.careshop.app/signup', nav: 'Start free', secondary: 'See Today' },
    signIn: { label: 'Sign in', href: 'https://app.careshop.app/login' },
    appPaths: ['/signup', '/login', '/features', '/pricing', '/contact'],
    nav: [
      { id: 'loop', label: 'The loop' },
      { id: 'today', label: 'Today' },
      { id: 'stock', label: 'Stock' },
      { id: 'queue', label: 'The queue' },
      { id: 'kitchen', label: 'Your kitchen' },
      { id: 'pricing', label: 'Pricing' },
    ],
    og: { bg: '#f6f4f0', bgDark: '#1b1613', ink: '#191713', accent: '#c25a38', tile: '#486b3d', glyph: '#ffffff', display: 'Fraunces', displayFile: 'fraunces.woff2', body: 'Hanken Grotesk', bodyFile: 'hanken-grotesk.woff2', weight: 600 },
    faq: [
      ['Isn’t CareShop just a grocery list?', 'A grocery list does not know that Room 2 is allergic to tree nuts, that the water reserve is short against your bed count, or what applesauce cost last month. The loop is the product.'],
      ['What if the phone has no signal in the store?', 'Picks wait on the phone. When the signal comes back they land once, and a pick is never counted twice.'],
      ['Can I use CareShop across more than one house?', 'Yes. Pro covers up to five houses. Scale is unlimited houses and seats, with spend across all of them.'],
      ['How much does CareShop cost?', 'Free to start with one house and up to three people. Nineteen dollars a house a month on Pro, thirty-seven on Scale.'],
    ],
    privacy: {
      holds: [
        ['Protected health information', 'One table: residents — diet tags, allergens, one texture level, Fatal Four roles and prep preferences. Enough for a tray note and a menu check. There are no clinical columns, and the validator refuses a name.'],
        ['Personal information', 'Memberships: the people who sign in, and their membership of an organisation and its houses.'],
        ['Public', 'Everything else — the catalogue, stores, prices, rule sets.'],
      ],
      baa: true,
    },
  },

  binderkit: {
    product: 'binderkit',
    domain: 'binderkit.com',
    description: 'Binder setup for Oregon care homes. Your licence track and five answers in; printable binder plans out, with the rule beside each item. No resident data.',
    preloadFonts: ['newsreader.woff2', 'instrument-sans.woff2'],
    legalLine: LEGAL,
    cta: { primary: 'Get early access', nav: 'Early access', secondary: 'See the contents page' },
    nav: [
      { id: 'plan', label: 'The plan' },
      { id: 'page', label: 'The page' },
      { id: 'library', label: 'The library' },
      { id: 'pricing', label: 'Pricing' },
    ],
    og: { bg: '#FFFFFF', bgDark: '#F3EBDA', ink: '#17201F', accent: '#6E8FE8', tile: '#17201F', glyph: '#FFFFFF', display: 'Newsreader', displayFile: 'newsreader.woff2', body: 'Instrument Sans', bodyFile: 'instrument-sans.woff2', weight: 500 },
    faq: [
      ['Can’t I just copy another provider’s binder?', 'A copied binder carries someone else’s licence track, house count and gaps. Binderkit builds the plan from your track and your answers.'],
      ['Will Binderkit make me compliant?', 'No. It tells you what the rule asks for, with the rule printed beside it, in order. It certifies nothing.'],
      ['What if a citation is wrong?', 'Every item carries a tag: verified, derived or open. Filter the plan to the unconfirmed items and take that list to an adviser.'],
      ['Does Binderkit store anything about residents?', 'No. Identity fields print blank, plans are keyed by a facility code, and there is no free-text field about a person anywhere.'],
    ],
    privacy: {
      holds: [
        ['Protected health information', 'None. There is no field in this product that can hold a name, a date of birth, a diagnosis or a finding about a person.'],
        ['Personal information', 'Your own account: an email address, and your membership of an organisation and its facilities.'],
        ['Public', 'Six tables — the rule libraries, the templates and the plans, keyed by facility code.'],
      ],
      baa: false,
    },
  },

  aidepost: {
    product: 'aidepost',
    domain: 'aidepost.com',
    description: 'Open shifts and jobs in care homes. Staff and credential dates, the roster, the open-shift board, clock-in and timesheets. Free for caregivers.',
    preloadFonts: ['bricolage-grotesque.woff2', 'manrope.woff2'],
    legalLine: LEGAL,
    cta: { primary: 'Get early access', nav: 'Early access', secondary: 'Caregivers: find shifts' },
    joinHouses: ['I’m a caregiver'],
    nav: [
      { id: 'providers', label: 'For providers' },
      { id: 'caregivers', label: 'For caregivers' },
      { id: 'credentials', label: 'Credentials' },
      { id: 'pricing', label: 'Pricing' },
    ],
    og: { bg: '#F7F3EC', bgDark: '#1C1620', ink: '#17201F', accent: '#D4699F', tile: '#17201F', glyph: '#F7F3EC', display: 'Bricolage Grotesque', displayFile: 'bricolage-grotesque.woff2', body: 'Manrope', bodyFile: 'manrope.woff2', weight: 700 },
    faq: [
      ['Why not just post an open shift in the Facebook group?', 'A Facebook group does not know who holds a current CPR card, cannot show that you offered the shift to your own staff first, and leaves you no timesheet at the end of the week.'],
      ['Will Aidepost stop me scheduling someone whose CPR has lapsed?', 'No. It tells you at thirty days, at seven, and on the roster itself. The decision stays yours.'],
      ['Will my staff be poached?', 'Shifts are never public. Only a job post is public, and only when you publish it and pay for it.'],
      ['Do caregivers pay for Aidepost?', 'Never. Caregivers create a profile, keep their dates, claim shifts and apply to posts free, without an organisation and without a card.'],
    ],
    privacy: {
      holds: [
        ['Protected health information', 'One table: assignments, where a named caregiver is paired with a resident who needs one-to-one support. Nothing else in the product can reference a resident.'],
        ['Personal information', 'Ten tables — staff, credentials and their dates, onboarding, shifts, clock events, timesheets, applications and caregiver profiles.'],
        ['Public', 'Two tables: published job posts, and the reference data behind them.'],
      ],
      baa: true,
    },
  },
};

/* Every config carries its own mail block, so no render module ever imports
   the plumbing: cfg.mail = { boxes, routes, subjects }. One source of truth
   in lib/boxes.js, shared with the API side. */
for (const c of Object.values(CONFIGS)) {
  c.mail = { boxes: BOXES[c.domain] || { main: 'hello' }, routes: ROUTES[c.domain] || {}, subjects: SUBJECTS[c.domain] || {} };
}

export default CONFIGS;
