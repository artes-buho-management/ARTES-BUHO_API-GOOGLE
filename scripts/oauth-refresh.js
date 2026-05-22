'use strict';

/**
 * Fuerza refresco del access token usando el refresh_token guardado.
 * Util para verificar que el refresh_token sigue valido.
 */

const { buildOAuthClient } = require('../src/auth/oauthClient');

async function main() {
  const client = buildOAuthClient();
  const res = await client.getAccessToken();
  if (res.token) {
    console.log('Access token refrescado OK. Expira pronto, se renueva solo.');
  } else {
    console.error('No se obtuvo token. Ejecuta `npm run oauth:setup`.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fallo refresh:', err.message);
  process.exit(1);
});
