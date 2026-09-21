// The four landing pages, as data. One invariant spine, one object per
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
   Written once and read by all four. This is the mechanism that makes the
   family read as one maker rather than three teams: the signup, the billing
   states and the trial line are literally the same strings on every page. */
export const TRIAL_FINE = 'Three days, card on file, everything Pro shows, one-tap cancel. Sold on the web, never through an app store.';

export const SIGNUP_SIX = {
  heading: 'Signing up, in six steps',
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
  heading: 'Signing up, in five steps',
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
    ['On a plan', 'Full access.'],
    ['If a payment fails', 'Full access while we retry — we write on day 0, day 7 and day 14.'],
    ['If it stays unpaid', 'You can still read and export. The work the product is required to keep still works.'],
    ['If you cancel', 'You can still sign in to export, until the account is deleted. Export first.'],
  ],
};

export const EVERY_PLAN = 'Every plan sees every screen; an action above your plan is shown with its cost, never silently blocked.';

/* The waitlist. One block, one form, the same promise on every site that has
   nothing to sell yet. CareShop drops the slot: it has a signup. */
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
      fine: 'Runs on the house phone your staff already carry. Dose records, documentation, task completions and incident drafts queue on the device, so a shift never waits for the wifi — signing off an incident, and approving anything, do not queue, because those are decisions.',
      strip: {
        kind: 'struck', label: 'What comes off the wall',
        cells: ['The paper MAR', 'The shift binder', 'The whiteboard', 'The group text'],
      },
    },
    {
      key: 'proof', kind: 'proof', id: 'why',
      items: [
        ['Two gates, and nothing else blocks', 'A medication that matches a recorded allergy, and an as-needed dose recorded before its minimum interval or beyond its daily ceiling. Everything else surfaces and steps aside: the rule is that exactly two actions may stop a caregiver, and no module may add a third.'],
        ['Append-only, by construction', 'Every regulated write is append-only and attributed. A correction is a new record, nothing is overwritten, nothing is deleted, and a dose cannot be un-administered.'],
        ['Not open yet, and plain about it', 'The first house is named — an adult foster home in Eugene, on the AFH-DD track — and what it has to prove is fourteen consecutive days of medication passes with no paper, plus one incident filed and signed off inside the product. Until the customer business associate agreement is executed, no real resident enters Cohort.'],
      ],
    },
    {
      key: 'screen', kind: 'screen', id: 'today',
      heading: 'Today, at 06:55.',
      sub: 'The first screen after sign-in, composed in a fixed order — medications due this shift, documentation done against expected, tasks due, a pinned announcement, last night’s handoff, incidents awaiting a decision, who is on today, and the emergency panel. Every line is a count with a route into the screen that owns it, nothing on it is stored, and nothing that is in good order is shown at all.',
      instrument: { desktop: 'ios', mobile: 'ios' },
      callouts: [
        [(s) => `“${s.tabBadge.text}”`, 'A count of what is due this shift, and a route into the MAR. There is no readiness percentage in this product and no countdown; the only things marked out are what is late, what is unread, and what is waiting on a decision.'],
        [(s) => `“${said(s.handoff.rows, 'Documentation')}”`, 'Inside the handoff: what the night shift finished, counted. Done against expected — never a percentage handed to you as a grade.'],
        [(s) => `“${s.handoff.t}”, and “${s.handoff.receipt}”`, 'The night caregiver has gone, and this is what she left: medication outcomes as counts by kind, documentation done against expected, incidents filed this shift, tasks completed and outstanding, and her passage for the next shift. Opening it records who opened it and when — acknowledgement is never assumed.'],
        [(s) => `“${s.rows[0].stamp}”`, 'Every entry carries the same stamp, logged by and at, with prior edits one tap away. An hour after the shift ends — the value is proposed, not settled — the entry locks, and from then on a correction is an addendum under the original, with a reason.'],
        ['below the list', 'Completed items leave the list rather than sit in it, and a house with nothing outstanding says so in words rather than looking broken. A section whose source fails says so and offers to retry; one failing read never empties the screen.'],
      ],
      side: {
        label: 'When the wifi goes',
        text: 'Dose records, documentation entries, task completions and incident drafts queue on the device against an idempotency key, so recording one twice writes it once and a caregiver never waits for the network. Signing off an incident, approving anything, closing any record — those do not queue, because they are decisions, and the product says so rather than pretending.',
      },
      caption: 'Nothing on this screen is red, and nothing on it is a score. Coral marks one thing in this product — what is late, unread, or waiting on a decision.',
      figure: {
        heading: 'How it speaks',
        rejected: '⚠ MEDICATIONS OVERDUE',
        kept: '4 meds due',
        caption: 'Calm and factual, and testable on any string in the product. The rule names what it will not print: no warning symbol, no capitalised shouting, no percentage offered as a grade.',
      },
    },
    {
      key: 'loop', kind: 'loop', id: 'pass',
      heading: 'The pass, as the state machine runs it.',
      sub: 'Seven states, and exactly two of them stop a caregiver. The number is fixed by a rule, not by taste — exactly two actions may stop a user, and no part of the product may add a third — because each one erodes the principle that the software informs rather than polices.',
      device: 'dots',
      nodes: [
        { label: 'scheduled', note: 'Against the order version in force.' },
        { label: 'Six Rights', note: 'Six boxes, all required.' },
        { label: 'allergy check', accent: true, note: 'Always runs.' },
        { label: 'interval and ceiling', accent: true, note: 'Two conditions, not one.' },
        { label: 'witness co-sign', note: 'Team houses only.' },
        { label: 'signed', states: [['given', 'Given'], ['held', 'Held']], note: 'Given, refused, held or missed.' },
        { label: 'locked', note: 'Addenda only. Never reversed.' },
      ],
      gates: [
        'A medication that matches a recorded allergy — matched on the normalised name and on a maintained list of equivalent names. The stop names the allergen, its severity, its reaction and where the information came from, and the check runs even where no allergy has been recorded, so that the absence is something the system states rather than something it left out.',
        'An as-needed dose recorded before the order’s minimum interval, or beyond its maximum in twenty-four hours — two conditions, not one. The stop shows when the last dose was given and when the next one is permitted.',
      ],
      gateNote: 'Both were chosen because the harm of not stopping is physical. Proceeding means choosing Override and typing a reason of at least ten characters; the reason is recorded on the dose, written to the audit log, and the manager is told. The limitation is stated rather than hidden — the match is by name and ingredient plus a manual flag, and it misses drug-class conflicts. There is no third gate, and there are no countdown timers.',
      pull: 'Un-administering is forbidden by the state machine, and so is recording in bulk — each administration is an individual attestation.',
      closing: 'There is a written test for the rest of it: walk the MAR, documentation, incidents, tasks and the handoff, and confirm that every other check informs rather than refuses.',
      machines: [
        ['Incident', 'Any role files it, with the narrative and the immediate action both required → every manager covering that house and the provider are told that an incident was filed at a house code, and nothing about who or what → reviewed → signed off by a manager or the provider, never by the caregiver who filed it → locked. The narrative is never edited; addenda append forever.'],
        ['Care note', 'A template of up to sixteen fields, set up by a manager → saved and stamped, with every prior version reachable in one step → an hour after the shift ends — the value is proposed, not settled — or when a manager closes the day, the entry locks → after that a correction is an addendum with a reason. A number outside its expected range is accepted and marked, never refused.'],
        ['Handoff', 'The outgoing caregiver starts it → the sheet composes, per resident, medication outcomes as counts by kind, documentation done against expected, incidents filed this shift, tasks completed and outstanding → she adds the passage for the next shift → posted once, and a second handoff for the same shift and house is prevented and the first one shown → opening it records who opened it and when. The sheet is stored as it stood, so it stays true as the records under it gain addenda, and where the house holds controlled medications the handover prompts a count.'],
        ['Plan version · v2', 'A document is uploaded with the date it takes effect and the date it expires → a manager types the goals in, because nothing reads them out of the file → daily work points at those goals → the expiry surfaces at thirty days and goes weekly to the manager and the provider → the next upload supersedes it, and every previous version stays readable. No field of a plan’s content is editable here, and nothing is blocked by expiry.'],
      ],
    },
    {
      key: 'depth', kind: 'table', id: 'rules',
      heading: 'The Oregon rule, quoted beside the thing it governs.',
      sub: 'Track-qualified, and marked with how sure we are of each one. A citation we have not read in the primary source says so here, on the page, and in the footer of anything you print.',
      cols: ['Topic', 'What is shown', 'Track', 'Confidence'],
      mono: [1],
      rows: [
        ['Records and documentation', 'OAR 411-360-0170', 'DD — the first house’s track', 'verified'],
        ['Records and documentation', 'OAR 411-050-0745 / 0750', 'APD', 'derived'],
        ['Records and documentation', 'Nothing shown — the section is not established', 'OHA', 'open'],
        ['Records and documentation', 'OAR 411-325, documentation sections', 'Agency', 'derived'],
        ['Abuse and incident', 'OAR 411-360-0185 — the word the rule uses is immediately', 'DD', 'verified'],
        ['Abuse and incident', 'OAR 411-323-0063', 'Agency', 'derived'],
        ['Abuse and incident', 'No section shown; the line still reads immediately', 'APD and OHA', 'open'],
        ['Capacity', 'OAR 411-360-0060 — five, and typed by the provider', 'The three AFH tracks', 'verified'],
        ['Medication delegation', 'OSBN 851-047 applies; OAR 855-080 does not', 'All tracks', 'derived'],
        ['Elopement response', 'The resident’s own window, from their plan', 'All tracks', 'corrected'],
      ],
      pull: 'A citation with no confidence beside it is a citation you cannot check, so the confidence is printed.',
      closing: 'Four tracks are modelled on one data model — APD, DD, OHA and Agency — and one library is verified so far, the first house’s. The track you pick at signup is the default a new house inherits, not a setting fixed for every house under you; changing the default later does not change the houses already made. The delegation line is shown at the dialog and never enforced, and that display is a later stage than the rest of this. Where a source has not been read, the product shows nothing rather than a guess — inventing a regulatory citation, threshold or window is one of the eleven things it refuses on principle.',
    },
    {
      key: 'boundary', kind: 'boundary', id: 'boundary',
      heading: 'What Cohort does, and what it leaves to the room next door.',
      sub: 'Four of the refusals are about scope — another room in this family does that work at full depth, which is why this one stays fast. Eleven are on principle, and each one is printed here with the reason given for it.',
      cols: [
        {
          label: 'Next door', kind: 'next', items: [
            ['Staff scheduling, hours, credentials', 'aidepost', 'Cohort keeps one shadow of it — who is on today, typed in by hand, one screen, kept ninety days.'],
            ['Household stock, menus, shopping', 'careshop', 'CareShop keeps its own copy of the allergens, because the four products keep separate backends.'],
            ['Binder structure and printed filing', 'binderkit', 'Cohort stores no document at all except a plan version — storage invites a filing system, and this product records care.'],
            ['Billing a payer, payroll, or claims', 'pho', 'With residents’ funds, clinical authoring, and every portal for a family, a guardian, a case manager or a licensor.'],
          ],
        },
        {
          label: 'Nowhere', kind: 'never', items: [
            ['No compliance score, no readiness percentage, no grade — it measures the record rather than the care, and it invites managing the number.', null],
            ['No countdown timer on a regulatory obligation — an obligation stated as immediate must not be rendered as a clock.', null],
            ['No third blocking check — two exist because physical harm justifies them, and a third erodes the principle that the product informs rather than polices.', null],
            ['Nothing is deleted — the record’s value is that it cannot be quietly changed.', null],
            ['A filed incident narrative is never edited — same reason; the correction is an addendum.', null],
            ['No resident information is sent outside the system — every message announces that something exists, and the content is read after signing in.', null],
            ['No family member or outside party is notified — the obligation and the judgement belong to the provider.', null],
            ['No regulatory number is worked out from operational data — capacity is typed by a human.', null],
            ['No regulatory citation, threshold or window is invented — where a source is not established, the statement is shown without one.', null],
            ['Care is never recorded in bulk — each administration, sign-off and completion is an individual attestation.', null],
            ['Houses and people are never ranked — ranking turns a record into a performance instrument.', null],
          ],
        },
      ],
      strip: {
        kind: 'phrase', label: 'Is not',
        cells: ['an EHR', 'clinical authoring — no ISP or nursing assessments, Provider Hub Oregon does those', 'a family or guardian portal — nobody outside the house signs in', 'a document store beyond plan versions', 'payroll', 'scheduling', 'billing to the state', 'compliance certification'],
      },
      pull: 'One question decides it: is this about a resident’s care? The product ships the answer in a sentence, at Settings and in the footer of every email it sends — Cohort keeps the residents’ record; it does not schedule staff, run the kitchen, or build binders.',
    },
    {
      key: 'evidence', kind: 'evidence', id: 'record',
      heading: 'Nothing is deleted, and nothing leaves.',
      sub: 'The protection is mechanism, not adjectives. The standing rule is one sentence: every regulated write is append-only and attributed, a correction is a new record, and nothing is overwritten. Here is how that is held up.',
      blocks: [
        { label: 'Append-only', text: 'Every entry is stamped “Logged by · at”. A correction is an addendum under the original, six tables and the incident narrative enforce it in the database, and a dose cannot be un-administered — the state machine has no way back from recorded.' },
        { label: 'Audited', text: 'Every change to a resident’s record writes a row, and every query that returns protected information writes a view row — prints, exports and any support session opened on your organisation included. A refused action is recorded too. No part of the product may opt out, and the audit log outlives the deletion.' },
        { label: 'What an email says', quote: 'WH-1: 2 items are waiting.', text: 'One of twenty-two templates. The only thing that varies in any of them is a house short code, a count, an amount from the payment processor, or a link — there is no free-text field in a single one, and no code path can add one.' },
        { label: 'What a push says', quote: 'WH-1: 4 medications due', text: 'One of nine sentences, and the set is closed, so no part of the system can invent a message. A test renders every one of them with a resident’s name in every field and checks that what comes out is the template with only the house code and the count filled in.' },
        { label: 'The house short-code', text: 'Made at setup from the house name’s initials and a number — WH-1, CH-1 — never typed and never changed. The generator refuses any code equal to or containing a resident’s name or initials, and it is the only house identifier allowed in an email or a push.' },
        { label: 'What leaves the device', text: 'Errors are scrubbed before the report leaves your phone: the request body is dropped, and any string matching a protected field name is stripped out with it. Analytics count per house per day, never per resident. Links are opaque short slugs. Exports are generated in your browser with redaction on by default, and turning redaction off for the licensing file is itself recorded.' },
      ],
      closingBlocks: [
        { text: 'Twenty-one of Cohort’s thirty tables hold protected health information, three hold personal information and six are public. It lives only in Convex, under a vendor business associate agreement, and travels only to a signed-in phone — no server renders a resident, which is what keeps the hosting company outside the boundary. You accept a Customer business associate agreement at signup, at step four, alongside Terms, Privacy and the auto-renewal disclosure: four separate checkboxes, each with its document and its version, and the card step will not load until all four exist.' },
        { heading: 'One setting, two kinds of house', text: 'A house is either solo or team, and that one switch drives the controlled-count and the witness rules. A house with one caregiver on shift cannot produce a witness, and requiring one would make the product unusable or make people lie — so in a solo house a witness-flagged dose is recorded with the absence noted, in those words: “solo — no witness”.' },
        { heading: 'What is kept, and what goes', text: 'Nothing is deleted while you are a customer. The shortest retention in the product is ninety days, on the list of who is on today. You can export at any time without asking anyone — a ZIP with a JSON file per table and every file you uploaded, readable without this product. On the way out: export, then a hold, then a hard delete of the organisation and every resident record and file. The audit log is kept for the statutory period.' },
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
        ['Resident record', 'a caregiver reads it; contacts and allergies are edited by a manager or the provider.'],
      ],
      closing: 'The same three words in code and on screen. Executive Director maps to provider, Program Manager to manager, DSP to caregiver — which is why your staff need no retraining when one house becomes twenty.',
    },
    {
      key: 'objections', kind: 'qa', id: 'questions',
      heading: 'The questions we get.',
      rows: [
        ['Will it stop my caregiver mid-shift?', 'Twice, ever. A medication that matches a recorded allergy, and an as-needed dose recorded before its minimum interval or beyond its daily ceiling — two conditions, not one. Everything else surfaces and steps aside. The governing idea is inform, don’t police, and there are no countdown timers anywhere in the product.'],
        ['The wifi in that house is bad.', 'Dose records, documentation, task completions and incident drafts queue on the device against an idempotency key, so recording one twice writes it once and the record catches up without the caregiver waiting for it. Signing off an incident, approving anything and closing any record do not queue — those are decisions, and the product says so rather than pretending.'],
        ['Can I get my data out?', 'Yes, and on the way out too. Exports are generated in the client with redaction on by default, and a cancelled account can still sign in to export before anything is purged. That export is the thing that carries you up to Provider Hub Oregon when one house becomes twenty — and it is yours to take anywhere else just as easily.'],
        ['What about Synkwise, or Therap?', 'Synkwise publishes $119–149 a month and works across many states. Therap and PointClickCare assume an agency with a compliance department. What we have instead: Oregon track-qualified citations, two gates and nothing else that blocks, an append-only record, one-house pricing — and nothing red. Those prices are their published range, not ours.'],
      ],
    },
    {
      key: 'start', kind: 'start', id: 'start',
      heading: 'The first ten minutes.',
      sub: 'The trial is the message. If this feels calm and fast, you can trust it.',
      steps: ['Name the house.', 'Add one resident with an allergy.', 'Enter one medication order.', 'Sign one dose behind the Six Rights dialog, and watch “Logged by · at” appear.', 'Invite a caregiver — the step that proves this is not a single-user product.'],
    },
    { key: 'join', kind: 'join', id: 'join' },
    {
      key: 'pricing', kind: 'tiers', id: 'pricing',
      heading: 'One price per house. Nothing hidden behind a plan.',
      sub: EVERY_PLAN,
      main: 1,
      note: 'One price per house — not per seat, not per resident, not per bed. Early-access houses are priced with us directly, before anything is charged. Selling is on the web, never through an app store.',
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
      disclaimer: 'Screens on this page use sample data.',
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
      fine: 'It prints on day one, on the black-and-white printer you already own. Early-access facilities are priced directly, to match how often the binder is revised.',
    },
    {
      key: 'proof', kind: 'proof', id: 'why',
      items: [
        ['It holds nothing about anyone', 'No protected health information anywhere in the product — no rows, no tables, no fields. Identity lines print blank and are completed by hand, a plan is keyed by a facility code rather than by a name, and there is no upload of any kind: no document, no photograph, not even your logo. That is structural, not a policy we could quietly change.'],
        ['Deterministic, and you can check it', 'The same licence track and the same five answers always produce the same plan. Generate twice and the two files are byte-identical; change an answer, re-plan, change it back, re-plan, and you are back to exactly the first plan. That is the only reason the diff at the end is worth reading.'],
        ['Every item prints its authority — or says it has none', 'A chapter and a section beside each item, with an evidence tag that takes one of three values: verified, derived, open. Derived and open print beside the citation until someone inspected on your track has read the rule text. An item that is your own house practice says so and carries no authority at all.'],
      ],
    },
    {
      key: 'screen', kind: 'screen', id: 'contents',
      heading: 'One page: the contents page.',
      sub: 'One page per binder, and the page a surveyor sees first. The header carries the binder name, the facility code, a blank identity line you complete by hand, the version and the control number. The body carries the tabs in order, numbered, each with its item, its authority, its evidence mark where the citation is short of confirmed, and a mark where the thing belongs on a wall rather than in a pocket. The footer carries the facility code, the version, the control number and the date it was generated.',
      instrument: { desktop: 'paper', mobile: 'paper' },
      split: true,
      callouts: [
        ['“Facility ______ · Resident ______”', 'Blank, and completed by hand. No person’s name appears anywhere on anything this product prints, there is no field that could hold one, and there is no free-text field about a resident anywhere in it.'],
        [(s) => `“${s.rows[2].slice(0, 3).join(' · ')}”`, 'The authority beside the item — a chapter and a section, or the words “house practice” where the item is your own and carries no authority at all. That column is the product.'],
        [(s) => `“${s.rows[3].slice(0, 4).join(' · ')}”`, 'Derived means it comes from the rule chapter rather than from a primary source that someone has read. It prints that way, visibly, until a provider inspected on your track confirms it — and you can filter the plan down to the unconfirmed items, which is the list you would take to an adviser.'],
        [(s) => `“${s.rows[4].slice(0, 4).join(' · ')}”`, 'Not one row here is marked verified, and that is the real state. Verified means a person inspected on that licence read the rule text. Today that count is zero: none of the thirty-two adult-foster-home items and none of the ninety-nine agency citations has been checked against the rule yet. These rows are illustrative; the table below is the real state, and it is on this page for that reason.'],
        [(s) => `“${s.control} · by Provider Hub Oregon”`, 'The control number is your facility code, the binder, the plan version and the print sequence, and it is on every page. Two prints of the same version carry different numbers, the file itself is kept so any past number reproduces the identical sheet, and a print that fails consumes no number and is not recorded as a print.'],
      ],
      side: {
        label: 'The banner you cannot dismiss',
        text: 'No library has been reviewed yet, so your plan and the first page of every artefact you print will carry one sentence: “This library has not yet been reviewed by a provider on your licence.” You cannot click it away, because it is there for whoever reads the print rather than whoever reads the screen. We will still generate the plan — an unreviewed plan is more useful than none, provided you can see exactly what it is.',
      },
      caption: 'Illustrative rows. The four templates were drawn for black and white on the printer you already own, and tested on paper before any screen work: readable at arm’s length, an authority column that does not wrap awkwardly, tab labels that fit standard divider stock, and the post-it-on-the-wall items gathered again at the end so you can put them all up in one pass. The last test is to assemble one binder and put it on the shelf — if it does not fit the shelf, the product has failed, whatever the screen shows.',
      figure: {
        heading: 'A phrase this product will not print',
        rejected: 'the 32 required documents',
        kept: 'thirty-two items, seen on one provider’s shelf',
        caption: 'There is no state-mandated count of resident documents. The thirty-two is one home’s binder, recorded as an observation, and no screen, no printed page and no page of this site presents it as a requirement.',
      },
      strip: {
        label: 'The four printed artefacts',
        cells: ['The contents page', 'Tab dividers', 'A one-page brief', 'The procedure'],
        foot: 'A tab label is bounded to what fits a real divider and the bound is enforced while you edit, so a label that will not fit cannot be saved; if you have no divider stock there is a plain-paper alternative with cut guides. Each artefact is generated as a PDF inside the product and then downloaded or shared — never handed to the browser’s print dialog, which is unreliable across platforms. On a phone it goes to the share sheet, so it can reach a printer, a laptop or a print shop.',
      },
    },
    {
      key: 'loop', kind: 'loop', id: 'plan',
      heading: 'Five answers in. A shelf of binders out.',
      sub: 'Deterministic, and tested as such: generate twice from the same library version and the same answers and the two files are byte-identical; change one answer, re-plan, change it back, re-plan, and you have the first plan again. Everything below depends on that, and so does the diff.',
      device: 'tabs',
      nodes: [
        { label: 'Question zero', note: 'Your licence track, asked before anything else and shown again on the plan so a wrong choice is visible rather than buried. Four cards, each described in two plain sentences saying what that licence is rather than what its chapter number is. It selects the library, and the libraries differ in almost every item. If your track has no library yet the plan screen says so plainly, and you are not charged for what you cannot use.' },
        { label: 'Five questions', note: 'How many people live here · do you employ staff other than yourself · do you provide transportation · do you handle residents’ money · is this home part of a certified agency. One per screen, each saying why it is asked and what it will change, so that answering is a decision rather than a form. On the agency track the fifth becomes how many homes you operate, because each library brings its own questions.' },
        { label: 'The plan', note: 'Typically five binders — resident, staff file, facility, emergency, policy — though the library decides. Every item is required, conditional or suggested: required items can be moved and never removed, conditional items carry the answer that produced them, suggested items are labelled as good practice and can go. The plan also tells you how many physical binders and how many dividers to buy.' },
        { label: 'Print', note: 'The contents page, the tab dividers, the brief and the procedure, each carrying your facility code, the version and a control number. Printing every binder’s every artefact in one go is the one bulk action there is. Every print writes a row — version, control number, artefact, who and when — and the file is kept, so any past control number reproduces the identical sheet.' },
        { label: 'Edit, guarded', note: 'Five edits and no others: reorder tabs, rename a tab’s label while the item and its authority stay as they are, move an item to another tab of the same binder, add an item of your own, remove a suggested one. Every edit is attributed and makes a version. There is no bulk edit, because each edit is a judgement about one item.', accent: true },
        { label: 'Re-plan', note: 'Three things can change — an answer, your track, or a new library version — and none of them changes your plan on its own. A re-plan is offered, never applied: the diff shows what was added and why, what was removed and why, what moved, and which of your edits can no longer apply. Nothing changes until you accept, and declining leaves the plan exactly as it was.' },
        { label: 'Reset', note: 'Back to the library default for your current answers. The screen tells you exactly what will be discarded before anything is. Your edits go, your notes stay, a new version is made, and the previous version with its edits is still readable.' },
      ],
      quote: { at: 4, text: 'This item is required by section 0170. You can move it, but it can’t come out.' },
      gates: [
        'Coverage — a required item can move to another tab and can never leave the binder. The refusal names the rule that requires it and offers you the move.',
        'Scope and access — “Staff records and resident records are kept separately. This item can move within the staff file.”',
        'Cohesion — “These items are one tab. Move the whole tab, or move this item into an existing tab here.”',
      ],
      gateNote: 'Every refusal says what you tried, which guardrail applied, the rule behind it, and at least one thing you can do instead, one tap away. It never uses the language of permission — it never says “not allowed” — and a refusal that offers you no alternative is a bug on our side, not a rule on yours. Refusals are counted by item and by guardrail, because a guardrail that refuses the same item over and over is telling us the library has that item marked wrongly or placed wrongly. So are the items you add yourself: every one of them is something the library did not know about.',
      pull: 'Skipping a question is a valid answer with a stated consequence: it resolves the most inclusive way, gives you more items rather than fewer, and the plan says which items came from a question you skipped, so you can come back and narrow it.',
      closing: 'Applying a re-plan tells you which binders need reprinting and which do not, which is the whole point. Say you start employing staff: the diff adds a staff-file binder and four facility items, each naming the answer that produced it, nothing is removed, one of your edits is reported as no longer applicable — and you print two, not five. Notes attach to an item’s permanent identifier, so they survive a reset, a re-plan, a new library version and a change of track; a note on an item a new version removes is kept and shown to you as orphaned, to move onto an item of your own or discard, never quietly lost.',
    },
    {
      key: 'depth', kind: 'table', id: 'library',
      heading: 'The licence track selects the library, and the library is the product.',
      sub: 'Four licence tracks, four separate rule sets, four separate libraries — and the agency chapters are not an old version of the adult-foster-home rules, they are a different track, right for agency homes and wrong for the other three. A facility has one track, chosen when you create it. Here is what each library draws on, what is in it, and how much of it has been read against the rule.',
      cols: ['Library', 'Authority', 'What is in it', 'Citations read against the rule'],
      mono: [1],
      rows: [
        ['AFH-DD', 'OAR 411-360 — 0130 standards, 0140 health care, 0170 documentation and records, 0185 abuse and incident; plus 411-004 HCBS', 'Thirty-two resident-binder items, observed on one pilot home’s shelf, sixteen of them flagged for checking. The house-level binders — facility, emergency, policy — have not been collected yet; only the resident binder was seen.', 'None of the thirty-two'],
        ['Agency', 'OAR 411-325 as amended 15 January 2026, and 411-323, for the setting and the certification; 411-318 and 411-004 are derived from the chapters rather than read', 'One hundred and twenty-six items: the same thirty-two, plus ninety-four derived. Ninety-nine citations recorded, all of which must be re-verified against the amended chapters before the first paying agency.', 'None of the ninety-nine'],
        ['AFH-APD', 'OAR 411-050 — 0745 Facility Records, which is the rule’s own name for that set, and 0750 resident records, twenty to twenty-four types', 'Not in this release.', '—'],
        ['AFH-OHA', 'OAR 309-040', 'Not in this release.', '—'],
      ],
      pull: 'Four rules govern every citation this product puts on paper: an item carries an authority, or it is marked “house practice” and carries none; a derived or open tag prints beside the citation where it applies; a library nobody inspected on that licence has reviewed shows a banner on the plan and on the first page of every print; and nothing here ever says, or implies, that following it makes a home compliant.',
      struck: {
        heading: 'Three words that do not appear in this product',
        words: ['ready', 'compliant', 'audit-proof'],
        foot: 'Not in the name, not in the descriptor, not in the interface, and not in the marketing either. Binderkit provides information about record-keeping requirements; it does not give legal or compliance advice, and it does not certify that any home meets any requirement. The Terms say it, and so does the footer of the brief you print.',
      },
      closing: 'AFH-DD and Agency ship first. Each library is read against the rule by a provider inspected on that track — thirty to forty hours apiece — and until that has happened your plan carries a banner saying so, on screen and on paper. We would rather hand you a banner than a tidy page.',
    },
    {
      key: 'boundary', kind: 'boundary', id: 'boundary',
      heading: 'What Binderkit refuses to do — and why the refusal is the product.',
      cols: [
        {
          label: 'Next door', kind: 'next', items: [
            ['Keep the document itself, or take any upload', 'pho', 'Provider Hub Oregon, the Digital Binder'],
            ['Record a policy acknowledgment or a credential date', 'aidepost', 'Binderkit prints the tab the policy goes in; Aidepost records the signature'],
            ['Hold emergency stock against a bed count', 'careshop', 'Binderkit prints the tab the reserve record goes in'],
          ],
        },
        {
          label: 'Never', kind: 'never', items: [
            ['Holding anything about any person.', null],
            ['Any upload of any kind — no document, no photograph, no logo.', null],
            ['A review cycle, findings, or an electronic signature.', null],
            ['Claiming that using it produces compliance.', null],
            ['No deadline, no countdown, no review reminder — the cadence is yours to set, and the procedure we print says exactly that.', null],
            ['The first three would each put a record about a person back into the product, and holding none of them is the whole of its value. The last two would turn a reference into a policeman.', null],
          ],
        },
      ],
      strip: {
        label: 'The test we put every request through',
        cells: ['Does it tell you what goes where?', 'Does it store a document?', 'Does it track what is filed?', 'Does it record a finding?'],
        foot: 'The first answer has to be yes and the other three no. If a request is about a person it belongs to Cohort or Aidepost; if it is stock it belongs to CareShop; if it wants the document itself kept, it belongs to Provider Hub Oregon. And if a capability would store a person’s name, a fact about a person, an uploaded file, or a finding, it ends the constraint this product is built on — which makes it a decision to be taken deliberately and written down, not a feature to be added.',
      },
      pull: 'Surface, never police.',
    },
    {
      key: 'evidence', kind: 'evidence', id: 'record',
      heading: 'It holds nothing about anyone.',
      sub: 'Zero is a property of this product rather than something missing from it, and most of what follows is a consequence.',
      blocks: [
        { label: 'What it holds', text: 'No protected health information anywhere: no rows, no tables, no fields. Nine product tables, all of them organisational — your facilities, your answers, your plans, your versions, your prints. Seven platform tables hold account information about the people who sign in: users, memberships, invites, notification preferences, support tickets, and the platform’s own admin and impersonation records. None of them is about a resident.' },
        { label: 'No business associate agreement', text: 'Which is why signing up is five steps rather than six: account, licence track, organisation and first facility, the legal set with its documents inline, card. There is no agreement to sign for protected information because the product receives none — which is not the same as there being nothing to protect, as the counterweight below says.' },
        { label: 'The key', text: 'A plan is keyed by your facility code — made from the facility name’s initials and a number when you create it, never changed, and never containing a person’s name. It is in the footer of every artefact and in every notification, and nowhere else, because every printed page needs an identifier that is not somebody’s name and not your address.' },
        { label: 'What a notification says', quote: 'WH-1: your plan has a new version.', text: 'One of four, and there is no fifth: your plan has a new version, the library has been updated, your trial ends tomorrow, your export is ready. The content is a facility code, a track name, a version number, an amount, or a link. There is no push notification at all — nothing in this product is urgent enough to interrupt you.' },
        { label: 'Printing', text: 'Generated as a PDF inside the product and then downloaded or shared, never handed to the browser’s print dialog. The identity line prints blank and you complete it by hand.' },
        { label: 'If you stop paying', wide: true, text: 'Printing, viewing and export keep working; answering, editing, re-planning, resetting and adding facilities do not. Somebody whose subscription has lapsed can still reprint a worn table of contents — withholding a reprint is not leverage.' },
        { label: 'What support asks for', text: 'The form already knows your organisation, your facility, your track and your library version. Its guidance reads “Tell us the facility code, not the resident’s name.” There is no warning about protected information on it, because there is none here to warn about.' },
        { label: 'The record we keep', text: 'An append-only log of every answer change, every generation, every edit accepted or refused — with the guardrail that refused it — every note, reset, print, facility change and library adoption. There is no logging of who looked at what, because there is nothing about a person to look at.' },
        { label: 'One exception, declared', text: 'When something goes wrong, the error report may carry the full contents of the request. That is deliberate, and it holds only while this product holds no record about any person.' },
      ],
      closingBlocks: [
        { heading: 'What the absence buys you', text: 'Five steps at signup instead of six, and no agreement to sign before you can try it. Support that can read your plan directly and answer, rather than asking you to describe it. A materially smaller amount of your business held by us at all. And deletion that no retention law delays — you ask to leave, you take the export, a holding period runs because we chose one commercially rather than because a rule requires it, and then the record is hard-deleted and the deletion confirmed.' },
        { heading: 'And the counterweight', text: 'Your staff accounts are still personal information. Access control, session security, audit logging, backups and our own discipline apply here exactly as they would in a product holding a resident record. The difference is in what is stored, never in how carefully it is kept.' },
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
        ['viewer (a product role)', 'A consultant or an adviser, invited by the provider to named facilities', 'Read and print that facility’s plan, from her own account', 'Laptop', 'wash'],
      ],
      leaders: true,
      perms: [
        ['Answer the questions', 'provider only.'],
        ['Edit contents, guarded', 'provider only.'],
        ['Notes', 'manager and provider.'],
        ['Reset and re-plan', 'provider only.'],
        ['Print', 'everyone, including the viewer.'],
      ],
      closing: 'A viewer is a seat, not a share. There is no public link to a plan and there will not be one: the consultant is invited to a named facility and reads it from her own account. Without the role she would be sent a screenshot or a password, so the role exists to make the honest thing the easy one. Seats are counted by tier, and going over one is shown with its cost rather than blocked.',
    },
    {
      key: 'objections', kind: 'qa', id: 'questions',
      heading: 'The questions we get.',
      rows: [
        ['Can’t I just copy another provider’s binder?', 'That is what most people do, and it is what the licensing letter is usually about. A copied binder carries someone else’s track, someone else’s house count, and someone else’s gaps.'],
        ['Will this make me compliant?', 'No. It tells you what the rule asks for, with the rule printed beside it, in order. It does not certify anything, and the words ready, compliant and audit-proof are forbidden in this product by design.'],
        ['What if a citation is wrong?', 'It tells you before you print it. Every item carries one of three evidence tags — verified, when a provider inspected on that track has read the primary source; derived, when it comes from the rule chapter; open, when no source is established at all. Today none is verified: none of the thirty-two adult-foster-home items and none of the ninety-nine agency citations. So the plan carries a banner saying so, and you can filter it down to the unconfirmed items, which is the list you would take to an adviser.'],
        ['Is a subscription right for something I use twice a year?', 'That is exactly why both shapes are offered. A binder revised continuously wants a subscription; one printed twice a year may want a single purchase. Early-access facilities are priced for the way they actually work — and printing, viewing and export keep working either way.'],
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
      heading: 'Priced in the open, and settled with you.',
      sub: EVERY_PLAN,
      main: 1,
      note: 'Two things are settled, by a Binderkit decision of 2026-09-12. Selling is on the web through Stripe Checkout, and the native application never presents a purchase sheet. And printing, viewing and export keep working after a payment fails, because withholding a reprint is not leverage, it is spite. Early-access facilities are priced directly, for the way the binder is actually used.',
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
      footer: 'Lands on Basic or Professional — the tier is a proposal rather than a decision — when you want the documents stored: the review cycle, uploads, expiry tracking. The trigger is assumed, not observed.',
      pull: 'The thing it will not do is the thing that graduates you.',
    },
    { key: 'family', kind: 'band', id: 'family', heading: 'One house. Four rooms. One ladder.', byline: 'by Provider Hub Oregon' },
    {
      key: 'foot', kind: 'foot', id: 'foot',
      by: 'by Provider Hub Oregon',
      disclaimer: 'Screens on this page use sample data.',
    },
  ],
};

