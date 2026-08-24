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

The admin dashboard (`/admin`) lets you manage registrations and staff. See **[`ADMIN_SETUP.md`](./ADMIN_SETUP.md)** for:
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
| 6 | Entrada | Selected entry type: `General` or `Personas negrxs y marronxs` |
| 7 | Edad | |
| 8 | Screenshot | Google Drive link to the uploaded payment proof (saved under `elite-way-school-data/PAGOS_QR`) |
| 9 | Status | `Registrado` (default) or `Pagado` — editable from the admin dashboard |

---

## 🌐 Part 3: Deploy to Netlify (Free)

### Step 1: Build Production Version

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Step 2: Deploy to Netlify

#### Option A: Drag & Drop (Easiest)

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the `dist` folder into the upload area
3. Wait for deployment to complete
4. Copy your site URL (e.g., `https://your-site.netlify.app`)

> Note: with drag & drop, environment variables must be baked in at build time (i.e. run `npm run build` locally with your real `.env` in place) since there's no separate build step on Netlify's side to inject them.

#### Option B: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **GitHub** and select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click **"Add environment variables"**
7. Add: `VITE_GOOGLE_SCRIPT_URL` with your Google Script URL
8. Click **"Deploy site"**

### Step 3: Configure Custom Domain (Optional)

1. Purchase a domain (e.g., from Namecheap, GoDaddy)
2. In Netlify, go to **Site settings** → **Domain management**
3. Click **"Add custom domain"**
4. Follow the instructions to update your DNS settings

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

### Blank Entries / Ghost Rows in Staff or Registrations

Google Sheets can retain formatting on rows after their content is deleted, making them appear as empty entries. The backend already skips rows with an empty Name/Nombre Artístico column, but you can also select and delete the stray rows directly in the sheet for tidiness.

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
- [ ] Site deployed to Netlify
- [ ] Custom domain configured (optional)

**Your Elite Way School registration site is now live! 🎉**
