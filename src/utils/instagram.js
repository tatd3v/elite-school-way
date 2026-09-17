/**
 * Instagram helpers.
 * The sheet stores the full profile URL (https://instagram.com/<handle>),
 * while the form inputs only collect the bare handle behind a fixed "@"
 * prefix — these helpers convert between the two shapes and clean up
 * pasted values like "@user", "instagram.com/user" or a full profile URL.
 */

/**
 * Reduce any accepted input (@handle, handle, instagram.com/handle,
 * full URL, legacy apostrophe-prefixed sheet value) to the bare handle.
 * @param {string} value
 * @returns {string} bare handle, or '' when there's nothing usable
 */
export function normalizeInstagramHandle(value) {
  if (!value) return '';
  const cleaned = String(value)
    .replace(/^'/, '')
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/^instagram\.com\//, '')
    .split('?')[0]
    .split('/')
    .filter(Boolean)
    .pop();
  return (cleaned || '').replace(/^@+/, '');
}

/**
 * Canonical profile URL saved to the sheet.
 * @param {string} value - any accepted instagram input
 * @returns {string} 'https://instagram.com/<handle>' or ''
 */
export function getInstagramProfileUrl(value) {
  const handle = normalizeInstagramHandle(value);
  return handle ? `https://instagram.com/${handle}` : '';
}

/**
 * Display-ready handle for the dashboard.
 * @param {string} value - any accepted instagram input
 * @returns {string} '@handle' or ''
 */
export function formatInstagramHandle(value) {
  const handle = normalizeInstagramHandle(value);
  return handle ? `@${handle}` : '';
}
