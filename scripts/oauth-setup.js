'use strict';

/**
 * Flujo OAuth2 inicial.
 * Ejecutar UNA VEZ: `npm run oauth:setup`
 *
 * 1. Abre el navegador con la URL de consentimiento.
 * 2. Inicia sesion con booking@artesbuhomanagement.com.
 * 3. Acepta todos los permisos.
 * 4. Copia el `code` de la URL de redireccion y pegalo aqui.
 * 5. Guarda el token en config/token.json para uso permanente.
 */

const http = require('http');
const url = require('url');
const readline = require('readline');
const { google } = require('googleapis');
const config = require('../src/config');
const { allScopes } = require('../src/scopes');
const { saveToken } = require('../src/auth/oauthClient');

async function main() {
  const { clientId, clientSecret, redirectUri } = config.oauth;
  if (!clientId || !clientSecret) {
    console.error(
      'ERROR: Configura GOOGLE_OAUTH_CLIENT_ID y GOOGLE_OAUTH_CLIENT_SECRET en .env'
    );
    console.error('Ver docs/setup-gcp.md para crear el cliente OAuth.');
    process.exit(1);
  }

  const oAuth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const scopes = allScopes();

  const authUrl = oAuth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
    login_hint: config.account.email,
  });

  console.log('\n=== OAuth2 setup ARTES-BUHO_API-GOOGLE ===');
  console.log(`Cuenta objetivo: ${config.account.email}`);
  console.log(`Scopes solicitados: ${scopes.length}`);
  console.log('\n1) Abre esta URL en el navegador:\n');
  console.log(authUrl);
  console.log('\n2) Inicia sesion con la cuenta objetivo y acepta.');
  console.log('3) Sera redirigido a', redirectUri);

  // Si el redirect es localhost, levantamos servidor para capturar el code.
  const parsed = new URL(redirectUri);
  if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
    await captureCodeViaServer(oAuth2, parsed);
  } else {
    await captureCodeViaPrompt(oAuth2);
  }
}

function captureCodeViaServer(oAuth2, parsed) {
  return new Promise((resolve, reject) => {
    const port = Number(parsed.port || 3000);
    const server = http.createServer(async (req, res) => {
      try {
        const q = url.parse(req.url, true).query;
        if (!q.code) {
          res.writeHead(400);
          res.end('Falta ?code en la URL');
          return;
        }
        const { tokens } = await oAuth2.getToken(q.code);
        saveToken(tokens);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(
          '<h1>OK</h1><p>Token guardado. Puedes cerrar esta ventana.</p>'
        );
        console.log('\nToken guardado en', config.oauth.tokenPath);
        server.close();
        resolve();
      } catch (err) {
        res.writeHead(500);
        res.end('Error: ' + err.message);
        reject(err);
      }
    });
    server.listen(port, () => {
      console.log(`\nEsperando callback en http://localhost:${port}...`);
    });
  });
}

function captureCodeViaPrompt(oAuth2) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('\nPega aqui el `code` de la URL de redireccion: ', async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2.getToken(code.trim());
        saveToken(tokens);
        console.log('Token guardado en', config.oauth.tokenPath);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

main().catch((err) => {
  console.error('Fallo OAuth setup:', err.message);
  process.exit(1);
});
