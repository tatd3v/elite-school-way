# Elite Way School - Ballroom Colombia 2026

Modern SPA for the Elite Way School Kiki Ball event. Includes a public landing page, registration form with QR/screenshot payment, an admin panel with Google Sheets authentication, and a staff directory.

## Features

- **SPA with Preact + Vite** — Fast, lightweight build.
- **Responsive design** — Mobile-first, dark mode by default.
- **Registration via Google Sheets** — Form that saves to Google Sheets through Apps Script.
- **QR payment** — Shows a payment QR code and lets users upload proof (screenshot).
- **Country code selector** — With search and Colombia as a featured option.
- **Code of conduct** — Spanish section with the event rules.
- **Staff directory** — Loads visible staff from Google Sheets with photos, roles and socials.
- **Admin panel** — Login with SHA-256 hash, `admin` / `viewer` roles, registration and staff management.
- **Code quality** — ESLint, Prettier, PropTypes, DRY, SOLID principles.

## Tech Stack

- **Framework:** Preact 10.19+
- **Build Tool:** Vite 8+
- **Styling:** Tailwind CSS 3.4+
- **Backend:** Google Apps Script (no dedicated server)
- **Hosting:** Vercel (see `vercel.json`)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/elite-school-way.git
cd elite-school-way

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` (port configured in `vite.config.js`).

## Available scripts

```bash
npm run dev         # Dev server
npm run build       # Production build
npm run preview     # Preview build
npm run lint        # ESLint
npm run lint:fix    # ESLint with auto-fix
npm run format      # Prettier
npm run format:check
npm run test        # Vitest - run all tests
npm run test:watch  # Vitest - watch mode
npm run test:ui     # Vitest - interactive UI
```

## 📚 Documentation

### Initial Setup
- **[SETUP.md](./SETUP.md)** — Complete setup guide (Google Sheets, Apps Script, environment variables)
- **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** — Admin panel and user configuration

### Testing
- **[TEST.md](./TEST.md)** — Testing guide with Vitest

### Technical Reference
- **[AGENTS.md](./AGENTS.md)** — Notes for AI agents (architecture, gotchas, conventions, DRY, SOLID, folder structure)
- **[google-apps-script.md](./google-apps-script.md)** — Backend source code (Apps Script)

## Configuration

### 1. Google Apps Script

The full guide is in [`SETUP.md`](./SETUP.md). The quick steps are:

1. Create a Google Sheet.
2. Open **Extensions → Apps Script**.
3. Copy the contents of [`google-apps-script.md`](./google-apps-script.md).
4. Deploy as **Web app** with **Execute as: Me** and **Who has access: Anyone**.
5. Copy the deployment URL.

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 3. Admin panel

To create/view admin users, see [`ADMIN_SETUP.md`](./ADMIN_SETUP.md).

Default credentials:
- **Email:** `admin@elite.com`
- **Password:** `admin123`

## Testing

### Running Tests

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode (re-run on changes)
npm run test:ui          # Interactive UI
```

### Available Tests

- **Integration (real backend)** — require `VITE_GOOGLE_SCRIPT_URL` in `.env`; they skip automatically if not configured:
  - Fetch/add/delete registrations
  - Fetch/add/update/delete staff members
  - Pagination (backend)
- **Components (jsdom, no backend)** — render the real components with a mocked `dashboardService`:
  - `AdminDashboard` pagination and sticky header (Participants)
  - `StaffManagementSection` pagination and sticky header (Staff)

See [TEST.md](./TEST.md) for more details.

## Build & Deploy

```bash
npm run build
```

The project deploys on **Vercel** (`vercel.json` includes the SPA rewrite needed for client-side routing to work). Connect the repository on [vercel.com](https://vercel.com) and configure:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_GOOGLE_SCRIPT_URL`

## Project structure

```
elite-school-way/
├── src/
│   ├── components/          # Preact components
│   │   ├── Hero.jsx
│   │   ├── EventDetails.jsx
│   │   ├── Categories.jsx / CategoryCard.jsx
│   │   ├── DressCode.jsx
│   │   ├── RulesSection.jsx / CodeOfConduct.jsx
│   │   ├── StaffSection.jsx / StaffMemberCard.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx / DesktopNavigation.jsx / BottomNavigation.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── ShareButton.jsx
│   │   ├── RegistrationModal.jsx
│   │   ├── AdminLogin.jsx / AdminPanel.jsx / AdminDashboard.jsx / DashboardHeader.jsx
│   │   ├── StaffManagementSection.jsx / StaffEditModal.jsx / ParticipantEditModal.jsx
│   │   └── ...
│   ├── data/                # Static content
│   │   ├── categories.js
│   │   ├── conductRules.js
│   │   ├── countryCodes.js
│   │   └── dressCodes.js
│   ├── services/            # Backend calls
│   │   ├── authService.js
│   │   └── dashboardService.js
│   ├── utils/               # Helpers
│   │   ├── formSubmit.js
│   │   ├── jsonp.js
│   │   ├── driveImage.js
│   │   ├── auth.js
│   │   └── theme.js
│   ├── config/              # Configuration
│   │   └── constants.js
│   ├── assets/              # Images and logos
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── src/tests/               # Vitest — see TEST.md for details on each file
│
├── .env.example
├── .eslintrc.cjs
├── .prettierrc.json
├── tailwind.config.js
├── vite.config.js
├── vitest.config.js
├── vercel.json              # Vercel deployment config
├── google-apps-script.md    # Apps Script backend
├── SETUP.md                 # Setup guide
├── ADMIN_SETUP.md           # Admin panel guide
├── TEST.md                  # Testing guide
├── AGENTS.md                # AI agent notes
└── README.md
```

## Form data

Registrations are saved to the `Registrations` sheet with the columns:

1. Timestamp
2. Nombre Artístico (stage name)
3. Email
4. Teléfono (phone)
5. House/007 (optional)
6. Entrada — numeric price (`20000` or `15000`) extracted from the chosen option, or `N/A`. The label text is **not** stored (e.g. "General — $20.000"); see `formSubmit.js`.
7. Edad (age)
8. Screenshot
9. Status (`Registrado` or `Pagado`)

The payment proof (screenshot) is saved to the `elite-way-school-data/PAGOS_QR` Drive folder and only its link is written to the sheet.

## Event information

- **Event:** Elite Way School Kiki Ball 2026
- **Date:** October 17, 2026
- **Time:** 6:00 PM
- **Venue:** The Game Dance Studio
- **Address:** Kr 13 #56-72, Chapinero, Bogotá

## Contact

- **Instagram:** [@theeliteway_b](https://www.instagram.com/theeliteway_b)
- **Phone:** [+57 333 738 0581](tel:+573337380581)

## License

© 2026 Elite Way School Ballroom Bogotá. All rights reserved.
