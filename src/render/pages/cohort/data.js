// The facts the Cohort site is laid out on. Every string here is either the
// vault's (src/data/page.js, brand.js) or the founder's shift narrative that
// the first page was written on; nothing is invented, and the clock is the
// metaphor that holds it together. Rewritten 2026-09-23: shorter, plainer,
// no build status, no sample-data confession, no sibling product.

import { PAGES } from '../../../data/page.js';

export const spec = PAGES.cohort;
export const find = (k) => spec.sections.find((s) => s.key === k);

export const APP = 'https://app.cohorthome.app';

/* the day, hour by hour — the spine of the front page. One line each. */
export const DAY = [
  { at: '06:55', t: 'Sign in with a staff code', d: 'On the house phone, or switch who is acting on a device already signed in.', screen: 'today', icon: 'key' },
  { at: '07:02', t: 'Read the handoff', d: 'What the night shift left, as counts. Reading it records a receipt.', screen: 'handoff', icon: 'handoff' },
  { at: '08:00', t: 'The MAR pass', d: 'Six Rights, the allergy check, the timing check, signed. The only two stops in the product are here.', screen: 'marpass', present: 'sheet', icon: 'pill', widget: 'sim' },
  { at: '10:30', t: 'Documentation', d: 'Every entry stamped with who and when. No signal? It queues and catches up.', screen: 'residents', icon: 'note', widget: 'air' },
  { at: '13:40', t: 'An incident', d: 'Filed from where she is, with the immediate action. Managers are told by house code, nothing more.', screen: 'incident', icon: 'flag' },
  { at: '18:45', t: 'Start handover', d: 'The sheet composes itself from the day. She adds one passage and posts.', screen: 'handoff', icon: 'count', widget: 'compose' },
  { at: '19:00', t: 'Sign out', d: 'Or the next caregiver switches in with her own code. Everything from the shift stays, attributed, for ever.', screen: 'today', icon: 'stamp' },
];
export const hid = (at) => at.replace(':', '');
export const tourKey = (d) => `${d.screen}${d.present ? `+${d.present}` : ''}`;

/* the manifesto — FAD §6.3, shortened. It lives on /features only. */
export const REFUSALS = [
  ['A compliance score or grade', 'It measures the record, not the care, and invites managing the number.'],
  ['Countdown timers on obligations', 'An obligation stated as immediate is not a clock.'],
  ['A third stop', 'Two exist because the harm is physical. A third turns informing into policing.'],
  ['Deleting anything', 'The record’s value is that it cannot be quietly changed.'],
  ['Editing a filed incident', 'A correction is an addendum under the original.'],
  ['Sending resident information outside the system', 'A message says something exists. The content is read after signing in.'],
  ['Notifying a family member', 'The obligation and the judgement belong to the provider.'],
  ['Working out a regulatory number', 'Capacity is typed by a person.'],
  ['Inventing a citation, threshold or window', 'Where a source is not established, the statement is shown without one.'],
  ['Recording care in bulk', 'Each dose, sign-off and completion is signed one at a time.'],
  ['Ranking houses or people', 'It turns a record into a performance instrument.'],
];

export const HOUSE_KEYS = [
  ['By invite', 'An administrator adds staff. There is no sign-up page.', 'people'],
  ['Stamped', 'Every entry carries who made it, and when.', 'stamp'],
  ['Offline-ready', 'Entries made without signal queue and catch up.', 'wifioff'],
];

/* the rail — the stops of the front page */
export const STOPS = [
  { id: 'shift', label: 'The shift', icon: 'clock' },
  { id: 'stops', label: 'Two stops', icon: 'gate' },
  { id: 'record', label: 'The record', icon: 'record' },
  { id: 'house', label: 'Your house', icon: 'house' },
  { id: 'pricing', label: 'Pricing', icon: 'tag' },
  { id: 'join', label: 'Join', icon: 'mail' },
];

