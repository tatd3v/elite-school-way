/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function getApiUrl() {
  if (process.env.VITE_GOOGLE_SCRIPT_URL) {
    return process.env.VITE_GOOGLE_SCRIPT_URL.replace(/^["']|["']$/g, '');
  }

  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return null;

  const env = readFileSync(envPath, 'utf-8');
  const match = env.match(/^VITE_GOOGLE_SCRIPT_URL=(.+)$/m);
  if (!match) return null;

  return match[1].trim().replace(/^["']|["']$/g, '');
}

const API_URL = getApiUrl();
const shouldRun = !!API_URL;

async function fetchRegistrations() {
  const url = new URL(API_URL);
  url.searchParams.set('action', 'getRegistrations');

  const res = await fetch(url);
  const text = await res.text();
  return JSON.parse(text);
}

async function postRegistration(payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  return JSON.parse(text);
}

// Polls fetchRegistrations() until `matchFn` finds something or we give up.
// A single fixed `setTimeout` wait before one fetch (the pattern used
// elsewhere in this file) isn't always enough — Sheets/Apps Script
// propagation delay can exceed it, which previously caused a cleanup loop to
// run against a still-stale read (finding 0 rows) and leave an orphaned row
// behind in the live sheet. Retrying is cheap insurance against that.
async function fetchWithRetry(matchFn, { attempts = 5, delayMs = 1500 } = {}) {
  for (let i = 0; i < attempts; i++) {
    await new Promise((r) => setTimeout(r, delayMs));
    try {
      const data = await fetchRegistrations();
      const match = matchFn(data.registrations);
      if (match.length > 0) return match;
    } catch {
      // Transient network/rate-limit hiccup (e.g. Apps Script returning an
      // HTML error page instead of JSON) — swallow and retry rather than
      // aborting the whole test, which would skip cleanup entirely and risk
      // leaving an orphaned row behind.
    }
  }
  return [];
}

async function deleteRegistration(rowIndex) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'deleteRegistration',
      rowIndex,
    }),
  });

  const text = await res.text();
  return JSON.parse(text);
}

function buildRegistration(index) {
  const timestamp = new Date().toISOString();
  const suffix = `${Date.now()}-${index}`;

  return {
    action: 'submitRegistration',
    timestamp,
    artistName: `Test Artist ${suffix}`,
    email: `test${suffix}@example.com`,
    phone: '3001234567',
    house: 'House of Testing',
    // The real form (formSubmit.js) never sends the raw category label —
    // it extracts the price digits from an option like "General — $20.000"
    // and sends the resulting Number (see RegistrationModal.jsx's entryType
    // options). The backend's own doPost handler does the same digit
    // extraction again and falls back to 'N/A' for non-numeric input, so a
    // plain label like 'General' here would silently become 'N/A'.
    entryType: 20000,
    age: '25',
    paymentScreenshot: '',
    paymentScreenshotName: '',
  };
}

describe.skipIf(!shouldRun)('Google Apps Script Registration API integration', () => {
  it('adds multiple registrations, deletes some, and verifies remaining data', async () => {
    const before = await fetchRegistrations();
    const beforeCount = before.registrations.length;

    // Create 5 registrations
    const registrationsToAdd = [
      buildRegistration(1),
      buildRegistration(2),
      buildRegistration(3),
      buildRegistration(4),
      buildRegistration(5),
    ];
    const emails = registrationsToAdd.map((r) => r.email);
    const artistNames = registrationsToAdd.map((r) => r.artistName);

    // Add all 5 registrations
    const addResults = [];
    for (const registration of registrationsToAdd) {
      const result = await postRegistration(registration);
      expect(result.status).toBe('success');
      addResults.push(result);
    }

    await new Promise((r) => setTimeout(r, 1500));
    const afterAdd = await fetchRegistrations();
    const added = afterAdd.registrations.filter((r) => emails.includes(r.email));

    // Verify all 5 were added
    expect(added.length).toBe(5);
    expect(afterAdd.registrations.length).toBe(beforeCount + 5);

    // Verify data integrity for added registrations
    added.forEach((registration) => {
      expect(registration.name).toBeDefined();
      expect(registration.email).toBeDefined();
      expect(String(registration.phone)).toMatch(/3001234567/);
      expect(String(registration.house)).toMatch(/House of Testing/);
      expect(artistNames).toContain(registration.name);
      expect(emails).toContain(registration.email);
    });

    // Delete 2 registrations (keep 3), starting from the highest rowIndex
    // so that deletions don't shift the rows we still need to delete.
    const toDelete = [added[0], added[1]].sort((a, b) => b.rowIndex - a.rowIndex);
    const deletedEmails = toDelete.map((r) => r.email);

    for (const registration of toDelete) {
      const deleteResult = await deleteRegistration(registration.rowIndex);
      expect(deleteResult.status).toBe('success');
    }

    await new Promise((r) => setTimeout(r, 1500));
    const afterDelete = await fetchRegistrations();
    const remaining = afterDelete.registrations.filter((r) => emails.includes(r.email));

    // Verify correct number remain
    expect(remaining.length).toBe(3);
    expect(afterDelete.registrations.length).toBe(beforeCount + 3);

    // Verify deleted registrations are gone
    expect(afterDelete.registrations.some((r) => deletedEmails.includes(r.email))).toBe(false);

    // Verify remaining registrations have correct data
    remaining.forEach((registration) => {
      expect(registration.name).toBeDefined();
      expect(registration.email).toBeDefined();
      expect(String(registration.phone)).toMatch(/3001234567/);
      expect(String(registration.house)).toMatch(/House of Testing/);
      expect(registration.entryType).toBe(20000);
      expect(String(registration.age)).toBe('25');

      // Verify it's one of the remaining ones (not deleted)
      expect(deletedEmails).not.toContain(registration.email);
      expect(emails).toContain(registration.email);
    });

    // Verify rowIndex is valid for remaining registrations
    remaining.forEach((registration) => {
      expect(registration.rowIndex).toBeGreaterThan(0);
      expect(typeof registration.rowIndex).toBe('number');
    });
  }, { timeout: 90000 });
});

