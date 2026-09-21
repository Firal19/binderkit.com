import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const guard = (key: string) => { if (!process.env.WAITLIST_KEY || key !== process.env.WAITLIST_KEY) throw new Error('not authorised'); };

/* A message from the contact form. Public because the form is public; it
   validates again because a public mutation is a public mutation. */
export const contact = mutation({
  args: { name: v.string(), email: v.string(), phone: v.optional(v.string()), topic: v.string(), message: v.string(), product: v.string(), source: v.string(), at: v.number() },
  handler: async (ctx, a) => {
    const email = a.email.trim().toLowerCase().slice(0, 254);
    if (!EMAIL.test(email)) throw new Error('bad email');
    const message = a.message.trim().slice(0, 4000);
    if (message.length < 4) throw new Error('empty');
    return await ctx.db.insert('messages', {
      name: a.name.slice(0, 120), email, phone: (a.phone || '').slice(0, 40) || undefined, topic: a.topic.slice(0, 40), message,
      product: a.product.slice(0, 20), source: a.source.slice(0, 300), at: a.at || Date.now(), answered: false,
    });
  },
});

/* One row per email that arrived at this domain, written by /api/inbound
   after Resend's signed webhook. The relay to the inbox is the nicety; this
   is the record. */
export const inbound = mutation({
  args: { emailId: v.string(), messageId: v.string(), from: v.string(), to: v.string(), subject: v.string(), domain: v.string(), at: v.number(), relayed: v.boolean() },
  handler: async (ctx, a) => {
    const seen = await ctx.db.query('inbox').withIndex('by_emailId', (q) => q.eq('emailId', a.emailId)).first();
    const row = { ...a, emailId: a.emailId.slice(0, 80), messageId: a.messageId.slice(0, 300), from: a.from.slice(0, 254), to: a.to.slice(0, 600), subject: a.subject.slice(0, 300), domain: a.domain.slice(0, 120) };
    if (seen) { await ctx.db.patch(seen._id, row); return seen._id; }
    return await ctx.db.insert('inbox', row);
  },
});

/* Read either list. Same key as waitlist:list — the same private operation. */
export const messages = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => { guard(key); return await ctx.db.query('messages').withIndex('by_at').order('desc').take(500); },
});
export const received = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => { guard(key); return await ctx.db.query('inbox').withIndex('by_at').order('desc').take(500); },
});
export const answered = mutation({
  args: { key: v.string(), id: v.id('messages') },
  handler: async (ctx, { key, id }) => { guard(key); await ctx.db.patch(id, { answered: true }); return true; },
});
