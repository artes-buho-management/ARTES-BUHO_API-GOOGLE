'use strict';

const fs = require('fs');
const { google } = require('googleapis');
const config = require('../config');

/**
 * Cliente Service Account para cargas server-to-server (Sheets internas,
 * Drive compartido, etc.). Opcional: solo si existe el JSON en config/.
 */
function buildServiceAccountAuth(scopes) {
  const { serviceAccountPath } = config.gcp;
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `No existe service account en ${serviceAccountPath}. ` +
        'Generala en GCP Console y guardala ahi, o usa OAuth2 en su lugar.'
    );
  }
  return new google.auth.GoogleAuth({
    keyFile: serviceAccountPath,
    scopes: Array.isArray(scopes) ? scopes : [scopes],
  });
}

module.exports = { buildServiceAccountAuth };
