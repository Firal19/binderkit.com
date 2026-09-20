// The facts the Cohort site is laid out on. Every string here is either the
// vault's (src/data/page.js, brand.js) or the founder's shift narrative that
// the first page was written on; nothing is invented, and the clock is the
// metaphor that holds it together.

import { PAGES } from '../../../data/page.js';

export const spec = PAGES.cohort;
export const find = (k) => spec.sections.find((s) => s.key === k);

export const APP = 'https://app.cohorthome.app';

/* the day, hour by hour — the spine of the front page */
export const DAY = [
  { at: '06:55', t: 'Sign in with a staff code', d: 'On the house phone, or switch the acting person on a device already signed in. A code alone never opens a device with no valid session.', screen: 'today', icon: 'clock' },
  { at: '07:02', t: 'Read the handoff', d: 'What the night shift left — MAR status per resident, documentation done, incidents, open issues. Reading it records a receipt. Acknowledgement is never assumed.', screen: 'handoff', icon: 'handoff' },
  { at: '08:00', t: 'The MAR pass', d: 'Scheduled → Six Rights → allergy check → PRN interval → signed. The only two things in the product that can stop you are in this step, and both are physical.', screen: 'marpass', present: 'sheet', icon: 'pill', widget: 'sim' },
  { at: '10:30', t: 'Documentation, per resident', d: 'Entries are stamped “Logged by · at”. If the wifi drops, they queue, are marked pending, and catch up. The caregiver does not wait for the record.', screen: 'residents', icon: 'note', widget: 'air' },
  { at: '13:40', t: 'An incident', d: 'Filed from where she is, with the immediate action taken. Managers are notified with a house code and nothing else. The external report is hers to make, outside the system.', screen: 'incident', icon: 'flag' },
  { at: '18:45', t: 'Start handover', d: 'The sheet composes itself from the day. A controlled-substance count is prompted. She writes one passage for the next shift and posts.', screen: 'handoff', present: 'compose', icon: 'count', widget: 'compose' },
  { at: '19:00', t: 'Sign out', d: 'Or the next caregiver switches in with her own code. Every record from the shift remains, attributed to the person who made it, for ever.', screen: 'today', icon: 'stamp' },
];
export const hid = (at) => at.replace(':', '');
export const tourKey = (d) => `${d.screen}${d.present ? `+${d.present}` : ''}`;

/* the manifesto — FAD §6.3, verbatim reasons */
export const REFUSALS = [
  ['Any compliance score, readiness percentage, or grade', 'It measures the record rather than the care, and it invites managing the number.'],
  ['Countdown timers on regulatory obligations', 'An obligation stated as immediate must not be rendered as a clock.'],
  ['A third blocking check', 'Two exist because physical harm justifies them; a third erodes the principle that the product informs rather than polices.'],
  ['Deleting anything', 'The record’s value is that it cannot be quietly changed.'],
  ['Editing a filed incident narrative', 'Same reason. A correction is an addendum under the original.'],
  ['Sending any resident information outside the system', 'Every message announces existence; content is read after signing in.'],
  ['Notifying a family member or external party', 'The obligation and the judgement belong to the provider.'],
  ['Deriving a regulatory number from operational data', 'Capacity is typed by a human.'],
  ['Inventing a regulatory citation, threshold, or window', 'Where a source is not established, the statement is shown without one.'],
  ['Bulk-recording care', 'Each administration, sign-off, and completion is an individual attestation.'],
  ['Ranking houses or people', 'It turns a record into a performance instrument.'],
];

export const NOT_STORED = ['staff credentials and expiry dates', 'rosters, clock events, timesheets', 'stock, menus, receipts', 'resident funds', 'documents other than plan versions', 'card numbers', 'anything about a family member beyond the contact list'];

export const HOUSE_KEYS = [
  ['By invite', 'New staff are added by an administrator, never by a sign-up page.'],
  ['Logged by · at', 'Every entry carries who made it, and when.'],
  ['Offline-ready', 'Entries made without signal queue, are marked pending, and catch up.'],
];

