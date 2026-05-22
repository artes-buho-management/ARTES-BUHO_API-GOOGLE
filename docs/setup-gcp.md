# Setup inicial GCP — booking@artesbuhomanagement.com

Guia paso a paso. Hacer **UNA SOLA VEZ**.
Despues cualquier proyecto ARTES BUHO se conecta importando este hub.

## 1. Crear proyecto GCP

1. Entra en https://console.cloud.google.com iniciando sesion con **booking@artesbuhomanagement.com**.
2. Arriba, selector de proyecto -> Nuevo proyecto.
3. Nombre: `artes-buho-api-google`.
4. Sin organizacion. Crear.
5. Copia el `Project ID` y ponlo en `.env` como `GOOGLE_CLOUD_PROJECT`.

## 2. Habilitar APIs

En "APIs y servicios" -> "Biblioteca", activa todas estas:

**Workspace**
- Gmail API
- Google Drive API
- Google Sheets API
- Google Docs API
- Google Slides API
- Google Calendar API
- People API
- Google Tasks API
- Google Forms API
- Google Chat API
- Google Keep API (si esta disponible en la cuenta)

**Media / marketing**
- YouTube Data API v3
- YouTube Analytics API
- Google Analytics Data API
- Google Search Console API
- My Business Account Management API
- My Business Business Information API
- Google Photos Library API

**Mapas / lugares** (API Key, no OAuth)
- Places API (New)
- Maps JavaScript API
- Geocoding API

**Meet**
- Google Meet API

## 3. Pantalla de consentimiento OAuth

"APIs y servicios" -> "Pantalla de consentimiento".

1. Tipo de usuario: **Externo** (o Interno si la cuenta es de Workspace con dominio).
2. Nombre de la app: `ARTES BUHO API Hub`.
3. Email de soporte: `booking@artesbuhomanagement.com`.
4. Dominios autorizados: `artesbuhomanagement.com`.
5. Email del desarrollador: `booking@artesbuhomanagement.com`.
6. Anadir scopes: pega los que devuelve `npm run list:scopes`.
7. Usuarios de prueba: anadir `booking@artesbuhomanagement.com` y cualquier otra cuenta que vaya a usar el hub.
8. Guardar.

> Si la app queda en estado "En pruebas", el refresh_token caduca en 7 dias. Para produccion: publicar la app o pedir verificacion.

## 4. Crear credenciales OAuth2

"APIs y servicios" -> "Credenciales" -> "Crear credenciales" -> "ID de cliente OAuth".

- Tipo de aplicacion: **Aplicacion de escritorio** (mas simple) o **Aplicacion web**.
- Si eliges Aplicacion web, anade URI de redireccion: `http://localhost:3000/oauth2/callback`.
- Nombre: `ARTES BUHO Hub Desktop`.
- Crear.
- Descarga el JSON o copia Client ID y Client Secret.

Rellena en `.env`:

```
GOOGLE_OAUTH_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=xxxxx
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/oauth2/callback
```

## 5. (Opcional) Service Account

Solo si necesitas procesos server-to-server sin login de usuario:

1. "Credenciales" -> "Crear credenciales" -> "Cuenta de servicio".
2. Nombre: `artes-buho-hub-sa`.
3. Rol: el minimo necesario (p. ej. `Editor` solo si hace falta).
4. Crear clave -> JSON -> descargar.
5. Guardar como `config/service-account.json` (ignorado por git).

## 6. API Keys (Places / Maps / YouTube publico)

"Credenciales" -> "Crear credenciales" -> "Clave de API".

- Crear una clave.
- Restringirla por API: Places API, Maps, Geocoding.
- Copiar a `.env` como `GOOGLE_PLACES_API_KEY` y `GOOGLE_MAPS_API_KEY`.
- Repetir para YouTube -> `YOUTUBE_API_KEY`.

## 7. Primer login OAuth del hub

En la carpeta del proyecto:

```
npm install
npm run oauth:setup
```

1. Abrira una URL en consola.
2. Abrela en el navegador e inicia sesion con **booking@artesbuhomanagement.com**.
3. Acepta todos los permisos.
4. Sera redirigido a `http://localhost:3000/...` y se guardara el token en `config/token.json`.

## 8. Verificar

```
npm run test:connection
```

Debe mostrar `[OK]` en Gmail, Drive, Calendar, Sheets, People, Tasks y YouTube.

## 9. Uso desde otro proyecto ARTES BUHO

Desde cualquier proyecto Node en el mismo PC:

```js
const hub = require('../ARTES-BUHO_API-GOOGLE/src');
const gmail = hub.clients.gmail();
const msgs = await gmail.users.messages.list({ userId: 'me', maxResults: 5 });
```

O vinculalo como dependencia local en tu `package.json`:

```json
"dependencies": {
  "artes-buho-api-google": "file:../ARTES-BUHO_API-GOOGLE"
}
```

## Troubleshooting

- `invalid_grant`: el refresh_token caduco. Re-ejecutar `npm run oauth:setup`.
- `access_denied`: la cuenta no esta en "Usuarios de prueba" de la OAuth consent screen.
- `API has not been used`: falta activarla en la biblioteca de APIs.
- Cuota 429: revisar `docs/apis.md` y subir cuota en GCP si aplica.
