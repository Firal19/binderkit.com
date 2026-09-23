// The four landing pages, as data. One invariant spine, one object per
// product, no HTML anywhere in this file — so adding or dropping a section is
// a one-line edit and a product can never quietly reorder the argument.
//
// The copy is written for a buyer, not for the team: short sentences, plain
// English, no build status, no roadmap, no sibling product and no "sample
// data" confession. What each product does, refuses to do, and costs is what
// is here. Rewritten 2026-09-23 to Firaol's element-by-element review.

import { PRODUCTS, MINIS } from './brand.js';

/* ── the spine ───────────────────────────────────────────────────────────
   Fixed order, every product. `caregiver` is the one structural insert in
   the family — Aidepost is the only two-sided product. A product may DROP a
   slot; it may never reorder one, and the renderer asserts it. `ladder` and
   `family` stay as slots for the checker's sake, but no product uses them:
   Provider Hub Oregon appears on a public page only as the byline.        */
export const SPINE = [
  'hero', 'proof', 'screen', 'loop', 'depth', 'boundary', 'evidence',
  'caregiver', 'roles', 'objections', 'start', 'join', 'pricing', 'ladder', 'family', 'foot',
];

/* ── the copy every product shares ───────────────────────────────────────
   Written once and read by all four, so the family reads as one maker. */
export const TRIAL_FINE = 'Three days, card on file, everything Pro shows. Cancel in one tap.';

export const SIGNUP_SIX = {
  heading: 'Signing up takes five minutes',
  steps: [
    'Email and password',
    'Licence track',
    'Your organisation and first house',
    'Terms, privacy and the customer agreement',
    'Card on file',
  ],
  tail: 'Then the trial starts.',
};

export const SIGNUP_FIVE = {
  heading: 'Signing up takes five minutes',
  steps: [
    'Email and password',
    'Licence track',
    'Your organisation and first facility',
    'Terms and privacy',
    'Card on file',
  ],
  tail: 'No customer agreement to sign, because nothing about a person is stored.',
};

export const BILLING_STATES = {
  heading: 'If a payment fails',
  rows: [
    ['On a plan', 'Full access.'],
    ['Payment fails', 'Full access while we retry. We write on day 0, 7 and 14.'],
    ['Stays unpaid', 'You can still read and export.'],
    ['You cancel', 'You can still sign in and export. Export first.'],
  ],
};

export const EVERY_PLAN = 'Every plan sees every screen. Anything above your plan shows its price. Nothing is silently blocked.';

/* The waitlist. One block, one form, the same promise on every site that has
   nothing to sell yet. CareShop drops the slot: it has a signup. */
export const JOIN = {
  eyebrow: 'Early access',
  heading: 'Be in the first houses on it.',
  sub: 'Leave an email. We write once, when it opens, with the price and how to get in.',
  fields: { email: 'Work email', houses: 'How many houses?', track: 'Licence track', phone: 'Phone (optional)' },
  tracks: ['APD', 'DD', 'OHA', 'Agency', 'Not licensed yet'],
  houseOptions: ['1', '2–3', '4–9', '10+', 'An agency'],
  button: 'Join the list',
  busy: 'Sending…',
  done: 'You are on the list. We will write once, when it opens.',
  failHead: 'That did not send.',
  fine: 'No card, no account, no newsletter.',
};

/* ── the reach-us block: a question becomes a conversation in three steps.
   Every site renders it after its questions. The address comes from cfg. */
