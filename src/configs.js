// One entry per site. This is the only file that differs between the three
// repositories in anything but a single import line: everything else — the
// data, the renderer, the face package, the stylesheet — is byte-identical,
// which is the mechanism that makes the family read as one maker.

const FONTS = ['561da8545041.woff2', '175f6e93d557.woff2'];   // Instrument Sans, Fraunces — latin, upright
const LEGAL = 'Bareeda LLC, doing business as Provider Hub Oregon. Oregon, USA.';

export const CONFIGS = {
  cohort: {
    product: 'cohort',
    domain: 'cohorthome.app',
    description: 'The app a care home’s staff run the residents’ day on: the MAR, care notes, incidents, tasks and the shift handoff. One record, stamped and never deleted.',
    preloadFonts: FONTS,
    legalLine: LEGAL,
    cta: {
      primary: 'Get early access',
      nav: 'Early access',
      secondary: 'See Today',
      secondaryHref: '#today',
    },
    nav: [
      { id: 'today', label: 'The screen' },
      { id: 'pass', label: 'The pass' },
      { id: 'boundary', label: 'What it does' },
      { id: 'pricing', label: 'Pricing' },
    ],
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

  binderkit: {
    product: 'binderkit',
    domain: 'binderkit.com',
    description: 'A licence track and five answers in; printable binder plans out — tabs, a contents page with the authority beside each item, a brief and an SOP.',
    preloadFonts: FONTS,
    legalLine: LEGAL,
    cta: {
      primary: 'Get early access',
      nav: 'Early access',
      secondary: 'See a contents page',
      secondaryHref: '#contents',
    },
    nav: [
      { id: 'contents', label: 'The page' },
      { id: 'plan', label: 'The plan' },
      { id: 'library', label: 'The library' },
      { id: 'pricing', label: 'Pricing' },
    ],
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
    preloadFonts: FONTS,
    legalLine: LEGAL,
    cta: {
      primary: 'Get early access',
      nav: 'Early access',
      secondary: 'Caregivers: find shifts',
      secondaryHref: '#caregivers',
    },
    // Aidepost is the only two-sided product, so its list takes both sides.
    joinHouses: ['I’m a caregiver'],
    nav: [
      { id: 'board', label: 'The board' },
      { id: 'flow', label: 'How it fills' },
      { id: 'caregivers', label: 'For caregivers' },
      { id: 'pricing', label: 'Pricing' },
    ],
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
