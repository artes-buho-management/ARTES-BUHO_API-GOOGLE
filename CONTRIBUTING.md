# Guia de contribucion

## Flujo de trabajo

1. Crear rama desde `main`: `feat/...`, `fix/...`, `docs/...`.
2. Commits descriptivos en espanol, prefijo tipo `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
3. Probar en local antes de push.
4. PR a `main` con descripcion clara.

## Reglas de codigo

- No commitear `.env`, claves ni service accounts.
- Usar `.env.example` para documentar variables nuevas.
- Registrar toda API nueva en `docs/apis.md` y `docs/credenciales.md`.
- Preferir Google Places API antes que scraping.

## Push seguro

Si la politica local bloquea `git push`:

```
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\elrub\Desktop\CARPETA CODEX\03_SCRIPTS_UTILIDAD\publicar_desde_local.ps1" -RepoPath "C:\Users\elrub\Desktop\CARPETA CODEX\01_PROYECTOS\ARTES-BUHO_API-GOOGLE" -Remote origin -Branch main
```

## Revisiones

- Cambios multi-archivo: PR obligatorio.
- Cambios en credenciales o permisos: requiere confirmacion.
