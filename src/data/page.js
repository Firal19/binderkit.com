// The three landing pages, as data. One invariant spine, one object per
// product, no HTML anywhere in this file — so adding or dropping a section is
// a one-line edit and a product can never quietly reorder the argument.
//
// The copy is the system board's, reset for a public page: the state-of-the-
// work ledgers, the open-item marks and the internal design-register flags
// are gone; what each product does, refuses to do, and costs is what is left.

import { PRODUCTS, MINIS } from './brand.js';

/* ── the spine ───────────────────────────────────────────────────────────
   Fifteen slots, fixed order, every product. `caregiver` is the one
   structural insert in the family — Aidepost is the only two-sided product —
   and it sits between `evidence` and `roles`. A product may DROP a slot; it
   may never reorder one, and the renderer asserts it.                    */
export const SPINE = [
  'hero', 'proof', 'screen', 'loop', 'depth', 'boundary', 'evidence',
  'caregiver', 'roles', 'objections', 'start', 'join', 'pricing', 'ladder', 'family', 'foot',
];

/* ── the copy every product shares ───────────────────────────────────────
   Written once and read by all three. This is the mechanism that makes the
   family read as one maker rather than three teams: the signup, the billing
   states and the trial line are literally the same strings on every page. */
export const TRIAL_FINE = 'Three days, card on file, everything Pro shows, one-tap cancel. Sold on the web, never through an app store.';

export const SIGNUP_SIX = {
  heading: 'Signing up, in six steps — the same in every product in this family',
  steps: [
    'email and password',
    'licence track — APD, DD, OHA or Agency',
    'organisation name',
    'your first house',
    'Terms, Privacy, the Customer BAA and auto-renewal',
    'card on file',
  ],
  tail: 'and the trial starts.',
};

export const SIGNUP_FIVE = {
  heading: 'Signing up, in five steps — the one variant in the family',
  steps: [
    'email and password',
    'licence track — APD, DD, OHA or Agency',
    'organisation name and your first facility',
    'Terms, Privacy and auto-renewal — there is no Customer BAA, because there is nothing to protect',
    'card on file',
  ],
  tail: 'Five steps, not six. Binderkit holds no record about any person, so there is nothing to sign for.',
};

export const BILLING_STATES = {
  heading: 'If a payment fails',
  rows: [
    ['trialing / active', 'Full access.'],
    ['past_due', 'Full access; you are warned, not punished, during the retries — emails on day 0, day 7 and day 14.'],
    ['read_only', 'Reads, export, and the product’s preserved core doing.'],
    ['cancelled', 'You can still sign in to export, until purge. Export first, then hard delete. The audit log is retained.'],
  ],
};

export const EVERY_PLAN = 'Every plan sees every screen; an action above your plan is shown with its cost, never silently blocked.';

/* The waitlist. One block, one form, the same promise on all three sites. */
export const JOIN = {
  eyebrow: 'Early access',
  heading: 'Be in the first houses on it.',
  sub: 'Leave an email and we will tell you when it opens, what it costs, and how to get in. One message when there is something to say — nothing else, ever.',
  fields: { email: 'Work email', houses: 'How many houses?', track: 'Licence track' },
  tracks: ['APD', 'DD', 'OHA', 'Agency', 'Not licensed yet'],
  houseOptions: ['1', '2–3', '4–9', '10+', 'An agency'],
  button: 'Join the list',
  busy: 'Sending…',
  done: 'You are on the list. We will write once, when it opens.',
  failHead: 'That did not send.',
  fine: 'One email address, one licence track, one house count. No card, no account, no newsletter.',
};