export const REACH = {
  eyebrow: 'Still a question?',
  heading: 'Ask a person.',
  sub: 'No sales team. The person who built it answers.',
  steps: [
    ['Write', 'One line is enough. Say what your house looks like.'],
    ['A person answers', 'Within one working day, from the same inbox.'],
    ['See it run', 'Twenty minutes on a call, with a house like yours.'],
  ],
  cta: 'Write to us',
  alt: 'Use the form',
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
      eyebrow: 'For Oregon care homes · runs on the house phone',
      fine: 'Works when the wifi drops. Every entry stamped with who and when.',
      strip: {
        kind: 'struck', label: 'What comes off the wall',
        cells: ['The paper MAR', 'The shift binder', 'The whiteboard', 'The group text'],
      },
    },
    {
      key: 'proof', kind: 'proof', id: 'why',
      items: [
        ['Two safety stops, nothing else blocks', 'A medication that matches a recorded allergy, and an as-needed dose given too soon. Everything else informs and steps aside.'],
        ['Nothing is ever deleted', 'A correction goes under the original, with a reason. A dose cannot be un-given.'],
        ['Built for the house phone', 'One shared device, staff codes to switch who is acting, and entries that queue when the signal drops.'],
      ],
    },
    {
      key: 'screen', kind: 'screen', id: 'today',
      heading: 'Today, at 06:55.',
      sub: 'The first screen after sign-in: what is due, what is documented, what is waiting on a decision. Counts, never a score.',
      instrument: { desktop: 'ios', mobile: 'ios' },
      callouts: [
        [(s) => `“${s.tabBadge.text}”`, 'What is due this shift, and a route into the MAR. No readiness score, no countdown.'],
        [(s) => `“${said(s.handoff.rows, 'Documentation')}”`, 'What the night shift finished, counted against what was expected.'],
        [(s) => `“${s.handoff.t}”, and “${s.handoff.receipt}”`, 'What the night caregiver left, and proof that the morning caregiver read it.'],
        [(s) => `“${s.rows[0].stamp}”`, 'Every entry carries who and when. A later correction goes underneath, with a reason.'],
        ['below the list', 'Done items leave the list. A house with nothing outstanding says so in words.'],
      ],
      side: {
        label: 'When the wifi goes',
        text: 'Doses, notes, tasks and incident drafts queue on the phone and catch up on their own. A caregiver never waits for the network.',
      },
      caption: 'Nothing on this screen is red. Coral marks one thing: what is late, unread, or waiting on a decision.',
      figure: {
        heading: 'How it speaks',
        rejected: '⚠ MEDICATIONS OVERDUE',
        kept: '4 meds due',
        caption: 'Calm and factual. No warning symbols, no capitals, no percentage offered as a grade.',
      },
    },
    {
      key: 'loop', kind: 'loop', id: 'pass',
      heading: 'The pass, step by step.',
      sub: 'Seven steps, and exactly two of them can stop a caregiver.',
      device: 'dots',
      nodes: [
        { label: 'scheduled', note: 'Against the order in force.' },
        { label: 'Six Rights', note: 'Six boxes, all required.' },
        { label: 'allergy check', accent: true, note: 'Always runs.' },
        { label: 'interval and ceiling', accent: true, note: 'Two conditions, not one.' },
        { label: 'witness co-sign', note: 'Team houses only.' },
        { label: 'signed', states: [['given', 'Given'], ['held', 'Held']], note: 'Given, refused, held or missed.' },
        { label: 'locked', note: 'Addenda only. Never reversed.' },
      ],
      gates: [
        'A medication that matches a recorded allergy. The stop names the allergen, its severity and its reaction, and it runs even when no allergy is on file, so the absence is stated too.',
        'An as-needed dose before the order’s minimum interval, or past its daily ceiling. The stop shows when the last dose was given and when the next is allowed.',
      ],
      gateNote: 'Both stops exist because the harm is physical. To go on, a caregiver types a reason, the reason is recorded on the dose, and the manager is told. There is no third stop and there are no countdown timers.',
      pull: 'Each dose is signed one at a time, by the person giving it. Nothing is recorded in bulk.',
      closing: 'Every other check in the product informs. None of them refuses.',
      machines: [
        ['Incident', 'Filed by anyone, with the narrative and the immediate action. Managers are told by house code only. Reviewed, signed off by a manager, locked. Corrections go underneath.'],
        ['Care note', 'A template of up to sixteen fields. Saved and stamped, every prior version one tap away. Locks an hour after the shift ends; after that, an addendum with a reason.'],
        ['Handoff', 'Composed from the day: doses as counts, documentation done, incidents filed, tasks open. The outgoing caregiver adds a passage and posts once. Reading it records a receipt.'],
        ['Plan version', 'Uploaded with its effective and expiry dates. Daily work points at its goals. Expiry surfaces at thirty days. The next upload supersedes it and every version stays readable.'],
      ],
    },
    {
      key: 'depth', kind: 'table', id: 'rules',
      heading: 'The Oregon rule, beside the thing it governs.',
      sub: 'Each citation is marked with how sure we are of it.',
      cols: ['Topic', 'What is shown', 'Track', 'Confidence'],
      mono: [1],
      rows: [
        ['Records and documentation', 'OAR 411-360-0170', 'DD', 'verified'],
        ['Records and documentation', 'OAR 411-050-0745 / 0750', 'APD', 'derived'],
        ['Records and documentation', 'OAR 411-325, documentation sections', 'Agency', 'derived'],
        ['Abuse and incident', 'OAR 411-360-0185 — the word the rule uses is immediately', 'DD', 'verified'],
        ['Abuse and incident', 'OAR 411-323-0063', 'Agency', 'derived'],
        ['Capacity', 'OAR 411-360-0060 — five, typed by the provider', 'AFH tracks', 'verified'],
        ['Medication delegation', 'OSBN 851-047 applies; OAR 855-080 does not', 'All tracks', 'derived'],
        ['Elopement response', 'The resident’s own window, from their plan', 'All tracks', 'corrected'],
      ],
      pull: 'A citation with no confidence beside it cannot be checked, so the confidence is printed.',
      closing: 'Four tracks on one data model: APD, DD, OHA and Agency. Where a source has not been read, the product shows nothing rather than a guess.',
    },
    {
      key: 'boundary', kind: 'boundary', id: 'boundary',
      heading: 'What Cohort is, and is not.',
      sub: 'It keeps the residents’ record. That is the whole job.',
      cols: [
        {
          label: 'Not this product', kind: 'next', items: [
            ['Staff scheduling, hours and credentials', '', ''],
            ['Stock, menus and shopping', '', ''],
            ['Binder structure and filing', '', ''],
            ['Billing a payer, payroll or claims', '', ''],
          ],
        },
        {
          label: 'Never', kind: 'never', items: [
            ['No compliance score or grade.', null],
            ['No countdown timers.', null],
            ['No third stop.', null],
            ['Nothing deleted.', null],
            ['No resident information sent outside the system.', null],
            ['Houses and people are never ranked.', null],
          ],
        },
      ],
      strip: {
        kind: 'phrase', label: 'Is not',
        cells: ['an EHR', 'a family portal', 'a document store', 'payroll', 'scheduling', 'billing'],
      },
      pull: 'One question decides it: is this about a resident’s care?',
    },
    {
      key: 'evidence', kind: 'evidence', id: 'record',
      heading: 'Nothing is deleted. Nothing leaves.',
      sub: 'Every write is stamped and kept. A correction is a new line under the old one.',
      blocks: [
        { label: 'Append-only', text: 'Every entry is stamped with who and when. A correction goes under the original. A dose cannot be un-given.' },
        { label: 'Audited', text: 'Every change, print, export and support session writes a row. The log outlives the account.' },
        { label: 'What a push says', quote: 'WH-1: 4 medications due', text: 'A house code and a count. Never a name. The set of messages is closed, so nothing can invent one.' },
        { label: 'What leaves the phone', text: 'Error reports are scrubbed of anything resembling a record. Exports are made on your device with redaction on by default.' },
      ],
      closingBlocks: [
        { heading: 'Where it lives', text: 'Under a vendor business associate agreement, reaching only a signed-in phone. You accept the customer agreement at signup.' },
        { heading: 'Solo houses', text: 'A house with one caregiver on shift cannot produce a witness. The product records the absence in those words rather than making anyone lie.' },
        { heading: 'Leaving', text: 'Export at any time, without asking. On the way out: export, a hold, then a hard delete. The audit log is kept for the statutory period.' },
      ],
    },
    {
      key: 'roles', kind: 'roles', id: 'roles',
      heading: 'Three people, three rhythms.',
      sub: 'Who holds the phone, and how often.',
      cols: ['Role', 'Who', 'In Cohort, they', 'Device and rhythm'],
      rows: [
        ['provider', 'The licence holder or executive director', 'Set up houses and residents, invite staff, review, print for the licensing file, manage billing', 'Phone and laptop, weekly'],
        ['manager', 'Resident manager or program manager', 'Sign off incidents, review notes, manage medication orders', 'Phone, daily'],
        ['caregiver', 'Direct care staff and substitutes', 'Sign the MAR, write notes, file incidents, do tasks, read and write the handoff', 'The house phone, every shift'],
      ],
      perms: [
        ['Stop overrides', 'anyone, with a reason recorded.'],
        ['Incident export', 'manager and provider, audited.'],
        ['Billing', 'provider only.'],
        ['Resident record', 'a caregiver reads it; a manager or the provider edits contacts and allergies.'],
      ],
      closing: 'The same three words in the app and in your licence. Staff need no retraining as you grow.',
    },
    {
      key: 'objections', kind: 'qa', id: 'questions',
      heading: 'The questions we get.',
      rows: [
        ['Will it stop my caregiver mid-shift?', 'Twice, ever: a medication that matches a recorded allergy, and an as-needed dose given too soon. Everything else informs and steps aside. There are no countdown timers.'],
        ['The wifi in my house is bad.', 'Doses, notes, tasks and incident drafts queue on the phone and catch up when the signal returns. Nothing is lost and nothing is recorded twice.'],
        ['Can I take my data out?', 'Yes, at any time, without asking anyone. The export is a ZIP you can read without Cohort. A cancelled account can still sign in to export.'],
        ['How is this different from Therap?', 'Therap and the other large systems are built for agencies with a compliance department. Cohort is built for a house: it runs on the phone your staff already carry, sets up in an afternoon, and is priced per house.'],
        ['Is it an electronic health record?', 'No. It runs the shift: medications, notes, incidents, tasks and the handoff. It does not author care plans or bill the state.'],
      ],
    },
    {
      key: 'start', kind: 'start', id: 'start',
      heading: 'The first ten minutes.',
      sub: 'If this feels calm and fast, you can trust it.',
      steps: ['Name the house.', 'Add one resident with an allergy.', 'Enter one medication order.', 'Sign one dose and watch the stamp appear.', 'Invite a caregiver.'],
    },
    { key: 'join', kind: 'join', id: 'join' },
    {
      key: 'pricing', kind: 'tiers', id: 'pricing',
      heading: 'One price per house.',
      sub: EVERY_PLAN,
      main: 1,
      note: 'Per house. Not per seat, not per resident, not per bed. Sold on the web, never through an app store.',
    },
    {
      key: 'foot', kind: 'foot', id: 'foot',
      by: 'by Provider Hub Oregon',
      disclaimer: '',
    },
  ],
};

