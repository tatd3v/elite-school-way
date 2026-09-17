# Elite Way School - Setup Guide

Complete setup guide for the registration form, admin dashboard, and Google Sheets/Apps Script backend.

## 📋 Prerequisites

- Node.js 18+ (tested with v22)
- Google Account (to own the Sheet + Apps Script deployment)
- Git (optional)

---

## 🚀 Part 1: Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` (configured in `vite.config.js`) to see the site running locally.

### 3. Verification commands

Useful while developing or before committing:

```bash
npm run build        # Production build — fastest way to catch errors
npm run lint         # ESLint
npm run test         # Vitest unit tests
npm run format:check # Prettier check
```

---

## 📊 Part 2: Google Sheets + Apps Script Backend

This project has **no traditional server or database** — a single Google Sheet plus an Apps Script Web App is the entire backend.

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it **"Elite Way School Registrations"**
4. Keep this tab open — sheets/tabs (Registrations, Users, Staff) are created automatically the first time each one is used, so you don't need to create them manually

### Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code in the editor
3. Open [`google-apps-script.md`](./google-apps-script.md) in this repository — this file is the **source of truth** for the backend code
4. Copy **all** the code
5. Paste it into the Apps Script editor
6. Click the **Save** icon (💾) or press `Ctrl+S`
7. Name the project: **"Elite Way School Form Handler"**

### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the **gear icon** ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description:** "Elite Way School Registration API"
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
5. Click **Deploy**
6. **Authorization Required:** Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to Elite Way School Form Handler (unsafe)**
9. Click **Allow**
10. **Copy the Web App URL** (it looks like: `https://script.google.com/macros/s/XXXXX/exec`)

> ⚠️ **Critical — read this or you will waste time debugging "it's not working":**
> Editing and saving the Apps Script code does **NOT** update the live deployment. The deployed Web App is frozen to whatever version was active when you last deployed it. Every time you change the Apps Script code, you must:
> **Deploy → Manage deployments → click the pencil/edit icon on the existing deployment → Version: "New version" → Deploy**
> Skipping this step is the single most common cause of "I fixed the bug but it's still broken."

### Step 4: Test the Deployment

1. In Apps Script editor, select the `testSubmission` function from the dropdown
2. Click **Run** (▶️ button)
3. Check your Google Sheet — a **Registrations** tab should appear with a test entry
4. If successful, delete the test row

### Google Drive authorization for screenshots and staff photos

`saveScreenshotToDrive` and `saveStaffPhotoToDrive` use `DriveApp.createFile`, which requires the full `https://www.googleapis.com/auth/drive` OAuth scope. The deployment authorization dialog may not request this until a Drive function is actually called.

1. At the bottom of `Code.gs` in the Apps Script editor, paste this temporary function:
   ```js
   function forceDriveAuth() {
     DriveApp.getRootFolder().createFile('elite-way-temp-auth.txt', 'ok');
   }
   ```
2. Select `forceDriveAuth` and click **Run**.
3. Grant **Google Drive** access in the dialog.
4. Delete the temp file `elite-way-temp-auth.txt` from your Drive root and remove the `forceDriveAuth` function from `Code.gs`.
5. If you were not asked for permission (you may have already authorized a narrower scope), remove the app's access at `https://myaccount.google.com/permissions`, then run `forceDriveAuth` again.

### Step 5: Configure Environment Variable

1. In your project folder, create a `.env` file:

```bash
cp .env.example .env
```

2. Open `.env` and add your Web App URL:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

3. Replace `YOUR_SCRIPT_ID` with your actual script ID from Step 3
4. `.env` is gitignored — never commit real credentials/URLs to the repository

### Step 6: Test Form Submission

1. Restart your dev server:

```bash
npm run dev
```

2. Open `http://localhost:3000`
3. Click **"Inscríbete Ya!"**
4. Fill out the form (name, email, phone, entry type and age ≥ 18 are required; House/007 is optional)
5. Optionally attach a payment screenshot
6. Click **"Confirmar Inscripción"**
7. Check your Google Sheet's **Registrations** tab — the registration should appear with **Status = Registrado**

### Step 7: Set up the Admin Dashboard (optional but recommended)

The admin dashboard (`/login`) lets you manage registrations and staff. See **[`ADMIN_SETUP.md`](./ADMIN_SETUP.md)** for:
- Creating your first admin login
- The difference between `admin` (full access) and `viewer` (read-only) roles
- Managing the **Staff** directory shown on the public site

---

