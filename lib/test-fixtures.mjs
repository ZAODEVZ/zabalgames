// Is this submission a test fixture? One source, used by every consumer.
//
// WHY THIS EXISTS. QA rows seeded while the ballot was being built went live on the public
// board, and one of them ranked #2 on the public artist standings. The stopgap was a hardcoded
// denylist - and it got duplicated, in two different key formats:
//
//   api/submissions.mjs   QA_FIXTURES = new Set(['5', '6'])
//   api/qv-vote.mjs       EXCLUDED    = new Set(['artist:5', 'creator:6'])
//
// Two hand-maintained copies of the same fact, one of which also needs you to know the row's
// TRACK. The failure mode writes itself: seed a QA row, remember one file, forget the other,
// and it is votable. docs/season-2-ideas.md lists this under "do not repeat" as "mixing test
// data into live state".
//
// So detection is by MARKER, not by id. A new QA row is excluded the moment it exists, with no
// code change and no second file to remember. The three real fixtures in the store were read
// before choosing the markers - this is not a guess at what a test row looks like:
//
//   id 1   promptId: 'wip-test'   "E2E test draft from the build terminal - safe to reject."
//   id 5   promptId: 'project'    "[QA TEST - please delete] A short pixel-art animation loop"
//   id 6   promptId: 'project'    "[QA TEST - please delete] A short written piece"
//
// id 1 is caught by its promptId; 5 and 6 only by the text marker. Both paths are needed.
//
// THE DURABLE FIX IS STILL DELETING THE ROWS at /review. This keeps them off every surface
// until someone does, and stops the next ones reaching a surface at all.

// An explicit prefix anyone can use deliberately when seeding a fixture.
export const TEST_MARKERS = ['[QA TEST', '[TEST]', '[FIXTURE'];

// promptIds that only ever exist for testing. Matched case-insensitively, prefix-wise, so
// `wip-test`, `test`, `test-2` and `TEST-anything` all count.
const TEST_PROMPT_RE = /^(wip-test|test)\b|-test$/i;

// Legacy backstop. These rows predate the markers... except they do not: both carry
// "[QA TEST" and are caught by the marker path above. They are listed anyway so that deleting
// or editing the marker out of a row cannot silently make it votable again, and so this file
// documents which ids were actually involved. Remove an id here only when the row is GONE.
export const LEGACY_TEST_IDS = new Set(['1', '5', '6']);

// Fields worth scanning for a marker. `answer` is the free-text body; `project` and
// `description` are the rendered title/blurb.
const TEXT_FIELDS = ['answer', 'project', 'description', 'title'];

function hasTextMarker(sub) {
  for (const f of TEXT_FIELDS) {
    const v = sub && sub[f];
    if (typeof v === 'string' && TEST_MARKERS.some((m) => v.toUpperCase().includes(m.toUpperCase()))) return true;
  }
  const fields = sub && sub.fields;
  if (fields && typeof fields === 'object') {
    for (const f of TEXT_FIELDS) {
      const v = fields[f];
      if (typeof v === 'string' && TEST_MARKERS.some((m) => v.toUpperCase().includes(m.toUpperCase()))) return true;
    }
  }
  return false;
}

// The single predicate. Pass a submission object; get true if it must never reach a public
// surface, a ballot, or a count.
export function isTestFixture(sub) {
  if (!sub || typeof sub !== 'object') return false;
  if (sub.test === true || sub.isTest === true) return true;               // explicit opt-in
  if (typeof sub.promptId === 'string' && TEST_PROMPT_RE.test(sub.promptId)) return true;
  if (sub.id != null && LEGACY_TEST_IDS.has(String(sub.id))) return true;  // backstop
  if (hasTextMarker(sub)) return true;
  return false;
}

// For call sites that only hold an id - the qv-vote tally read iterates ZSET members, which are
// bare ids with no row attached. Deliberately NOT track-prefixed: the old EXCLUDED set required
// knowing the track, which is one more thing to get wrong for no benefit.
export function isTestFixtureId(id) {
  return id != null && LEGACY_TEST_IDS.has(String(id));
}

export default isTestFixture;