/* ── Binderkit ──────────────────────────────────────────────────────────── */
const binderkit = {
  id: 'binderkit',
  accentBudget: 3,
  control: 'BK-LP',
  sections: [
    {
      key: 'hero', kind: 'hero', id: 'top',
      eyebrow: 'Binder setup for Oregon care homes · no resident data',
      instrument: { desktop: 'paper', mobile: 'paper' },
      live: 'tag',
      descriptorInline: true,
      fine: 'Prints on day one, on the printer you already own.',
    },
    {
      key: 'proof', kind: 'proof', id: 'why',
      items: [
        ['Nothing about anyone', 'No resident record, no upload, no photograph. Identity lines print blank and are filled in by hand. That is structure, not policy.'],
        ['The same answers, the same plan', 'Generate twice and the two files match. Change an answer and back again, and you have the first plan.'],
        ['The rule beside every item', 'A chapter and a section next to each item, marked with how sure we are. An item that is your own house practice says so.'],
      ],
    },
    {
      key: 'screen', kind: 'screen', id: 'contents',
      heading: 'One page: the contents page.',
      sub: 'The page a surveyor sees first. The binder, the facility code, the tabs in order, the rule beside each item, and a control number in the footer.',
      instrument: { desktop: 'paper', mobile: 'paper' },
      split: true,
      callouts: [
        ['“Facility ______ · Resident ______”', 'Blank, and filled in by hand. No name appears on anything this product prints.'],
        [(s) => `“${s.rows[2].slice(0, 3).join(' · ')}”`, 'The rule beside the item: a chapter and a section, or the words “house practice”.'],
        [(s) => `“${s.rows[3].slice(0, 4).join(' · ')}”`, 'Derived means it comes from the rule chapter. It prints that way until a provider on your track confirms it.'],
        [(s) => `“${s.rows[4].slice(0, 4).join(' · ')}”`, 'Filter the plan to the unconfirmed items. That is the list you take to an adviser.'],
        [(s) => `“${s.control} · by Provider Hub Oregon”`, 'The control number: facility code, binder, version and print sequence. Any past number reprints the identical page.'],
      ],
      side: {
        label: 'The banner on an unreviewed library',
        text: 'Until a provider on your licence has reviewed a library, the plan and every print say so on the first page. You still get the plan.',
      },
      caption: 'Drawn for black and white, on the printer you already own. Tab labels fit standard divider stock.',
      figure: {
        heading: 'A phrase this product will not print',
        rejected: 'the 32 required documents',
        kept: 'thirty-two items, seen on one provider’s shelf',
        caption: 'There is no state-mandated count of resident documents, so no page here presents one as a requirement.',
      },
      strip: {
        label: 'Four things print',
        cells: ['The contents page', 'Tab dividers', 'A one-page brief', 'The procedure'],
        foot: 'Each is a PDF made inside the product. On a phone it goes to the share sheet, so it can reach any printer.',
      },
    },
    {
      key: 'loop', kind: 'loop', id: 'plan',
      heading: 'Five answers in. Five binders out.',
      sub: 'The same answers always produce the same plan, with the reasoning shown.',
      device: 'tabs',
      nodes: [
        { label: 'Question zero', note: 'Your licence track. It selects the library, and the libraries differ in almost every item.' },
        { label: 'Five questions', note: 'Staff other than you · do you live in the home · how many residents · anyone on one-to-one support · who keeps the policy binder.' },
        { label: 'The plan', note: 'Usually five binders: resident, staff file, facility, emergency, policy. Every item is required, conditional or suggested, and says why.' },
        { label: 'Print', note: 'The contents page, the dividers, the brief and the procedure, each with your facility code, the version and a control number.' },
        { label: 'Edit, guarded', note: 'Reorder tabs, rename a label, move an item, add one of your own, remove a suggested one. Every edit makes a version.', accent: true },
        { label: 'Re-plan', note: 'An answer or a library changes. A re-plan is offered with the diff, never applied on its own.' },
        { label: 'Reset', note: 'Back to the library default. Your edits go, your notes stay, and the previous version is still readable.' },
      ],
      quote: { at: 4, text: 'This item is required by section 0170. You can move it, but it can’t come out.' },
      gates: [
        'Coverage: a required item can move to another tab and never leaves the binder.',
        'Scope: staff records and resident records are kept apart.',
        'Cohesion: a tab holds one subject. Move the whole tab, or the item within it.',
      ],
      gateNote: 'Every refusal says what you tried, which rule applied, and one thing you can do instead. It never says “not allowed”.',
      pull: 'Skip a question and the plan resolves the inclusive way, and tells you which items came from the skip.',
      closing: 'A re-plan tells you which binders need reprinting and which do not. Notes attach to an item and survive a reset, a re-plan and a change of track.',
    },
    {
      key: 'depth', kind: 'table', id: 'library',
      heading: 'Your licence track selects the library.',
      sub: 'Four tracks, four rule sets, four libraries. A facility has one track, chosen when you create it.',
      cols: ['Library', 'Authority', 'What is in it'],
      mono: [1],
      rows: [
        ['AFH-DD', 'OAR 411-360 — 0130 standards, 0140 health care, 0170 documentation and records, 0185 abuse and incident; plus 411-004 HCBS', 'Thirty-two resident-binder items, observed on one provider’s shelf, with the rule beside each.'],
        ['Agency', 'OAR 411-325 as amended 15 January 2026, and 411-323; 411-318 and 411-004 derived from the chapters', 'One hundred and twenty-six items across the five binders, with ninety-nine citations.'],
        ['AFH-APD', 'OAR 411-050 — 0745 facility records and 0750 resident records', 'Coming next.'],
        ['AFH-OHA', 'OAR 309-040', 'Coming next.'],
      ],
      pull: 'An item carries its rule, or it is marked “house practice” and carries none.',
      struck: {
        heading: 'Three words that do not appear in this product',
        words: ['ready', 'compliant', 'audit-proof'],
        foot: 'Binderkit tells you what the rule asks for and prints the rule beside it. It does not certify that any home meets any requirement.',
      },
      closing: 'AFH-DD and Agency ship first. Each library is read against the rule by a provider inspected on that track, and until then your plan carries a banner saying so.',
    },
    {
      key: 'boundary', kind: 'boundary', id: 'boundary',
      heading: 'What Binderkit will not do.',
      cols: [
        {
          label: 'Not this product', kind: 'next', items: [
            ['Keep the document itself, or take any upload', '', ''],
            ['Record a policy signature or a credential date', '', 'It prints the tab the policy goes in.'],
            ['Hold emergency stock against a bed count', '', 'It prints the tab the reserve record goes in.'],
          ],
        },
        {
          label: 'Never', kind: 'never', items: [
            ['Hold anything about any person.', null],
            ['Take an upload of any kind.', null],
            ['Run a review cycle or record a finding.', null],
            ['Claim that using it makes a home compliant.', null],
            ['Set a deadline or a countdown.', null],
          ],
        },
      ],
      strip: {
        label: 'The test every request passes through',
        cells: ['Does it tell you what goes where?', 'Does it store a document?', 'Does it track what is filed?', 'Does it record a finding?'],
        foot: 'The first answer has to be yes and the other three no.',
      },
      pull: 'Surface, never police.',
    },
    {
      key: 'evidence', kind: 'evidence', id: 'record',
      heading: 'It holds nothing about anyone.',
      sub: 'Zero is a property of this product, and most of what follows comes from it.',
      blocks: [
        { label: 'What it holds', text: 'Your facilities, your answers, your plans, your versions and your prints. Account records for the people who sign in. Nothing about a resident.' },
        { label: 'No customer agreement', text: 'Signing up is five steps, not six. There is no protected information to sign for.' },
        { label: 'The key', text: 'A plan is keyed by your facility code, never by a name. It is in the footer of every page and in every notification.' },
        { label: 'What a notification says', quote: 'WH-1: your plan has a new version.', text: 'One of four. A facility code, a version number, an amount or a link. There is no push notification at all.' },
        { label: 'If you stop paying', wide: true, text: 'Printing, viewing and export keep working. Withholding a reprint is not leverage.' },
        { label: 'The record we keep', text: 'An append-only log of every answer, generation, edit, note, reset and print.' },
      ],
      closingBlocks: [
        { heading: 'What the absence buys you', text: 'No agreement before you can try it. Support that can read your plan and answer. Deletion that no retention law delays.' },
        { heading: 'And the counterweight', text: 'Your staff accounts are still personal information, and they are kept with the same care a resident record would be.' },
      ],
    },
    {
      key: 'roles', kind: 'roles', id: 'roles',
      heading: 'Three people, one printer.',
      sub: 'The device column is short, because it prints.',
      cols: ['Role', 'Who', 'In Binderkit, they', 'Device'],
      rows: [
        ['provider', 'The licence holder or executive director', 'Answer the questions, review the plan, print, edit, re-plan, manage billing', 'Laptop'],
        ['manager', 'Resident manager or program manager', 'Print a fresh contents page when a tab is worn; add notes', 'Laptop'],
        ['viewer', 'A consultant or adviser, invited to named facilities', 'Read and print that facility’s plan from her own account', 'Laptop', 'wash'],
      ],
      leaders: true,
      perms: [
        ['Answer the questions', 'provider only.'],
        ['Edit, guarded', 'provider only.'],
        ['Notes', 'manager and provider.'],
        ['Reset and re-plan', 'provider only.'],
        ['Print', 'everyone, including the viewer.'],
      ],
      closing: 'A viewer is a seat, not a share. There is no public link to a plan.',
    },
    {
      key: 'objections', kind: 'qa', id: 'questions',
      heading: 'The questions we get.',
      rows: [
        ['Can’t I just copy another provider’s binder?', 'A copied binder carries someone else’s licence track, house count and gaps. Binderkit builds the plan from your track and your answers.'],
        ['Will this make me compliant?', 'No. It tells you what the rule asks for, with the rule printed beside it, in order. It certifies nothing.'],
        ['What if a citation is wrong?', 'Every item carries a tag: verified, derived or open. You can filter the plan to the unconfirmed items and take that list to an adviser.'],
        ['I only revise the binder twice a year.', 'Then buy it once. Pro is a subscription or a single purchase, and printing keeps working either way.'],
        ['Does it store anything about residents?', 'No. Identity fields print blank, plans are keyed by a facility code, and there is no free-text field about a person anywhere.'],
      ],
    },
    {
      key: 'start', kind: 'start', id: 'start',
      heading: 'The first ten minutes, and the first sheet of paper.',
      sub: 'If the rule column reads right for your licence, you trust it.',
      steps: ['Pick the licence track.', 'Answer five questions.', 'See the plan, and why each binder exists.', 'Print the resident-binder contents page, and hold it.'],
      signup: 'five',
    },
    { key: 'join', kind: 'join', id: 'join' },
    {
      key: 'pricing', kind: 'tiers', id: 'pricing',
      heading: 'Priced per facility.',
      sub: EVERY_PLAN,
      main: 1,
      note: 'Sold on the web. Printing, viewing and export keep working after a payment fails.',
    },
    {
      key: 'foot', kind: 'foot', id: 'foot',
      by: 'by Provider Hub Oregon',
      disclaimer: '',
    },
  ],
};

