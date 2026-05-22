'use strict';

/**
 * ARTES-BUHO_API-GOOGLE
 * Hub central de APIs de Google para la cuenta booking@artesbuhomanagement.com.
 *
 * Exporta:
 *  - clients: factorias listas para usar (gmail, drive, sheets, ...)
 *  - auth: helpers OAuth2 / Service Account
 *  - scopes: listas de scopes por servicio y agregados
 *  - config: configuracion leida de .env
 */

const clients = require('./clients');
const oauthClient = require('./auth/oauthClient');
const serviceAccount = require('./auth/serviceAccount');
const scopes = require('./scopes');
const config = require('./config');

module.exports = {
  clients,
  auth: { ...oauthClient, ...serviceAccount },
  scopes,
  config,
};
