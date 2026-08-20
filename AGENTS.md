# Project Notes for AI Agents

Elite Way School — Ballroom event registration SPA. Preact + Vite + Tailwind frontend,
Google Sheets/Apps Script backend (no traditional server/DB).

## Tech stack & structure
- **Framework**: Preact (`preact/hooks`, `preact/compat` for `createPortal`), not React — imports must come from `preact/hooks` / `preact/compat`, not `react`.
- **Build**: Vite (`npm run dev`, `npm run build`, `npm run preview`).
- **Styling**: Tailwind CSS with a custom design-token config (colors like `on-surface`, `surface-container`, font sizes like `text-display-lg`, spacing like `px-margin-mobile`). `@tailwind`/`@apply` warnings from generic CSS linters in `src/index.css` are expected/harmless — Tailwind processes them at build time.
- **Routing**: `preact-router`.
- **Verification**: `npm run build` (or `npx vite build`) is the fast sanity check used throughout this project's history. Also available: `npm run lint`, `npm run test`.
- Run shell commands via `wsl -e bash -lc "cd ~/elite-school-way && ..."` — the repo is accessed through a WSL UNC path from Windows.

## Backend: Google Apps Script (`google-apps-script.md`)
This file is the **source of truth** for the backend script — it must be manually copy-pasted into the Google Apps Script editor (Extensions > Apps Script on the Google Sheet) and does not deploy automatically.

Key sheets (auto-created lazily on first use, not up front):
- **Registrations** — form submissions (`initializeSheet`)
- **Users** (formerly "Admins") — admin/viewer accounts (`initializeAdminsSheet`), columns: Email, Password Hash (SHA-256), Role, Name
- **Staff** — staff/faculty directory (`initializeStaffSheet`), columns: Name, Role, Bio, Photo URL, Social Links, Display Order, Is Visible

### Critical Apps Script gotchas (already hit and fixed multiple times — don't repeat)
1. **`ContentService` has NO `setHeader`/`addHeader` API.** Do not add CORS headers this way — it throws `TypeError: ... setHeader is not a function` at runtime (only surfaces when the deployed endpoint is actually hit, e.g. via `curl`, not from a code review). `createJsonResponse` must stay a plain `ContentService.createTextOutput(...).setMimeType(...)` with no header calls.
2. **CORS is handled by avoiding it entirely**, not by fixing headers:
   - Reads (`getRegistrations`, `getStaff`, `login`) go through **JSONP** (`src/utils/jsonp.js`, shared by `dashboardService.js` and `authService.js`) — loads response via a `<script>` tag, which sidesteps CORS. Apps Script's `doGet` supports a `callback` param for this.
   - Writes (form submit, staff update/delete/toggle) use `fetch` with `mode: 'no-cors'` and `Content-Type: 'text/plain'` (not `application/json`) to avoid triggering a preflight `OPTIONS` request, which Apps Script can't answer properly anyway.
   - Login (`AUTH_CONFIG.LOGIN_ACTION`) is sent as a JSONP **GET** (email/password as query params) — note this means credentials are visible in browser history/server logs; acceptable for this project's low-stakes admin demo but flagged as a real trade-off.
3. **Editing the Apps Script code and saving does NOT update the live deployment.** You must explicitly go to **Deploy → Manage deployments → (pencil/edit icon) → Version: "New version" → Deploy**. Forgetting this step is the single most common cause of "it still doesn't work" — always ask/verify this was done when debugging a script behavior change, and it can be confirmed by `curl`-ing the deployed URL directly and reading the raw HTML error (Apps Script returns error details in a simple `<div class="errorMessage">` on failure, e.g. `TypeError: ... (línea N, archivo "Code")`), which reveals the exact deployed line number — compare against the current script to check if the deployment is stale.
4. Deployment must be **Execute as: Me**, **Who has access: Anyone**.

## Roles (Users/Admins sheet)
- `admin` role → full dashboard access (actions menu, edit/delete participants, manage staff).
- Any other role value (e.g. `viewer`) → read-only dashboard (no Acciones column, no staff edit controls). Enforced both in UI (hidden) and in handlers (`if (!isAdmin) return`).

## Known fragile areas / external dependencies
- **Staff photo hosting**: Google Drive share links and Imgur album links do NOT work as direct `<img src>` — they need direct file links (`i.imgur.com/...` for Imgur; Drive requires "Anyone with the link" sharing + a direct embed format, and even then Drive hotlinking has been unreliable/rate-limited by Google). `src/utils/driveImage.js` has a best-effort multi-candidate fallback chain for Drive links, but recommend migrating to Imgur/Cloudinary/self-hosted images long-term.
- **Old Android WebView compatibility**: avoid the CSS `aspect-ratio` property (unsupported on older Android WebViews — collapses container to 0 height, making content invisible). Use the classic padding-percentage trick instead (`position: relative` + `padding-top: X%` + absolutely positioned child) — see `StaffMemberCard.jsx`.
- **Mobile horizontal overflow**: `html`/`body` in `src/index.css` have `overflow-x: hidden` as a safety net. When adding new large headings, always step down font size responsively (see `Hero.jsx`'s `text-3xl md:text-display-lg-mobile lg:text-display-lg` pattern) rather than using bare `text-display-lg`, since 56px headings can overflow narrow viewports.

## Conventions
- Spanish UI copy throughout (site is for a Spanish-speaking ballroom community in Bogotá, Colombia).
- Gender-neutral Spanish (`x` endings like "Seleccionadxs", "Listx") is used intentionally in some copy — don't "fix" this.
- New shared utilities go in `src/utils/`; new datasets go in `src/data/`.
- Don't add new npm dependencies for small self-contained needs (e.g. JSONP helper, country code list) if a simple in-repo utility suffices.
