# Admin Authentication Setup Guide

This guide explains how to set up and use the Google Sheets-based admin authentication for Elite Way School.

## 📋 Overview

The admin system uses Google Sheets as a simple, secure database for storing admin credentials. No external auth services required!

## 🔧 Setup Instructions

### Step 1: Update Google Apps Script

1. Open your Google Sheet (the one with "Registrations" tab)
2. Go to **Extensions** → **Apps Script**
3. **Replace ALL existing code** with the updated code from `google-apps-script.js`
4. Click **Save** (💾)
5. Click **Deploy** → **Manage deployments**
6. Click the **Edit** icon (pencil) on your existing deployment
7. Under "Version", select **New version**
8. Click **Deploy**

### Step 2: Verify Admins Sheet Was Created

1. Go back to your Google Sheet
2. You should see a new tab called **"Admins"**
3. It will have these columns:
   - **Email** - Admin email address
   - **Password Hash** - SHA-256 hashed password
   - **Role** - Admin role (admin, staff, etc.)
   - **Name** - Display name

4. There should be a sample admin already created:
   - Email: `admin@elite.com`
   - Password: `admin123`
   - Role: `admin`

### Step 3: Test Admin Login

1. Go to your site: `http://localhost:3000/admin`
2. Login with:
   - **Email:** `admin@elite.com`
   - **Password:** `admin123`
3. You should see the admin dashboard!

---

## 👥 Managing Admin Users

### Add a New Admin

To add a new admin user, you need to manually add them to the Google Sheet:

1. Open your Google Sheet
2. Go to the **Admins** tab
3. You need to generate a password hash for the new admin

#### Generate Password Hash

Open the **Apps Script Editor** and run this function:

```javascript
function generatePasswordHash() {
  const password = 'your_password_here';  // Replace with actual password
  const hash = Utilities.base64Encode(
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      password
    )
  );
  Logger.log(hash);
}
```

1. Replace `'your_password_here'` with the desired password
2. Click **Run** (▶️)
3. Check the **Execution log** at the bottom - copy the hash
4. Add a new row in the Admins sheet with:
   - Email: new admin email
   - Password Hash: the hash you just copied
   - Role: admin or staff
   - Name: display name

### Remove an Admin

Simply delete their row from the Admins sheet.

### Roles: Admin vs Viewer

The **Role** column controls what a logged-in user can do on the dashboard:

- **`admin`** — Full access. Can see the "Acciones" menu on Participantes (Confirmar Pago, Editar, Eliminar) and can manage Staff (toggle visibility, edit, delete, add).
- **`viewer`** (or any value other than `admin`) — Read-only access. Can see the Participantes table and Staff list, but the "Acciones" column and all edit/delete/toggle controls are hidden. Any attempt to trigger these actions is also blocked in code, not just hidden in the UI.

To create a viewer account, add a new row in the **Admins/Users** sheet with:
   - Email: viewer's email
   - Password Hash: generated hash (see above)
   - Role: `viewer`
   - Name: display name

### Change Password

1. Generate a new password hash (see above)
2. Replace the old hash in the Admins sheet

---

## 🔐 Security Notes

### Password Hashing
- Passwords are hashed using SHA-256 before storage
- Never store plain text passwords in the sheet
- Hash is generated server-side (in Google Apps Script)

### Session Management
- Admin sessions last 24 hours
- Session data stored in browser localStorage
- Automatic logout after 24 hours of inactivity

### Access Control
- Only people with the Google Sheet link can manage admins
- Keep your Google Sheet private
- Don't share your admin credentials

---

## 🚀 Accessing Admin Panel

### Development
```
http://localhost:3000/admin
```

### Production (after deployment)
```
https://your-site.netlify.app/admin
```

Or add a link in your app.

---

## 📊 Admin Dashboard Features

Once logged in, admins can:

- ✅ View registration statistics
- ✅ Access Google Sheet directly
- ✅ Export data to Excel
- ✅ Monitor categories and registrations

---

## 🔧 Troubleshooting

### "Invalid credentials" error
- Check that you're using the correct email/password
- Verify the password hash in the Admins sheet is correct
- Make sure you updated the Google Apps Script with the new code

### Admins sheet not created
- Run `initializeAdminsSheet()` manually from Apps Script editor
- Or add the sheet manually with columns: Email, Password Hash, Role, Name

### Login not working
- Check browser console for errors (F12)
- Verify VITE_GOOGLE_SCRIPT_URL is set in .env
- Make sure Google Apps Script deployment is set to "Anyone"

### Session expired
- Sessions last 24 hours
- Just login again

---

## 🔄 Integration with Existing App

To add admin panel access to your main app, you can add a link in the footer or header:

```jsx
<a href="/admin" className="text-on-surface-variant hover:text-primary">
  Admin
</a>
```

Or create a dedicated admin route (requires routing library).

---

## 📝 Default Admin Credentials

**Email:** `admin@elite.com`  
**Password:** `admin123`

⚠️ **IMPORTANT:** Change the default password immediately in production!

To change:
1. Generate new hash for your password
2. Update the Admins sheet
3. Delete or update the default admin row

---

## ✅ Setup Checklist

- [ ] Updated Google Apps Script with auth code
- [ ] Deployed new version of the script
- [ ] Verified Admins sheet exists
- [ ] Tested login with default credentials
- [ ] Changed default admin password
- [ ] Added your own admin accounts
- [ ] Accessed admin dashboard successfully

**Your admin authentication is now ready! 🎉**