/* the rail — the stops of the front page, each with the hour it belongs to */
export const STOPS = [
  { id: 'shift', hr: '06:55', label: 'Shift', icon: 'clock' },
  { id: 'stops', hr: '08:00', label: 'Stops', icon: 'gate' },
  { id: 'record', hr: '13:40', label: 'Record', icon: 'record' },
  { id: 'house', hr: '', label: 'House', icon: 'house' },
  { id: 'pricing', hr: '', label: 'Pricing', icon: 'tag' },
  { id: 'join', hr: '', label: 'Join', icon: 'mail' },
];

/* the pages this module exports, in the order the rail shows them */
export const PAGE_LINKS = [
  { path: 'features', label: 'Features', icon: 'note', title: 'Everything Cohort does' },
  { path: 'pricing', label: 'Pricing', icon: 'tag', title: 'One price per house' },
  { path: 'security', label: 'Security', icon: 'shield', title: 'What Cohort holds, and what leaves' },
  { path: 'about', label: 'About', icon: 'house', title: 'Who makes Cohort' },
  { path: 'contact', label: 'Contact', icon: 'mail', title: 'Write to a person' },
];

/* the product's own verbs, for the palette — the app's PALETTE list, plus
   the two the day makes obvious */
export const VERBS = [
  { t: 'Sign a dose', s: '08:00 · The MAR pass', to: '0800', icon: 'pill' },
  { t: 'File an incident', s: '13:40 · An incident', to: '1340', icon: 'flag' },
  { t: 'Start handover', s: '18:45 · The sheet composes itself', to: '1845', icon: 'count' },
  { t: 'Add an addendum', s: 'The record · under the original, never over it', to: 'record', icon: 'addendum' },
  { t: 'Read the handoff', s: '07:02 · Reading it records a receipt', to: '0702', icon: 'handoff' },
  { t: 'Print what it will not do', s: 'Eleven refusals, one page', to: 'refuses', icon: 'print' },
];

/* the contact topics, set for this product */
export const TOPICS = ['Early access', 'The pilot', 'Pricing', 'Security and privacy', 'Press', 'Something else'];

