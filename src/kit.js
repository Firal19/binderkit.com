// The small surface the ported board modules expect. On the system board this
// was a live token engine writing custom properties on every keystroke; a
// shipped site has no controls, so the same four names are answered
// statically. The face package itself — every --t-* and --c-* value, for all
// five products, in both modes — is baked into css/faces.css by the board's
// own faceSheetText(), so nothing here has to do colour maths.

import { PRODUCTS } from './data/brand.js';
import { MARKS } from './marks.js';

export { PRODUCTS, MARKS };

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const productOf = (id) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

/* The instruments read `state.view` for the three shell options the board
   used to expose as controls. A site picks one composition and keeps it. */
export const state = {
  view: { shellScreen: 0, shellFill: 'filled', shellPresent: 'none', shellW: 1280 },
};

/* ── the marks ───────────────────────────────────────────────────────────
   Three bodies per mark, the crossover at 32px and 14px, exactly as the
   board draws them. The four accent hexes stay literal in marks.js so they
   can be swapped here for the live variables — which is what lets one drawing
   sit on ivory in the nav and on deep teal in the family band. */
const ACCENT_HEX = { '#E0704F': 'coral', '#E19A2E': 'amber', '#6E8FE8': 'peri', '#D4699F': 'orchid' };
const ACCENT_RE = /#(E0704F|E19A2E|6E8FE8|D4699F)/g;

const bodyFor = (productId, size, opts) => {
  const m = MARKS.find((x) => x && x.id === productId);
  if (!m) return null;
  const tiny = opts.tiny ?? size < 14;
  const small = opts.small ?? size < 32;
  if ((tiny || small) && typeof m.small === 'function') return { m, fn: m.small };
  return { m, fn: m.svg };
};

export function mark(productId, size = 40, opts = {}) {
  const chosen = bodyFor(productId, size, opts);
  if (!chosen) return '';
  const { m, fn } = chosen;
  const tile = opts.tile || 'var(--c-tile)';
  const glyph = opts.glyph || 'var(--c-glyph)';
  const body = fn(tile, glyph).replace(ACCENT_RE, (h) => (opts.mono ? tile : `var(--t-${ACCENT_HEX[h]})`));
  const label = opts.label === false
    ? 'aria-hidden="true" focusable="false"'
    : `role="img" aria-label="${esc(m.name)}"`;
  return `<svg class="mk" width="${size}" height="${size}" viewBox="0 0 64 64" ${label}>${body}</svg>`;
}

/* The same drawing with literal colours, for the places a CSS variable cannot
   reach: the favicon, the apple-touch icon and the social card. */
export function markLiteral(productId, tile, glyph, size = 64) {
  const m = MARKS.find((x) => x && x.id === productId);
  if (!m) return '';
  const body = (size < 32 ? m.small : m.svg)(tile, glyph);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">${body}</svg>`;
}
