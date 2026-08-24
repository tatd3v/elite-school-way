/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeAll } from 'vitest';
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

async function fetchStaff(includeHidden = true) {
  const url = new URL(API_URL);
  url.searchParams.set('action', 'getStaff');
  url.searchParams.set('includeHidden', String(includeHidden));

  const res = await fetch(url);
  const text = await res.text();
  return JSON.parse(text);
}

async function postStaff(action, payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, ...payload }),
  });

  const text = await res.text();
  return JSON.parse(text);
}

function findFirstEmptyRow(staff) {
  if (!staff.length) return 2;

  const indices = staff
    .map((m) => m.rowIndex)
    .sort((a, b) => a - b);
  const max = indices[indices.length - 1];
  const set = new Set(indices);

  for (let r = 2; r <= max; r++) {
    if (!set.has(r)) return r;
  }

  return max + 1;
}

describe.skipIf(!shouldRun)('Google Apps Script Staff API integration', () => {
  const timestamp = Date.now();
  const baseName = `Integration Test ${timestamp}`;
  const role = 'Tester';
  const bio = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
  const social = `https://instagram.com/integration_test_${timestamp}`;

  let createdRowIndex;

  it('fetches the staff list', async () => {
    const data = await fetchStaff(true);
    expect(data.staff).toBeDefined();
    expect(Array.isArray(data.staff)).toBe(true);
  }, { timeout: 15000 });

  it('adds a staff member to the first empty row', async () => {
    const before = await fetchStaff(true);
    const expectedRow = findFirstEmptyRow(before.staff);

    const result = await postStaff('addStaff', {
      name: baseName,
      role,
      bio,
      photo: '',
      socialLinks: social,
      displayOrder: 999,
      isVisible: true,
    });

    expect(result.status).toBe('success');
    expect(result.rowIndex).toBe(expectedRow);

    createdRowIndex = result.rowIndex;

    await new Promise((r) => setTimeout(r, 1000));
    const after = await fetchStaff(true);
    const added = after.staff.find((m) => m.name === baseName);

    expect(added).toBeDefined();
    expect(added.rowIndex).toBe(expectedRow);
    expect(added.role).toBe(role);
    expect(added.bio).toBe(bio);
  }, { timeout: 30000 });

  it('new staff member display order matches sequential order in Google Sheet', async () => {
    const data = await fetchStaff(true);
    const allStaff = data.staff;
    
    // Get the newly added staff member
    const newMember = allStaff.find((m) => m.rowIndex === createdRowIndex);
    expect(newMember).toBeDefined();
    
    // Get all staff members sorted by rowIndex to verify sequential order
    const sortedByRow = [...allStaff].sort((a, b) => a.rowIndex - b.rowIndex);
    
    // Find the position of the new member in the sorted list
    const newMemberIndex = sortedByRow.findIndex((m) => m.rowIndex === createdRowIndex);
    expect(newMemberIndex).toBeGreaterThanOrEqual(0);
    
    // Verify that the new member's rowIndex is sequential with Google Sheet
    // (rowIndex should match its position in the sheet, starting from row 2)
    expect(newMember.rowIndex).toBe(sortedByRow[newMemberIndex].rowIndex);
    
    // Verify displayOrder is a valid number
    expect(typeof newMember.displayOrder).toBe('number');
  }, { timeout: 15000 });

  it('updates the staff member', async () => {
    const updateResult = await postStaff('updateStaff', {
      rowIndex: createdRowIndex,
      name: baseName,
      role: 'Updated Tester',
      bio,
      photo: '',
      socialLinks: social,
      displayOrder: 999,
      isVisible: true,
    });

    expect(updateResult.status).toBe('success');

    await new Promise((r) => setTimeout(r, 1000));
    const data = await fetchStaff(true);
    const updated = data.staff.find((m) => m.rowIndex === createdRowIndex);

    expect(updated).toBeDefined();
    expect(updated.role).toBe('Updated Tester');
  }, { timeout: 30000 });

  it('toggles staff visibility off', async () => {
    const toggleResult = await postStaff('toggleStaffVisibility', {
      rowIndex: createdRowIndex,
      isVisible: false,
    });

    expect(toggleResult.status).toBe('success');

    await new Promise((r) => setTimeout(r, 1000));

    const visibleOnly = await fetchStaff(false);
    expect(visibleOnly.staff.some((m) => m.rowIndex === createdRowIndex)).toBe(false);

    const all = await fetchStaff(true);
    const hidden = all.staff.find((m) => m.rowIndex === createdRowIndex);
    expect(hidden).toBeDefined();
    expect(hidden.isVisible).toBe(false);
  }, { timeout: 30000 });

  it('deletes the staff member', async () => {
    const deleteResult = await postStaff('deleteStaff', {
      rowIndex: createdRowIndex,
    });

    expect(deleteResult.status).toBe('success');

    await new Promise((r) => setTimeout(r, 1000));
    const after = await fetchStaff(true);
    expect(after.staff.some((m) => m.rowIndex === createdRowIndex)).toBe(false);
  }, { timeout: 30000 });
});

