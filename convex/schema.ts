import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Three tables, none of them about any resident, caregiver or house:
//   waitlist  the early-access list
//   messages  what people wrote through the contact form
//   inbox     one row per email that arrived at this domain (the relay log)
export default defineSchema({
  waitlist: defineTable({
    email: v.string(),
    phone: v.optional(v.string()),
    track: v.string(),
    houses: v.string(),
    product: v.string(),
    source: v.string(),
    at: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_at', ['at']),

  messages: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    topic: v.string(),
    message: v.string(),
    product: v.string(),
    source: v.string(),
    at: v.number(),
    answered: v.boolean(),
  })
    .index('by_at', ['at'])
    .index('by_email', ['email']),

  inbox: defineTable({
    emailId: v.string(),
    messageId: v.string(),
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    domain: v.string(),
    at: v.number(),
    relayed: v.boolean(),
  })
    .index('by_emailId', ['emailId'])
    .index('by_at', ['at']),
});
