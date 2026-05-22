'use strict';

const path = require('path');

const ROOT = path.resolve(__dirname, '..');
// Cargar .env desde la raiz del hub, sea quien sea el proceso que lo importa.
require('dotenv').config({ path: path.join(ROOT, '.env') });

const config = {
  account: {
    email: process.env.GOOGLE_ACCOUNT_EMAIL || 'booking@artesbuhomanagement.com',
  },
  gcp: {
    project: process.env.GOOGLE_CLOUD_PROJECT || '',
    serviceAccountPath:
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      path.join(ROOT, 'config', 'service-account.json'),
  },
  oauth: {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
    redirectUri:
      process.env.GOOGLE_OAUTH_REDIRECT_URI ||
      'http://localhost:3000/oauth2/callback',
    tokenPath: path.join(ROOT, 'config', 'token.json'),
  },
  apiKeys: {
    places: process.env.GOOGLE_PLACES_API_KEY || '',
    maps: process.env.GOOGLE_MAPS_API_KEY || '',
    youtube: process.env.YOUTUBE_API_KEY || '',
  },
  paths: {
    root: ROOT,
    config: path.join(ROOT, 'config'),
  },
};

module.exports = config;
