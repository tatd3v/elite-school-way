# Elite Way School - Ballroom Colombia 2026

SPA moderna para el evento Elite Way School Kiki Ball. Incluye landing pública, formulario de inscripción con pago por QR/screenshot, panel de administración con autenticación Google Sheets, y directorio de staff.

## Características

- **SPA con Preact + Vite** — Build rápida y ligera.
- **Diseño responsivo** — Mobile-first, modo oscuro por defecto.
- **Inscripción con Google Sheets** — Formulario que guarda en Google Sheets vía Apps Script.
- **Pago por QR** — Muestra QR de pago y permite subir comprobante (screenshot).
- **Selector de código de país** — Con buscador y Colombia como opción destacada.
- **Código de conducta** — Sección en español con reglas del evento.
- **Directorio de Staff** — Carga staff visible desde Google Sheets con fotos, roles y redes.
- **Panel de administración** — Login con hash SHA-256, roles `admin` / `viewer`, gestión de inscripciones y staff.
- **Calidad de código** — ESLint, Prettier, PropTypes, DRY, SOLID principles.

## Tech Stack

- **Framework:** Preact 10.19+
- **Build Tool:** Vite 8+
- **Styling:** Tailwind CSS 3.4+
- **Backend:** Google Apps Script (sin servidor propio)
- **Hosting:** Netlify (o cualquier static host)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/yourusername/elite-school-way.git
cd elite-school-way

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Visita `http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev         # Dev server
npm run build       # Build de producción
npm run preview     # Previsualizar build
npm run lint        # ESLint
npm run lint:fix    # ESLint con auto-fix
npm run format      # Prettier
npm run format:check
npm run test        # Vitest - run all tests
npm run test:watch  # Vitest - watch mode
npm run test:ui     # Vitest - interactive UI
```

## 📚 Documentación

### Setup Inicial
- **[SETUP.md](./SETUP.md)** — Guía completa de configuración (Google Sheets, Apps Script, variables de entorno)
- **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** — Configuración del panel de administración y usuarios

### Testing
- **[TEST.md](./TEST.md)** — Guía de testing con Vitest

### Referencia Técnica
- **[AGENTS.md](./AGENTS.md)** — Notas para agentes de IA (arquitectura, gotchas, convenciones, DRY, SOLID, folder structure)
- **[google-apps-script.md](./google-apps-script.md)** — Código fuente del backend (Apps Script)
- **[ROW_INSERTION_LOGIC.md](./ROW_INSERTION_LOGIC.md)** — Explicación visual de la lógica de inserción de filas

## Configuración

### 1. Google Apps Script

La guía completa está en [`SETUP.md`](./SETUP.md). Los pasos rápidos son:

1. Crear una hoja de Google Sheets.
2. Abrir **Extensions → Apps Script**.
3. Copiar el contenido de [`google-apps-script.md`](./google-apps-script.md).
4. Desplegar como **Web app** con **Execute as: Me** y **Who has access: Anyone**.
5. Copiar la URL del deployment.

### 2. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env`:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 3. Panel de administración

Para crear/ver usuarios admin, ver [`ADMIN_SETUP.md`](./ADMIN_SETUP.md).

Credenciales por defecto:
- **Email:** `admin@elite.com`
- **Password:** `admin123`

## Testing

### Ejecutar Tests

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode (re-run on changes)
npm run test:ui          # Interactive UI
```

### Tests Disponibles

- Fetch registrations
- Add/delete registrations
- Fetch staff
- Add staff member
- Update staff member
- Delete staff member

Ver [TEST.md](./TEST.md) para más detalles.

## Build y Deploy

```bash
npm run build
```

Sube la carpeta `dist/` a Netlify Drop, o conecta el repositorio a Netlify y configura:

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_GOOGLE_SCRIPT_URL`

## Estructura del proyecto

```
elite-school-way/
├── src/
│   ├── components/          # Componentes de Preact
│   │   ├── Hero.jsx
│   │   ├── EventDetails.jsx
│   │   ├── Categories.jsx / CategoryCard.jsx
│   │   ├── DressCode.jsx
│   │   ├── RulesSection.jsx / CodeOfConduct.jsx
│   │   ├── StaffSection.jsx / StaffMemberCard.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx / DesktopNavigation.jsx / BottomNavigation.jsx
│   │   ├── RegistrationModal.jsx
│   │   ├── AdminLogin.jsx / AdminPanel.jsx / AdminDashboard.jsx
│   │   └── ...
│   ├── data/                # Contenido estático
│   │   ├── categories.js
│   │   ├── conductRules.js
│   │   ├── countryCodes.js
│   │   └── dressCodes.js
│   ├── services/            # Llamadas al backend
│   │   ├── authService.js
│   │   └── dashboardService.js
│   ├── utils/               # Helpers
│   │   ├── formSubmit.js
│   │   ├── jsonp.js
│   │   └── driveImage.js
│   ├── config/              # Configuración
│   │   └── constants.js
│   ├── assets/              # Imágenes y logos
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css

├── .env.example
├── .eslintrc.cjs
├── .prettierrc.json
├── tailwind.config.js
├── vite.config.js
├── vitest.config.js
├── google-apps-script.md    # Backend de Apps Script
├── SETUP.md                 # Guía de setup
├── ADMIN_SETUP.md           # Guía del panel admin
├── TEST_INSTRUCTIONS.md     # Testing guide
├── STAFF_TESTING.md         # Staff testing details
├── QUICK_TEST.md            # Quick test reference
├── AGENTS.md                # Notas para agentes de IA
└── README.md
```

## Datos del formulario

Las inscripciones se guardan en la hoja `Registrations` con las columnas:

1. Timestamp
2. Nombre Artístico
3. Email
4. Teléfono
5. House/007 (opcional)
6. Entrada
7. Edad
8. Screenshot

El comprobante (screenshot) se guarda en la carpeta de Drive `elite-way-school-data/PAGOS_QR` y solo se escribe el enlace en la hoja.

## Información del evento

- **Evento:** Elite Way School Kiki Ball 2026
- **Fecha:** 17 de octubre de 2026
- **Hora:** 6:00 PM
- **Lugar:** The Game Dance Studio
- **Dirección:** Kr 13 #56-72, Chapinero, Bogotá

## Contacto

- **Instagram:** [@theeliteway_b](https://www.instagram.com/theeliteway_b)
- **Teléfono:** [+57 333 738 0581](tel:+573337380581)

## Licencia

© 2026 Elite Way School Ballroom Bogotá. Todos los derechos reservados.