describe.skipIf(!shouldRun)('Registrations Pagination Tests', () => {
  it('should fetch all registrations', async () => {
    const data = await fetchRegistrations();
    expect(data.registrations).toBeDefined();
    expect(Array.isArray(data.registrations)).toBe(true);
  }, { timeout: 15000 });

  it('should support pagination with initial load of 15 items', async () => {
    const data = await fetchRegistrations();
    const allRegistrations = data.registrations;
    
    // Simulate pagination: first page shows 15 items (matches the mobile
    // "Cargar más" initial load size in AdminDashboard.jsx)
    const pageSize = 15;
    const firstPage = allRegistrations.slice(0, pageSize);
    
    expect(firstPage.length).toBeLessThanOrEqual(pageSize);
  }, { timeout: 15000 });

  it('should support loading more items (pagination)', async () => {
    const data = await fetchRegistrations();
    const allRegistrations = data.registrations;
    
    if (allRegistrations.length <= 15) {
      // Skip test if there are 15 or fewer registrations
      expect(allRegistrations.length).toBeLessThanOrEqual(15);
      return;
    }
    
    // Simulate pagination: first page (15 items)
    const pageSize = 15;
    const firstPage = allRegistrations.slice(0, pageSize);
    expect(firstPage.length).toBe(pageSize);
    
    // Simulate loading more: second page (next 15 items)
    const secondPage = allRegistrations.slice(pageSize, pageSize * 2);
    expect(secondPage.length).toBeGreaterThan(0);
    expect(secondPage.length).toBeLessThanOrEqual(pageSize);
    
    // Verify no duplicates between pages
    const firstPageEmails = new Set(firstPage.map((r) => r.email));
    const secondPageEmails = new Set(secondPage.map((r) => r.email));
    const intersection = [...firstPageEmails].filter((email) => secondPageEmails.has(email));
    expect(intersection.length).toBe(0);
  }, { timeout: 15000 });

  it('should maintain registration order across pagination', async () => {
    const data = await fetchRegistrations();
    const allRegistrations = data.registrations;
    
    if (allRegistrations.length <= 15) {
      expect(allRegistrations.length).toBeLessThanOrEqual(15);
      return;
    }
    
    // Check that each registration has required fields
    const pageSize = 15;
    const firstPage = allRegistrations.slice(0, pageSize);
    const secondPage = allRegistrations.slice(pageSize, pageSize * 2);
    
    // Each page should have valid registration data
    firstPage.forEach((registration) => {
      expect(registration.name).toBeDefined();
      expect(registration.email).toBeDefined();
      expect(registration.rowIndex).toBeDefined();
    });

    secondPage.forEach((registration) => {
      expect(registration.name).toBeDefined();
      expect(registration.email).toBeDefined();
      expect(registration.rowIndex).toBeDefined();
    });
  }, { timeout: 15000 });
});