/* the pages this module exports, in the order the rail shows them */
export const PAGE_LINKS = [
  { path: 'screens', label: 'Screens', icon: 'screens', title: 'All five screens, at the size they ship' },
  { path: 'features', label: 'Features', icon: 'note', title: 'Everything Cohort does' },
  { path: 'pricing', label: 'Pricing', icon: 'tag', title: 'One price per house' },
  { path: 'security', label: 'Security', icon: 'shield', title: 'What Cohort holds, and what leaves' },
  { path: 'about', label: 'About', icon: 'house', title: 'Who makes Cohort' },
  { path: 'contact', label: 'Contact', icon: 'mail', title: 'Write to a person' },
];

/* the product's own verbs, for the palette */
export const VERBS = [
  { t: 'Sign a dose', s: 'The MAR pass', to: '0800', icon: 'pill' },
  { t: 'File an incident', s: 'From where she is', to: '1340', icon: 'flag' },
  { t: 'Start handover', s: 'The sheet composes itself', to: '1845', icon: 'count' },
  { t: 'Add an addendum', s: 'Under the original, never over it', to: 'grammar', icon: 'addendum' },
  { t: 'Read the handoff', s: 'Reading it records a receipt', to: '0702', icon: 'handoff' },
];

/* the contact topics, set for this product */
export const TOPICS = ['Early access', 'A demo', 'Pricing', 'Security and privacy', 'Press', 'Something else'];

/* what the features page groups — FEATURES_COHORT.md §3, one row per CH-nn */
export const MODULES = [
  ['01', 'Identity and access', [['CH-17', 'Account and sign-in', 'password, magic link, Google/Apple, TOTP, sessions, reset, staff codes, allow-list', 'v1', 'common', 'PII']]],
  ['02', 'Organisation and houses', [['CH-01', 'People and access', 'organisation, houses, memberships, invites, short codes, allow-list, licence track', 'v1', 'Pro', 'PII'], ['CH-01.5', 'The houses roll-up as the provider’s home screen', '', 'v1', 'Scale', 'PUBLIC']]],
  ['03', 'Residents', [['CH-02', 'Resident record', 'directory, profile, allergies, diagnoses, contacts, summary sheet, archive, history', 'v1', 'Pro', 'PHI']]],
  ['04', 'Medication administration', [['CH-05', 'MAR', 'orders, scheduled doses, Six Rights, outcomes, PRN, controlled/witness, month print, offline', 'v1', 'Pro', 'PHI'], ['CH-05.7', 'The allergy stop', '', 'v1', 'Pro', 'PHI'], ['CH-05.8', 'The timing stop', '', 'v1', 'Pro', 'PHI'], ['CH-05.9', 'RN delegation tracking per caregiver per task', '', 'v2', 'Pro', 'PHI']]],
  ['05', 'Care documentation', [['CH-04', 'Care documentation', 'templates, assignments, entries, lock and addenda, history', 'v1', 'Pro', 'PHI']]],
  ['06', 'Incidents', [['CH-06', 'Incidents', 'filing, duty line, sign-off, addenda, emergency panel, history', 'v1', 'Pro', 'PHI'], ['CH-06.6', 'Incident PDF export with redaction', '', 'v1', 'Pro', 'PHI']]],
  ['07', 'Daily operations', [['CH-08', 'Today and the handoff', 'composition, sheet, read receipt, count prompt, print, history', 'v1', 'Pro', 'PHI'], ['CH-07.1', '“Who’s on today” — a read-only presence list', '', 'v1', 'Pro', 'PII']]],
  ['08', 'House tasks', [['CH-09', 'House tasks', 'definitions, completion, work orders, resident-linked, log', 'v1', 'Pro', 'PUBLIC / PHI']]],
  ['09', 'Plans', [['CH-09.1', 'Plans', 'versions, goals, linking, expiry, elopement window', 'v2', 'Pro', 'PHI']]],
  ['10', 'Communication', [['CH-13', 'Communication', 'announcements, care-team thread', 'v1', 'Pro', 'PHI']]],
  ['11', 'Issues', [['CH-10', 'Issues', 'raise, assign, status', 'v2', 'Pro', 'PII / PHI']]],
  ['12', 'Administration and reporting', [['CH-11', 'Admin', 'audit view, PHI-view log, exports, roll-ups, billing view', 'v1', 'Pro / Scale', 'PHI'], ['CH-19', 'Export and offboarding', 'a ZIP you can read without Cohort', 'v1', 'common', '—']]],
  ['13', 'Subscription and billing', [['CH-22', 'Signup, trial and billing', 'five steps and the billing states', 'v1', 'common', 'PUBLIC'], ['CH-20', 'The customer agreement at signup', '', 'v1', '—', '—'], ['CH-18', 'Onboarding checklist', 'five first actions', 'v1', 'common', '—']]],
  ['14', 'Notifications', [['CH-12', 'Notifications', 'inbox, push, email, nine event keys, preferences', 'v1', 'common', 'PUBLIC']]],
  ['15', 'Support', [['CH-16', 'Help and support', 'ticket form, replies', 'v1', 'common', 'PII']]],
  ['—', 'Everywhere', [['CH-23', 'On iPhone, Android and the web', '', 'v1', 'common', '—']]],
];

