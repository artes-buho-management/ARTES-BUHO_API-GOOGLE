# Arquitectura

## Vision general

Hub central de integracion con APIs de Google para el ecosistema ARTES BUHO.
Centraliza autenticacion, cuotas y wrappers reutilizables.

## Capas

1. **Auth** — gestion de credenciales (API keys, OAuth2, service accounts).
2. **Clients** — wrappers por API (Places, Sheets, Drive, Gmail, Calendar).
3. **Services** — logica de negocio compuesta (ej. buscar empresas + guardar en Sheets).
4. **Jobs/Scripts** — tareas programadas y utilidades.

## Entornos

- Local: Node/Python con `.env`.
- Apps Script: Script Properties.
- GCP: Secret Manager + Service Account.

## Flujo tipico

```
[Proyecto ARTES BUHO]
      |
      v
[API-GOOGLE] --auth--> [Google API]
      |
      v
[Respuesta normalizada]
```

## Decisiones

- Una sola clave Places compartida por proyectos ARTES BUHO para simplificar cuotas.
- Logs estructurados (JSON) para facilitar debug entre proyectos.
- Rate limiting centralizado en los clients.

## Pendientes de diseno

- Elegir lenguaje principal (Node vs Python vs Apps Script).
- Definir formato de logs.
- Definir estrategia de cache.
