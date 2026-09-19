// The five marks — five objects cut by one hand on one 64-unit tile, plus the
// geometry assertion that keeps them honest. Every mark is `(f, d) => svg body`
// where f is the tile/ground and d is the glyph; the four accent hexes stay
// literal so tokens.js can substitute live variables over them.

/* ── the hand, stated once ───────────────────────────────────────────────
   BOX          64 × 64, tile on all five: rect 64 rx 16 in f.
   SAFE AREA    9 units of tile on every side; no ink outside x/y 9–55.
   KEYLINES     every ink bbox centres on (32,32); pho 46×46 (the parent is
                one step wider, because it is the container), cohort 46×36,
                careshop 44×44, binderkit 38×46, aidepost 46×38.
   STROKE       full body — stem 5, hairline 2.5, plane-soften 3.
                small body — stem 6, soften 4; nothing under 4 but a well ring,
                whose floor is 2.5. Those are the only two ramps in the set.
   CORNERS      rx = 0.25 × the short side; polygon vertices softened to 1.5 by
                a same-colour round join. Nothing is sharp.
   BREATH       separate parts of one object hold 2.5 units apart; parts of the
                same object overlap and fuse.
   THE PIN      one accent incident per child, four in the parent: an accent
                disc seated in a tile-coloured well cut into a glyph plane, so
                the perceivable edge is always ivory-on-teal (7.04:1) and the
                hue only names the product. Strip the accent and the pin becomes
                a clean knockout — the drawing keeps its meaning in one ink.
   PARENT       pho is the only architecture; the other four are portable
                objects that live inside it. At the full body it carries four
                of the component each child carries one of — an accent disc in
                a tile-coloured well. Below the crossover the count survives
                but the component does not: a 2.5-unit well ring is 0.6px at
                16px, so the parent’s four wells become four plain windows
                while the children keep their one well. The four-to-one
                inheritance is countable at every size; it is the same
                component only at the full body.                              */

const T = {                       // the two declared exceptions to the pin law
  phoWindows: 'the parent’s small body trades four pins for four windows — at 16px a 2.5-unit well ring is 0.6px and the four wells fuse into two slots, so below the crossover the four-to-one inheritance is still countable but it is no longer the same component the children carry',
  aidepostSlot: 'aidepost’s well is the slot itself, because the slot is the product',
};

