// lib/mail.js — the one way this site sends an email.
//
// Every message any of the four sites sends goes through here, and every one
// of them is shaped so that the whole family's mail lands in ONE inbox and
// can be answered from it:
//
//   · from      the box that site prints — shift@cohorthome.app,
//               kitchen@careshop.app, plan@binderkit.com, shifts@aidepost.com,
//               or caregiver@aidepost.com — the product's own voice
//   · reply-to  the person, when a human should answer them; or that same
//               box, which Resend receives and relays to the inbox
//   · inbox     MAIL_INBOX — the one address every notification is copied to
//
// No SDK: Resend's REST API over fetch, so a Vercel function needs nothing
// installed. With RESEND_API_KEY unset, send() returns { sent: false } and
// the caller decides whether that matters — a waitlist row is still kept, a
// contact message is still stored, and the page says so honestly.
//
// Environment (per Vercel project):
//   RESEND_API_KEY   the key — one per site, minted by tools/mail-setup.mjs
//   MAIL_INBOX      where every notice lands; one address, or several comma-separated
//   MAIL_DOMAIN      optional; defaults to the request host
//   MAIL_FROM_NAME   optional; defaults to the product name

const API = 'https://api.resend.com';

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const configured = () => Boolean(process.env.RESEND_API_KEY);
/* MAIL_INBOX may name more than one address, comma-separated, and every notice
   and every relayed message goes to all of them. Returns '' when unset so the
   `if (inbox())` guards stay falsy, a plain string for one address, and an array
   for several — send() already normalises `to` through Array.isArray. */
export const inbox = () => {
  const raw = clean(process.env.MAIL_INBOX, 254);
  if (!raw) return '';
  const list = raw.split(',').map((a) => a.trim()).filter(Boolean);
  return list.length > 1 ? list : (list[0] || '');
};

/** The site's own address at a domain: shift@cohorthome.app. The local part
    always comes from BOXES in lib/boxes.js, never from a request field. */
export const address = (local, domain) => `${local}@${String(domain || '').replace(/^www\./, '')}`;
export const named = (name, email) => `${String(name).replace(/[<>"]/g, '')} <${email}>`;

/** Resolve the domain a request arrived on, or the configured one. */
export const domainOf = (req) => {
  const env = clean(process.env.MAIL_DOMAIN, 120);
  if (env) return env;
  const host = clean((req && req.headers && (req.headers['x-forwarded-host'] || req.headers.host)) || '', 120).split(':')[0];
  return host.replace(/^www\./, '') || 'providerhub.us';
};

/**
 * Send one email. Returns { sent, id } or { sent: false, error }.
 * Never throws: mail is a nicety after the record is kept, never a gate.
 */
export async function send({ from, to, subject, text, html, replyTo, headers, tags }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, error: 'not configured' };
  const body = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject: String(subject).slice(0, 998),
    text,
    html,
  };
  if (replyTo) body.reply_to = Array.isArray(replyTo) ? replyTo : [replyTo];
  if (headers) body.headers = headers;
  if (tags) body.tags = tags;
  try {
    const r = await fetch(`${API}/emails`, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const out = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error('mail: resend refused', r.status, out && (out.message || out.name));
      return { sent: false, error: (out && out.message) || `http ${r.status}` };
    }
    return { sent: true, id: out.id };
  } catch (e) {
    console.error('mail: resend unreachable', e && e.message);
    return { sent: false, error: e && e.message };
  }
}

/** Fetch a received email's content — the webhook carries metadata only. */
export async function received(id) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('not configured');
  const r = await fetch(`${API}/emails/receiving/${encodeURIComponent(id)}`, {
    headers: { authorization: `Bearer ${key}` },
  });
  const out = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`receiving/${id} → ${r.status} ${out && out.message}`);
  return out;
}

/* ── the family's letterhead: plain text first, a quiet HTML twin ──────── */

const wrap = (title, inner, foot) => `<!doctype html><html lang="en"><body style="margin:0;padding:0;background:#F7F3EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#17201F">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EC"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFDF9;border:1px solid rgba(23,32,31,.12);border-radius:16px">
<tr><td style="padding:28px 32px 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#5B6663">${esc(title)}</td></tr>
<tr><td style="padding:0 32px 28px;font-size:16px;line-height:1.55">${inner}</td></tr>
</table>
<p style="max-width:560px;margin:18px 0 0;font-size:12px;line-height:1.5;color:#5B6663">${foot}</p>
</td></tr></table></body></html>`;

const P = (t) => `<p style="margin:0 0 14px">${t}</p>`;
const KV = (rows) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 16px;font-size:14px">${rows.map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#5B6663;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0">${esc(v)}</td></tr>`).join('')}</table>`;

export const LEGAL = '© 2026 Bareeda LLC · Providerhub Oregon · Oregon';

/**
 * The three letters the sites write. Each returns { subject, text, html }.
 * `site` is { name, domain }; every letter names the product and nothing
 * about anyone else, and every one says how to stop hearing from us.
 */
