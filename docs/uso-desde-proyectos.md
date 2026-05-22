# Uso desde otros proyectos ARTES BUHO

Este hub centraliza la conexion a Google via la cuenta
**booking@artesbuhomanagement.com**. Cualquier proyecto que necesite Gmail,
Drive, Sheets, Calendar, YouTube, etc. debe consumir desde aqui.

## Opcion A — Dependencia local (recomendado para Node)

En el `package.json` del proyecto consumidor:

```json
"dependencies": {
  "artes-buho-api-google": "file:../ARTES-BUHO_API-GOOGLE"
}
```

Luego `npm install` y:

```js
const hub = require('artes-buho-api-google');

async function leerUltimoEmail() {
  const gmail = hub.clients.gmail();
  const r = await gmail.users.messages.list({ userId: 'me', maxResults: 1 });
  return r.data.messages;
}
```

## Opcion B — Require relativo

```js
const hub = require('../../01_PROYECTOS/ARTES-BUHO_API-GOOGLE/src');
```

## Opcion C — Apps Script

Apps Script NO puede requerir Node. En su lugar:

1. Usar el mismo `GOOGLE_OAUTH_CLIENT_ID` en Script Properties si haces OAuth propio.
2. O publicar este hub como Web App / API y llamarlo via `UrlFetchApp`.
3. O mantener Apps Script con sus servicios nativos (GmailApp, DriveApp) — ya estan autenticados por el usuario que ejecuta el script; en ese caso solo usa este hub para lo que Apps Script no cubre.

## Clientes disponibles

| Metodo | API | Uso tipico |
|--------|-----|-----------|
| `clients.gmail()` | Gmail v1 | Leer, enviar, etiquetas |
| `clients.drive()` | Drive v3 | Archivos, permisos, busqueda |
| `clients.sheets()` | Sheets v4 | Leer/escribir celdas |
| `clients.docs()` | Docs v1 | Generar documentos |
| `clients.slides()` | Slides v1 | Presentaciones |
| `clients.calendar()` | Calendar v3 | Eventos, disponibilidad |
| `clients.people()` | People v1 | Contactos |
| `clients.tasks()` | Tasks v1 | Listas de tareas |
| `clients.forms()` | Forms v1 | Formularios y respuestas |
| `clients.chat()` | Chat v1 | Mensajes Google Chat |
| `clients.youtube()` | YouTube Data v3 | Canales, videos, playlists |
| `clients.youtubeAnalytics()` | YT Analytics v2 | Metricas YouTube |
| `clients.analytics()` | GA Data v1beta | Google Analytics 4 |
| `clients.searchconsole()` | Search Console v1 | Datos SEO |
| `clients.mybusinessAccount()` | My Business | Cuentas de negocio |
| `clients.mybusinessInfo()` | My Business | Info de ubicaciones |
| `clients.placesKey()` | Places (API Key) | Devuelve la API Key |
| `clients.mapsKey()` | Maps (API Key) | Devuelve la API Key |

## Ejemplos rapidos

### Enviar email

```js
const hub = require('artes-buho-api-google');
const gmail = hub.clients.gmail();

const raw = Buffer.from(
  'To: destino@ejemplo.com\r\n' +
  'From: booking@artesbuhomanagement.com\r\n' +
  'Subject: Hola\r\n\r\n' +
  'Mensaje de prueba desde el hub.'
).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
```

### Leer una hoja de Sheets

```js
const hub = require('artes-buho-api-google');
const sheets = hub.clients.sheets();
const r = await sheets.spreadsheets.values.get({
  spreadsheetId: 'XXXX',
  range: 'Hoja 1!A1:D10',
});
console.log(r.data.values);
```

### Crear evento en Calendar

```js
const hub = require('artes-buho-api-google');
const cal = hub.clients.calendar();
await cal.events.insert({
  calendarId: 'primary',
  requestBody: {
    summary: 'Bolo RUBEN COTON',
    start: { dateTime: '2026-05-10T22:00:00+02:00' },
    end: { dateTime: '2026-05-11T02:00:00+02:00' },
  },
});
```

### Places (API Key)

```js
const hub = require('artes-buho-api-google');
const key = hub.clients.placesKey();
const r = await fetch(
  `https://places.googleapis.com/v1/places:searchText`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress',
    },
    body: JSON.stringify({ textQuery: 'bodas en Madrid' }),
  }
);
console.log(await r.json());
```