## 🗂️ How the backend is organized

Unlike a typical database, sheets/tabs in this project are created **lazily** — the first time a feature is used, not when you first open the spreadsheet. Don't be alarmed if you only see some tabs at first.

| Sheet | Created by | Purpose |
|---|---|---|
| **Registrations** | First form submission (or `testSubmission`) | Participant sign-ups |
| **Users** | First admin login attempt | Admin/viewer accounts (email, password hash, role, name) |
| **Staff** | First time the Staff API is called (dashboard load or public site load) | Staff/faculty directory |

### Registrations columns

| # | Column | Notes |
|---|---|---|
| 1 | Timestamp | |
| 2 | Nombre Artístico | |
| 3 | Email | |
| 4 | Teléfono | Stored with a leading apostrophe so Sheets doesn't misparse `+57...` as a formula |
| 5 | House/007 | Optional. Same apostrophe trick, preserves leading zeros like `007` |
| 6 | Entrada | Numeric price (`20000` or `15000`) extracted from the selected entry type label by `formSubmit.js` — **not** the label text itself (e.g. `General — $20.000` becomes `20000`). Falls back to `N/A` if no digits are found. |
| 7 | Edad | |
| 8 | Screenshot | Google Drive link to the uploaded payment proof (saved under `elite-way-school-data/PAGOS_QR`). Can be filled in later even after the row exists — see "Duplicate registrations" below |
| 9 | Status | `Registrado` (default) or `Pagado` — editable from the admin dashboard |
| 10 | Instagram | Optional. Stores the full profile URL (`https://instagram.com/<handle>`) — the form collects only the bare handle behind a fixed `@` prefix and `src/utils/instagram.js` normalizes it before submit. Still written with the same apostrophe trick as Teléfono/House so legacy "@" values can't trigger a Sheets smart chip. Added as a *trailing* column (not inserted between existing ones) so no other column's position/index changes; `initializeSheet()` auto-adds this header to sheets created before this field existed, the next time it runs |

### Duplicate registrations

Before writing a new row, the public form calls `checkRegistrationExists` (matches by email or phone, case-insensitive/digits-only) to avoid creating a second row for someone who already registered. There's no separate modal for this — the same registration form (and its existing "Pago por QR" screenshot field) is reused, with an inline message replacing the usual success/error notice:
- **No screenshot on file yet, and the user already attached a file** → it's sent immediately via `attachPaymentScreenshot`, which only ever writes the Screenshot column (column 8) — it never touches name/email/phone/house/entry/age.
- **No screenshot on file yet, but nothing was attached** → the user sees a message asking them to use the "Pago por QR" field and submit again.
- **Already has a screenshot** → no upload is offered; the user just sees a "you're already registered" message with contact info (Instagram/phone/WhatsApp) to reach the site admins if they need a change made manually.

---

## 🌐 Part 3: Deploy to Vercel

This project already includes `vercel.json` (rewrites every path to `index.html`, required for the client-side router in `src/components/Router.jsx` to work correctly on page refresh/direct links).

### Step 1: Build Production Version (optional, for a local sanity check)

```bash
npm run build
```

This creates a `dist/` folder with optimized files. Vercel runs this build itself, so you don't need to upload `dist/` manually.

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI

```bash
npx vercel        # first deploy, follow the prompts
npx vercel --prod # promote to production
```

#### Option B: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) → **Add New...** → **Project**
3. Import your repository
4. Framework preset should auto-detect as **Vite**; leave build settings as:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
5. Add the environment variable `VITE_GOOGLE_SCRIPT_URL` with your Google Script URL
6. Click **"Deploy"**

### Step 3: Configure Custom Domain (Optional)

1. Purchase a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel, go to your project → **Settings** → **Domains**
3. Add your custom domain and follow the instructions to update your DNS/nameservers
4. **Registrar-side gotcha (Namecheap specifically):** if the domain ever stops resolving entirely with nameservers changed to something like `verify-contact-details.namecheap.com` / `failed-whois-verification.namecheap.com`, that's an ICANN-mandated WHOIS contact-verification suspension, not a Vercel/DNS-config issue on your end. Log into Namecheap → Domain List → resend/complete the registrant email verification (the confirmation links expire quickly, sometimes within a week) — Namecheap restores the real nameservers automatically once verified.

---

## 📱 Part 4: View & Export Registrations

### Google Sheets

All registrations save automatically to the **Registrations** tab (see column list above). Payment screenshots are stored as Google Drive links, not embedded in the sheet itself.

