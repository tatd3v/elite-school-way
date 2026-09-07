# Testing Guide - Vitest Only

Run tests locally using Vitest with npm scripts.

## Quick Start

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode (re-run on changes)
npm run test:ui          # Interactive UI
```

## Available Commands

```bash
npm run test              # Run all tests once and exit
npm run test:watch       # Watch mode (re-run on file changes)
npm run test:ui          # Interactive UI (http://localhost:51204)
npm run test -- --grep "pattern"  # Run tests matching pattern
npm run test -- file.test.js      # Run specific test file
```

## Test Output

### Standard Output
```
✓ src/tests/appsScript.integration.test.js (5 tests) 22461ms

Test Files  1 passed (1)
     Tests  5 passed (5)
```

### Watch Mode
```bash
npm run test:watch
```

Automatically re-runs tests when you modify files. Press `q` to quit.

### Interactive UI
```bash
npm run test:ui
```

Opens http://localhost:51204 with:
- Visual test explorer
- Click to run individual tests
- Detailed test output
- Debug mode support

## Test Files

Located in: `src/tests/`. There are two distinct categories — don't mix their conventions:

### Live backend integration tests
Hit the **real, deployed** Google Apps Script backend over the network. Each file starts with `describe.skipIf(!shouldRun)`, where `shouldRun` is `true` only if `VITE_GOOGLE_SCRIPT_URL` is set (via `.env` or the environment) — so these silently skip (not fail) if you don't have a backend configured. Because they share one live Google Sheet, **both files must run sequentially, not in parallel** — see `vitest.config.js`'s `fileParallelism: false` and the note in `AGENTS.md`'s "Known fragile areas". Don't "optimize" that setting away.

- `appsScript.integration.test.js` — staff endpoints (fetch/add/update/toggle-visibility/delete) + staff pagination
- `registrations.integration.test.js` — registration submissions (add/delete, duplicates) + registration pagination

### Component tests (jsdom, no network)
Render the actual Preact components with `preact`'s `render`/`h` and `preact/test-utils`'s `act` — no `@testing-library`, that's not a project dependency. External calls are mocked with `vi.mock` (or avoided entirely by passing data via props, e.g. `StaffManagementSection`'s `staff` prop).

- `adminDashboardPagination.test.js` — mocks `dashboardService`, verifies `AdminDashboard`'s Participantes pagination (independent mobile "Cargar más" vs. desktop `currentPage`) and the sticky mobile header
- `staffManagementSectionPagination.test.js` — passes `staff` directly via props (no fetch), verifies the same pagination/sticky-header behavior for Staff

## Tests Available

- Fetch/add/update/delete registrations, staff members
- Registration and staff pagination (backend-level slicing sanity checks)
- `AdminDashboard`/`StaffManagementSection` pagination and sticky-header behavior (component-level, mocked)

## Writing Tests

### Test Structure
```javascript
import { describe, it, expect } from 'vitest';
import { dashboardService } from '../services/dashboardService';

describe('Staff Operations', () => {
  it('should add a staff member', async () => {
    const member = {
      name: 'Test Staff',
      role: 'Instructor',
      bio: 'Test bio',
      photo: '',
      socialLinks: '@test',
      displayOrder: 1,
      isVisible: true,
    };

    const result = await dashboardService.addStaff(member);

    expect(result.success).toBe(true);
    expect(result.rowIndex).toBeGreaterThan(0);
  });
});
```

### Common Assertions
```javascript
expect(value).toBe(expected)           // Strict equality
expect(value).toEqual(expected)        // Deep equality
expect(value).toBeTruthy()             // Truthy value
expect(value).toBeFalsy()              // Falsy value
expect(array).toContain(item)          // Array contains
expect(fn).toThrow()                   // Function throws
expect(promise).rejects.toThrow()      // Promise rejects
```

## Best Practices

1. **Test one thing per test** — Keep tests focused
2. **Use descriptive names** — `it('should add staff member with valid data')`
3. **Arrange, Act, Assert** — Setup → Execute → Verify
4. **Mock external dependencies for component tests** — `adminDashboardPagination.test.js`/`staffManagementSectionPagination.test.js` mock/avoid `dashboardService` so they run instantly with no network. The two `*.integration.test.js` files are the deliberate exception — they intentionally hit the real Google Sheets backend to catch deployment drift (e.g. stale field names) that mocks would hide; don't "fix" them by mocking the API.
5. **Clean up after tests** — Integration tests that create rows should delete them afterward (or in a later step of the same `it`) so the live sheet doesn't accumulate stray test data across runs
6. **Test edge cases** — Empty arrays, null values, errors
7. **Keep component tests fast** — Avoid long timeouts, use mocks; integration tests are inherently slower (real network calls) — that's expected

## Troubleshooting

### Tests Not Running
```bash
npm install
npm run test
```

### Tests Timing Out
Increase timeout in test:
```javascript
it('should do something', async () => {
  // test code
}, 10000); // 10 second timeout
```

### Tests Failing
1. Check `.env` has `VITE_GOOGLE_SCRIPT_URL`
2. Verify Google Apps Script deployment is current
3. Check network connectivity
4. Run with verbose output:
   ```bash
   npm run test -- --reporter=verbose
   ```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Preact Test Utils](https://preactjs.com/guide/v10/preact-testing-library/) (`preact/test-utils`'s `act`, used directly — no `@testing-library` wrapper is installed)
- [Jest Matchers](https://vitest.dev/api/expect.html)

## Summary

| Command | Purpose |
|---------|---------|
| `npm run test` | Run all tests |
| `npm run test:watch` | Watch mode |
| `npm run test:ui` | Interactive UI |
| `npm run test -- --grep "pattern"` | Run tests matching pattern |
| `npm run test -- file.test.js` | Run specific file |

Use `npm run test:watch` during development!