/* ══ THE WORKING DEMO ═════════════════════════════════════════════════════
   Everything below feeds the live instruments. */

export const SITE = 'https://cohorthome.app';
export const STRIP = 'strip-cohort';

/* the five real screens, in the order the product builds them, with the
   tab word each one owns and the one thing it proves. */
export const SCREEN_ORDER = ['today', 'marpass', 'incident', 'handoff', 'residents'];
export const SCREEN_NOTES = {
  today: { tab: 'Today', proves: 'Counts, never a score, and nothing red. A house with nothing outstanding says so in words.' },
  marpass: { tab: 'MAR pass', proves: 'The only two stops in the product are on this screen. Everything else informs.' },
  incident: { tab: 'Incident', proves: 'Filed, notified, reviewed, signed off, locked. Then an addendum under the original.' },
  handoff: { tab: 'Handoff', proves: 'Composed from the day, not typed from memory. Reading it records a receipt.' },
  residents: { tab: 'Residents', proves: '“No allergies recorded” and “nobody has asked yet” are different facts, and both are kept.' },
};
export const screenHref = (key) => `/screens#${STRIP}-${key}`;

/* the route line, in reading order — the floating "next" walks it */
export const ROUTES = [
  { path: '', page: 'home', label: 'The shift', gist: 'One caregiver’s day, hour by hour' },
  { path: 'screens', page: 'screens', label: 'Screens', gist: 'All five, at the size they ship' },
  { path: 'features', page: 'features', label: 'Features', gist: 'Everything Cohort does' },
  { path: 'pricing', page: 'pricing', label: 'Pricing', gist: 'One price per house' },
  { path: 'security', page: 'security', label: 'Security', gist: 'What it holds, what leaves' },
  { path: 'about', page: 'about', label: 'About', gist: 'Who makes Cohort' },
  { path: 'contact', page: 'contact', label: 'Contact', gist: 'Write to a person' },
  { path: 'privacy', page: 'privacy', label: 'Privacy', gist: 'The full notice' },
];

/* the four words this product owns, verbatim from src/data/states.js */
export const STATE_KEYS = ['due', 'overdue', 'given', 'held'];

/* the seven states of the pass, from page.js loop.nodes — two of them stop */
export const PASS = [
  ['scheduled', '', 'Against the order in force.'],
  ['Six Rights', '', 'Six boxes, all required.'],
  ['allergy check', '1', 'Always runs, even where no allergy is on file.'],
  ['timing', '2', 'Before the minimum interval, or past the daily ceiling.'],
  ['witness co-sign', '', 'Team houses only.'],
  ['signed', '', 'Given, refused, held or missed, with who and when.'],
  ['locked', '', 'Addenda only. Never reversed.'],
];
