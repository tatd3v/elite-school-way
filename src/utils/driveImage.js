/**
 * Google Drive "share" links (e.g. the ones you get from "Share" > "Copy link")
 * point to an HTML viewer page, not the raw image bytes, so they don't work
 * as an <img src="..."> value. This converts common Drive share link formats
 * into a direct-viewable thumbnail URL. Non-Drive URLs are returned as-is.
 *
 * Supported input formats:
 *  - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *  - https://drive.google.com/open?id=FILE_ID
 *  - https://drive.google.com/uc?id=FILE_ID&export=view
 *
 * Note: the file must be shared as "Anyone with the link" for this to work.
 *
 * @param {string} url
 * @returns {string}
 */
export function toDirectImageUrl(url) {
  if (typeof url !== 'string' || url.trim() === '') return url;

  const trimmed = url.trim();

  if (!trimmed.includes('drive.google.com')) {
    return trimmed;
  }

  let fileId = null;

  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  } else {
    try {
      const parsed = new URL(trimmed);
      fileId = parsed.searchParams.get('id');
    } catch {
      fileId = null;
    }
  }

  if (!fileId) return trimmed;

  // For Google Drive files shared with "Anyone with the link", the thumbnail
  // endpoint is usually the most reliable direct image format.
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

/**
 * Returns a list of candidate direct-image URLs to try, in order of
 * reliability, for a given (possibly Drive share link) URL. Used to build
 * an onError fallback chain in the UI, since no single Drive embed format
 * is 100% reliable for every file/sharing configuration.
 *
 * @param {string} url
 * @returns {string[]}
 */
export function getDriveImageCandidates(url) {
  if (typeof url !== 'string' || url.trim() === '') return [];

  const trimmed = url.trim();

  if (!trimmed.includes('drive.google.com')) {
    return [trimmed];
  }

  let fileId = null;
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  } else {
    try {
      fileId = new URL(trimmed).searchParams.get('id');
    } catch {
      fileId = null;
    }
  }

  if (!fileId) return [trimmed];

  return [
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://lh3.googleusercontent.com/d/${fileId}=w1000`,
  ];
}
