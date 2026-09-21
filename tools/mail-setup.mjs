// mail-setup.mjs — wire one Resend account to the four sites so that every
// email the family sends or receives goes through one inbox.
//
//   RESEND_API_KEY=re_… node tools/mail-setup.mjs --inbox you@example.com
//   RESEND_API_KEY=re_… node tools/mail-setup.mjs --inbox … --dry        plan only
//   RESEND_API_KEY=re_… node tools/mail-setup.mjs --inbox … --dns        also add the MX records
//
// Run it from sites/ (it knows the four directories) with a FULL-ACCESS key
// from https://resend.com/api-keys. It is idempotent: run it twice and the
// second run changes nothing. What it does, in order:
//
//   1  checks every domain is verified for sending in this Resend account
//   2  enables receiving on each domain and reads back the MX record it wants
//   3  creates (or finds) the one email.received webhook → the relay endpoint
//   4  mints one API key per site, named after the site
//   5  sets RESEND_API_KEY, RESEND_WEBHOOK_SECRET, MAIL_INBOX on each Vercel
//      project, production and preview, through the REST API (upsert)
//   6  with --dns, adds the MX records to Vercel DNS; otherwise prints them
//   7  prints how to answer from the inbox AS hello@<domain> (Gmail "send as"
//      over Resend SMTP), which is the last step and is done by a person
//
// It never prints a key it minted except into the Vercel environment.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITES = path.resolve(HERE, '..', '..');            // sites/
const args = process.argv.slice(2);
const flag = (k) => args.includes(k);
const val = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : ''; };
const DRY = flag('--dry');
const INBOX = val('--inbox') || process.env.MAIL_INBOX || '';
const RELAY = val('--relay') || 'https://cohorthome.app/api/inbound';
const KEY = process.env.RESEND_API_KEY || '';

const SITE_DIRS = {
  'cohorthome.app': 'cohorthome.app',
  'careshop.app': 'careshop.app',
  'binderkit.com': 'binderkit.com',
  'aidepost.com': 'aidepost.com',
};
/* providerhub.us is the family's parent domain, not one of the four sites, and
   putting an inbound MX on a root that already receives mail elsewhere is the
   one genuinely destructive thing in this script — Resend's own note says so.
   So it is opt-in: pass --with-parent to include it. */
const DOMAINS = [...Object.keys(SITE_DIRS), ...(flag('--with-parent') ? ['providerhub.us'] : [])];

if (!KEY) { console.error('  RESEND_API_KEY is not set. Create a full-access key at https://resend.com/api-keys and run again.'); process.exit(1); }
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(INBOX)) { console.error('  --inbox <address> is required: the one inbox every message is copied to.'); process.exit(1); }

