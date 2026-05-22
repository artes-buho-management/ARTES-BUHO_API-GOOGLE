# CLAUDE.md — ARTES-BUHO_API-GOOGLE

## Objetivo del proyecto

Hub de integracion con APIs de Google para el ecosistema ARTES BUHO.

## Reglas especificas

1. No commitear claves, tokens ni service accounts.
2. Toda clave nueva debe documentarse en `docs/credenciales.md` (solo nombre, no valor).
3. Usar Google Places API para discovery (NO scraping de Google Search).
4. Apps Script: configurar siempre via Script Properties.
5. Node/local: usar `.env` (ignorado por git).

## Estructura

- `src/` — codigo principal
- `scripts/` — utilidades
- `config/` — configuracion sin secretos
- `docs/` — documentacion
- `tests/` — pruebas

## APIs en uso

Listar aqui cada API habilitada y su proposito segun se vayan anadiendo.

| API | Uso | Fecha alta |
|-----|-----|-----------|
| (pendiente) | - | - |

## Dependencias con otros proyectos ARTES BUHO

- APP_ARTES-BUHO_BUSCA-CONTACTOS — usa Google Places
- APP_ARTES-BUHO_DISTRITOS-MADRID — scope empresas adjudicatarias
- ARTES-BUHO_GMAIL — Gmail API
- ARTES-BUHO_RAMON — Drive API (incluye copias CRM y organizador, antes en ARTES-BUHO_DRIVE-COPIA-SEGURIDAD, destruido 2026-04-20)

Coordinar claves/proyectos GCP para evitar duplicar cuotas.
