// lib/boxes.js — every address the four sites print, and the routes that
// change one. Resend receives every local part at every one of these domains
// (api/inbound.js routes on the domain and discards the local part), so
// hello@ keeps arriving for ever; it is simply never printed again.
//
// 'main' is the box a site prints when no route and no topic says otherwise.
// These are fixed literals. A local part must never come from a request field:
// lib/mail.js address() does not sanitise it, so a free field here would be a
// header-injection point. Every key below is looked up by a domain plus a
// value that is already validated against a closed allow-list.
//
// It lives in lib/ because sites/make.mjs copies src, tools, api and convex
// into each site directory and lib/ already ships with api/, so both the
// render side and the API side get the same file and there is no second map
// to drift.

export const BOXES = {
  'cohorthome.app': { main: 'shift' },
  'careshop.app':   { main: 'kitchen' },
  'binderkit.com':  { main: 'plan' },
  'aidepost.com':   { main: 'shifts', caregivers: 'caregiver' },
};

/* route → box key. Only aidepost forks, and only by route — never by the
   client-side side switch, which a weeks-old localStorage value can win. */
export const ROUTES = {
  'aidepost.com': { '/caregivers': 'caregivers' },
};

/* topic → box key, for the contact endpoint. The topic is already validated
   against the TOPICS Set in api/contact.js, so this is a closed lookup. */
export const TOPIC_BOX = {
  'aidepost.com': { 'I’m a caregiver': 'caregivers' },
};

/* waitlist "You are" value → box key. Already validated in api/waitlist.js. */
export const JOINER_BOX = {
  'aidepost.com': { 'I’m a caregiver': 'caregivers' },
};

/* the mailto subject a route prefills, in the reader's own first person */
export const SUBJECTS = {
  'cohorthome.app': { '/screens': 'I’m staff', '/pricing': 'Pricing', '/security': 'Security and privacy', '/privacy': 'Privacy', '/404': 'A link that went nowhere' },
  'careshop.app':   { '/shelf': 'I’m staff', '/stock': 'I’m staff', '/pricing': 'Pricing', '/rules': 'A rule', '/privacy': 'Privacy', '/404': 'A link that went nowhere' },
  'binderkit.com':  { '/screens': 'The plates', '/plan': 'Which track?', '/pricing': 'Pricing', '/privacy': 'Privacy', '/404': 'A link that went nowhere' },
  'aidepost.com':   { '/screens': 'The screens', '/caregivers': 'I’m a caregiver', '/providers': 'I run a house', '/pricing': 'Pricing', '/privacy': 'Privacy', '/404': 'A link that went nowhere' },
};

const bare = (d) => String(d || '').replace(/^www\./, '');

/** The local part for a domain and a box key. Falls back to main, then hello. */
export const localPart = (domain, key = 'main') => {
  const m = BOXES[bare(domain)] || {};
  return m[key] || m.main || 'hello';
};

export const keyForRoute  = (domain, route) => (ROUTES[bare(domain)]     || {})[route] || 'main';
export const keyForTopic  = (domain, topic) => (TOPIC_BOX[bare(domain)]  || {})[topic] || 'main';
export const keyForJoiner = (domain, you)   => (JOINER_BOX[bare(domain)] || {})[you]   || 'main';
export const subjectFor   = (domain, route) => (SUBJECTS[bare(domain)]   || {})[route] || '';

export default BOXES;