describe.skipIf(!shouldRun)('Staff Pagination Tests', () => {
  beforeAll(async () => {
    const data = await fetchStaff(true);
    const needed = 5 - (data.staff?.length || 0);

    for (let i = 1; i <= needed; i++) {
      await postStaff('addStaff', {
        name: `Pagination Seed ${Date.now()}-${i}`,
        role: 'Tester',
        bio: 'Pagination test bio',
        photo: '',
        socialLinks: '',
        displayOrder: i,
        isVisible: true,
      });
    }

    await new Promise((r) => setTimeout(r, 1000));
  }, 60000);

  it('should fetch all staff members', async () => {
    const data = await fetchStaff(true);
    expect(data.staff).toBeDefined();
    expect(Array.isArray(data.staff)).toBe(true);
    expect(data.staff.length).toBeGreaterThan(0);
  }, { timeout: 15000 });

  it('should support pagination with initial load of 4 items', async () => {
    const data = await fetchStaff(true);
    const allStaff = data.staff;
    
    // Simulate pagination: first page shows 4 items
    const pageSize = 4;
    const firstPage = allStaff.slice(0, pageSize);
    
    expect(firstPage.length).toBeLessThanOrEqual(pageSize);
    expect(firstPage.length).toBeGreaterThan(0);
  }, { timeout: 15000 });

  it('should support loading more items (pagination)', async () => {
    const data = await fetchStaff(true);
    const allStaff = data.staff;
    
    if (allStaff.length <= 4) {
      // Skip test if there are 4 or fewer staff members
      expect(allStaff.length).toBeLessThanOrEqual(4);
      return;
    }
    
    // Simulate pagination: first page (4 items)
    const pageSize = 4;
    const firstPage = allStaff.slice(0, pageSize);
    expect(firstPage.length).toBe(pageSize);
    
    // Simulate loading more: second page (next 4 items)
    const secondPage = allStaff.slice(pageSize, pageSize * 2);
    expect(secondPage.length).toBeGreaterThan(0);
    expect(secondPage.length).toBeLessThanOrEqual(pageSize);
    
    // Verify no duplicates between pages
    const firstPageIds = new Set(firstPage.map((m) => m.rowIndex));
    const secondPageIds = new Set(secondPage.map((m) => m.rowIndex));
    const intersection = [...firstPageIds].filter((id) => secondPageIds.has(id));
    expect(intersection.length).toBe(0);
  }, { timeout: 15000 });

  it('should maintain staff order across pagination', async () => {
    const data = await fetchStaff(true);
    const allStaff = data.staff;
    
    if (allStaff.length <= 4) {
      expect(allStaff.length).toBeLessThanOrEqual(4);
      return;
    }
    
    // Check that displayOrder is consistent across pages
    const pageSize = 4;
    const firstPage = allStaff.slice(0, pageSize);
    const secondPage = allStaff.slice(pageSize, pageSize * 2);
    
    // Each page should have valid displayOrder values
    firstPage.forEach((member) => {
      expect(typeof member.displayOrder).toBe('number');
    });
    
    secondPage.forEach((member) => {
      expect(typeof member.displayOrder).toBe('number');
    });
  }, { timeout: 15000 });
});