### Export to Excel

1. Open your Google Sheet
2. Click **File** → **Download** → **Microsoft Excel (.xlsx)**
3. The file downloads with all registrations

---

## 🔧 Troubleshooting

### Form Not Submitting

1. Check browser console for errors (F12)
2. Verify `.env` has the correct `VITE_GOOGLE_SCRIPT_URL`
3. Ensure Google Apps Script deployment access is set to "Anyone"
4. Confirm you redeployed a **New version** after any recent code change (see the callout in Part 2, Step 3)

### CORS Errors / "JSONP request failed"

- Reads (registrations, staff, login) use **JSONP**, not `fetch`, because Apps Script's `ContentService` cannot set custom response headers and therefore can't answer CORS preflight requests. If you see a JSONP failure, it almost always means the deployed script is throwing an error — paste the deployed URL directly into your browser with `?action=getStaff&callback=test` appended to see the raw error message Apps Script returns.
- Writes (form submission, staff edits, status updates) intentionally use `fetch` with `mode: 'no-cors'` and `Content-Type: text/plain`. This means the browser **cannot read the response**, so don't be alarmed by a lack of visible confirmation in devtools — check the Google Sheet directly to confirm the write succeeded.

### `TypeError: ... setHeader is not a function`

This means the deployed Apps Script code doesn't match `google-apps-script.md` (an older/broken version is live). `ContentService` has no `setHeader`/`addHeader` API — never add one. Copy the current code from `google-apps-script.md` again and redeploy a new version.

### "No cuentas con el permiso para llamar a DriveApp..." / Screenshot not saving to Google Drive

The Apps Script needs the full `https://www.googleapis.com/auth/drive` OAuth scope to create and share files. This is not always requested during the initial web app deployment because the deployment dialog only asks for scopes that are triggered by the functions it runs at that moment.

1. Run the one-time `forceDriveAuth` function from the setup steps to force the Drive permission prompt.
2. If it does not ask for permission, remove the project's access at `https://myaccount.google.com/permissions` and run `forceDriveAuth` again.
3. Redeploy the web app as a **New version** after authorizing.

### Blank Entries / Ghost Rows in Staff or Registrations

Google Sheets can retain formatting on rows after their content is deleted, making them appear as empty entries. The backend already skips rows with an empty Name/Nombre Artístico column, but you can also select and delete the stray rows directly in the sheet for tidiness.

`doPost`'s registration-submission handler validates `artistName`/`email`/`phone` and rejects the request (`status: 'error'`) if any are blank, and falls back to the server's current time if `timestamp` is missing/invalid — so a direct/bot POST to the public Web App URL (bypassing the real form's `required` inputs) can no longer create a blank row with a "12/31/1969" epoch Timestamp. This only affects **new** submissions after you redeploy; it doesn't retroactively clean up rows created before the fix.

### Phone or House shows `#ERROR!`

Google Sheets tries to parse values starting with `+`, `-`, or `=` as formulas. The backend prefixes these fields with a literal apostrophe to prevent this — if you see `#ERROR!` on an old row from before this fix, manually retype it with a leading apostrophe (e.g. `'+57 300 1234567`).

### Staff Photos Not Showing

Google Drive share links (`drive.google.com/file/d/.../view`) and Imgur **album** links (`imgur.com/a/...`) do **not** work as direct image sources. Use a direct image link instead (e.g. `i.imgur.com/XXXXX.jpg` for Imgur — right-click the image itself and "Copy image address"). For Drive, the file must be shared as "Anyone with the link", and even then hotlinking can be unreliable — a dedicated image host is more robust long-term.

### No Data Appearing At All

1. Re-deploy the Apps Script as a **new version** (not just saved)
2. Clear browser cache / hard refresh
3. Test with the `testSubmission` function directly in the Apps Script editor
4. Check the Apps Script project's **Executions** log (left sidebar) for server-side errors

---

## 📞 Support

For issues:
- Instagram: [@theeliteway_b](https://www.instagram.com/theeliteway_b)
- Phone: 3337380581

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Google Sheet created
- [ ] Apps Script code copied from `google-apps-script.md` and deployed as Web App
- [ ] Web App URL copied
- [ ] `.env` file configured
- [ ] Test form submission successful (Status = Registrado appears in the sheet)
- [ ] Admin dashboard set up (see `ADMIN_SETUP.md`)
- [ ] Site deployed to Vercel
- [ ] Custom domain configured (optional)

**Your Elite Way School registration site is now live! 🎉**