/* ── Cohort ───────────────────────────────────────────────────────────── */
const cohort = {
  id: 'cohort',
  accentBudget: 3,
  sections: [
    {
      key: 'hero', kind: 'hero', id: 'top',
      instrument: { desktop: 'ios', mobile: 'ios' },
      live: 'notice',
      descriptorInline: true,
      eyebrow: 'Phone-first · Oregon AFH, DD and agency homes',
      fine: 'Runs on the house phone your staff already carry. Offline-safe, so a shift never waits for the wifi.',
      strip: {
        kind: 'struck', label: 'What comes off the wall',
        cells: ['The paper MAR', 'The shift binder', 'The whiteboard', 'The group text'],
      },
    },
    {
      key: 'proof', kind: 'proof', id: 'why',
      items: [
        ['Two gates, and nothing else blocks', 'A medication that matches a recorded allergy, and an as-needed dose given too soon. Everything else surfaces and steps aside.'],
        ['Append-only, by construction', 'Every field is stamped “Logged by · at”. A correction is an addendum under the original. Nothing is deleted, and un-administering is forbidden by the state machine.'],
        ['Running in a real house', 'A pilot adult foster home in Eugene runs its medication passes on it, on the AFH-DD track.'],
      ],
    },
    {
      key: 'screen', kind: 'screen', id: 'today',
      heading: 'Today, at 06:55.',
      sub: 'The first screen after sign-in. It shows what is due and what is late, hides what is fine, and stores nothing of its own — it composes reads from each source surface.',
      instrument: { desktop: 'ios', mobile: 'ios' },
      callouts: [
        [(s) => `“${s.tabBadge.text}”`, 'A count of what is due, not a score. There is no readiness percentage anywhere in this product, and no countdown.'],
        [(s) => `“${said(s.handoff.rows, 'Documentation')}”`, 'Inside the handoff: what the night shift finished, counted. Nine of nine — never ninety-five per cent.'],
        [(s) => `“${s.handoff.t}”, and “${s.handoff.receipt}”`, 'The night caregiver has gone. This is what she left — MAR status per resident, documentation done, incidents and open issues — and the receipt that records the day caregiver reading it.'],
        [(s) => `“${s.rows[0].stamp}”`, 'Every entry is stamped “Logged by · at”. Nothing is deleted, and a correction is an addendum under the original.'],
        ['below the list', 'Completed items disappear rather than sit in the list.'],
      ],
      caption: 'Nothing on this screen is red, and nothing on it is a score. Coral marks one thing in this product — what needs attention this shift.',
      figure: {
        heading: 'How it speaks',
        rejected: '⚠ MEDICATIONS OVERDUE',
        kept: '4 meds due',
        caption: 'Calm and factual. That is the whole voice rule, and it is testable on any string in the product.',
      },
    },
    {
      key: 'loop', kind: 'loop', id: 'pass',
      heading: 'The pass, as the state machine runs it.',
      sub: 'Six steps, two of which can stop you. They are the only two in the product.',
      device: 'dots',
      nodes: [
        { label: 'scheduled' },
        { label: 'Six Rights' },
        { label: 'allergy check', accent: true },
        { label: 'PRN interval', accent: true },
        { label: 'signed', states: [['given', 'Given'], ['held', 'Held']] },
        { label: 'witness co-sign' },
        { label: 'locked' },
      ],
      gates: [
        'A medication that matches a recorded allergy.',
        'An as-needed dose given too soon after the last one.',
      ],
      gateNote: 'Both were chosen because the harm of not stopping is physical. An override is recorded with a reason; then the pass proceeds. There is no third gate, and there are no countdown timers.',
      pull: 'Un-administering is forbidden by the state machine.',
      machines: [
        ['Incident', 'filed (offline-safe, idempotent) → manager notified by push → reviewed → signed off with an addendum → locked. Addenda append forever.'],
        ['Care note', 'draft → saved and stamped → correction window → locked → addendum. Prior edits are one tap away.'],
        ['Handoff', 'the outgoing caregiver taps Start handover → a sheet composed from MAR status per resident, documentation done, incidents, tasks and open issues → the incoming caregiver reads → a read receipt is recorded.'],
        ['Plan version', 'uploaded with an expiry → goals extracted → notes link to goals → the expiry surfaces at thirty days → superseded by the next version, with the diff retained. Storage and expiry. Never authoring.'],
      ],
    },
    {
      key: 'depth', kind: 'table', id: 'rules',
      heading: 'The Oregon rule, quoted beside the thing it governs.',
      sub: 'Track-qualified: the citation you see is the one for the licence you hold, not a national average.',
      cols: ['Topic', 'What is shown', 'Track'],
      mono: [1],
      rows: [
        ['Records and documentation', 'OAR 411-360-0170', 'DD'],
        ['Abuse and incident', 'OAR 411-360-0185', 'DD'],
        ['Medication delegation', 'OSBN 851-047 applies to AFH practice; OAR 855-080 does not', 'All tracks'],
        ['Capacity', 'Five for AFH — OAR 411-360-0060', 'AFH'],
        ['Records and documentation', 'OAR 411-050-0745 / 0750', 'APD'],
        ['Elopement response', 'Per resident, from the individual support plan. No fixed window, because the rule sets none.', 'All tracks'],
      ],
      pull: 'A citation with no track beside it is a citation you cannot check.',
      closing: 'Four tracks are supported — APD, DD, OHA and Agency — and the track you pick at signup selects the library for every house under it.',
    },
    {
      key: 'boundary', kind: 'boundary', id: 'boundary',
      heading: 'What Cohort does, and what it leaves to the room next door.',
      sub: 'Every overlapping feature has one home at full depth, and is a thin, declared shadow anywhere else. That is why this one stays fast.',
      cols: [
        {
          label: 'Next door', kind: 'next', items: [
            ['Schedule staff, track clock-in, or hold credentials', 'aidepost'],
            ['Run the kitchen', 'careshop'],
            ['Generate binders', 'binderkit'],
            ['Hold resident funds, author ISPs, or bill the state', 'pho'],
          ],
        },
        {
          label: 'Nowhere', kind: 'never', items: [
            ['Police compliance. No timers. No readiness scores. No “audit-ready” badge. Not in the name, not in a descriptor, not in the interface.', null],
          ],
        },
      ],
      strip: {
        kind: 'phrase', label: 'Is not',
        cells: ['an EHR', 'clinical authoring — no ISP or nursing assessments, Provider Hub Oregon does those', 'payroll', 'scheduling', 'billing to the state', 'compliance certification'],
      },
    },
    {
      key: 'evidence', kind: 'evidence', id: 'record',
      heading: 'Nothing is deleted, and nothing leaves.',
      sub: 'The protection is mechanism, not adjectives. Here is the mechanism.',
      blocks: [
        { label: 'Append-only', text: 'Every field is stamped “Logged by · at”. Corrections are addenda under the original. Nothing is deleted. Un-administering is forbidden by the state machine.' },
        { label: 'Audited', text: 'Every query that returns protected information writes an audit row.' },
        { label: 'What an email says', quote: 'You have 2 items waiting in Cohort for WH-1. Sign in.', text: 'Never a resident, never a medication, never an incident.' },
        { label: 'What a push says', quote: 'WH-1: medication due.' },
        { label: 'The house short-code', text: 'Product-assigned, never typed. So a house named after its only resident cannot leak through an email.' },
        { label: 'The rest', text: 'Errors are scrubbed before they reach the error reporter. Analytics count MAR passes per house per day, never per resident. Exports are generated in the client, with redaction on by default. URLs are opaque short-codes.' },
      ],
      closingBlocks: [
        { text: 'Fourteen tables hold protected information, two hold personal information, three are public. It lives only in Convex under an executed business associate agreement, and travels only to a signed-in phone. You accept a Customer BAA at signup, at step five, before the trial.' },
        { heading: 'One setting, two kinds of house', text: 'A house is either solo or team, and that drives the controlled-count and witness rules. One switch is the difference between the home where the provider is also the caregiver and the agency group home running shifts.' },
      ],
    },
    {
      key: 'roles', kind: 'roles', id: 'roles',
      heading: 'Three people, three rhythms.',
      sub: 'Phone-first is only a claim if you cannot say who is holding the phone, and how often.',
      cols: ['Role', 'Who', 'In Cohort, they', 'Device and rhythm'],
      rows: [
        ['provider', 'The licence holder; an agency’s Executive Director', 'Set up houses and residents, invite staff, review roll-ups, print for the licensing file, manage billing', 'Phone + laptop, weekly'],
        ['manager', 'Resident manager; program manager', 'Sign off incidents, review notes, manage medication orders, answer the surveyor', 'Phone, daily'],
        ['caregiver', 'Direct care staff; DSPs; substitutes', 'Sign the MAR, write notes, file incidents, do tasks, read and write the handoff', 'The house phone, every shift'],
      ],
      perms: [
        ['Gate overrides', 'caregiver, manager and provider each record the override with a reason.'],
        ['Incident PDF export', 'caregiver none; manager export, audited; provider export.'],
        ['Billing', 'provider only.'],
        ['Resident record', 'caregiver view, and edit contacts and allergies.'],
      ],
      closing: 'The same three words in code and on screen. Executive Director maps to provider, Program Manager to manager, DSP to caregiver — which is why your staff need no retraining when one house becomes twenty.',
    },
    {
      key: 'objections', kind: 'qa', id: 'questions',
      heading: 'The questions we get.',
      rows: [
        ['Will it stop my caregiver mid-shift?', 'Twice, ever. A medication that matches a recorded allergy, and an as-needed dose given too soon after the last one. Everything else surfaces and steps aside. The governing idea is inform, don’t police, and there are no countdown timers anywhere in the product.'],
        ['The wifi in that house is bad.', 'Incidents are filed offline-safe and idempotent. Every shift write goes through the outbox. The record catches up; the caregiver does not wait for it.'],
        ['Can I get my data out?', 'Yes, and on the way out too. Exports are generated in the client with redaction on by default, and a cancelled account can still sign in to export before anything is purged. The same export is what carries you up to Provider Hub Oregon when one house becomes twenty.'],
        ['What about Synkwise, or Therap?', 'Synkwise publishes $119–149 a month and works across many states. Therap and PointClickCare assume an agency with a compliance department. What we have instead: Oregon track-qualified citations, two gates and nothing else that blocks, an append-only record, one-house pricing — and nothing red. Those prices are their published range, not ours.'],
      ],
    },
    {
      key: 'start', kind: 'start', id: 'start',
      heading: 'The first ten minutes.',
      sub: 'The trial is the message. If this feels calm and fast, you can trust it.',
      steps: ['Name the house.', 'Add one resident with an allergy.', 'Enter one medication order.', 'Sign one dose behind the Six Rights dialog, and watch “Logged by · at” appear.'],
    },
    { key: 'join', kind: 'join', id: 'join' },
    {
      key: 'pricing', kind: 'tiers', id: 'pricing',
      heading: 'One price per house. Nothing hidden behind a plan.',
      sub: EVERY_PLAN,
      main: 1,
      note: 'Pricing is per house and is set at launch. Join the early-access list and you will have it, in writing, before anyone else. Sold on the web through Stripe Checkout; the native application never presents a purchase sheet.',
    },
    {
      key: 'ladder', kind: 'map', id: 'ladder',
      heading: 'When one house becomes twenty.',
      sub: 'Export → import, one login. Nothing is rewritten twice.',
      rows: [
        ['Residents, contacts, diagnoses, allergies, summary sheets', 'M02 Resident Management'],
        ['Medications, orders, doses, controlled counts, delegations', 'M04 Workspace eMAR'],
        ['Care documentation', 'M04 Daily Documentation'],
        ['Incidents', 'M04 Incident Reporting'],
        ['Plans', 'M02 ISP and Behaviour Support'],
        ['Tasks', 'M04 and M15 Quality Assurance'],
        ['Handoffs', 'M04 Shift Handoff'],
      ],
      footer: 'Lands on Professional or Enterprise, when care plans are authored in-system, nursing assessments arrive, or you start billing the state.',
      closing: 'Your staff keep the same three words. That is the point of the ladder.',
    },
    { key: 'family', kind: 'band', id: 'family', heading: 'One house. Four rooms. One ladder.', byline: 'by Provider Hub Oregon' },
    {
      key: 'foot', kind: 'foot', id: 'foot',
      by: 'by Provider Hub Oregon',
      disclaimer: 'WH-1, Meadow Care and the names on any screen shown here are sample data, not real people or real houses.',
    },
  ],
};