/* ── CareShop ─────────────────────────────────────────────────────────────
   The one product in the family that is already live and priced, so it is
   the one page with a signup rather than a list to join. It drops `join`. */
const careshop = {
  id: 'careshop',
  accentBudget: 3,
  sections: [
    {
      key: 'hero', kind: 'hero', id: 'top',
      eyebrow: 'Live at careshop.app · Oregon care homes',
      instrument: { desktop: 'crop', mobile: 'crop' },
      descriptorInline: true,
      fine: 'Free to start. No card. Installs on iOS and Android.',
    },
    {
      key: 'proof', kind: 'proof', id: 'why',
      items: [
        ['Scan it, and it exists', 'A caregiver scans a barcode at the shelf and types a name. Nothing else is required.'],
        ['The buy list writes itself', 'A menu shortfall, an expiry, a par breach or a reserve gap files its own request, carrying where it came from.'],
        ['A resident is a label, never a name', 'Initials or a room number, diet tags, allergens, one texture level. Enough for a tray note and a menu check.'],
      ],
    },
    {
      key: 'screen', kind: 'screen', id: 'queue',
      heading: 'One screen: the buy queue.',
      sub: 'What to buy and nothing else. Each line says where it came from, who asked, and the last price at the cheapest shop.',
      instrument: { desktop: 'web', mobile: 'ios' },
      callouts: [
        [(s) => `“${s.rows[0].origin}”`, 'Where the line came from. Five origins and no sixth.'],
        [(s) => `“${s.rows.find((r) => r.state === 'expiring').origin}”`, 'Dated at entry, most urgent first.'],
        [(s) => `“${s.rows.find((r) => r.stage === 'Approved').stage}”`, 'Your purchasing rules decided this, and the rule is recorded in place of an approver.'],
        [(s) => `“${s.rows.find((r) => r.store.startsWith('Costco')).store}”`, 'The price ledger. Every purchase records a price for that item at that shop on that date.'],
        [(s) => `the ${s.side.t} panel`, 'Most urgent first, with the value at risk in money. Use it, replace it, or discard it.'],
      ],
      side: {
        label: 'Bulk approval, and where it stops',
        text: 'Small requests can be approved together. Anything above your threshold is decided one at a time.',
      },
      caption: 'Amber is the whole product in one colour: what is short, or expiring.',
      strip: {
        label: 'Six front doors, one list',
        cells: ['The shelf', 'The scanner', 'Today', 'A workbook import', 'The catalogue', 'The system'],
        foot: 'All six write the same buy request under the same rules.',
      },
    },
    {
      key: 'loop', kind: 'loop', id: 'loop',
      heading: 'The loop closes by itself.',
      sub: 'Count, queue, approve, shop, receipt, stock, cook. The house’s own numbers move around it, and nobody re-types anything.',
      device: 'arc',
      nodes: [
        { label: 'The count', note: 'Walk the house one zone at a time. Each item shows its last count and a keypad.' },
        { label: 'The menu', note: 'Shaped by who lives there: diet tags, allergens, texture. The tray note is drawn when you look, never stored.' },
        { label: 'The shortfall', note: 'What the week is short of files its own buy request, carrying its origin.', accent: true },
        { label: 'The policy', note: 'Auto-approve under your threshold. A manager above it. The rule is recorded.' },
        { label: 'The shop', note: 'In that shop’s aisle order. Works with no signal.' },
        { label: 'The receipt', note: 'Closing the run puts stock and prices back on the shelf, once.' },
      ],
      machines: [
        ['Expiry', 'Dated at entry → most urgent first, with the value at risk → use it, replace it, or discard it.'],
        ['Reserve', 'Days × beds × the quantity per bed → the gap files into the queue → bought → the next count reads it back.'],
        ['Cook', 'Today’s prep → the allergen check, which warns and names the resident’s initials → complete → stock down, once.'],
        ['Shared run', 'A link for the person doing the Costco run → they tick and close → a signed-in person confirms before the ledger moves.'],
      ],
      pull: 'On hand is never typed. Every change is a recorded movement with a who and a why.',
      closing: 'Category is the catalogue. Aisle is the route through a store. Zone is where it sits in the house. The three are never mixed.',
    },
    {
      key: 'depth', kind: 'table', id: 'compliance',
      heading: 'The rule that says what the house must keep.',
      sub: 'The reserve target is arithmetic from your bed count. Ten Oregon citations are explained in the product.',
      cols: ['Topic', 'What is shown', 'Where'],
      mono: [2],
      rows: [
        ['Emergency reserves', 'Days × licensed beds × the quantity per bed per day, then the on-hand reading and the gap.', 'Dashboard and the surveyor PDF'],
        ['The rule citations', 'Ten Oregon citations explained in one line each: 411-050-0715, 0720, 0725, 0730 and 309-040-0385.', 'Every catalogue row'],
        ['Fatal Four', 'Eight closed tags on items and on residents, and a coverage reading per house.', 'Residents and items'],
        ['Diet, texture, allergens', 'The resident’s tags on the menu, the tray note per resident, the allergen check on cook.', 'Menu and Cook'],
        ['Food safety', 'Expiry dates and Expiry Watch on every dated item.', 'Stock'],
      ],
      pull: 'The reserve target is arithmetic, not a shrug.',
      closing: 'CareShop reads a house against its own counts. It never ranks one house against another.',
    },
    {
      key: 'boundary', kind: 'boundary', id: 'boundary',
      heading: 'What CareShop will not do.',
      cols: [
        {
          label: 'Not this product', kind: 'next', items: [
            ['Store diagnoses, medications, incidents or clinical notes', ''],
            ['Schedule anyone', ''],
          ],
        },
        {
          label: 'Never', kind: 'never', items: [
            ['Store a tray note.', null],
            ['Let anyone type stock on hand.', null],
            ['Block a menu because of an allergen. It warns.', null],
            ['Derive the bed count from the resident list.', null],
            ['Delete a movement.', null],
            ['Rank one house against another.', null],
            ['Certify compliance.', null],
          ],
        },
      ],
      strip: {
        label: 'One question',
        cells: ['Does this belong to the household?'],
        foot: 'If it belongs to a resident’s care, the roster or the binder, it is not CareShop.',
      },
      pull: 'It reads a house against its own counts.',
    },
    {
      key: 'evidence', kind: 'evidence', id: 'record',
      heading: 'A resident is a label, never a name.',
      sub: 'One table holds anything about a person. These are the rules that keep it small.',
      blocks: [
        { label: 'The resident record', quote: 'Room 2 · A', text: 'Initials or a room, diet tags, one texture level, allergens, preferences. No diagnosis, no medication, no note, no free text.' },
        { label: 'Why initials are not a defence', text: 'In a house with five residents, initials identify a person to anyone who knows the house. They are ordinary decency, not a shield.' },
        { label: 'The label validator', text: 'A label that reads like a name is refused. So is an import with a clinical-notes column.' },
        { label: 'What leaves the house', wide: true, text: 'A house short code, a count, a date, an amount, a link. There is no free-text body anywhere in a message.' },
        { label: 'The shared run', text: 'A link for the person doing the shopping. It sees items and quantities, and nothing about who lives there.' },
        { label: 'Tray notes', text: 'Drawn at the moment of viewing, never stored. A menu holds a recipe, not a person.' },
      ],
      closingBlocks: [
        { heading: 'Out of range is accepted, and marked', text: 'A surprising count, a past expiry date or a high price is accepted and marked, never refused. The moment a number moves is the moment something happened.' },
        { heading: 'Two people, one shelf', text: 'The later count stands and both movements exist with their times, so a disagreement is visible rather than hidden.' },
      ],
    },
    {
      key: 'roles', kind: 'roles', id: 'roles',
      heading: 'Six people, and one of them has no account.',
      sub: 'The person doing the shopping is often not the person with the licence.',
      cols: ['Role', 'Who', 'In CareShop, they', 'Device'],
      rows: [
        ['provider', 'The licence holder or executive director', 'Set purchasing rules, approve, see spend across houses, manage billing', 'Phone and laptop'],
        ['manager', 'Resident manager or program manager', 'Plan the menu, approve requests, attest to counts', 'Phone'],
        ['caregiver', 'Direct care staff', 'Count, scan, file a request, cook from Today, shop from the list', 'Phone, at the shelf and in the store'],
        ['buyer', 'Whoever shops', 'Shopping mode and the receipt', 'Phone, in the store'],
        ['no account', 'A spouse doing the Costco run', 'Open a shared run, tick, close it. A signed-in person confirms.', 'Phone, on the web', 'wash'],
        ['operator', 'The platform team', 'Provision, suspend, repair accounts', 'Web'],
      ],
    },
    {
      key: 'objections', kind: 'qa', id: 'questions',
      heading: 'The questions we get.',
      rows: [
        ['Isn’t this just a grocery list?', 'A grocery list does not know that Room 2 is allergic to tree nuts, that the water reserve is short against your bed count, or what applesauce cost last month. The loop is the product.'],
        ['My caregiver’s phone has no signal in the store.', 'Picks wait on the phone. When the signal comes back they land once, and a pick is never counted twice.'],
        ['Can I use it across more than one house?', 'Yes. Pro covers up to five houses. Scale is unlimited houses and seats, with spend across all of them.'],
        ['How is this different from a spreadsheet?', 'A spreadsheet does not scan, does not know who lives there, and does not put the receipt back on the shelf. CareShop closes the loop by itself.'],
      ],
    },
    {
      key: 'start', kind: 'start', id: 'start',
      heading: 'The first ten minutes.',
      sub: 'If the loop closes once, you trust it.',
      steps: ['Add a zone and scan five items from the pantry.', 'Set a par on one, and watch it become a buy request.', 'Add a resident with a tree-nut allergy, and see the menu warn.', 'Open Today and see what the house needs.'],
    },
    {
      key: 'pricing', kind: 'tiers', id: 'pricing',
      heading: 'Nineteen dollars a house.',
      sub: EVERY_PLAN,
      main: 1,
      note: 'Sold on the web. Start on Free: one house, three people, no card.',
    },
    {
      key: 'foot', kind: 'foot', id: 'foot',
      by: 'by Provider Hub Oregon',
      disclaimer: '',
    },
  ],
};

