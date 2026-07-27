# 🎓 Elite Way School - Ballroom Culture 2026

Modern SPA landing page for Elite Way School Ballroom event with integrated registration form and Google Sheets backend.

![Elite Way School](https://img.shields.io/badge/Preact-673AB8?style=for-the-badge&logo=preact&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Features

- ⚡ **Lightning Fast** - Built with Preact & Vite
- 🎨 **Beautiful Design** - Academic Prestige & Ballroom Grandeur theme
- 📱 **Fully Responsive** - Mobile-first approach
- 📊 **Google Sheets Integration** - Zero-cost form backend
- 🚀 **Easy Deployment** - Netlify-ready
- ♿ **Accessible** - WCAG compliant

## 🏗️ Tech Stack

- **Framework:** Preact 10.19+
- **Build Tool:** Vite 5.0+
- **Styling:** Tailwind CSS 3.4+
- **Backend:** Google Apps Script (Free)
- **Hosting:** Netlify (Free tier)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/elite-school-way.git
cd elite-school-way

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 🔧 Configuration

### 1. Google Sheets Setup

Follow the complete guide in [`SETUP.md`](./SETUP.md) to configure Google Sheets integration.

Quick steps:
1. Create Google Sheet
2. Deploy Apps Script (from `google-apps-script.js`)
3. Copy Web App URL
4. Add to `.env` file

### 2. Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your Google Script URL
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

**Manual deployment:**
1. Run `npm run build`
2. Drag `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Add environment variable `VITE_GOOGLE_SCRIPT_URL`

## 📁 Project Structure

```
elite-school-way/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── EventDetails.jsx
│   │   ├── StaffSection.jsx
│   │   ├── Categories.jsx
│   │   ├── RulesSection.jsx
│   │   ├── FinalCTA.jsx
│   │   ├── Footer.jsx
│   │   └── RegistrationModal.jsx
│   ├── utils/
│   │   └── formSubmit.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── google-apps-script.js
├── SETUP.md
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## 🎨 Design System

### Colors
- **Primary (Navy):** #000666, #1a237e
- **Secondary (Crimson):** #b52617, #ff5c45
- **Accent (Silver):** #c6c5d4
- **Surface:** #fbf9f8, #ffffff

### Typography
- **Headlines:** Hanken Grotesk (600-700)
- **Body:** Libre Franklin (400-600)

### Spacing
- Desktop: 64px margins, 80px section gaps
- Mobile: 20px margins, 48px section gaps

## 📊 Form Data

Registrations are saved to Google Sheets with:
- Timestamp
- Nombre Artístico
- Email
- Teléfono
- House/007
- Categorías (comma-separated)
- Edad
- Comentarios

**Export to Excel:** File → Download → Microsoft Excel (.xlsx)

## 🐛 Troubleshooting

See [`SETUP.md`](./SETUP.md#-troubleshooting) for common issues.

## 📝 Event Information

**Event:** Elite Way School Ballroom Culture 2026  
**Date:** October 17, 2026  
**Time:** 6:00 PM  
**Venue:** The Game Dance Studio  
**Location:** Kr 13 #56-72, Chapinero, Bogotá

## 📞 Contact

- **Instagram:** [@theeliteway_b](https://instagram.com/theeliteway_b)
- **Phone:** 3337380581

## 📄 License

© 2026 Elite Way School Ballroom Culture. All Rights Reserved.

## 🤝 Contributing

This is a private event registration site. For issues or questions, contact the organizers directly.

---

**Built with ❤️ for the Ballroom Community**
