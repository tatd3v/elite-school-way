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

Located in: `src/tests/`

- `setup.js` — Test environment configuration
- `appsScript.integration.test.js` — Integration tests for Google Apps Script staff endpoints
- `registrations.integration.test.js` — Integration tests for registration submissions

## Tests Available

- Fetch registrations
- Add/delete registrations
- Fetch staff
- Add staff member
- Update staff member
- Delete staff member

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
4. **Mock external dependencies** — Don't rely on real Google Sheets
5. **Clean up after tests** — Use `afterEach()` to reset state
6. **Test edge cases** — Empty arrays, null values, errors
7. **Keep tests fast** — Avoid long timeouts, use mocks

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
- [Testing Library](https://testing-library.com/)
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