/* ── Binderkit ────────────────────────────────────────────────────────────
   The tab notch and the leader dot. The only hero in the family with no
   device: a printed sheet at paper aspect. Each section carries a control
   number, BK-LP-01 … , so scrolling reads like turning a plan.           */
const binderkit = {
  id: 'binderkit',
  accentBudget: 3,
  control: 'BK-LP',
  sections: [
    {
      key: 'hero', kind: 'hero', id: 'top',
      eyebrow: 'Zero resident data · no business associate agreement required',
      instrument: { desktop: 'paper', mobile: 'paper' },
      live: 'tag',
      descriptorInline: true,
      fine: 'It prints on day one, on the black-and-white printer you already own.',
    },
    {
      key: 'proof', kind: 'proof', id: 'why',
      items: [
        ['It holds nothing about anyone', 'Identity fields print blank and are filled in by hand. A plan is keyed by a facility code, not a name — so there is no protected information to lose.'],
        ['Deterministic', 'The same answers always produce the same plan, and the reasoning is shown per binder. You can check it.'],
        ['Every item prints its authority', 'The rule beside the tab, with an evidence tag saying whether it was read from the primary source or derived from the rule chapter.'],
      ],
    },
    {
      key: 'screen', kind: 'screen', id: 'contents',
      heading: 'One page: the contents page.',
      sub: 'One page per binder. It is the thing the surveyor sees first — and the four templates were designed on a black-and-white home printer before any screen work happened.',
      instrument: { desktop: 'paper', mobile: 'paper' },
      split: true,
      callouts: [
        ['“Facility ______ · Resident ______”', 'Blank, and filled in by hand. There is no field here that could hold a name, and there is no free-text field about a resident anywhere in the product.'],
        [(s) => `“${s.rows[2].slice(0, 3).join(' · ')}”`, 'The authority beside the item. That column is the product.'],
        [(s) => `“${s.rows[3].slice(0, 4).join(' · ')}”`, 'Derived from the rule chapter. It prints that way, visibly, until someone inspected on that track confirms it against the primary source.'],
        [(s) => `“${s.rows[4].slice(0, 4).join(' · ')}”`, 'Verified: someone inspected on this track read the primary source. Every tab prints its evidence tag, and the page does not hide which is which.'],
        [(s) => `“${s.control} · by Provider Hub Oregon”`, 'A version and a control number in the footer of every page, so two binders on two shelves can be told apart.'],
      ],
      strip: {
        label: 'What else prints',
        cells: ['Tab dividers', 'A one-page brief', 'A standard operating procedure'],
        foot: 'PDFs on the phone, and the same layout rendered in the browser on a laptop.',
      },
    },
    {
      key: 'loop', kind: 'loop', id: 'plan',
      heading: 'Five answers in. Five binders out.',
      sub: 'Deterministic: the same answers always produce the same plan, with the reasoning shown.',
      device: 'tabs',
      nodes: [
        { label: 'Question zero', note: 'The licence track. It selects the library, and the library is everything: the items, the order, the citations.' },
        { label: 'Five questions', note: 'How many homes, whether you have staff, and so on.' },
        { label: 'The plan', note: 'The recommended plan, with the reasoning shown per binder: which binders this licence needs, and why each one exists.' },
        { label: 'Print', note: 'The contents page, tab dividers, the brief and the SOP. A print-count row is written.' },
        { label: 'Edit, guarded', note: 'Add, remove or reorder a tab. Three guardrails answer in plain words: coverage, scope and access, cohesion.', accent: true },
        { label: 'Re-plan', note: 'An answer changes — “now has staff” — the plan regenerates, the diff is shown, notes carry by item ID, and the version becomes n+1.' },
        { label: 'Reset', note: 'Regenerate from the answers. Edits discarded, notes kept.' },
      ],
      quote: { at: 4, text: 'This item is required by 411-360-0170; it can move but not go.' },
      closing: 'A refusal is written in plain words, with the rule that caused it. A guardrail that cannot explain itself is a bug.',
    },
    {
      key: 'depth', kind: 'table', id: 'library',
      heading: 'The licence track selects the library, and the library is the product.',
      sub: 'Four tracks, four chapters of Oregon rule. Here is what each one draws on.',
      cols: ['Library', 'Authority', 'Coverage'],
      mono: [1],
      rows: [
        ['AFH-DD', 'OAR 411-360 — 0130 standards, 0140 health, 0170 documentation, 0185 abuse and incident; plus 411-004 HCBS', 'Thirty-two resident items, observed at a pilot home and cited item by item.'],
        ['Agency', 'OAR 411-325 (as amended 15 January 2026), 411-323, 411-318, 411-004', 'One hundred and twenty-six items across four chapters.'],
        ['AFH-APD', 'OAR 411-050 — 0745 Facility Records, 0750 resident records', 'On the roadmap.'],
        ['AFH-OHA', 'OAR 309-040', 'On the roadmap.'],
      ],
      pull: 'Every item prints its authority citation and its evidence tag.',
      struck: {
        heading: 'Three words that do not appear in this product',
        words: ['ready', 'compliant', 'audit-proof'],
        foot: 'Not in the name, not in a descriptor, not anywhere in the interface. It tells you what the rule asks for. It does not certify you.',
      },
    },
    {
      key: 'boundary', kind: 'boundary', id: 'boundary',
      heading: 'What Binderkit refuses to do — and why the refusal is the product.',
      cols: [
        {
          label: 'Next door', kind: 'next', items: [
            ['Store documents or scans', 'pho', 'Provider Hub Oregon, the Digital Binder'],
            ['Record policy acknowledgments or credential dates', 'aidepost', 'Binderkit prints the policy; Aidepost records the signature'],
            ['Hold emergency stock', 'careshop', null],
          ],
        },
        {
          label: 'Never', kind: 'never', items: [
            ['Review cycles · findings · a readiness dashboard · e-signature · document storage.', null],
            ['Each of those would reintroduce a record about a person, and this product’s value is that it holds none.', null],
          ],
        },
      ],
    },
    {
      key: 'evidence', kind: 'evidence', id: 'record',
      heading: 'It holds nothing about anyone.',
      sub: 'Which is the whole reason it can ship before anything else in the family.',
      blocks: [
        { label: 'Classification', text: 'Zero protected health information. Zero personal information beyond your own user account. Six public tables.' },
        { label: 'No Customer BAA', text: 'Which is why the signup is five steps, not six. There is nothing to protect, so there is nothing to sign for.' },
        { label: 'The key', text: 'A plan is keyed by a facility code, not a name. There is no free-text field about a resident anywhere.' },
        { label: 'What an email says', quote: 'Your plan for facility WH-1 has a new version.', text: 'That is the entire template.' },
        { label: 'Printing', text: 'Client-side, with the identity fields blank.' },
        { label: 'Determinism', text: 'The same answers always produce the same plan, with the reasoning shown. You can check it.' },
      ],
    },
    {
      key: 'roles', kind: 'roles', id: 'roles',
      heading: 'Three people, one device.',
      sub: 'The device column is short on this page, because it prints.',
      cols: ['Role', 'Who', 'In Binderkit, they', 'Device'],
      rows: [
        ['provider', 'The licence holder; an agency’s Executive Director', 'Answer the questions, review the plan, print, edit, re-plan, manage billing', 'Laptop — it prints'],
        ['manager', 'Resident manager; program manager', 'Print a fresh contents page when a tab is worn; add notes', 'Laptop'],
        ['viewer (a product role)', 'A consultant, a surveyor — anyone you share with', 'Read the plan, print', 'Laptop', 'wash'],
      ],
      leaders: true,
      perms: [
        ['Answer the questions', 'provider only.'],
        ['Edit contents, guarded', 'provider only.'],
        ['Notes', 'manager and provider.'],
        ['Reset and re-plan', 'provider only.'],
        ['Print', 'everyone, including the viewer.'],
      ],
      closing: 'The viewer role exists so a consultant or a licensor can read the plan without an account in anyone’s system.',
    },
    {
      key: 'objections', kind: 'qa', id: 'questions',
      heading: 'The questions we get.',
      rows: [
        ['Can’t I just copy another provider’s binder?', 'That is what most people do, and it is what the licensing letter is usually about. A copied binder carries someone else’s track, someone else’s house count, and someone else’s gaps.'],
        ['Will this make me compliant?', 'No. It tells you what the rule asks for, with the rule printed beside it, in order. It does not certify anything, and the words ready, compliant and audit-proof are forbidden in this product by design.'],
        ['What if a citation is wrong?', 'It tells you before you print it. Every item carries an evidence tag: verified when someone inspected on that track has read the primary source, derived when it comes from the rule chapter. You always know which one you are holding.'],
        ['Is a subscription right for something I use twice a year?', 'A fair question, and it is why both shapes are on the table for launch: a subscription, or a single purchase per facility. Early-access members get the choice first.'],
      ],
    },
    {
      key: 'start', kind: 'start', id: 'start',
      heading: 'The first ten minutes, and the first sheet of paper.',
      sub: 'If the authority column reads correctly for your licence, you trust it.',
      steps: ['Pick the licence track.', 'Answer five questions.', 'See the plan, and why each binder exists.', 'Print the resident-binder contents page, and hold it.'],
      signup: 'five',
    },
    { key: 'join', kind: 'join', id: 'join' },
    {
      key: 'pricing', kind: 'tiers', id: 'pricing',
      heading: 'Priced per facility.',
      sub: EVERY_PLAN,
      main: 1,
      note: 'A subscription or a single purchase — both shapes are on the table, and early-access members choose first. Sold on the web through Stripe Checkout; the native application never presents a purchase sheet.',
    },
    {
      key: 'ladder', kind: 'map', id: 'ladder',
      heading: 'When you want the documents kept, not just listed.',
      leaders: true,
      rows: [
        ['Plans, versions and edits', 'M06 Digital Binder — the resident, staff and house binders, and the policy library structure'],
        ['Libraries', 'M06 reference data and M19 Regulatory Intelligence'],
        ['Notes', 'M06'],
      ],
      footer: 'Lands on Basic or Professional, when you want the documents stored — the review cycle, uploads, expiry tracking.',
      pull: 'The thing it will not do is the thing that graduates you.',
    },
    { key: 'family', kind: 'band', id: 'family', heading: 'One house. Four rooms. One ladder.', byline: 'by Provider Hub Oregon' },
    {
      key: 'foot', kind: 'foot', id: 'foot',
      by: 'by Provider Hub Oregon',
      disclaimer: 'The contents page shown here is rendered from the product’s own templates with illustrative rows. It describes no real facility and no real person.',
    },
  ],
};