/* ── CareShop ─────────────────────────────────────────────────────────────
   The ledger rule and the basket arc. The one product in the family that is
   already live and already has a price, so it is the one page here with a
   number on it and a signup rather than a list to join. It drops `join`.  */
const careshop = {
  id: 'careshop',
  accentBudget: 3,
  sections: [
    {
      key: 'hero', kind: 'hero', id: 'top',
      eyebrow: 'Live at careshop.app · Oregon care homes',
      instrument: { desktop: 'crop', mobile: 'crop' },
      descriptorInline: true,
      fine: `${TRIAL_FINE} The tiers running today are Free, Pro and Scale.`,
    },
    {
      key: 'proof', kind: 'proof', id: 'why',
      items: [
        ['In real kitchens today', 'A caregiver scans an unknown barcode at the shelf and the item exists: the barcode and a typed name, and nothing else required — no category, no unit, no zone, no threshold. On the one house we have watched, it is the most-used capability in the product.'],
        ['The loop closes by itself', 'A menu shortfall, an expiry, a par breach or a reserve gap files its own buy request, carrying its origin, and nobody re-types anything. Stock rising on a receipt and falling on a cook is a switch that ships off by default and only on the paid tiers, because a house whose loop does not visibly close has not seen the product.'],
        ['A resident is a label, never a name', 'Initials or a room number, diet tags, one texture level, allergens — enough for a tray note and a menu check, and nothing more. Initials are a display convention, not a de-identification method, and the product’s obligations are unchanged by them.'],
      ],
    },
    {
      key: 'screen', kind: 'screen', id: 'queue',
      heading: 'One screen: the buy queue.',
      sub: 'Grouped by house, then by origin, and within each, most urgent first. Each line carries the item, the quantity, where it came from, who raised it, its status, and the last known price at the cheapest shop. An empty queue says the house is stocked rather than showing nothing.',
      instrument: { desktop: 'web', mobile: 'ios' },
      callouts: [
        [(s) => `“${s.rows[0].origin}”`, 'Where the line came from. Five origins and no sixth — a menu shortfall, an expiry, a par breach, a reserve gap, or a person’s request — and every request carries exactly one, preserved through to purchase. Without the origin the queue is a list; with it, the queue is diagnosable. Origin is recorded on every request today.'],
        [(s) => `“${s.rows.find((r) => r.state === 'expiring').origin}”`, 'Dated at entry, most urgent first. Short and expiring are the only two states this product marks, and only an item tracked with dates can be either of them — an item tracked by count alone carries no date and never appears here.'],
        [(s) => `“${s.rows.find((r) => r.stage === 'Approved').stage}”`, 'The provider’s purchasing rules decided this, not a person: auto-approve under the threshold, a manager approves, or a flag-mode exception. Where the rule decided, the rule is recorded in place of an approver, so the queue never shows a decision nobody made. Three of the eight purchasing rules run today. The receipt requirement, the trip cap, the substitution mode and price-at-pickup are not applied yet.'],
        [(s) => `“${s.rows.find((r) => r.store.startsWith('Costco')).store}”`, 'The price ledger. Every purchase records a price for that item at that shop on that date, prices accumulate and are never overwritten, and an item with no history shows no price rather than a guess — the total then says it is incomplete. The three store columns a new tenant starts with are modelled from a base price rather than observed, and the screen does not yet say so.'],
        [(s) => `the ${s.side.t} panel`, 'Sorted most urgent first, with the value at risk totalled at the foot in money. Three actions, each one step from the list: use it, replace it — which files a request carrying the expiry origin — or discard it, which writes a waste movement with a note. The daily notice is one message with a count, never one per item, because a fridge clear-out produces a dozen at once.'],
      ],
      side: {
        label: 'Bulk approval, and where it stops',
        text: 'Several requests may be approved at once only where each one is under the automatic threshold — where the provider has already decided that requests of this size need no individual judgement. Anything above it is decided one at a time. Counting, closing a run and recording a cook session are never bulk actions, because each one writes to the ledger and each is an individual observation.',
      },
      caption: 'It should feel like what to buy, and nothing else. Amber is the whole product in one colour — what is short, or expiring.',
      strip: {
        label: 'Six front doors, one contract',
        cells: ['The shelf', 'The scanner', 'Today', 'A workbook import', 'The catalogue', 'The system'],
        foot: 'All six write the same buy request under the same purchasing rules, and there is no privileged door. The last of them — a menu, an expiry, a par or a reserve — is the door that produces four of the five origins.',
      },
    },
    {
      key: 'loop', kind: 'loop', id: 'loop',
      heading: 'The loop closes by itself.',
      sub: 'Six stations drawn, and the count is both the first and the last: count, queue, approve, shop, receipt, stock, cook, and count again. The house’s own data moves around them without anyone re-typing it.',
      device: 'arc',
      nodes: [
        { label: 'The count', note: 'A physical walk, one zone at a time in the house’s own walk order, each item showing its previous count and a keypad. Pausable and resumable without losing entries; items not reached are left unchanged rather than zeroed. The walk-through is the audit.' },
        { label: 'The menu', note: 'Residents’ tags shape it: diet tags, allergens, one texture level, Fatal Four roles. The tray note is rendered per resident at the moment of viewing, and the menu record itself holds a recipe reference and no resident field of any kind.' },
        { label: 'The shortfall', note: 'What the week is short of files its own buy request, carrying its origin — a menu shortfall, an expiry, a par breach or a reserve gap. Planning offers those shortfalls to the queue; it never adds them silently.', accent: true },
        { label: 'The policy', note: 'Auto-approve under the threshold, a manager approves, or a flag-mode exception. Where the rule decided, the rule is recorded in place of an approver. A change to the rules takes effect on new requests and never retroactively.' },
        { label: 'The shop', note: 'Ordered by that shop’s aisle sequence — never alphabetically, never by category. Where no sequence has been recorded for the shop, the list is grouped by zone as the nearest useful approximation and the screen says so. Every action works with no signal and is recorded exactly once on reconnection.' },
        { label: 'The receipt', note: 'Closing the run is the only moment stock rises from a shop, and it writes atomically: one purchase movement per taken item, a dated unit for everything tracked with dates, a price for each item at that shop on that date, and the run’s total. Anything unticked returns to the queue as still needed, with its origin intact.' },
      ],
      machines: [
        ['Expiry', 'a perishable is dated at entry → Expiry Watch sorts by urgency and totals the value at risk in money → use it, replace it with a request carrying the expiry origin, or discard it as waste with a note.'],
        ['Reserve', 'the provider sets a number of days → the target is that number of days, times the licensed bed count, times the quantity per bed per day for that item → an item flagged as a reserve item with no quantity recorded is excluded and named on the screen rather than counted as zero → the gap files into the queue → bought → the next count reads it back.'],
        ['Cook', 'today’s prep in the house’s own time zone → Cook this → the allergen check, which names the resident’s initials and the ingredient and warns rather than prevents → complete → stock down exactly once, however many times completion is attempted.'],
        ['Shared run', 'the approved queue → a token link → someone with no account ticks, marks unavailable and closes → a signed-in person reviews and confirms, and the ledger is written on that confirmation rather than on the shopper’s action, because an account-less person cannot be held accountable for a financial record and the product does not pretend otherwise. Until then the run stays open and says who it is waiting on.'],
      ],
      pull: 'A feature that does not participate in the loop must justify itself against it.',
      closing: 'Every change to on-hand is a recorded, immutable movement carrying the item, the house, the delta, a reason from a fixed set, the actor, the time, and a key that ensures it is recorded exactly once. On-hand is never typed, and a correction is a further movement rather than an edit. Par stays direct because a par is a target and not a fact. And the three axes are never conflated — category is the catalogue facet, aisle is the route through a store, zone is where it sits in the house.',
    },
    {
      key: 'depth', kind: 'table', id: 'compliance',
      heading: 'The rule that says what the house must keep.',
      sub: 'The reserve target is computed from the bed count. Ten Oregon citations are explained in the product today. A banner stays on the plan until a provider on that track has reviewed the rule set.',
      cols: ['Topic', 'What is shown, and where', 'Today'],
      mono: [2],
      rows: [
        ['Emergency reserves', 'The target is the reserve period in days, times the licensed bed count, times the quantity per bed per day for that item — then the on-hand reading and the gap, on the dashboard and on the surveyor PDF. An item flagged as a reserve item with no quantity recorded is excluded from the arithmetic and named on the screen rather than counted as zero.', 'in the product'],
        ['The rule citations', 'Ten Oregon citations are explained inside the product today — 411-050-0715(5), (8)(j), (9)(c), (10)(d) and (10)(f); 411-050-0720(12) and (15); 411-050-0725; 411-050-0730(8); and 309-040-0385. Every other catalogue row carries the bare rule text and no explanation at all.', 'in the product'],
        ['The confidence on a citation', 'A citation appears only with its confidence: those ten seed confirmed, every other row seeds inferred, and a rule set no provider has reviewed carries a banner on the dashboard and on every export, including the one you hand a surveyor. Until a provider inspected on that track has reviewed a set, every tenant on that track sees the banner.', 'coming'],
        ['Fatal Four', 'Eight closed tags, on items today; on residents the tags are carried — aspiration risk and its mitigator, constipation risk and its mitigator, dehydration risk and its rescue, the seizure mitigator, the med-pass vehicle — and a coverage reading per house. Never a clinical claim about a person.', 'on items today'],
        ['Diet, texture, allergens', 'The resident’s tags on the menu, the tray note rendered per resident, and the allergen check on cook. Eighteen diet tags, IDDSI-0 through IDDSI-7 among them. A match is exact rather than textual because both sides draw on one closed vocabulary.', 'in the product'],
        ['Food safety', 'Expiry dates and Expiry Watch, on every item tracked with dates; an item tracked by count alone carries no date and no expiry surfacing.', 'dates today'],
      ],
      pull: 'The reserve target is arithmetic, not a shrug.',
      closing: 'CareShop reads a house against its own counts. It never ranks one house against another, and it never says a house is compliant. Ten citations are explained in one line each; every other catalogue row carries the bare rule text. A rule set no provider has reviewed carries a banner on the dashboard and on every export.',
    },
    {
      key: 'boundary', kind: 'boundary', id: 'boundary',
      heading: 'What CareShop does, and what it will not do.',
      cols: [
        {
          label: 'Next door', kind: 'next', items: [
            ['Store diagnoses, medications, incidents or clinical notes', 'cohort'],
            ['Schedule anyone', 'aidepost'],
            ['Print the tab where a reserve record goes', 'binderkit'],
          ],
        },
        {
          label: 'Never', kind: 'never', items: [
            ['Store a tray note. It is rendered per resident at the moment of viewing and written to no menu, no list, no print, no snapshot and no export.', null],
            ['Type stock on hand. On-hand is derived from movements, there is no mutation that sets it, and a correction is a further movement with its own reason.', null],
            ['Prevent a menu because of an allergen. It warns, naming the resident’s initials and the ingredient — preventing it would teach people to work around the product.', null],
            ['Derive the licensed bed count from the resident list. It is the only regulated number in the product, and a regulated number is typed by a person.', null],
            ['Delete a movement. It is the record.', null],
            ['Rank one house against another. A count is not a grade.', null],
            ['Certify compliance. No screen carries a readiness figure, a score, or a grade of a house against anything but its own counts.', null],
            ['Set a deadline. Nothing in the product expires unrecoverably, nothing must be done by a time, and no countdown exists anywhere in it.', null],
          ],
        },
      ],
      strip: {
        label: 'The boundary test, as it ships in Settings',
        cells: ['Does this belong to the household?', 'A resident’s care', 'The roster', 'The binder'],
        foot: 'If it belongs to a resident’s care, the roster, or the binder, it is another product’s. Two wordings of that line ship today and one of them has to be retired: the difference is whether CareShop runs the kitchen and the household, or the household.',
      },
      pull: 'It reads a house against its own counts. It never ranks one house against another, and it never says a house is compliant.',
    },
    {
      key: 'evidence', kind: 'evidence', id: 'record',
      heading: 'A resident is a label, never a name.',
      sub: 'One table in CareShop holds protected information, and these are the rules that keep it there.',
      blocks: [
        { label: 'The resident record', quote: 'Room 2 · A', text: 'A display name or initials, the house, diet tags, one texture level, allergens drawn from the same closed vocabulary the catalogue uses, and preferences. Nothing else: no diagnosis, no medication, no incident, no clinical note, and no free-text field about the person. The schema says outright that it never holds a full name. Any proposal to add a field is a boundary change rather than a feature request.' },
        { label: 'Why initials are not a defence', text: 'Initials are a display convention, not a de-identification method. In a house with five residents, “M.C. — pureed, no nuts” identifies one person to anyone who knows the house. They are a matter of ordinary decency, and the product’s obligations are unchanged by them.' },
        { label: 'The label validator', text: 'A resident label that reads as a person’s name is refused, and so is an import with a clinical-notes column. Protected information is purged, not hidden.' },
        { label: 'Classification', text: 'One table holds protected information — residents — and the audit log with it, because its snapshots can contain resident rows. Memberships hold personal information. Everything else is public. Every change to a resident is recorded, and so is every reading: printing a diet card counts as a reading.' },
        { label: 'The customer agreement', text: 'CareShop holds residents’ diet tags, texture and allergens — enough for a tray note and a menu check. A customer business associate agreement belongs with that, and it is not in place yet. We are telling you because you would find out.' },
        { label: 'What leaves the house', wide: true, text: 'Eighteen shared templates and four of CareShop’s own, each carrying a house short code, a count, a date, an amount, the person’s own name and a link. There is no free-text body parameter anywhere in the system: the send function accepts a template key and typed parameters, and nothing else. A push carries the same, and the inbox renders from the record at read time, so no notification row stores free text. Expiry notices are batched into one message with a count, never one per item, because a fridge clear-out produces a dozen at once. Two of the twenty-two templates send today.' },
        { label: 'The house short code', text: 'A house is named in an email or a push by its generated short code — WH-1 — and by nothing else. The code is immutable, and it is checked so that no code equals or contains any resident’s display name or initials anywhere in the organisation.' },
        { label: 'The shared run', text: 'A token addresses a snapshot of one run’s items and quantities. It grants ticking, marking unavailable and closing, and grants no session and no route into anything else; it is revocable at any moment and it expires. The snapshot is produced by a source that cannot read the resident table, so it cannot carry a tray note even by error. The email that carries the link carries the link, the house short code and a count of items, and never an item name: an item name in an email is how “pureed chicken” reaches an inbox.' },
        { label: 'Tray notes', text: 'Rendered at the moment of viewing, never stored. A menu record holds a recipe reference and no resident field at all, which is why an archived resident stops appearing on tray notes while historical menus are unaffected: they never contained resident information in the first place.' },
      ],
      closingBlocks: [
        { heading: 'Out of range is accepted, and marked', text: 'A count far above or below the previous one is accepted and marked rather than refused, because a delivery or a spoilage event is exactly when the number moves. An expiry date in the past is accepted, because a caregiver counting the pantry has found something expired and needs to record it. A price materially above the recent average for that item at that shop is marked, not refused. The moment a number moves is the moment something happened.' },
        { heading: 'Two people, one shelf', text: 'When two people count the same item, the later count stands and both movements exist with their times, so a disagreement is visible rather than hidden. When a manager approves while a caregiver is editing, the approval takes the request as it stood and the edit is refused with the current state shown. When two people merge overlapping catalogue items, the first merge stands and the second is shown the result.' },
      ],
    },
    {
      key: 'roles', kind: 'roles', id: 'roles',
      heading: 'Six people, and one of them has no account.',
      sub: 'The person doing the shopping is often not the person with the licence. That is the whole reason for the last two rows.',
      cols: ['Role', 'Who', 'In CareShop, they', 'Device'],
      rows: [
        ['provider', 'The licence holder; an agency’s Executive Director', 'Set purchasing policy, approve, see spend across houses, manage the catalogue, review the rule set, manage billing', 'Phone + laptop'],
        ['manager', 'Resident manager; program manager — scoped to named houses in the specification, organisation-wide in the live product', 'Plan the week’s menu, approve requests, attest to counts, run the wizard', 'Phone'],
        ['caregiver', 'Direct care staff', 'Count, scan, file a buy request, cook from Today, shop from the list, read tray notes', 'Phone, at the shelf and in the store'],
        ['buyer (a flag)', 'Whoever shops', 'Shopping mode and the receipt. Reading the till roll on the device is not in the product yet', 'Phone, in the store'],
        ['no account', 'A spouse doing the Costco run', 'Open a shared run, tick, mark unavailable and close it — and a signed-in person confirms before anything reaches the ledger', 'Phone, on the web', 'wash'],
        ['operator', 'The platform team', 'The console: provision, suspend, impersonate with a reason, repair accounts', 'Web'],
      ],
    },
    {
      key: 'objections', kind: 'qa', id: 'questions',
      heading: 'The questions we get.',
      rows: [
        ['Isn’t this just a grocery list?', 'A grocery list does not know that Room 2 · A is tree-nut allergic, that the water reserve is short against a licensed bed count, or what the applesauce cost at Fred Meyer last month. The loop is the product; the list is one station on it.'],
        ['Who checks your rules?', 'A provider inspected on that track. Ten Oregon citations are explained in one line each today; every other catalogue row carries the bare rule text, unexplained — and a banner says exactly that until a provider on that track has reviewed the set. You always know which of the two you are reading. We would rather tell you than show you a tidy screen.'],
        ['My caregiver’s phone has no signal in the store.', 'Picks wait on the phone. When the signal comes back they land once, and a pick is never counted twice.'],
        ['Can I use it across more than one house?', 'Yes. Scale is thirty-seven dollars a month, for unlimited houses and seats and the multi-house views. It does not give you your own branding: branding is frozen, and if it comes back it will be a decision taken then rather than something inherited.'],
      ],
    },
    {
      key: 'start', kind: 'start', id: 'start',
      heading: 'The first ten minutes.',
      sub: 'If the loop closes once, you trust it.',
      steps: ['Add a zone and scan five items from the pantry.', 'Set a par on one, and watch it become a buy request.', 'Add a resident with a tree-nut allergy, and see the menu warn.', 'Open Today and see what the house needs — restock, expiry, dinner.'],
    },
    {
      key: 'pricing', kind: 'tiers', id: 'pricing',
      heading: 'Nineteen dollars a house.',
      sub: EVERY_PLAN,
      main: 1,
      note: 'Sold on the web through Stripe Checkout; the app never presents a purchase sheet. Free, Pro at nineteen a house, Scale at thirty-seven. Start on Free — one house, three people, five hundred items, and no card.',
    },
    {
      key: 'ladder', kind: 'map', id: 'ladder',
      heading: 'When the kitchen becomes the whole house.',
      sub: 'Export → import, one login.',
      rows: [
        ['Items, the stock ledger, pars, expiries, zones', 'M14 Inventory & Supplies tracking'],
        ['Buy requests, trips, receipts, policies, stores, prices', 'M14 ordering and vendor'],
        ['Meals, menus, cook sessions', 'M14 — a gap Provider Hub Oregon absorbs'],
        ['Minimal residents', 'M02 medical'],
        ['Rule sets, attestations, snapshots', 'M15 Quality Assurance and M06 Digital Binder'],
      ],
      footer: 'Lands on Professional, when purchasing is integrated with billing, vendor management arrives, or you want the full compliance programme — a trigger we assume rather than one we have watched happen.',
    },
    { key: 'family', kind: 'band', id: 'family', heading: 'One house. Four rooms. One ladder.', byline: 'by Provider Hub Oregon' },
    {
      key: 'foot', kind: 'foot', id: 'foot',
      by: 'by Provider Hub Oregon',
      disclaimer: 'Screens on this page use sample data.',
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
        ['Inward first, outward second', 'A shift is offered to the people who already work in the house — the default selection is everyone eligible and not already assigned at that time — and the first acceptance claims it. Posting outward is a manager’s action on an open shift, never a timer.'],
        ['Surfaced, never enforced', 'A missing or expired credential, an age constraint, an overlapping assignment or unfinished onboarding is named beside the person while you are choosing. No marker removes her from the list. No marker requires an override. The assignment proceeds on a single action.'],
        ['A shift describes the work', 'The shift record carries house, date, start, end, role, credentials required, awake-overnight, ratio and rate — and no field capable of describing a person receiving care. Shifts are never public; a job posting is, and only once you have published it.'],
      ],
    },
    {
      key: 'screen', kind: 'screen', id: 'board',
      heading: 'One screen: covered, or not.',
      sub: 'This week and next, for your houses, one row per shift, soonest first — covered, with the person’s name, or open. Above one house they are grouped by house. That is the whole emotion.',
      instrument: { desktop: 'web', mobile: 'ios' },
      callouts: [
        [(s) => `a covered cell reading “${s.week.rows[0][1][0]}”`, 'Covered means a name. There is nothing else on the cell to read, and nothing on the row capable of describing a person receiving care.'],
        ['the open cell', 'Open. One word, one consistent treatment, and the only state the board carries. A shift still open within twenty-four hours of its start tells the manager and the provider, and is distinguished here and on the cross-house overview.'],
        [(s) => `the detail card “${s.shift.when} · ${s.shift.work}”`, 'A shift carries house, date, start, end, role, credentials required, awake-overnight, the ratio, an optional rate and a status. It has no field capable of describing a person receiving care, and none may be added.'],
        [(s) => `“${s.shift.actions[0]}”, then “${s.shift.actions[1]}”`, 'Inward first, always. Posting outward is your action on an open shift and never a timer — nothing in Aidepost offers a shift to anyone without a manager deciding to.'],
        ['the eligibility list', 'Every staff member of that house, each carrying any marker that applies. No marker removes a person from the list. No marker requires an override. The assignment proceeds on a single action.'],
      ],
      side: {
        label: 'Credentials, before they bite',
        text: 'The holder is alerted at thirty days, at seven, and on the day. You receive a count for your houses and never a person’s name in the message. A next-screening date alerts separately and fourteen days earlier, because obtaining a screening takes longer than renewing a certificate.',
      },
      caption: 'On a caregiver’s phone the same work is a feed: postings — and, where she has opted in, posted relief shifts — soonest first, then nearest, each with the work, the schedule in words, the rate, the credentials required and the distance. Never a resident, never another caregiver, and never a house’s address before a relationship exists.',
      figure: {
        heading: 'What a marker is, and is not',
        rejected: 'Blocked — CPR expired',
        kept: 'CPR expired. Assign anyway.',
        caption: 'Four markers may appear beside a name at the moment of choosing: a required credential missing or expired, named; an age constraint, derived from the chapter rather than read in the primary source, where the shift would leave a caregiver under twenty-one as the only staff for more than two hours in twelve; an overlapping assignment; and outstanding onboarding. Not one of them removes her from the list, and not one requires an override.',
      },
    },
    {
      key: 'loop', kind: 'loop', id: 'flow',
      heading: 'Inward first. Outward second.',
      sub: 'The order is the product, and every step of it is somebody’s deliberate action. A shift goes to the people who already work in the house before it goes anywhere near the outside, because they know the house.',
      device: 'week',
      nodes: [
        { label: 'a pattern', note: 'Day, Evening, Night or a name you type — with the times, whether it is awake overnight, the role, the credentials, the ratio and the days. Changing it affects future generation only.' },
        { label: 'open', accent: true, note: 'Still open within twenty-four hours of its start, and the manager and the provider are both told.', states: [['open', 'Open'], ['covered', 'Covered']] },
        { label: 'offered inward', note: 'The default selection is everyone eligible and not already assigned at that time. The offer states the work, the house identifier, the time and the rate.' },
        { label: 'claimed', note: 'The first acceptance claims it; the others are told immediately and it disappears from their list.' },
        { label: 'posted outward', note: 'With the marketplace · your action, never a timer. Visible only to signed-in relief workers whose area covers the house — never public.' },
        { label: 'claimed by relief', note: 'The relief pool ships last: a two-sided market with one side empty is worse than no marketplace at all.' },
        { label: 'confirmed', note: 'You decide who enters your house.' },
        { label: 'worked', note: 'Clock in and out. The events queue without connectivity and are submitted exactly once on reconnection.' },
        { label: 'timesheet', note: 'A week per person — hours by day, a total, and an indication at forty hours. Approved one person at a time; bulk approval is forbidden.' },
      ],
      quote: { at: 1, text: 'It shows what is not covered.' },
      gates: [
        'A relief worker cannot clock in until you have confirmed her.',
        'An unpaid posting stays a draft.',
      ],
      gateNote: 'Two gates, and both are about who may act rather than about whether a rule was followed. Nothing else in this product stops anyone: where it knows a fact bearing on whether a person should work a shift, it marks it at the point of assignment and never removes her from the list or prevents the assignment.',
      pull: 'Surface, never police — show what a rule says where it is relevant, and never block a shift, a hire or a clock-in. You are responsible; the system makes the facts visible.',
      closing: 'One thing survives a failed payment. Rosters cannot be built, shifts cannot be assigned, postings cannot be published and applications cannot be advanced — and your workers can still clock in and out, because hours worked are a legal record that must not be lost over a billing failure. The notice says so.',
      machines: [
        ['Credential → expiring → expired', 'recorded with its dates and marked self-attested, because that is what it is → a thirty-day notice → a seven-day notice → a notice on the day → expired, named on the roster and on the eligibility list, and the shift can still be assigned → renewed as a new record superseding the prior one, which stays with its dates. Credential history is never collapsed. An expiry before its issue date is refused; an expiry in the past is accepted, because that is a true and useful fact.'],
        ['Application → hire', 'a post is drafted, invisible to everyone outside your organisation → the per-post charge is paid, because an unpaid posting stays a draft → published, and reachable without an account → an application arrives carrying her profile, her recorded credentials as self-attested and her answers, one per person per posting → screened → offered → accepted → a staff record is created and the invitation attaches the account she already has → the onboarding checklist opens for that house’s track. Applications are never ranked or scored, and hiring is never a bulk action.'],
        ['Clock-in → timesheet', 'clock in at the house, offline if she must, on an idempotency key of user, shift, action and client timestamp → clock out, or the entry is marked incomplete two hours after the shift ends and you both see it → hours by day → a week → an indication at forty hours, and none daily → approve one person at a time, which locks the week → export CSV. A clock event is never edited or deleted; a correction is a new record referencing the original, and both remain visible.'],
        ['Policy acknowledgment', 'Binderkit produces the policy text and Aidepost never authors, edits or templates it → you register which version is current → each person signs by typing her name and confirming, and the signature records who, when, which version and the IP → a new version resets the outstanding signatures and keeps the ones made against prior versions, so it stays provable who agreed to what and when.'],
      ],
    },
    {
      key: 'depth', kind: 'table', id: 'rules',
      heading: 'What the rule says, shown — and never enforced.',
      sub: 'Where Aidepost knows a fact bearing on whether a person should work a shift, it marks it at the point of assignment. It never removes her from the list and it never prevents the assignment. The last column is how sure we are of the rule itself.',
      cols: ['Rule', 'What Aidepost shows', 'Where', 'How sure'],
      mono: [2],
      rows: [
        ['Under 21, only staff for more than 2 hours in 12', 'A marker beside her name at the moment of choosing — one of 4, with a missing or expired credential, an overlapping assignment, and outstanding onboarding', 'The eligibility list', 'Derived — APD and DD; open on OHA'],
        ['Dementia training before direct care — ORS 443.743', 'A default onboarding item on the adult-foster-home tracks, satisfied by a credential of that type', 'Onboarding', 'Derived'],
        ['Background check — OAR 407-007', 'A status you type — not started, submitted, cleared, not cleared, expired — with a date. Never a result, and never the content', 'Credentials', 'Derived'],
        ['Weekly overtime — ORS 653.261', 'An indication at 40 hours in the week. There is no daily indication, because showing one would mislead you into a calculation you do not owe', 'Timesheets', 'Derived'],
        ['Exclusion screening', 'A next-screening date, alerting 14 days out — periodic, not only at hire', 'Credentials', 'No citation we have read'],
        ['Competency-Based Training Plan — OAR 411-325-0025', 'Each plan item as an ordinary credential type, on the agency track', 'Credentials', 'Verified 2026-09-04'],
        ['Relief care; substitute caregiver — OAR 411-360', 'The vocabulary the marketplace uses, and the substitute-caregiver title on the three adult-foster-home tracks', 'Everywhere', 'Verified 2026-09-04'],
      ],
      pull: 'Thirty days, seven days, then the day itself — the holder by name to herself, you by count. The decision stays yours.',
      closing: 'Two of these seven we have read in the primary source ourselves. The rest are derived from the chapter, and one has no citation we have found at all. Every derived row is closed by reading the primary source and confirmed by a provider surveyed on that track before it is shown to a paying customer on that track. Until then the column says so, which is the point of the column.',
    },
    {
      key: 'boundary', kind: 'boundary', id: 'boundary',
      heading: 'What Aidepost refuses to do, and who does it instead.',
      sub: 'Aidepost holds no thin copy of another product’s feature. Every one of its features lives here at full depth. So this section is short on hand-offs and long on refusals.',
      cols: [
        {
          label: 'Next door', kind: 'next', items: [
            ['Hold resident care, the MAR or incidents', 'cohort', null],
            ['Write the house rules', 'binderkit', 'Binderkit produces the policy text; Aidepost registers the version and records the signature'],
          ],
        },
        {
          label: 'You do', kind: 'provider', items: [
            ['Run the check. Aidepost holds a status you type — not started, submitted, cleared, not cleared, expired — with a date, and never the content or the result.', null],
            ['Decide. Every marker is shown at the moment of choosing, and none of them blocks the assignment, the hire or the clock-in.', null],
            ['Pay. Hours leave as CSV — person, employee reference, house, date, hours, overtime hours, shift type and the rate where one was recorded — and no calculated pay, no tax identifier and no deduction. Exporting is recorded.', null],
          ],
        },
        {
          label: 'Never', kind: 'never', items: [
            ['Run or receive a background check. That is Fair Credit Reporting Act territory, and it changes the legal character of the business.', null],
            ['Verify a credential with its issuer. Every record is marked self-attested, because that is what it is; a manager who has looked at the card records seen by, on a date — never verified, and the distinction is explicit on the screen and in the export.', null],
            ['Share attendance facts between employers. You see only what your own organisation recorded. Changing that is a legal decision about what kind of business this is, not a product decision.', null],
            ['Rate a person. Attendance is exactly one of showed, did not show, or late with a number of minutes — no rating, no comment, no free text. There is no field anywhere in the schema for an opinion about a person.', null],
            ['Describe a resident in a posting. A description matching the patterns raises a warning that explains why; you may proceed, and the warning and your decision are both recorded, because a false positive must not stop a home hiring.', null],
            ['Add a field to a shift or a posting that could reference a person receiving care. The schema check asserts that no such field exists, and a code review that finds one is a blocker, not a finding.', null],
          ],
        },
      ],
      strip: {
        kind: 'phrase', label: 'Does not',
        cells: ['keep residents’ records', 'run the kitchen', 'build binders', 'process payroll', 'run background checks'],
      },
      pull: 'That sentence is the product. It ships on the About page, in these words: “Aidepost is the workforce record. It does not keep residents’ records, run the kitchen, build binders, process payroll, or run background checks.”',
    },
    {
      key: 'evidence', kind: 'evidence', id: 'record',
      heading: 'A shift describes the work, never the person.',
      sub: 'What the product holds, what it is allowed to say, what it does when something goes wrong — and the one thing about it we have not decided.',
      blocks: [
        { label: 'Classification', text: 'Nineteen Aidepost tables — one holds protected information, twelve hold personal information, six are public — over eighteen platform tables. The protected one is assignments, and only because a one-to-one assignment may optionally record the initials of the person supported, typed by you. Aidepost holds no resident record and never will. Leave the field empty and the assignment is still valid.' },
        { label: 'Where those initials may appear', text: 'Nowhere before the assignment exists. Never in a notification, an export of shifts, a posting, or anything visible before assignment. Every read of an assignment writes a view row, and our own support console never queries that table at all.' },
        { label: 'An open question we have not closed', wide: true, text: 'Whether that field should exist at all is still open, and it is the largest open thing in the product: removing it removes all protected information, the customer agreement, the view logging on assignments and one launch blocker — and if it goes, the data is purged rather than hidden. A second question sits on the same field. One reading says the table is protected by classification even when the field is blank; the other says an employer who leaves it empty means the system holds no protected information at all. That decides whether the agreement applies to a customer who never uses the field. We have not decided it, and this page will not imply that we have.' },
        { label: 'What an email says', quote: 'WH-1: 2 shifts open within 24 hours.', text: 'That is the whole rendering of the uncovered-shift event, and it is one of sixteen messages that may be sent at all. The send function takes an event key and references; there is no body parameter, so there is nothing to write free text into.' },
        { label: 'What a push says', quote: 'Your CPR expires in 7 days.', text: 'A credential name may appear to its own holder, and nowhere else; your version of the same event carries a count. Where a message names a time it renders as a day and a shift name — “Sat night” — never a date and time, because a precise time identifies a person’s routine to anyone holding the phone.' },
        { label: 'What is public', text: 'One thing: a live job posting, reachable without an account, at an opaque address that carries no organisation, house or sequence — so nobody can enumerate the listings or work out how many customers we have. That endpoint reads the posts table only, filtered to live, and cannot read any table holding personal or protected information. Applying requires an account. Relief shifts never appear there, and a shift is never public at all.' },
        { label: 'Analytics', text: 'Open shifts filled within twenty-four hours, by house. Nothing we measure is ever shown to a caregiver as a score about herself. That is a constraint on the product, not a note about reporting.' },
        { label: 'Attendance', text: 'When the relief pool ships, a manager records exactly one of: showed, did not show, or late with a number of minutes. No rating, no comment, no free text. The worker sees her own facts and can correct everything recorded about her, and they are never shown to another employer.' },
        { label: 'If a payment fails', text: 'Full access first, and the notice goes to you alone — your workers see nothing. Then read-only: read every record, export hours, and your staff can still clock in and out, because hours worked are a legal record that must not be lost over a billing failure. The notice says so. Paying restores everything immediately.' },
        { label: 'If the phone has no signal', text: 'Clocking in and out is the only thing that queues. Events queue without connectivity and are submitted exactly once on reconnection. Assignments, confirmations, approvals, publishing a post and hiring are never queued — each of those is a decision, and a decision should not arrive late.' },
        { label: 'The law that applies to your staff', text: 'Caregiver data is governed by state privacy and employment law, not by the federal health rule. The customer agreement we ask you to accept is drafted for products capable of holding protected information — which, for Aidepost, turns entirely on the one optional field above.' },
      ],
      closingBlocks: [
        { heading: 'What is here, and what is coming', text: 'The first release is the house toolkit: staff, credentials, the roster and the open-shift board, filling from your own staff, onboarding, clocking and the timesheet export, and the caregiver side free. Public job posts, applications and hiring, and policy signatures come with the marketplace. Cross-employer relief work — posting outward, claiming, confirming, attendance facts — ships last, because a two-sided market with one side empty is worse than no marketplace at all. Nothing on this page is a screenshot of software you can buy today.' },
        { heading: 'Two audiences, one design', text: 'The employer’s side is dense and administrative; the caregiver’s side is sparse and single-column, for a phone held in one hand on a bus. They share every component; they differ in density and in the first screen. You are asked which side you are on once, in plain language, and never again.' },
      ],
    },
    {
      key: 'caregiver', kind: 'caregiver', id: 'caregivers',
      heading: 'Shifts near you, tonight.',
      sub: 'Free. No organisation. No card.',
      lines: [
        'Create a profile. Add a CPR card photo and its date.',
        'See open shifts near you, soonest first and then nearest, with the work described — and never the person.',
        'Keep your own credential dates in one place, and carry them from one employer to the next.',
        'Claim an open shift at a house you already work at.',
        'Clock in, clock out, and see your own weekly total.',
        'Apply to a job post with a caregiver account — that arrives with the marketplace, in the second release.',
        'Opt in to relief work across providers, by radius and by availability. It is off unless you turn it on, turning it on says plainly that a shift starting soon may reach you during quiet hours, and cross-employer relief ships last of all.',
      ],
      promise: 'You are not the product. Aidepost never runs a background check on you, never rates your character, and, when relief work ships, will record attendance as facts only — showed, did not show, or late with a number of minutes. What a listing says about the work is public; what it says about you is not.',
      ctas: [['Join as a caregiver', '#join'], ['How credentials work', '#rules']],
      fine: 'Caregivers pay nothing, ever. Browsing a public post needs no account; everything else does. Providers buy Aidepost.',
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
        ['Her own profile, area, availability and credentials', 'all five roles, the manager and the provider included. Everyone keeps her own.'],
        ['Browsing public posts', 'all five roles. Applying to one is the applicant, the relief worker and the caregiver.'],
        ['Credentials belonging to someone else', 'a manager views and adds dates; the provider edits.'],
        ['Roster and the open-shift board', 'a caregiver views; a manager builds, offers and posts outward.'],
        ['Job posts', 'a manager drafts; the provider publishes, and pays.'],
        ['The one-to-one field on an assignment', 'a manager or the provider sets it; a relief worker sees her own assignments.'],
        ['Relief opt-in', 'a relief worker and a caregiver. Not a manager, and not the provider.'],
        ['Policy signatures', 'everyone employed signs; a manager registers which version is current.'],
        ['Timesheets', 'everyone employed sees her own, a manager included; a manager and the provider approve; exporting is the provider’s alone, and it is recorded.'],
        ['Audit snapshots, the houses roll-up, and billing', 'provider only.'],
      ],
      closing: 'Read that beside the other three dimensions, because a role alone does not decide anything here: which side you are on, which houses you are scoped to, and whether the subscription is paid. A refused action names the dimension that refused it.',
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
        { label: 'Caregiver', wash: true, steps: ['Create a profile.', 'Add a CPR card photo and its date.', 'See three open shifts within twenty-five miles.'], foot: 'No organisation. No card. Nothing to cancel.' },
      ],
      signupHeading: 'Signing up, in six steps — the provider side',
    },
    { key: 'join', kind: 'join', id: 'join' },
    {
      key: 'pricing', kind: 'tiers', id: 'pricing',
      heading: 'Providers pay. Caregivers never do.',
      sub: EVERY_PLAN,
      main: 1,
      note: 'A subscription — up to three houses on Pro, unlimited on Scale — plus one charge for each job post. Amounts are set at launch. Sold on the web through Stripe Checkout; the native application never presents a purchase sheet.',
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
      disclaimer: 'Screens on this page use sample data.',
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

export const PAGES = { cohort, careshop, binderkit, aidepost };

/* The sibling cards under the family band: the parent first, then the three
   siblings. Computed from brand.js so a name or a descriptor cannot drift. */
export const siblingsFor = (id) => [PRODUCTS[0], ...MINIS.filter((m) => m.id !== id)];

export default PAGES;
