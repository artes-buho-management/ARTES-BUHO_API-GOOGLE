# ARTES-BUHO_API-GOOGLE

Proyecto de integracion con APIs de Google para ARTES BUHO.

## Objetivo

Centralizar el acceso y uso de **todas** las APIs de Google desde una unica cuenta:

**`booking@artesbuhomanagement.com`**

Cualquier proyecto de ARTES BUHO que necesite Gmail, Drive, Sheets, Calendar, YouTube, Analytics, etc. consume desde este hub — sin duplicar credenciales ni flujos OAuth.

## Arranque rapido

1. Leer [docs/setup-gcp.md](docs/setup-gcp.md) — crear proyecto GCP, activar APIs, generar credenciales OAuth.
2. `cp .env.example .env` y rellenar `GOOGLE_OAUTH_CLIENT_ID` y `GOOGLE_OAUTH_CLIENT_SECRET`.
3. `npm install`
4. `npm run oauth:setup` — login unico con la cuenta booking.
5. `npm run test:connection` — verifica que todas las APIs responden.
6. Ver [docs/uso-desde-proyectos.md](docs/uso-desde-proyectos.md) para integrar desde otros proyectos.

## Estructura

- `src/` — codigo fuente
- `scripts/` — scripts de utilidad y mantenimiento
- `config/` — configuracion y plantillas (sin secretos)
- `docs/` — documentacion tecnica
- `tests/` — pruebas

## Secretos / credenciales

No commitear claves. Usar:

- Variables de entorno locales (`.env`, ignorado en git)
- Script Properties de Apps Script
- Secret Manager de GCP cuando aplique

## APIs previstas

- Google Places API
- Google Sheets API
- Google Drive API
- Gmail API
- Google Calendar API
- OAuth2 / Service Accounts

## Estado

- PENDIENTE: definir alcance exacto y primer caso de uso
- PENDIENTE: crear proyecto GCP y habilitar APIs
- PENDIENTE: configurar credenciales

## Flujo git seguro

Si `git push` falla por politica local:

```
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\elrub\Desktop\CARPETA CODEX\03_SCRIPTS_UTILIDAD\publicar_desde_local.ps1" -RepoPath "C:\Users\elrub\Desktop\CARPETA CODEX\01_PROYECTOS\ARTES-BUHO_API-GOOGLE" -Remote origin -Branch main
```
