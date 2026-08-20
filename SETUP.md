# Elite Way School - Setup Guide

Guía completa para configurar el formulario de inscripción con Google Sheets y Google Apps Script.

## Requisitos

- Node.js 18+
- Cuenta de Google
- Git (opcional)

---

## Parte 1: Desarrollo local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar servidor de desarrollo

```bash
npm run dev
```

Visita `http://localhost:5173`.

---

## Parte 2: Google Apps Script

### Paso 1: Crear la hoja de cálculo

1. Ve a [Google Sheets](https://sheets.google.com).
2. Crea una hoja de cálculo en blanco.
3. Ponle el nombre que prefieras, por ejemplo **"Elite Way School Registrations"**.

### Paso 2: Crear el proyecto de Apps Script

1. Dentro de la hoja, ve a **Extensions → Apps Script**.
2. Borra el código por defecto.
3. Abre el archivo [`google-apps-script.md`](./google-apps-script.md) de este repositorio.
4. Copia **todo** el código.
5. Pégalo en el editor de Apps Script.
6. Guarda (`Ctrl+S` o el icono de disquete).
7. Nombra el proyecto: **"Elite Way School Form Handler"**.

### Paso 3: Desplegar como Web App

1. Haz clic en **Deploy → New deployment**.
2. Haz clic en el engranaje ⚙️ junto a **Select type**.
3. Selecciona **Web app**.
4. Configura:
   - **Description:** "Elite Way School Registration API"
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Haz clic en **Deploy**.
6. Cuando pida autorización, elige tu cuenta, luego **Advanced → Go to... → Allow**.
7. Copia la **Web App URL** (se ve como `https://script.google.com/macros/s/XXXXX/exec`).

### Paso 4: Probar el despliegue

1. En el editor de Apps Script, selecciona la función `testSubmission` del desplegable.
2. Ejecuta (**Run**).
3. Vuelve a la hoja de cálculo. Debería aparecer una hoja `Registrations` con una fila de prueba.
4. Si funciona, borra la fila de prueba.

### Paso 5: Configurar `.env`

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Edita `.env` y agrega la URL del despliegue:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

3. Reinicia el servidor:

```bash
npm run dev
```

### Paso 6: Probar una inscripción real

1. Abre `http://localhost:5173`.
2. Haz clic en **Inscríbete Ya!** o en el botón de inscripción.
3. Llena el formulario (se requiere mínimo una categoría y edad ≥ 18).
4. Sube el comprobante de pago si lo tienes (opcional).
5. Haz clic en **Confirmar Inscripción**.
6. Revisa la hoja `Registrations` — la inscripción debería aparecer.

---

## Parte 3: Desplegar a Netlify

### 1. Build de producción

```bash
npm run build
```

Esto crea la carpeta `dist/`.

### 2. Subir a Netlify

#### Opción A: Drag & Drop

1. Ve a [Netlify Drop](https://app.netlify.com/drop).
2. Arrastra la carpeta `dist/`.
3. Copia la URL de tu sitio.

#### Opción B: Integración con GitHub

1. Sube el código a GitHub.
2. En Netlify: **Add new site → Import an existing project → GitHub**.
3. Configura:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Agrega la variable de entorno:
   - `VITE_GOOGLE_SCRIPT_URL` con tu URL de Apps Script.
5. Despliega.

---

## Parte 4: Ver inscripciones

### Google Sheets

Las inscripciones se guardan en la hoja `Registrations` con las columnas:

- Timestamp
- Nombre Artístico
- Email
- Teléfono
- House/007
- Categorías
- Edad
- Screenshot

El enlace en la columna `Screenshot` apunta a una imagen guardada en la carpeta `elite-way-school-data/PAGOS_QR` de Google Drive.

### Exportar a Excel

1. Abre la hoja de cálculo.
2. **File → Download → Microsoft Excel (.xlsx)**.

---

## Troubleshooting

### El formulario no se envía

1. Abre la consola del navegador (F12).
2. Verifica que `.env` tenga la URL correcta.
3. Asegúrate de que el despliegue de Apps Script esté configurado como **Anyone**.

### No aparecen datos en la hoja

1. Vuelve a desplegar Apps Script (**Deploy → Manage deployments → Edit → New version → Deploy**).
2. Limpia la caché del navegador.
3. Ejecuta `testSubmission` en Apps Script para verificar.

### CORS

El frontend usa `mode: 'no-cors'` para las peticiones POST. Esto significa que no se puede leer la respuesta del servidor, pero el envío sí funciona. Confirma en la hoja de cálculo.

### La hoja `Registrations` está en el formato viejo

Borra la hoja `Registrations` en Google Sheets y envía una nueva inscripción. El script la recreará con los headers correctos.

---

## Contacto

- **Instagram:** [@theeliteway_b](https://www.instagram.com/theeliteway_b)
- **Teléfono:** [+57 333 738 0581](tel:+573337380581)

---

## Checklist

- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Dev server corriendo (`npm run dev`)
- [ ] Hoja de Google Sheets creada
- [ ] Código de `google-apps-script.md` copiado y guardado
- [ ] Web App desplegada con **Execute as: Me** y **Anyone**
- [ ] URL del despliegue copiada a `.env`
- [ ] Primer envío de formulario exitoso
- [ ] Sitio desplegado en Netlify

**¡Listo! Tu sitio de inscripciones de Elite Way School está en vivo.**