/* what the features page groups — FEATURES_COHORT.md §3, one row per CH-nn */
export const MODULES = [
  ['01', 'Identity and Access', [['CH-17', 'Account and sign-in', 'password, magic link, Google/Apple, TOTP, sessions, reset, staff codes, allow-list', 'v1', 'common', 'PII']]],
  ['02', 'Organisation and Houses', [['CH-01', 'People and access', 'organisation, houses, memberships, invites, short codes, allow-list, licence track', 'v1', 'Pro', 'PII'], ['CH-01.5', 'The Houses roll-up as the provider’s home screen', '', 'v1', 'Scale', 'PUBLIC']]],
  ['03', 'Residents', [['CH-02', 'Resident record', 'directory, profile, allergies, diagnoses, contacts, summary sheet, archive, history', 'v1', 'Pro', 'PHI']]],
  ['04', 'Medication Administration', [['CH-05', 'MAR', 'orders, scheduled doses, Six Rights, outcomes, PRN, controlled/witness, month print, offline', 'v1', 'Pro', 'PHI'], ['CH-05.7', 'The allergy gate — the first hard stop', '', 'v1', 'Pro', 'PHI'], ['CH-05.8', 'The PRN interval gate — the second hard stop', '', 'v1', 'Pro', 'PHI'], ['CH-05.9', 'RN delegation tracking per caregiver per task', '', 'v2', 'Pro', 'PHI']]],
  ['05', 'Care Documentation', [['CH-04', 'Care documentation', 'templates, assignments, entries, lock and addenda, history, legacy retirement', 'v1', 'Pro', 'PHI']]],
  ['06', 'Incidents', [['CH-06', 'Incidents', 'filing, duty line, sign-off, addenda, emergency panel, history', 'v1', 'Pro', 'PHI'], ['CH-06.6', 'Incident PDF export with redaction', '', 'v1', 'Pro', 'PHI']]],
  ['07', 'Daily Operations', [['CH-08', 'Today and the handoff', 'composition, sheet, read receipt, count prompt, print, history', 'v1', 'Pro', 'PHI'], ['CH-07.1', '“Who’s on today” — a read-only presence list', 'thin by design', 'v1', 'Pro', 'PII']]],
  ['08', 'House Tasks', [['CH-09', 'House tasks', 'definitions, completion, work orders, resident-linked, log', 'v1', 'Pro', 'PUBLIC / PHI']]],
  ['09', 'Plans', [['CH-09.1', 'Plans', 'versions, goals, linking, expiry, elopement window', 'v2', 'Pro', 'PHI']]],
  ['10', 'Communication', [['CH-13', 'Communication', 'announcements, care-team thread', 'v1 min', 'Pro', 'PHI'], ['CH-13.3', 'Direct messages, meeting requests, message templates', 'not planned', 'later', 'Pro', 'PHI']]],
  ['11', 'Issues', [['CH-10', 'Issues', 'raise, assign, status', 'v2 min', 'Pro', 'PII / PHI'], ['CH-10.3', 'Dispute-response path', 'a register row only', 'later', '—', '—']]],
  ['12', 'Administration and Reporting', [['CH-11', 'Admin', 'audit view, PHI-view log, exports, roll-ups, billing view', 'v1', 'Pro / Scale', 'PHI'], ['CH-19', 'Export and offboarding', 'the export in v1; the importer later', 'v1', 'common', '—']]],
  ['13', 'Subscription and Billing', [['CH-22', 'Signup, trial, and billing', 'six steps and the billing states', 'v1', 'common', 'PUBLIC'], ['CH-20', 'Customer business associate agreement at signup', 'required before real residents enter', 'v1', '—', '—'], ['CH-18', 'Onboarding checklist', 'five first actions', 'v1', 'common', '—']]],
  ['14', 'Notifications', [['CH-12', 'Notifications', 'inbox, push, email, nine event keys, preferences', 'v1', 'common', 'PUBLIC']]],
  ['15', 'Support', [['CH-16', 'Help and support', 'ticket form, replies', 'v1', 'common', 'PII']]],
  ['16', 'Platform Operations', [['CH-03', 'The operator console', '', 'v1 min', 'common', 'PII']]],
  ['—', 'Cross-cutting', [['CH-21', 'The boundary line', 'one sentence, on the About page', 'v1', 'common', 'PUBLIC'], ['CH-23', 'On iPhone, Android and the web', '', 'v1', 'common', '—']]],
];
export const MOVED = [
  ['CH-07', 'Shift Operations — patterns, schedule, clock-in/out, timesheets', '', 'Cohort runs the shift. It does not schedule staff or track hours.'],
  ['CH-09.2', 'House-rules acknowledgment', '', 'Policy acknowledgment is a workforce act, not a care record.'],
  ['CH-15', 'Credentials — expiry dates, exclusion re-screening', '', 'Who may work, and whether their card is current, is not this product.'],
];
export const REMOVED = [
  ['CH-02.9', 'Resident document presence tracker', '', 'Only plan expiry dates stay, in Plans.'],
  ['CH-14', 'Supplies and Spend — shopping runs, expenses, inventory, menus, dishes', '', 'The kitchen is not this product.'],
  ['CH-14.1', 'Resident fund light note', '', 'Residents’ money is not this product.'],
];
export const NOT_NOW = [
  ['Languages other than English', 'A customer whose staff need another'],
  ['Integration with pharmacy, laboratory, or health record systems', 'Established demand and an agreement covering protected information'],
  ['Voice entry', 'Established demand; accuracy risk in a clinical record'],
  ['Automatic recognition of a medication from a photograph', 'Accuracy risk'],
  ['Offline for administrative screens', 'Only operational recording needs it'],
  ['A public API', 'No established consumer'],
];
export const LARGER = ['authoring care plans, behaviour plans or assessments', 'residents’ funds, ledgers, or any money belonging to a resident', 'billing the state, claims, eligibility', 'external portals for family, guardians, case managers or regulators', 'document storage of any kind beyond plan versions', 'training delivery or course content', 'transportation, vehicles, drivers', 'business reporting, forecasting, occupancy analysis'];
