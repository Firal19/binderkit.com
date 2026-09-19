// The social glyphs, and the one renderer every site calls.
//
// A platform's mark has to be its own — that is the whole point of one — so
// the eight shapes are the platforms' shapes. What each SITE decides is the
// container, the stroke, the size, the colour and the motion; the renderer
// puts a stable class on everything (soc, soc-i, soc-g) and the page
// stylesheet does the rest.

import { esc } from '../kit.js';
import { socialFor } from '../data/social.js';

const F = (d) => ({ fill: d });
const S = (d) => ({ stroke: d });

const GLYPH = {
  x: F('M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'),
  instagram: F('M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zM17.3 5.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z'),
  facebook: F('M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'),
  linkedin: F('M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'),
  youtube: F('M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'),
  tiktok: F('M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'),
  threads: S('M12 21.5c-5.2 0-8.5-3.4-8.5-9.5S6.8 2.5 12 2.5c4.2 0 7 2.2 7.9 5.6M8.6 12.7c.6-1.4 2-2.2 3.6-2.2 2.7 0 4.3 1.6 4.3 4.1 0 2.3-1.7 3.9-4.2 3.9-1.9 0-3.3-1-3.3-2.5 0-1.4 1.3-2.3 3.5-2.4 1.3-.1 2.7.1 3.8.5M15.5 8.9c-.4-1.4-1.6-2.3-3.2-2.3'),
  bluesky: F('M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z'),
};

/** One platform glyph, 24-unit box, coloured by currentColor. */
export function socialGlyph(id, size = 18) {
  const g = GLYPH[id];
  if (!g) return '';
  const body = g.fill
    ? `<path d="${g.fill}" fill="currentColor"/>`
    : `<path d="${g.stroke}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<svg class="soc-g" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
}

/**
 * The block. `opts.text` puts the handle beside the glyph; `opts.cls` lets a
 * site name its own variant; `opts.only` narrows the platforms.
 */
export function social(productId, opts = {}) {
  const items = socialFor(productId).filter((s) => !opts.only || opts.only.includes(s.id));
  const size = opts.size || 18;
  return `<nav class="soc ${opts.cls || ''}" aria-label="${esc(opts.label || 'Social')}">${items.map((s) => `<a class="soc-i" data-net="${s.id}" href="${esc(s.href)}" rel="me noopener" target="_blank" aria-label="${esc(s.name)}${opts.text ? '' : ` — ${esc(s.label)}`}">${socialGlyph(s.id, size)}${opts.text ? `<span class="soc-t">${esc(s.label)}</span>` : ''}</a>`).join('')}</nav>`;
}

export const socialUrls = (productId) => socialFor(productId).map((s) => s.href);
