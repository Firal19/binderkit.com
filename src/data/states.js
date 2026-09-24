// The four words each product owns for the state of its own work.
// Lifted verbatim from the system board (src/board/derive.js).

export const STATE_SETS = {
  pho: [
    ['attention', 'Needs attention', 'escalated', 'A module is waiting on the organisation, not on a house.'],
    ['inFlight', 'In flight', 'attention', 'Started and running; the roll-up is counting it.'],
    ['settled', 'Settled', 'settled', 'Closed, with who and when.'],
    ['paused', 'Paused', 'inert', 'Deliberately held; it is not late, it is stopped.'],
  ],
  cohort: [
    ['due', 'Due', 'attention', 'A dose this shift has not been signed yet.'],
    ['overdue', 'Overdue', 'escalated', 'Past its window and still unsigned — deeper coral, never red.'],
    ['given', 'Given', 'settled', 'Signed, with who and when, under the Six Rights dialog.'],
    ['held', 'Held', 'inert', 'Withheld on purpose, with a reason attached.'],
  ],
  careshop: [
    ['short', 'Short', 'escalated', 'Below the par the provider set; it is in the buy queue.'],
    ['expiring', 'Expiring', 'attention', 'Dated inside the window and still on the shelf.'],
    ['stocked', 'Stocked', 'settled', 'At or above par, nothing to do.'],
    ['over', 'Over', 'inert', 'More than the shelf needs — a note, not an alarm.'],
  ],
  binderkit: [
    ['verified', 'Verified', 'settled', 'The authority was read and it matches the item.'],
    ['derived', 'Derived', 'offered', 'Inferred from the licence track; it says so until verified.'],
    ['unverified', 'Unverified', 'escalated', 'No authority attached yet — the citation mark.'],
    ['superseded', 'Kept', 'inert', 'Replaced by a later control number; kept, not deleted.'],
  ],
  aidepost: [
    ['covered', 'Covered', 'settled', 'A person is on it, by name.'],
    ['open', 'Open', 'attention', 'Nobody is on it yet — offer it to own staff, then post outward.'],
    ['pending', 'Pending', 'offered', 'Offered and awaiting an answer.'],
 ['expired', 'Expired', 'borrowed', 'An expired credential turns coral on the roster, naming the credential and the date it ran out.'],
  ],
};