export const letters = {
  /* to the person who joined the list */
  waitlistReceipt(site, row) {
    const subject = `You are on the ${site.name} list`;
    const text = `You are on the ${site.name} early-access list.

We will write once, when it opens — what it costs and how to get in. Nothing else, ever.

What you told us:
  email    ${row.email}
  track    ${row.track}
  houses   ${row.houses}

Reply to this message and a person answers. Reply with "remove" and the row is deleted.

${site.name} · https://${site.domain}
${LEGAL}`;
    const html = wrap(`${site.name} · early access`,
      `${P(`<b>You are on the ${esc(site.name)} list.</b>`)}${P('We will write once, when it opens — what it costs and how to get in. Nothing else, ever.')}${KV([['Email', row.email], ...(row.phone ? [['Phone', row.phone]] : []), ['Licence track', row.track], ['Houses', row.houses]])}${P('Reply to this message and a person answers. Reply with <b>remove</b> and the row is deleted.')}`,
      `${esc(site.name)} · <a href="https://${esc(site.domain)}" style="color:#0F5C5A">${esc(site.domain)}</a><br>${esc(LEGAL)}`);
    return { subject, text, html };
  },

  /* to the inbox: someone joined */
  waitlistNotice(site, row) {
    const subject = `[${site.domain}] early access · ${row.email}`;
    const text = `${row.email} joined the ${site.name} list.

  track    ${row.track}
  houses   ${row.houses}${row.phone ? `\n  phone    ${row.phone}` : ''}
  product  ${row.product}
  from     ${row.source}

Reply to this message to write to them directly.`;
    const html = wrap(`${site.domain} · new on the list`,
      `${P(`<b>${esc(row.email)}</b> joined the ${esc(site.name)} list.`)}${KV([['Track', row.track], ['Houses', row.houses], ...(row.phone ? [['Phone', row.phone]] : []), ['Product', row.product], ['From', row.source]])}${P('Reply to this message to write to them directly.')}`,
      `Sent by the ${esc(site.domain)} waitlist endpoint.`);
    return { subject, text, html };
  },

  /* to the person who wrote through the contact form */
  contactReceipt(site, msg) {
    const subject = `Got it — ${site.name}`;
    const text = `Thanks, ${msg.name || 'there'}. Your message reached a person at ${site.name}, and that person will answer. One inbox, no ticket, no queue.

What you wrote:

${msg.message}

If you did not send this, ignore it; nothing else will follow.

${site.name} · https://${site.domain}
${LEGAL}`;
    const html = wrap(`${site.name} · received`,
      `${P(`Thanks, ${esc(msg.name || 'there')}. Your message reached a person at ${esc(site.name)}, and that person will answer. One inbox, no ticket, no queue.`)}${P('<span style="color:#5B6663">What you wrote:</span>')}<blockquote style="margin:0 0 16px;padding:12px 16px;border-left:3px solid #0F5C5A;background:#F2EFE8;border-radius:0 10px 10px 0;white-space:pre-wrap">${esc(msg.message)}</blockquote>${P('If you did not send this, ignore it; nothing else will follow.')}`,
      `${esc(site.name)} · <a href="https://${esc(site.domain)}" style="color:#0F5C5A">${esc(site.domain)}</a><br>${esc(LEGAL)}`);
    return { subject, text, html };
  },

  /* to the inbox: a message came through the form */
  contactNotice(site, msg) {
    const subject = `[${site.domain}] ${msg.topic || 'message'} · ${msg.name || msg.email}`;
    const text = `${msg.name || '(no name)'} <${msg.email}> wrote through ${site.domain}:

${msg.message}

  topic    ${msg.topic || '—'}${msg.phone ? `\n  phone    ${msg.phone}` : ''}
  product  ${msg.product}
  from     ${msg.source}

Reply to this message and it goes to them.`;
    const html = wrap(`${site.domain} · ${esc(msg.topic || 'message')}`,
      `${P(`<b>${esc(msg.name || '(no name)')}</b> &lt;${esc(msg.email)}&gt; wrote through ${esc(site.domain)}:`)}<blockquote style="margin:0 0 16px;padding:12px 16px;border-left:3px solid #0F5C5A;background:#F2EFE8;border-radius:0 10px 10px 0;white-space:pre-wrap">${esc(msg.message)}</blockquote>${KV([['Topic', msg.topic || '—'], ...(msg.phone ? [['Phone', msg.phone]] : []), ['Product', msg.product], ['From', msg.source]])}${P('Reply to this message and it goes to them.')}`,
      `Sent by the ${esc(site.domain)} contact endpoint.`);
    return { subject, text, html };
  },

  /* to the inbox: an email arrived at any local part at <domain>, relayed whole.
     Receiving is per-DOMAIN, not per-address: api/inbound.js routes on the
     domain and discards the local part, so hello@ keeps arriving for ever.
     `local` is the local part actually written to, for the subject. */
  relay(site, mail, local) {
    const fromHeader = (mail.headers && mail.headers.from) || mail.from;
    const subject = `[${site.domain}${local ? ` · ${local}` : ''}] ${mail.subject || '(no subject)'}`;
    const attachments = Array.isArray(mail.attachments) && mail.attachments.length
      ? `\n\nAttachments (${mail.attachments.length}): ${mail.attachments.map((a) => a.filename || a.name || 'file').join(', ')} — open the message in Resend to download.`
      : '';
    const text = `From: ${fromHeader}
To: ${(mail.to || []).join(', ')}
${mail.cc && mail.cc.length ? `Cc: ${mail.cc.join(', ')}\n` : ''}
${mail.text || '(no plain-text body)'}${attachments}

— relayed by ${site.domain}. Reply to this message and it goes to the sender.`;
    const html = wrap(`${site.domain} · received`,
      `${KV([['From', fromHeader], ['To', (mail.to || []).join(', ')], ...(mail.cc && mail.cc.length ? [['Cc', mail.cc.join(', ')]] : []), ['Subject', mail.subject || '(no subject)']])}<div style="padding:14px 16px;border:1px solid rgba(23,32,31,.12);border-radius:10px">${mail.html || `<pre style="white-space:pre-wrap;font:inherit;margin:0">${esc(mail.text || '(no body)')}</pre>`}</div>${attachments ? P(`<span style="color:#5B6663">${esc(attachments.trim())}</span>`) : ''}${P('<span style="color:#5B6663">Reply to this message and it goes to the sender.</span>')}`,
      `Relayed by ${esc(site.domain)}.`);
    return { subject, text, html };
  },
};