export const MARKS = [
  {
    id: 'pho', name: 'Provider Hub Oregon', accent: '#0F5C5A', keyline: [46, 46],
    note: 'The eave over four rooms. The only architecture in the set — the other four are portable objects that live inside it — and the only mark carrying four of the pin each child carries one of. A countable inheritance: four rooms, four products, in product order. Below the crossover the four stay four, drawn as windows rather than as pins in wells.',
    status: 'redrawn',
    statusNote: `Gains the family tile, so it stops reading as a different system beside its four children; the parent signal moves to form. ${T.phoWindows}.`,
    // roof 9–22.5 · breath 2.5 · rooms 25–55, four r5.5 wells on a 15 × 14 pitch
    svg: (f, d) => `<rect width="64" height="64" rx="16" fill="${f}"/><path d="M32 10.5 L53.5 21 L10.5 21 Z" fill="${d}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/><rect x="15" y="25" width="34" height="30" rx="7.5" fill="${d}"/><circle cx="24.5" cy="33" r="5.5" fill="${f}"/><circle cx="24.5" cy="33" r="3" fill="#E0704F"/><circle cx="39.5" cy="33" r="5.5" fill="${f}"/><circle cx="39.5" cy="33" r="3" fill="#E19A2E"/><circle cx="24.5" cy="47" r="5.5" fill="${f}"/><circle cx="24.5" cy="47" r="3" fill="#6E8FE8"/><circle cx="39.5" cy="47" r="5.5" fill="${f}"/><circle cx="39.5" cy="47" r="3" fill="#D4699F"/>`,
    // four windows on 4-unit webs — 1.00px of clear tile at 16px, twice a well’s
    small: (f, d) => `<rect width="64" height="64" rx="16" fill="${f}"/><path d="M32 11 L53 20 L11 20 Z" fill="${d}" stroke="${d}" stroke-width="4" stroke-linejoin="round"/><rect x="13" y="24" width="38" height="31" rx="7.75" fill="${d}"/><rect x="20" y="28" width="10" height="9.5" rx="2.375" fill="#E0704F"/><rect x="34" y="28" width="10" height="9.5" rx="2.375" fill="#E19A2E"/><rect x="20" y="41.5" width="10" height="9.5" rx="2.375" fill="#6E8FE8"/><rect x="34" y="41.5" width="10" height="9.5" rx="2.375" fill="#D4699F"/>`,
  },
  {
    id: 'cohort', name: 'Cohort', accent: '#E0704F', keyline: [46, 36],
    note: 'The bed: a tall headboard, a pillow knocked out of the mattress, a low footboard and a real void underneath, so the silhouette is a bed and not a bench. The coral pin is the one resident who needs something this shift. Calm and factual; nothing is red.',
    status: 'proposed',
    statusNote: 'Replaces the vault’s five dots arranged as a C (open item #12). The dots read as a dice five or a loading spinner, died at 16px, and carried two metaphors — “five beds” and “a C” — fighting inside one shape; the counting of rooms moves to the parent’s four pins, where it belongs. Replacing a vault metaphor is a product decision, so this mark ships proposed, not settled.',
    svg: (f, d) => `<rect width="64" height="64" rx="16" fill="${f}"/><rect x="9" y="14" width="8.5" height="36" rx="2.125" fill="${d}"/><rect x="46.5" y="24" width="8.5" height="26" rx="2.125" fill="${d}"/><rect x="13" y="26" width="38" height="17" rx="4.25" fill="${d}"/><rect x="18.5" y="28.5" width="11" height="8" rx="2" fill="${f}"/><circle cx="38" cy="34.5" r="6" fill="${f}"/><circle cx="38" cy="34.5" r="3.5" fill="#E0704F"/>`,
    // keeps the pillow: without it the small body is a bare hospital-bed elevation
    small: (f, d) => `<rect width="64" height="64" rx="16" fill="${f}"/><rect x="9" y="14" width="9" height="36" rx="2.25" fill="${d}"/><rect x="46" y="24" width="9" height="26" rx="2.25" fill="${d}"/><rect x="13" y="26" width="38" height="18" rx="4.5" fill="${d}"/><rect x="17" y="28.5" width="9" height="8" rx="2" fill="${f}"/><circle cx="37" cy="35" r="6.5" fill="${f}"/><circle cx="37" cy="35" r="4" fill="#E0704F"/>`,
  },
  {
    id: 'careshop', name: 'CareShop', accent: '#E19A2E', keyline: [44, 44],
    note: 'The basket, kept from the vault and redrawn so it cannot be read as a padlock: a wide shallow bail where a shackle is narrow and tall, a full-width lip overhanging the body, and a 22° draft down to the foot. The amber pin is the item that is short or dated — the buy queue in one shape.',
    status: 'redrawn',
    statusNote: 'Same object as the shipped mark. The bail (chord 35 of a 44 rim), the overhanging rim and the draft are what kill the padlock read; the handle holds the family’s 2.5-unit breath gap above the rim, so it reads attached rather than sunk in.',
    svg: (f, d) => `<rect width="64" height="64" rx="16" fill="${f}"/><path d="M14.5 26 A18.1 18.1 0 0 1 49.5 26" fill="none" stroke="${d}" stroke-width="5" stroke-linecap="round"/><rect x="10" y="31" width="44" height="5" rx="1.25" fill="${d}"/><path d="M14.5 36.75 H49.5 L43 52.5 H21 Z" fill="${d}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="44.5" r="6" fill="${f}"/><circle cx="32" cy="44.5" r="3.5" fill="#E19A2E"/>`,
    small: (f, d) => `<rect width="64" height="64" rx="16" fill="${f}"/><path d="M14.5 26.5 A18.1 18.1 0 0 1 49.5 26.5" fill="none" stroke="${d}" stroke-width="6" stroke-linecap="round"/><rect x="10" y="32" width="44" height="6" rx="1.5" fill="${d}"/><path d="M14.5 38.5 H49.5 L43 52 H21 Z" fill="${d}" stroke="${d}" stroke-width="4" stroke-linejoin="round"/><circle cx="32" cy="45" r="6.5" fill="${f}"/><circle cx="32" cy="45" r="4" fill="#E19A2E"/>`,
  },
  {
    id: 'binderkit', name: 'Binderkit', accent: '#6E8FE8', keyline: [38, 46],
    note: 'The punched sheet with index tabs. The tabs are drawn in the glyph colour and overlap the page edge, so the union is a page with three bumps rather than notches cut into it. The periwinkle pin is the line that is derived rather than cited, and the re-plan banner.',
    status: 'redrawn',
    statusNote: 'Same object as the shipped mark, with the metaphor turned the right way round: the tabs project instead of notching, the two punches sit symmetric about the centre instead of one orphan ring, and every radius moves onto the family law (page 7.5, tabs 2.5).',
    svg: (f, d) => `<rect width="64" height="64" rx="16" fill="${f}"/><rect x="41" y="14" width="10" height="10" rx="2.5" fill="${d}"/><rect x="41" y="27" width="10" height="10" rx="2.5" fill="${d}"/><rect x="41" y="40" width="10" height="10" rx="2.5" fill="${d}"/><rect x="13" y="9" width="30" height="46" rx="7.5" fill="${d}"/><circle cx="18.5" cy="18" r="2.5" fill="${f}"/><circle cx="18.5" cy="46" r="2.5" fill="${f}"/><rect x="25" y="16.5" width="13" height="2.5" rx="1.25" fill="${f}"/><rect x="25" y="23" width="13" height="2.5" rx="1.25" fill="${f}"/><rect x="25" y="29.5" width="9" height="2.5" rx="1.25" fill="${f}"/><circle cx="31.5" cy="42.5" r="6" fill="${f}"/><circle cx="31.5" cy="42.5" r="3.5" fill="#6E8FE8"/>`,
    // Below the crossover the sheet drops its rules and punches and keeps the
    // pin; the tabs shed half a unit of height each so their gutters open from
    // 3.0 to 4.0 units — 1.00px at 16px, the family clearance floor.
    small: (f, d) => `<rect width="64" height="64" rx="16" fill="${f}"/><rect x="41" y="14.5" width="10" height="9" rx="2.25" fill="${d}"/><rect x="41" y="27.5" width="10" height="9" rx="2.25" fill="${d}"/><rect x="41" y="40.5" width="10" height="9" rx="2.25" fill="${d}"/><rect x="13" y="9" width="30" height="46" rx="7.5" fill="${d}"/><circle cx="28" cy="32" r="8" fill="${f}"/><circle cx="28" cy="32" r="5" fill="#6E8FE8"/>`,
  },
  {
    id: 'aidepost', name: 'Aidepost', accent: '#D4699F', keyline: [46, 38],
    note: 'The shift board: a plate with a sunken field, five cards in it — taken — and one position empty but for the orchid pin. Covered or not is the whole emotion of the product, and here it is a shape before it is a colour, so it survives with no hue at all.',
    status: 'redrawn',
    statusNote: `Reinterprets the vault’s week board as one object rather than six floating cells. The five cards are the correction, and they had to be cards: rendered, a plate with six knockout slots and one disc reads as six empty frames of which one is filled — the inverse of what the product means. On a sunken field the ivory says “taken” and the gap says “open”. ${T.aidepostSlot}.`,
    // plate 46 × 38 · field 40 × 31.5 sunk 3 inside it · six 10 × 12 positions on 2.5 gutters
    svg: (f, d) => `<rect width="64" height="64" rx="16" fill="${f}"/><rect x="9" y="13" width="46" height="38" rx="9.5" fill="${d}"/><rect x="12" y="16.25" width="40" height="31.5" rx="7.875" fill="${f}"/><rect x="14.5" y="18.75" width="10" height="12" rx="2.5" fill="${d}"/><rect x="27" y="18.75" width="10" height="12" rx="2.5" fill="${d}"/><rect x="39.5" y="18.75" width="10" height="12" rx="2.5" fill="${d}"/><rect x="14.5" y="33.25" width="10" height="12" rx="2.5" fill="${d}"/><rect x="27" y="33.25" width="10" height="12" rx="2.5" fill="${d}"/><circle cx="44.5" cy="39.25" r="3.5" fill="#D4699F"/>`,
    // The same 3 × 2 as the full body at a coarser pitch, because the count IS
    // the claim and the claim has to survive the crossover: cards 7.3 × 7 inside
    // a 4-unit field margin, on 4-unit column gutters and an 8-unit row gutter.
    // The row gutter is doubled on purpose — at 16px a 4-unit gutter centred on
    // the axis straddles two pixel rows at half cover and greys out, so the two
    // rows fuse into bars and the five stop being countable; 28–36 lands on
    // whole pixel rows at 16px. Measured at a true 16px raster, not scaled down.
    small: (f, d) => `<rect width="64" height="64" rx="16" fill="${f}"/><rect x="9" y="13" width="46" height="38" rx="9.5" fill="${d}"/><rect x="13" y="17" width="38" height="30" rx="7.5" fill="${f}"/><rect x="17" y="21" width="7.3" height="7" rx="1.75" fill="${d}"/><rect x="28.35" y="21" width="7.3" height="7" rx="1.75" fill="${d}"/><rect x="39.7" y="21" width="7.3" height="7" rx="1.75" fill="${d}"/><rect x="17" y="36" width="7.3" height="7" rx="1.75" fill="${d}"/><rect x="28.35" y="36" width="7.3" height="7" rx="1.75" fill="${d}"/><circle cx="43.35" cy="39.5" r="3.5" fill="#D4699F"/>`,
  },
];

export const ACCENT_HEXES = ['#E0704F', '#E19A2E', '#6E8FE8', '#D4699F'];
