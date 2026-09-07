# Admin Authentication Setup Guide

Guide to configuring and using authentication for the Elite Way School admin panel.

## Overview

The admin panel uses a Google Sheets tab (`Users`) as a simple user database. No external authentication services are required.

## Prerequisites

- Follow the setup in [`SETUP.md`](./SETUP.md) first.
- The code from [`google-apps-script.md`](./google-apps-script.md) must be copied and deployed in Apps Script.

## Setup instructions

### Step 1: Deploy the updated script

1. Open your Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Make sure the code was copied from [`google-apps-script.md`](./google-apps-script.md).
4. Save and deploy a new version: **Deploy → Manage deployments → Edit → New version → Deploy**.

### Step 2: Verify the users sheet

1. Go back to your spreadsheet.
2. The script automatically creates a tab named **Users** (even though the internal function is called `initializeAdminsSheet`).
3. The columns are:
   - **Email** — user's email address
   - **Password Hash** — SHA-256 hash of the password
   - **Role** — `admin` or `viewer`
   - **Name** — display name

4. A default user should exist:
   - Email: `admin@elite.com`
   - Password: `admin123`
   - Role: `admin`

### Step 3: Test login

1. In development: `http://localhost:3000/login` (port configured in `vite.config.js`)
2. In production: `https://your-site.vercel.app/login` (or your custom domain)
3. Enter:
   - **Email:** `admin@elite.com`
   - **Password:** `admin123`
4. If everything is set up correctly, you'll enter the panel.

---

## User management

### Create a new user

1. Open the **Users** tab.
2. Generate the SHA-256 hash of the password.

#### Generating a password hash

In the Apps Script editor, create and run this function:

```javascript
function generatePasswordHash() {
  const password = 'your_password_here';
  const hash = Utilities.base64Encode(
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      password
    )
  );
  Logger.log(hash);
}
```

1. Replace `'your_password_here'` with the desired password.
2. Run the function (**Run**).
3. Copy the hash from the **Execution log**.
4. Add a row to the **Users** tab:
   - Email: the new user's email
   - Password Hash: the copied hash
   - Role: `admin` or `viewer`
   - Name: display name

### Change a password

1. Generate a new hash (see above).
2. Replace the hash in the **Users** tab.

### Delete a user

Simply delete their row in the **Users** tab.

---

## Roles

- **`admin`** — Full access: can edit/delete registrations, manage staff, toggle visibility, etc.
- **`viewer`** (or any other value) — Read-only: can see registrations and staff, but cannot perform actions. The restriction is enforced in both the UI and the backend.

To create a read-only user, assign the `viewer` role.

---

## Security

- Passwords are stored as SHA-256 hashes, never in plain text.
- Admin sessions last **24 hours** and are stored in `localStorage`.
- Keep the Google Sheet private.
- Change the default password (`admin123`) before going to production.

---

## Admin panel

Once logged in, administrators can:

- View registration statistics.
- See the participant list with actions (confirm payment, edit, delete).
- View and manage the staff directory.
- Export data to Excel from Google Sheets.

---

## Troubleshooting

### "Invalid credentials"

- Verify the email and password.
- Make sure the hash in the **Users** tab is correct.
- Confirm the Apps Script deployment is up to date.

### The Users tab isn't created

- Manually run `initializeAdminsSheet()` in Apps Script.
- Or create the tab manually with the headers: `Email, Password Hash, Role, Name`.

### Login won't load

- Check the browser console (F12).
- Verify `VITE_GOOGLE_SCRIPT_URL` in `.env`.
- Make sure the deployment access is set to **Anyone**.

### Session expired

- Sessions last 24 hours.
- Log in again.

---

## Default credentials

**Email:** `admin@elite.com`  
**Password:** `admin123`

⚠️ **Important:** change the default password before putting the site into production.

---

## Checklist

- [ ] `google-apps-script.md` code copied and deployed
- [ ] New deployment version published
- [ ] `Users` tab created with the default user
- [ ] Login tested with default credentials
- [ ] Default password changed
- [ ] Additional users added (if applicable)
- [ ] Admin panel accessed successfully

**Admin authentication is ready!**