/* ── Aidepost ───────────────────────────────────────────────────────────── */
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
      eyebrow: 'Providers pay · caregivers never do',
      fine: 'Caregivers use it free, with no organisation and no card.',
    },
    {
      key: 'proof', kind: 'proof', id: 'why',
      items: [
        ['Inward first, outward second', 'A shift goes to your own staff first. The first acceptance claims it. Posting outward is your decision, never a timer.'],
        ['Surfaced, never enforced', 'A lapsed credential or an overlap is named beside the person while you choose. Nothing removes her from the list.'],
        ['A shift describes the work', 'House, date, hours, role, credentials, rate. There is no field that can describe a resident.'],
      ],
    },
    {
      key: 'screen', kind: 'screen', id: 'board',
      heading: 'One screen: covered, or not.',
      sub: 'This week and next, one row per shift. Covered with a name, or open.',
      instrument: { desktop: 'web', mobile: 'ios' },
      callouts: [
        [(s) => `a covered cell reading “${s.week.rows[0][1][0]}”`, 'Covered means a name. There is nothing else on the cell to read.'],
        ['the open cell', 'Open. One word, and the only other state the board has. Open within twenty-four hours tells the manager and the provider.'],
        [(s) => `the detail card “${s.shift.when} · ${s.shift.work}”`, 'House, date, hours, role, credentials, rate. Nothing about a resident.'],
        [(s) => `“${s.shift.actions[0]}”, then “${s.shift.actions[1]}”`, 'Inward first, always. Posting outward is your action on an open shift.'],
        ['the eligibility list', 'Everyone on that house’s staff, with any marker that applies. No marker removes a person.'],
      ],
      side: {
        label: 'Credentials, before they bite',
        text: 'The holder is told at thirty days, at seven, and on the day. You get a count for your houses, never a name in the message.',
      },
      caption: 'On a caregiver’s phone the same work is a feed: soonest first, then nearest. Never a resident, never a house address before a relationship exists.',
      figure: {
        heading: 'What a marker is, and is not',
        rejected: 'Blocked — CPR expired',
        kept: 'CPR expired. Assign anyway.',
        caption: 'Four markers can appear beside a name: a missing credential, an age rule, an overlap, unfinished onboarding. None of them removes her from the list.',
      },
    },
    {
      key: 'loop', kind: 'loop', id: 'flow',
      heading: 'Inward first. Outward second.',
      sub: 'The order is the product. Your own staff know the house.',
      device: 'week',
      nodes: [
        { label: 'a pattern', note: 'Day, Evening, Night or a name you type, with the times, the role and the credentials.' },
        { label: 'open', accent: true, note: 'Still open within twenty-four hours, and the manager and the provider are told.', states: [['open', 'Open'], ['covered', 'Covered']] },
        { label: 'offered inward', note: 'Everyone eligible and free at that time.' },
        { label: 'claimed', note: 'The first acceptance claims it. The others are told.' },
        { label: 'posted outward', note: 'Your action, never a timer. Visible only to signed-in relief workers in your area.' },
        { label: 'claimed by relief', note: 'A caregiver from the pool takes it.' },
        { label: 'confirmed', note: 'You decide who enters your house.' },
        { label: 'worked', note: 'Clock in and out. Events queue without signal and land once.' },
        { label: 'timesheet', note: 'A week per person, a total, and a flag at forty hours. Approved one person at a time.' },
      ],
      quote: { at: 1, text: 'It shows what is not covered.' },
      gates: [
        'A relief worker cannot clock in until you have confirmed her.',
        'An unpaid posting stays a draft.',
      ],
      gateNote: 'Two gates, both about who may act. Nothing else in this product stops anyone.',
      pull: 'Surface, never police. You are responsible; the system makes the facts visible.',
      closing: 'If a payment fails, your staff can still clock in and out. Hours are a legal record.',
      machines: [
        ['Credential', 'Recorded with its dates → a notice at thirty days, at seven, on the day → expired, named on the roster, still assignable → renewed as a new record. History is never collapsed.'],
        ['Hire', 'A post is drafted → paid and published → an application arrives with her profile and credentials → screened, offered, accepted → a staff record and the onboarding checklist. Applications are never scored.'],
        ['Hours', 'Clock in at the house, offline if she must → clock out, or it is marked incomplete and you both see it → a week → a flag at forty hours → approve one person at a time → export CSV.'],
        ['Policy signature', 'You register which version is current → each person signs by typing her name → a new version resets the outstanding signatures and keeps the old ones.'],
      ],
    },
    {
      key: 'depth', kind: 'table', id: 'rules',
      heading: 'What the rule says, shown and never enforced.',
      sub: 'Where Aidepost knows a fact about whether a person should work a shift, it shows it at the moment of choosing.',
      cols: ['Rule', 'What Aidepost shows', 'Where', 'How sure'],
      mono: [2],
      rows: [
        ['Under 21, alone for more than 2 hours in 12', 'A marker beside her name at the moment of choosing', 'The eligibility list', 'Derived'],
        ['Dementia training before direct care — ORS 443.743', 'A default onboarding item on the adult-foster-home tracks', 'Onboarding', 'Derived'],
        ['Background check — OAR 407-007', 'A status you type, with a date. Never a result.', 'Credentials', 'Derived'],
        ['Weekly overtime — ORS 653.261', 'A flag at 40 hours in the week', 'Timesheets', 'Derived'],
        ['Competency-Based Training Plan — OAR 411-325-0025', 'Each plan item as a credential type, on the agency track', 'Credentials', 'Verified'],
        ['Relief care; substitute caregiver — OAR 411-360', 'The vocabulary the marketplace uses', 'Everywhere', 'Verified'],
      ],
      pull: 'Thirty days, seven days, then the day itself. The decision stays yours.',
      closing: 'Every derived row is closed by reading the source and confirmed by a provider on that track.',
    },
    {
      key: 'boundary', kind: 'boundary', id: 'boundary',
      heading: 'What Aidepost will not do.',
      sub: 'It is the workforce record, at full depth, and nothing else.',
      cols: [
        {
          label: 'Not this product', kind: 'next', items: [
            ['Hold resident care, the MAR or incidents', '', null],
            ['Write the house rules', '', 'It records who signed which version.'],
          ],
        },
        {
          label: 'You do', kind: 'provider', items: [
            ['Run the background check. Aidepost holds a status you type.', null],
            ['Decide. Every marker is shown, and none of them blocks an assignment.', null],
            ['Pay. Hours leave as a CSV with no calculated pay.', null],
          ],
        },
        {
          label: 'Never', kind: 'never', items: [
            ['Run or receive a background check.', null],
            ['Verify a credential with its issuer. Every record is marked self-attested.', null],
            ['Share attendance between employers.', null],
            ['Rate a person. Attendance is showed, did not show, or late by a number of minutes.', null],
            ['Describe a resident in a posting.', null],
          ],
        },
      ],
      strip: {
        kind: 'phrase', label: 'Does not',
        cells: ['keep residents’ records', 'run the kitchen', 'build binders', 'process payroll', 'run background checks'],
      },
      pull: 'Aidepost is the workforce record. It does not keep residents’ records, run the kitchen, build binders, process payroll, or run background checks.',
    },
    {
      key: 'evidence', kind: 'evidence', id: 'record',
      heading: 'A shift describes the work, never the person.',
      sub: 'What the product holds, what it is allowed to say, and what it does when something goes wrong.',
      blocks: [
        { label: 'What it holds', text: 'Staff, credentials and their dates, shifts, clock events, timesheets, applications and caregiver profiles. No resident record, ever.' },
        { label: 'What an email says', quote: 'WH-1: 2 shifts open within 24 hours.', text: 'One of sixteen messages. There is no free-text body, so there is nothing to write a name into.' },
        { label: 'What a push says', quote: 'Your CPR expires in 7 days.', text: 'A credential name goes to its own holder and nowhere else. Your copy carries a count.' },
        { label: 'What is public', text: 'One thing: a live job posting, at an address nobody can enumerate. Relief shifts are never public, and a shift is never public at all.' },
        { label: 'Attendance', text: 'Showed, did not show, or late with a number of minutes. No rating, no comment, no free text.' },
        { label: 'If a payment fails', text: 'You see the notice; your staff see nothing. They can still clock in and out, because hours are a legal record.' },
        { label: 'If the phone has no signal', text: 'Clocking in and out queues and lands once. Decisions never queue, so a decision never arrives late.' },
      ],
      closingBlocks: [
        { heading: 'Two audiences, one design', text: 'The employer’s side is dense. The caregiver’s side is one column, for a phone held in one hand on a bus. You are asked which side you are on once.' },
      ],
    },
    {
      key: 'caregiver', kind: 'caregiver', id: 'caregivers',
      heading: 'Shifts near you, tonight.',
      sub: 'Free. No organisation. No card.',
      lines: [
        'Create a profile. Add a CPR card photo and its date.',
        'See open shifts near you, soonest first and then nearest, with the work described and never the person.',
        'Keep your credential dates in one place, and carry them from one employer to the next.',
        'Claim an open shift at a house you already work at.',
        'Clock in, clock out, and see your own weekly total.',
        'Apply to a job post with your caregiver account.',
        'Opt in to relief work across providers, by radius and by availability. It is off until you turn it on.',
      ],
      promise: 'You are not the product. Aidepost never runs a background check on you, never rates you, and records attendance as facts only. What a listing says about the work is public; what it says about you is not.',
      ctas: [['Join as a caregiver', '#join'], ['How credentials work', '#credentials']],
      fine: 'Caregivers pay nothing, ever. Providers buy Aidepost.',
      mono: 'aidepost.com/caregivers',
    },
    {
      key: 'roles', kind: 'roles', id: 'roles',
      heading: 'Five roles, and two of them have no employer.',
      cols: ['Role', 'Who', 'In Aidepost, they', 'Device'],
      rows: [
        ['provider', 'The licence holder or executive director', 'Post jobs, approve hires, see coverage across houses, export timesheets, manage billing', 'Phone and laptop'],
        ['manager', 'Resident manager or program manager', 'Build the roster, fill open shifts, review applications, see expiring credentials', 'Phone, daily'],
        ['caregiver', 'Staff on the roster', 'See my schedule, clock in and out, claim an open shift, keep my dates', 'Phone, every shift'],
        ['applicant', 'A caregiver with no organisation yet', 'A profile, self-attested credentials, apply to posts', 'Phone', 'wash'],
        ['relief worker', 'Opted into the pool', 'Claim relief shifts across providers', 'Phone', 'wash'],
      ],
      perms: [
        ['Her own profile, availability and credentials', 'everyone keeps her own.'],
        ['Someone else’s credentials', 'a manager views and adds dates; the provider edits.'],
        ['The roster and the open-shift board', 'a caregiver views; a manager builds, offers and posts outward.'],
        ['Job posts', 'a manager drafts; the provider publishes and pays.'],
        ['Timesheets', 'everyone sees her own; a manager or the provider approves; the provider exports.'],
        ['Billing', 'provider only.'],
      ],
      closing: 'A refused action names the reason: your role, your side, your houses, or the subscription.',
    },
    {
      key: 'objections', kind: 'qa', id: 'questions',
      heading: 'The questions we get.',
      rows: [
        ['Why not just post in the Facebook group?', 'A Facebook group does not know who holds a current CPR card, cannot show that you offered the shift to your own staff first, and leaves you no timesheet at the end of the week.'],
        ['Will it stop me scheduling someone whose CPR has lapsed?', 'No. It tells you at thirty days, at seven, and on the roster itself. The decision stays yours.'],
        ['Will my staff be poached?', 'Shifts are never public. Only a job post is public, and only when you publish it and pay for it.'],
        ['How much is a post?', 'Twenty-five dollars per post. It publishes when it is paid, on every plan including the trial.'],
        ['Do caregivers pay?', 'Never. Caregivers create a profile, keep their dates, claim shifts and apply to posts free, without an organisation and without a card.'],
      ],
    },
    {
      key: 'start', kind: 'start', id: 'start',
      heading: 'The first ten minutes, on both sides.',
      columns: [
        { label: 'Provider', steps: ['Add six staff and their CPR dates.', 'See the one that expires Friday light up.', 'Build next week’s roster.', 'See Saturday night open. Offer it to your own staff, then post outward.'] },
        { label: 'Caregiver', wash: true, steps: ['Create a profile.', 'Add a CPR card photo and its date.', 'See three open shifts within twenty-five miles.'], foot: 'No organisation. No card. Nothing to cancel.' },
      ],
      signupHeading: 'Signing up takes five minutes',
    },
    { key: 'join', kind: 'join', id: 'join' },
    {
      key: 'pricing', kind: 'tiers', id: 'pricing',
      heading: 'Providers pay. Caregivers never do.',
      sub: EVERY_PLAN,
      main: 1,
      note: 'Per house, plus one charge for each job post. Sold on the web.',
    },
    {
      key: 'foot', kind: 'foot', id: 'foot',
      by: 'by Provider Hub Oregon',
      disclaimer: '',
    },
  ],
};

/* ── quoted callouts, read from the surface they annotate ────────────────
   A callout may never quote a string the instrument beside it does not
   render, so a callout target is either plain prose or a function of that
   product's own surfaces entry, resolved at render time; check() re-reads
   every one of them against the rendered instrument. */
function said(rows, key) {
  const r = rows.find(([k]) => k === key);
  return r ? `${r[0]} · ${r[1]}` : key;
}

export const PAGES = { cohort, careshop, binderkit, aidepost };

/* Kept for the render registry's sake; no public page renders siblings. */
export const siblingsFor = (id) => [PRODUCTS[0], ...MINIS.filter((m) => m.id !== id)];

export default PAGES;
