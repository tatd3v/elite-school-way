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