/* ── Aidepost ─────────────────────────────────────────────────────────────
   The seven-cell week rule, and the page that turns over. The only product
   with a structural insert: a full-bleed dark caregiver section between
   `evidence` and `roles`, because it is the only two-sided product.      */
const aidepost = {
  id: 'aidepost',
  accentBudget: 3,
  sections: [
    {
      key: 'hero', kind: 'hero', id: 'top',
      instrument: { desktop: 'week', mobile: 'week' },
      live: 'open',
      descriptorInline: true,
      wide: true,
      eyebrow: 'Two-sided · providers pay, caregivers never do',
      fine: 'Providers buy Aidepost. Caregivers use it free, without an organisation and without a card.',
    },
    {
      key: 'proof', kind: 'proof', id: 'why',
      items: [
        ['Inward first, outward second', 'A shift goes to your own staff before it goes anywhere near the outside. The order is the product.'],
        ['Credentials surfaced, never enforced', 'Thirty days, seven days, then marked on the roster. Nothing is ever blocked, because the decision is yours.'],
        ['A shift describes the work', 'The shift schema has no field that can reference a resident. Shifts are never public; only a job post is, and only when you publish it.'],
      ],
    },
    {
      key: 'screen', kind: 'screen', id: 'board',
      heading: 'One screen: covered, or not.',
      sub: 'This week, per house, one row per shift. Covered, with a name — or open, in the accent. That is the whole emotion.',
      instrument: { desktop: 'web', mobile: 'ios' },
      callouts: [
        [(s) => `a covered cell reading “${s.week.rows[0][1][0]}”`, 'Covered means a name. There is nothing else on the cell to read.'],
        ['the open cell', 'Open. One word, and the only state the board carries.'],
        [(s) => `the detail card “${s.shift.when} · ${s.shift.work}”`, 'The shift describes the work. The shift schema has no field that can reference a resident.'],
        [(s) => `“${s.shift.actions[0]}”, then “${s.shift.actions[1]}”`, 'Inward first, always. Outward only after nobody on staff has taken it.'],
        ['the eligible filter', 'It surfaces the credentials the shift requires and the twenty-one-and-over note. It does not exclude anyone.'],
      ],
      side: {
        label: 'Expiring credentials',
        text: 'M. Okafor · CPR · Friday. Thirty days, seven days, then marked on the roster. Nothing is ever blocked.',
      },
      caption: 'On a caregiver’s phone the same board is a feed: open shifts near me, soonest first, with the work described — and never the person.',
    },
    {
      key: 'loop', kind: 'loop', id: 'flow',
      heading: 'Inward first. Outward second.',
      sub: 'The order is the product. A shift goes to your own staff before it goes anywhere near the outside.',
      device: 'week',
      nodes: [
        { label: 'a pattern' },
        { label: 'open', accent: true, states: [['open', 'Open'], ['covered', 'Covered']] },
        { label: 'offered inward' },
        { label: 'claimed' },
        { label: 'posted outward' },
        { label: 'claimed by relief' },
        { label: 'confirmed' },
        { label: 'worked' },
        { label: 'timesheet' },
      ],
      closing: 'The eligible filter surfaces the credentials required and the twenty-one-and-over note. It does not exclude.',
      machines: [
        ['Credential → expiring → expired', 'entered with an expiry → a thirty-day notice → a seven-day notice → expired, and marked on the roster → renewed as a new row, with the old one retained.'],
        ['Application → hire', 'a post is drafted → the per-post charge is paid → published → an application arrives with self-attested credentials → screened → an offer → accepted → a staff row is created → the onboarding checklist opens → cleared to work alone when it is complete.'],
        ['Clock-in → timesheet', 'clock in at the house → clock out → a daily total → a weekly total → the overtime flag at forty hours → the manager approves → the provider exports.'],
        ['Policy acknowledgment', 'a Binderkit policy version is published → the manager records the version → each staff member signs → the unsigned are surfaced.'],
      ],
    },
    {
      key: 'depth', kind: 'table', id: 'rules',
      heading: 'What the rule says, shown — and never enforced.',
      sub: 'Credentials are surfaced, not gates. Nothing here stops a shift from being scheduled.',
      cols: ['Topic', 'What is shown', 'Where'],
      mono: [2],
      rows: [
        ['Twenty-one and over to work alone more than two hours in twelve', 'A note on the shift when the only available caregiver is under twenty-one', 'The roster'],
        ['Dementia training before direct care (ORS 443.743)', 'An onboarding checklist item', 'Onboarding'],
        ['Abuse-reporter training; background check (ORCHARDS, OAR 407-007)', 'A checklist item, and a status field — the provider runs the check', 'Onboarding; credentials'],
        ['Exclusion screening (OIG LEIE, SAM.gov)', 'A re-screen due date — periodic, not only at hire', 'Credentials'],
        ['Competency-Based Training Plan (411-325-0025)', 'CBTP items as credential types, on the agency track', 'Credentials'],
        ['Wage and hour (ORS 653.261)', 'A weekly overtime flag. There is no daily overtime flag, because Oregon has none for this.', 'Timesheets'],
        ['Relief care; substitute caregiver', 'Defined in OAR 411-360 — the marketplace’s vocabulary', 'Everywhere'],
      ],
      pull: 'Thirty days, seven days, then marked on the roster. The decision stays yours.',
    },
    {
      key: 'boundary', kind: 'boundary', id: 'boundary',
      heading: 'What Aidepost refuses to do, and who does it instead.',
      cols: [
        {
          label: 'Next door', kind: 'next', items: [
            ['Hold resident care, the MAR or incidents', 'cohort', null],
            ['Write the house rules', 'binderkit', 'Binderkit prints the policy; Aidepost records the signature'],
          ],
        },
        {
          label: 'The provider does', kind: 'provider', items: [
            ['Payroll. Background checks. Aidepost records the status and the dates; it does not run the check.', null],
          ],
        },
        {
          label: 'Never', kind: 'never', items: [
            ['Describe a resident in a posting.', null],
            ['Run a background check itself — if it did, the Fair Credit Reporting Act would apply, and the design forbids it.', null],
            ['Rate a person. Attendance is facts only — showed, no-show, late. Never free text, never a character rating.', null],
          ],
        },
      ],
      strip: {
        kind: 'phrase', label: 'Is not',
        cells: ['payroll', 'a background-check service', 'an HR system', 'a resident-care record'],
      },
    },
    {
      key: 'evidence', kind: 'evidence', id: 'record',
      heading: 'A shift describes the work, never the person.',
      blocks: [
        { label: 'Classification', text: 'One table holds protected information: assignments, where a named caregiver is paired with a resident who needs one-to-one support. Ten tables hold personal information. Two are public.' },
        { label: 'What an email says', quote: '1 open shift at WH-1 needs cover.', text: 'Or: “Your CPR expires in 7 days.”' },
        { label: 'Analytics', text: 'Open shifts filled within twenty-four hours. Never per caregiver.' },
        { label: 'What is public', text: 'A job listing is public by design: the work, the house’s public-facing name or a short-code, and the pay. Never a resident. Shifts, as opposed to postings, are never public.' },
        { label: 'The law that applies to your staff', text: 'Caregiver data is governed by state privacy and employment law, not HIPAA. A Customer BAA is still required, because of that one assignments table.' },
        { label: 'Attendance', text: 'Facts only — showed, no-show, late. There is no free-text field and no character rating anywhere in the product.' },
      ],
    },
    {
      key: 'caregiver', kind: 'caregiver', id: 'caregivers',
      heading: 'Shifts near you, tonight.',
      sub: 'Free. No organisation. No card.',
      lines: [
        'Create a profile. Add a CPR card photo and its date.',
        'See open shifts near you, soonest first, with the work described — and never the person.',
        'Keep your own credential dates in one place, and carry them from one employer to the next.',
        'Claim an open shift at a house you already work at.',
        'Opt in to relief work across providers, by radius and by availability.',
        'Apply to a job post with a caregiver account. Clock in, clock out, see your own weekly total.',
      ],
      promise: 'You are not the product. Aidepost never runs a background check on you, never rates your character, and records attendance as facts only — showed, no-show, late. What a listing says about the work is public; what it says about you is not.',
      ctas: [['Join as a caregiver', '#join'], ['How credentials work', '#rules']],
      fine: 'Caregivers pay nothing. Browse public; apply with a caregiver account. Providers buy Aidepost.',
      mono: 'aidepost.com/caregivers',
    },
    {
      key: 'roles', kind: 'roles', id: 'roles',
      heading: 'Five roles, and two of them have no employer.',
      cols: ['Role', 'Who', 'In Aidepost, they', 'Device'],
      rows: [
        ['provider', 'The licence holder; an agency’s Executive Director', 'Post jobs, approve hires, see coverage across houses, export timesheets, pay per post, manage billing', 'Phone + laptop'],
        ['manager', 'Resident manager; program manager', 'Build the roster, fill open shifts, review applications, see expiring credentials', 'Phone, daily'],
        ['caregiver', 'Staff on the roster', 'See my schedule, clock in and out, claim an open shift, keep my credential dates', 'Phone, every shift'],
        ['applicant (a product role)', 'A caregiver with no organisation yet', 'A profile, self-attested credentials, apply to posts', 'Phone', 'wash'],
        ['relief_worker (a product role)', 'Opted into the pool', 'Claim relief shifts across providers', 'Phone', 'wash'],
      ],
      perms: [
        ['Job posts', 'a manager drafts; the provider publishes, and pays.'],
        ['Timesheets', 'a caregiver sees her own; a manager approves her own houses; the provider exports.'],
        ['Credentials', 'everyone edits their own; a manager views and adds dates; the provider edits.'],
        ['Roster and the open-shift board', 'a caregiver views; a manager builds, offers and posts outward.'],
        ['Billing', 'provider only.'],
      ],
    },
    {
      key: 'objections', kind: 'qa', id: 'questions',
      heading: 'The questions we get.',
      rows: [
        ['Why not just post in the Facebook group?', 'A Facebook group does not know who holds a current CPR card, cannot record that the shift was offered to your own staff first, and leaves you no timesheet at the end of the week.'],
        ['Will it stop me scheduling someone whose CPR has lapsed?', 'No. It will tell you at thirty days, at seven days, and on the roster itself. Credentials are surfaced, never enforced. The decision stays yours, because it is yours.'],
        ['Will my staff be poached?', 'Shifts are never public. Only a job post is public, and only when you publish it and pay for it.'],
        ['How much is a post?', 'One charge per post, and it publishes when it is paid. Posting is available on every plan, including the trial. The amount is set at launch.'],
      ],
    },
    {
      key: 'start', kind: 'start', id: 'start',
      heading: 'The first ten minutes, on both sides.',
      columns: [
        { label: 'Provider', steps: ['Add six staff and their CPR dates.', 'See the one that expires Friday take the accent.', 'Build next week’s roster.', 'See Saturday night open — offer it to your own staff, then post outward.'] },
        { label: 'Caregiver', wash: true, steps: ['Create a profile.', 'Add a CPR card photo and its date.', 'See three open shifts within twenty miles.'], foot: 'No organisation. No card. Nothing to cancel.' },
      ],
      signupHeading: 'Signing up, in six steps — the provider side, the same in every product in this family',
    },
    { key: 'join', kind: 'join', id: 'join' },
    {
      key: 'pricing', kind: 'tiers', id: 'pricing',
      heading: 'Providers pay. Caregivers never do.',
      sub: EVERY_PLAN,
      main: 1,
      note: 'Per house, plus one charge per job post. Amounts are set at launch and early-access members get them first. Sold on the web through Stripe Checkout; the native application never presents a purchase sheet.',
    },
    {
      key: 'ladder', kind: 'map', id: 'ladder',
      heading: 'When the roster outgrows one provider.',
      sub: 'Export → import, one login.',
      rows: [
        ['Staff, credentials, documents, onboarding', 'M03 Staff & Workforce'],
        ['Shifts, patterns, assignments, clock events, timesheets', 'M03 scheduling and timekeeping'],
        ['Posts, applications, profiles', 'M07 Job Board, the Jobs application, and the external portal'],
        ['The relief pool', 'M07 open shifts and talent pool'],
        ['Acknowledgments', 'M03 and M09'],
      ],
      footer: 'Lands on Enterprise, when payroll integration or agency-scale scheduling across many sites arrives.',
    },
    { key: 'family', kind: 'band', id: 'family', heading: 'One house. Four rooms. One ladder.', byline: 'by Provider Hub Oregon', second: true },
    {
      key: 'foot', kind: 'foot', id: 'foot',
      by: 'by Provider Hub Oregon',
      disclaimer: 'The roster shown here is sample data; M. Okafor, J. Ruiz and T. Nguyen are not real people.',
    },
  ],
};

/* ── quoted callouts, read from the surface they annotate ────────────────
   An annotated screen is the page's central proof device, so a callout may
   never quote a string the instrument beside it does not render. A callout
   target is therefore either plain prose or a function of that product's own
   surfaces entry, resolved at render time; check() re-reads every one of
   them against the rendered instrument and fails on the first that has
   drifted. Nothing quoted is typed twice, so nothing quoted can drift.  */
function said(rows, key) {
  const r = rows.find(([k]) => k === key);
  return r ? `${r[0]} · ${r[1]}` : key;
}

export const PAGES = { cohort, binderkit, aidepost };

/* The sibling cards under the family band: the parent first, then the three
   siblings. Computed from brand.js so a name or a descriptor cannot drift. */
export const siblingsFor = (id) => [PRODUCTS[0], ...MINIS.filter((m) => m.id !== id)];

export default PAGES;