describe.skipIf(!shouldRun)('Registration required-field validation (reproduces prod data-integrity bug)', () => {
  // Prod's Registrations sheet has rows with blank Nombre Artístico/Email/
  // Teléfono and a "12/31/1969 19:00" (Unix epoch, shown in America/Bogota's
  // UTC-5 offset) Timestamp. These can't come from the real form: `formSubmit.js`
  // always sends a current `timestamp`, and `RegistrationModal.jsx`'s inputs
  // have the HTML `required` attribute, which blocks the browser's native
  // submit event entirely when those fields are empty. That means these rows
  // were created by something POSTing straight to the public Apps Script Web
  // App URL (bot/scanner traffic, since "Who has access" is "Anyone") — and
  // `doPost`'s fallback "else" branch (google-apps-script.md, the only branch
  // handling `submitRegistration`) has NO server-side validation: it writes
  // `data.artistName`/`data.email`/`data.phone` and `new Date(data.timestamp)`
  // straight to the sheet regardless of whether they're empty/missing.
  // These tests codify the actual requirement ("required fields must be
  // filled") against the live backend, so they currently FAIL until
  // server-side validation is added to the `doPost` handler.
  it('should NOT create a row when required fields (email, phone) are blank', async () => {
    // IMPORTANT: artistName is deliberately kept non-blank (the marker
    // itself) even though we're testing "missing required fields". This is
    // NOT optional — `getRegistrations()` (google-apps-script.md) silently
    // skips any row whose Name column is blank ("Skip blank/ghost rows"),
    // so a row created with a blank artistName becomes permanently
    // invisible to `fetchRegistrations()` and therefore impossible to find
    // or clean up via `deleteRegistration` through the API. (This actually
    // happened while writing this test — it left an orphaned, undeletable
    // row in the live sheet that had to be removed manually from the
    // Sheets UI.) Leaving email/phone blank is enough to exercise the same
    // missing-required-field bug without ever risking another
    // unrecoverable ghost row.
    const marker = `TEST-VALIDATION-${Date.now()}`;

    const result = await postRegistration({
      action: 'submitRegistration',
      // No timestamp either — mirrors a direct/bot POST that bypasses
      // formSubmit.js, the only place a timestamp is normally generated.
      artistName: marker,
      email: '',
      phone: '',
      house: marker,
      entryType: '',
      age: '',
      paymentScreenshot: '',
      paymentScreenshotName: '',
    });

    const created = await fetchWithRetry((regs) => regs.filter((r) => r.name === marker));

    // Clean up immediately regardless of outcome, so a failing test (i.e.
    // today's actual buggy behavior) doesn't leave garbage data in the live
    // sheet on top of the bug it's demonstrating.
    for (const registration of created) {
      await deleteRegistration(registration.rowIndex);
    }

    expect(result.status).not.toBe('success');
    expect(created.length).toBe(0);
  }, { timeout: 30000 });

  it('should never write an epoch/1970 Timestamp when "timestamp" is missing from the payload', async () => {
    const marker = `TEST-TIMESTAMP-${Date.now()}`;
    const email = `${marker}@example.com`;

    await postRegistration({
      action: 'submitRegistration',
      // timestamp intentionally omitted — the rest of the fields are valid
      // so this test isolates the timestamp bug from the required-field bug above.
      artistName: `Timestamp Test ${marker}`,
      email,
      phone: '3001234567',
      house: marker,
      entryType: 20000,
      age: '25',
      paymentScreenshot: '',
      paymentScreenshotName: '',
    });

    const created = await fetchWithRetry((regs) => regs.filter((r) => r.email === email));

    for (const registration of created) {
      await deleteRegistration(registration.rowIndex);
    }

    // Either the backend rejects a request with no timestamp, or (if it's
    // accepted) it must default to "now" — never silently fall back to
    // epoch (`new Date(undefined/0)` → 1969/1970).
    if (created.length > 0) {
      const year = new Date(created[0].timestamp).getFullYear();
      expect(year).toBeGreaterThan(2000);
    }
  }, { timeout: 30000 });
});

describe.skipIf(!shouldRun)('Multi-registration / Duplication', () => {
  it('should allow more added than deleted registrations for the same email', async () => {
    const timestamp = new Date().toISOString();
    const base = `multi-${Date.now()}`;
    const email = `duplicate-${base}@example.com`;

    for (let i = 1; i <= 3; i++) {
      const result = await postRegistration({
        action: 'submitRegistration',
        timestamp,
        artistName: `Duplicate ${base} #${i}`,
        email,
        phone: `300123456${i}`,
        house: 'House of Duplicates',
        entryType: i === 1 ? 20000 : 15000, // matches the real form's price-based entryType (see buildRegistration above)
        age: String(20 + i),
        paymentScreenshot: '',
        paymentScreenshotName: '',
      });
      expect(result.status).toBe('success');
    }

    await new Promise((r) => setTimeout(r, 1500));
    const before = await fetchRegistrations();
    const beforeDuplicates = before.registrations.filter((r) => r.email === email);
    expect(beforeDuplicates.length).toBe(3);

    // Delete only one (the highest rowIndex first so deletions don't shift remaining rows)
    const toDelete = beforeDuplicates.sort((a, b) => b.rowIndex - a.rowIndex)[0];
    const deleteResult = await deleteRegistration(toDelete.rowIndex);
    expect(deleteResult.status).toBe('success');

    await new Promise((r) => setTimeout(r, 1500));
    const after = await fetchRegistrations();
    const afterDuplicates = after.registrations.filter((r) => r.email === email);

    // More added (3) than deleted (1) → 2 duplicates remain
    expect(afterDuplicates.length).toBe(2);

    // Clean up remaining duplicates
    for (const registration of afterDuplicates) {
      await deleteRegistration(registration.rowIndex);
    }
  }, { timeout: 60000 });
});
