# Admin Authentication Setup Guide

Guía para configurar y usar la autenticación del panel de administración de Elite Way School.

## Resumen

El panel admin usa una hoja de Google Sheets (`Users`) como base de datos simple de usuarios. No requiere servicios de autenticación externos.

## Requisitos previos

- Seguir el setup de [`SETUP.md`](./SETUP.md) primero.
- El código de [`google-apps-script.md`](./google-apps-script.md) debe estar copiado y desplegado en Apps Script.

## Instrucciones de configuración

### Paso 1: Desplegar el script actualizado

1. Abre tu hoja de Google Sheets.
2. Ve a **Extensions → Apps Script**.
3. Asegúrate de que el código esté copiado desde [`google-apps-script.md`](./google-apps-script.md).
4. Guarda y despliega una nueva versión: **Deploy → Manage deployments → Edit → New version → Deploy**.

### Paso 2: Verificar la hoja de usuarios

1. Vuelve a tu hoja de cálculo.
2. El script crea automáticamente una hoja llamada **Users** (aunque la función interna se llame `initializeAdminsSheet`).
3. Las columnas son:
   - **Email** — correo del usuario
   - **Password Hash** — hash SHA-256 de la contraseña
   - **Role** — `admin` o `viewer`
   - **Name** — nombre para mostrar

4. Debería existir un usuario por defecto:
   - Email: `admin@elite.com`
   - Password: `admin123`
   - Role: `admin`

### Paso 3: Probar login

1. En desarrollo: `http://localhost:5173/admin`
2. En producción: `https://tu-sitio.netlify.app/admin`
3. Ingresa:
   - **Email:** `admin@elite.com`
   - **Password:** `admin123`
4. Si todo está bien, entrarás al panel.

---

## Gestión de usuarios

### Crear un nuevo usuario

1. Abre la hoja **Users**.
2. Genera el hash SHA-256 de la contraseña.

#### Generar hash de contraseña

En el editor de Apps Script, crea y ejecuta esta función:

```javascript
function generatePasswordHash() {
  const password = 'tu_contraseña_aqui';
  const hash = Utilities.base64Encode(
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      password
    )
  );
  Logger.log(hash);
}
```

1. Reemplaza `'tu_contraseña_aqui'` por la contraseña deseada.
2. Ejecuta la función (**Run**).
3. Copia el hash del **Execution log**.
4. Agrega una fila en la hoja **Users**:
   - Email: correo del nuevo usuario
   - Password Hash: el hash copiado
   - Role: `admin` o `viewer`
   - Name: nombre para mostrar

### Cambiar una contraseña

1. Genera un nuevo hash (ver arriba).
2. Reemplaza el hash en la hoja **Users**.

### Eliminar un usuario

Simplemente borra su fila en la hoja **Users**.

---

## Roles

- **`admin`** — Acceso completo: puede editar/eliminar inscripciones, gestionar staff, cambiar visibilidad, etc.
- **`viewer`** (o cualquier otro valor) — Solo lectura: ve inscripciones y staff, pero no puede realizar acciones. El bloqueo se aplica tanto en UI como en el backend.

Para crear un usuario con permisos de solo lectura, asigna el rol `viewer`.

---

## Seguridad

- Las contraseñas se almacenan como hash SHA-256, nunca en texto plano.
- La sesión del admin dura **24 horas** y se guarda en `localStorage`.
- Mantén privada la hoja de Google Sheets.
- Cambia la contraseña por defecto (`admin123`) en producción.

---

## Panel de administración

Una vez logueado, los administradores pueden:

- Ver estadísticas de inscripciones.
- Ver listado de participantes con acciones (confirmar pago, editar, eliminar).
- Ver y gestionar el directorio de staff.
- Exportar datos a Excel desde Google Sheets.

---

## Troubleshooting

### "Credenciales inválidas"

- Verifica email y contraseña.
- Asegúrate de que el hash en la hoja **Users** sea correcto.
- Confirma que el despliegue de Apps Script esté actualizado.

### No se crea la hoja Users

- Ejecuta manualmente `initializeAdminsSheet()` en Apps Script.
- O crea la hoja manualmente con los headers: `Email, Password Hash, Role, Name`.

### El login no carga

- Revisa la consola del navegador (F12).
- Verifica `VITE_GOOGLE_SCRIPT_URL` en `.env`.
- Asegúrate de que el despliegue tenga acceso **Anyone**.

### Sesión expirada

- Las sesiones duran 24 horas.
- Vuelve a iniciar sesión.

---

## Credenciales por defecto

**Email:** `admin@elite.com`  
**Password:** `admin123`

⚠️ **Importante:** cambia la contraseña por defecto antes de poner el sitio en producción.

---

## Checklist

- [ ] Código de `google-apps-script.md` copiado y desplegado
- [ ] Nueva versión del despliegue publicada
- [ ] Hoja `Users` creada con usuario por defecto
- [ ] Login con credenciales por defecto probado
- [ ] Contraseña por defecto cambiada
- [ ] Usuarios adicionales agregados (si aplica)
- [ ] Panel de admin accedido correctamente

**¡Autenticación de administrador lista!**
