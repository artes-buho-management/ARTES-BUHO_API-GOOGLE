'use strict';

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const config = require('../config');

/**
 * Cliente OAuth2 reutilizable para la cuenta booking@artesbuhomanagement.com.
 * Carga token persistido desde config/token.json si existe.
 */
function buildOAuthClient() {
  const { clientId, clientSecret, redirectUri, tokenPath } = config.oauth;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Faltan GOOGLE_OAUTH_CLIENT_ID o GOOGLE_OAUTH_CLIENT_SECRET en .env. ' +
        'Ejecuta la guia docs/setup-gcp.md y luego `npm run oauth:setup`.'
    );
  }

  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  if (fs.existsSync(tokenPath)) {
    const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    client.setCredentials(token);
  }

  // Persistir cualquier refresco automatico de tokens.
  client.on('tokens', (tokens) => {
    const existing = fs.existsSync(tokenPath)
      ? JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
      : {};
    const merged = { ...existing, ...tokens };
    fs.mkdirSync(path.dirname(tokenPath), { recursive: true });
    fs.writeFileSync(tokenPath, JSON.stringify(merged, null, 2));
  });

  return client;
}

function saveToken(tokens) {
  const { tokenPath } = config.oauth;
  fs.mkdirSync(path.dirname(tokenPath), { recursive: true });
  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
}

function hasToken() {
  return fs.existsSync(config.oauth.tokenPath);
}

module.exports = { buildOAuthClient, saveToken, hasToken };