const resend = async (route, init = {}) => {
  const r = await fetch(`https://api.resend.com${route}`, { ...init, headers: { authorization: `Bearer ${KEY}`, 'content-type': 'application/json', ...(init.headers || {}) } });
  const text = await r.text();
  const body = text ? JSON.parse(text) : null;
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${route} → ${r.status} ${body && (body.message || body.name)}`);
  return body;
};
const say = (s) => console.log(`  ${s}`);
const plan = (s) => console.log(`  ${DRY ? '(dry) ' : ''}${s}`);

/* ── 1 · the domains ──────────────────────────────────────────────────── */
const domains = (await resend('/domains')).data || [];
const byName = Object.fromEntries(domains.map((d) => [d.name, d]));
say('Domains in this Resend account:');
for (const d of DOMAINS) {
  const row = byName[d];
  say(`   ${d.padEnd(18)} ${row ? `${row.status}${row.capabilities ? ` · receiving ${row.capabilities.receiving}` : ''}` : 'NOT IN THIS ACCOUNT'}`);
}
const missing = DOMAINS.filter((d) => !byName[d] || byName[d].status !== 'verified');
if (missing.length) { console.error(`\n  These domains are not verified here yet: ${missing.join(', ')}. Add them at https://resend.com/domains (the DKIM and SPF records are already in Vercel DNS) and run again.`); process.exit(1); }

/* ── 2 · receiving, and the MX record each domain wants ───────────────── */
const mx = {};
for (const d of DOMAINS) {
  let row = await resend(`/domains/${byName[d].id}`);
  if (!row.capabilities || row.capabilities.receiving !== 'enabled') {
    plan(`enable receiving on ${d}`);
    if (!DRY) { await resend(`/domains/${byName[d].id}`, { method: 'PATCH', body: JSON.stringify({ capabilities: { receiving: 'enabled' } }) }); row = await resend(`/domains/${byName[d].id}`); }
  }
  const rec = (row.records || []).find((r) => r.type === 'MX' && r.name !== 'send' && !/send/.test(r.name || ''));
  if (rec) mx[d] = rec;
  else if (!DRY) say(`   ${d}: receiving is on but no MX record came back yet — open https://resend.com/domains and copy it by hand`);
}

/* ── 3 · the one webhook ──────────────────────────────────────────────── */
let hook = ((await resend('/webhooks')).data || []).find((w) => w.endpoint === RELAY);
if (!hook) {
  plan(`create the email.received webhook → ${RELAY}`);
  if (!DRY) hook = await resend('/webhooks', { method: 'POST', body: JSON.stringify({ endpoint: RELAY, events: ['email.received'] }) });
} else {
  say(`webhook exists → ${RELAY}`);
  if (!hook.signing_secret) hook = await resend(`/webhooks/${hook.id}`);
}
const secret = hook && hook.signing_secret;
if (!DRY && !secret) { console.error('  the webhook came back without a signing secret; open it at https://resend.com/webhooks and copy the secret into RESEND_WEBHOOK_SECRET by hand'); }

/* ── 4 · one key per site ─────────────────────────────────────────────── */
const existing = ((await resend('/api-keys')).data || []).map((k) => k.name);
const keys = {};
for (const d of Object.keys(SITE_DIRS)) {
  const name = `${d} site`;
  if (existing.includes(name)) { say(`key “${name}” already exists — keeping the one in Vercel; delete it at https://resend.com/api-keys to mint a fresh one`); continue; }
  plan(`mint key “${name}”`);
  if (!DRY) keys[d] = (await resend('/api-keys', { method: 'POST', body: JSON.stringify({ name, permission: 'full_access' }) })).token;
}

/* ── 5 · the Vercel environment, through the REST API ─────────────────── */
const auth = JSON.parse(fs.readFileSync(path.join(process.env.HOME, 'Library', 'Application Support', 'com.vercel.cli', 'auth.json'), 'utf8'));
const vercel = async (route, init = {}) => {
  const r = await fetch(`https://api.vercel.com${route}`, { ...init, headers: { authorization: `Bearer ${auth.token}`, 'content-type': 'application/json' } });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${route} → ${r.status} ${body && body.error && body.error.message}`);
  return body;
};
for (const [d, dir] of Object.entries(SITE_DIRS)) {
  const link = path.join(SITES, dir, '.vercel', 'project.json');
  if (!fs.existsSync(link)) { say(`${d}: not linked to Vercel here (${dir}/.vercel/project.json missing) — skipped`); continue; }
  const { projectId, orgId } = JSON.parse(fs.readFileSync(link, 'utf8'));
  const vars = { MAIL_INBOX: INBOX, MAIL_DOMAIN: d };
  if (keys[d]) vars.RESEND_API_KEY = keys[d];
  if (secret) vars.RESEND_WEBHOOK_SECRET = secret;
  for (const [k, v] of Object.entries(vars)) {
    plan(`${d}: set ${k}`);
    if (DRY) continue;
    await vercel(`/v10/projects/${projectId}/env?upsert=true&teamId=${orgId}`, { method: 'POST', body: JSON.stringify({ key: k, value: v, type: k.startsWith('MAIL_') ? 'plain' : 'encrypted', target: ['production', 'preview'] }) });
  }
}

/* ── 6 · DNS ──────────────────────────────────────────────────────────── */
console.log('\n  MX records for receiving (Vercel DNS):');
for (const d of DOMAINS) {
  const r = mx[d];
  if (!r) { say(`   ${d}: (not returned yet)`); continue; }
  const host = !r.name || r.name === d || r.name === '@' ? '@' : r.name.replace(`.${d}`, '');
  const cmd = `vercel dns add ${d} ${host} MX ${r.value} ${r.priority || 10}`;
  say(`   ${cmd}`);
  if (flag('--dns') && !DRY) {
    try { execFileSync('vercel', ['dns', 'add', d, host, 'MX', r.value, String(r.priority || 10)], { stdio: 'inherit' }); } catch (e) { say(`   ${d}: vercel dns add failed — ${e.message}`); }
  }
}
say('  A domain that already receives mail elsewhere must NOT get this record on its root — see the Resend note on conflicting MX records.');

/* ── 7 · answering as the site ────────────────────────────────────────── */
console.log(`
  Done${DRY ? ' (nothing changed — dry run)' : ''}. Redeploy each site once (vercel --prod) so the functions pick up the environment.

  To ANSWER from ${INBOX} as the site (Gmail → Settings → Accounts → “Send mail as”):
     name      Cohort / CareShop / Binderkit / Aidepost
     email     hello@<domain>
     SMTP      smtp.resend.com   port 465 (SSL)   user: resend   password: that site's RESEND_API_KEY
  Do it once per domain. Replies from the inbox then leave as hello@<domain>, and anything sent to
  hello@<domain> comes back to ${INBOX} through the relay, with reply-to already set to the sender.
`);
