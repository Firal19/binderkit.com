// One entry per site. The page itself lives in render/pages/<id>.js and its
// look in css/pages/<id>.css; this is the small set of facts the shared
// pieces need — the domain, the nav, the buttons, the head, the social card.

const LEGAL = 'Bareeda LLC, doing business as Providerhub Oregon. Oregon, USA.';

export const CONFIGS = {
  cohort: {
    product: 'cohort',
    domain: 'cohorthome.app',
    description: 'The app a care home’s staff run the residents’ day on: the MAR, care notes, incidents, tasks and the shift handoff. One record, stamped and never deleted.',
    preloadFonts: ['fraunces.woff2', 'instrument-sans.woff2'],
    legalLine: LEGAL,
    cta: { primary: 'Get early access', nav: 'Early access', secondary: 'See a shift' },
    signIn: { label: 'Open the console', href: 'https://app.cohorthome.app' },
    nav: [
      { id: 'shift', label: 'The shift' },
      { id: 'stops', label: 'Two stops' },
      { id: 'record', label: 'The record' },
      { id: 'pricing', label: 'Pricing' },
    ],
    og: { bg: '#F9F4EC', ink: '#17201F', accent: '#E0704F', tile: '#0F5C5A', glyph: '#F9F4EC', display: 'Fraunces', displayFile: 'fraunces.woff2', body: 'Instrument Sans', bodyFile: 'instrument-sans.woff2', weight: 500 },
    faq: [
      ['Will Cohort stop my caregiver mid-shift?', 'Twice, ever: a medication that matches a recorded allergy, and an as-needed dose given too soon after the last one. Everything else surfaces and steps aside. There are no countdown timers anywhere in the product.'],
      ['Does Cohort work when the house wifi is bad?', 'Yes. Incidents are filed offline-safe and idempotent, and every shift write goes through an outbox. The record catches up; the caregiver does not wait for it.'],
      ['Can I export my data out of Cohort?', 'Yes. Exports are generated in the client with redaction on by default, and a cancelled account can still sign in to export before anything is purged.'],
      ['Is Cohort an electronic health record?', 'No. It runs the shift — medication administration, care documentation, incidents, tasks and the handoff. It does not author care plans or nursing assessments, schedule staff, or bill the state.'],
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
    description: 'Stock by zone, dated perishables, a weekly menu checked against who lives there, a buy queue under your policy, and receipts that land prices back on the shelf.',
    preloadFonts: ['fraunces.woff2', 'hanken-grotesk.woff2'],
    legalLine: LEGAL,
    cta: { primary: 'Start free', primaryHref: '/signup', nav: 'Start free', secondary: 'See the loop' },
    signIn: { label: 'Sign in', href: '/login' },
    appPaths: ['/signup', '/login', '/features', '/pricing', '/contact'],
    nav: [
      { id: 'loop', label: 'The loop' },
      { id: 'stock', label: 'Stock' },
      { id: 'queue', label: 'The queue' },
      { id: 'pricing', label: 'Pricing' },
    ],
    og: { bg: '#f6f4f0', ink: '#191713', accent: '#c25a38', tile: '#486b3d', glyph: '#ffffff', display: 'Fraunces', displayFile: 'fraunces.woff2', body: 'Hanken Grotesk', bodyFile: 'hanken-grotesk.woff2', weight: 600 },
    faq: [
      ['Isn’t CareShop just a grocery list?', 'A grocery list does not know that Room 2 · A is tree-nut allergic, that the water reserve is short against a licensed bed count, or what the applesauce cost at Fred Meyer last month. The loop is the product; the list is one station on it.'],
      ['Who checks the rules CareShop cites?', 'A provider who has been inspected on that track — and none has yet. The confidence on a citation and the banner on an unreviewed rule set are specified and not yet built; what runs today is ten Oregon citations explained in one line each, and the bare rule text on every other catalogue row.'],
      ['What if the phone has no signal in the store?', 'Picks queue offline. Every write goes through an outbox with idempotency, so a pick is never counted twice. Reading the till roll on the device is specified and not yet built.'],
      ['How much does CareShop cost?', 'Free to start with one house and up to three people. Nineteen dollars a house a month on Pro, thirty-seven on Scale for unlimited houses and seats.'],
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
    description: 'A licence track and five answers in; printable binder plans out — tabs, a contents page with the authority beside each item, a brief and an SOP.',
    preloadFonts: ['newsreader.woff2', 'instrument-sans.woff2'],
    legalLine: LEGAL,
    cta: { primary: 'Get early access', nav: 'Early access', secondary: 'See the contents page' },
    nav: [
      { id: 'plan', label: 'The plan' },
      { id: 'page', label: 'The page' },
      { id: 'library', label: 'The library' },
      { id: 'pricing', label: 'Pricing' },
    ],
    og: { bg: '#FFFFFF', ink: '#17201F', accent: '#6E8FE8', tile: '#17201F', glyph: '#FFFFFF', display: 'Newsreader', displayFile: 'newsreader.woff2', body: 'Instrument Sans', bodyFile: 'instrument-sans.woff2', weight: 500 },
    faq: [
      ['Can’t I just copy another provider’s binder?', 'A copied binder carries someone else’s licence track, someone else’s house count, and someone else’s gaps. Binderkit builds the plan from your track and your five answers.'],
      ['Will Binderkit make me compliant?', 'No. It tells you what the rule asks for, with the rule printed beside it, in order. It does not certify anything — and the words ready, compliant and audit-proof are forbidden in the product by design.'],
      ['What if a citation is wrong?', 'It tells you before you print it. Every item carries an evidence tag: verified when someone inspected on that track has read the primary source, derived when it comes from the rule chapter.'],
      ['Does Binderkit store anything about residents?', 'No. Identity fields print blank and are filled in by hand, and a plan is keyed by a facility code rather than a name. There is no free-text field about a resident anywhere in the product.'],
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
    description: 'Staff and credential dates, the roster, the open-shift board, clock-in and timesheets — plus job posts and a relief pool of caregivers, free to them.',
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
    og: { bg: '#F7F3EC', ink: '#17201F', accent: '#D4699F', tile: '#17201F', glyph: '#F7F3EC', display: 'Bricolage Grotesque', displayFile: 'bricolage-grotesque.woff2', body: 'Manrope', bodyFile: 'manrope.woff2', weight: 700 },
    faq: [
      ['Why not just post an open shift in the Facebook group?', 'A Facebook group does not know who holds a current CPR card, cannot record that the shift was offered to your own staff first, and leaves you no timesheet at the end of the week.'],
      ['Will Aidepost stop me scheduling someone whose CPR has lapsed?', 'No. It tells you at thirty days, at seven days, and on the roster itself. Credentials are surfaced, never enforced — the decision stays yours.'],
      ['Will my staff be poached?', 'Shifts are never public. Only a job post is public, and only when you publish it and pay for it.'],
      ['Do caregivers pay for Aidepost?', 'Never. Providers buy Aidepost. Caregivers create a profile, keep their credential dates, claim shifts and apply to posts free, without an organisation and without a card.'],
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

export default CONFIGS;
