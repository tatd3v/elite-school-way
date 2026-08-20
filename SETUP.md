# Elite Way School - Setup Guide

Complete setup guide for the registration form with Google Sheets integration.

## 📋 Prerequisites

- Node.js 16+ installed
- Google Account
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

Visit `http://localhost:3000` to see the site running locally.

---

## 📊 Part 2: Google Sheets Integration

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it **"Elite Way School Registrations"**
4. Keep this tab open

### Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code in the editor
3. Open the `google-apps-script.js` file from this project
4. Copy ALL the code
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

### Step 4: Test the Deployment

1. In Apps Script editor, select the `testSubmission` function from the dropdown
2. Click **Run** (▶️ button)
3. Check your Google Sheet - you should see a test entry appear
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

### Step 6: Test Form Submission

1. Restart your dev server:

```bash
npm run dev
```

2. Open `http://localhost:3000`
3. Click **"Inscríbete Ya!"**
4. Fill out the form
5. Click **"Confirmar Inscripción"**
6. Check your Google Sheet - the registration should appear!

---

## 🌐 Part 3: Deploy to Netlify (Free)

### Step 1: Build Production Version

```bash
npm run build
```

This creates a `dist` folder with optimized files.

### Step 2: Deploy to Netlify

#### Option A: Drag & Drop (Easiest)

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the `dist` folder into the upload area
3. Wait for deployment to complete
4. Copy your site URL (e.g., `https://your-site.netlify.app`)

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

## 📱 Part 4: View Registrations

### Google Sheets

- All registrations automatically save to your Google Sheet
- **Columns:**
  - Timestamp
  - Nombre Artístico
  - Email
  - Teléfono
  - House/007
  - Categorías
  - Edad
  - Screenshot

### Export to Excel

1. Open your Google Sheet
2. Click **File** → **Download** → **Microsoft Excel (.xlsx)**
3. The file downloads with all registrations

---

## 🔧 Troubleshooting

### Form Not Submitting

1. Check browser console for errors (F12)
2. Verify `.env` file has correct Google Script URL
3. Ensure Google Apps Script deployment is set to "Anyone"

### Blank Entries in Sheet

1. Make sure all required fields (*) are filled
2. Check that Google Apps Script code is saved and deployed

### CORS Errors

- This is expected with `no-cors` mode
- Form will still work, just can't read response
- Check Google Sheet to confirm submissions

### No Data Appearing

1. Re-deploy Google Apps Script
2. Clear browser cache
3. Test with `testSubmission` function in Apps Script

---

## 📞 Support

For issues:
- Instagram: @theeliteway_b
- Phone: 3337380581

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Google Sheet created
- [ ] Apps Script deployed as Web App
- [ ] Web App URL copied
- [ ] `.env` file configured
- [ ] Test form submission successful
- [ ] Site deployed to Netlify
- [ ] Custom domain configured (optional)

**Your Elite Way School registration site is now live! 🎉**
