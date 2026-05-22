'use strict';

const { google } = require('googleapis');
const { buildOAuthClient } = require('./auth/oauthClient');
const config = require('./config');

/**
 * Factorias de clientes Google listos para usar.
 * Todas usan el OAuth2 de booking@artesbuhomanagement.com salvo indicacion.
 *
 * Uso desde otro proyecto:
 *   const hub = require('artes-buho-api-google');
 *   const gmail = hub.clients.gmail();
 *   await gmail.users.messages.list({ userId: 'me' });
 */

let _oauth = null;
function auth() {
  if (!_oauth) _oauth = buildOAuthClient();
  return _oauth;
}

const clients = {
  // Workspace
  gmail: () => google.gmail({ version: 'v1', auth: auth() }),
  drive: () => google.drive({ version: 'v3', auth: auth() }),
  sheets: () => google.sheets({ version: 'v4', auth: auth() }),
  docs: () => google.docs({ version: 'v1', auth: auth() }),
  slides: () => google.slides({ version: 'v1', auth: auth() }),
  calendar: () => google.calendar({ version: 'v3', auth: auth() }),
  people: () => google.people({ version: 'v1', auth: auth() }),
  tasks: () => google.tasks({ version: 'v1', auth: auth() }),
  forms: () => google.forms({ version: 'v1', auth: auth() }),
  chat: () => google.chat({ version: 'v1', auth: auth() }),

  // Media / ads / data
  youtube: () => google.youtube({ version: 'v3', auth: auth() }),
  youtubeAnalytics: () =>
    google.youtubeAnalytics({ version: 'v2', auth: auth() }),
  analytics: () => google.analyticsdata({ version: 'v1beta', auth: auth() }),
  searchconsole: () =>
    google.searchconsole({ version: 'v1', auth: auth() }),
  mybusinessAccount: () =>
    google.mybusinessaccountmanagement({ version: 'v1', auth: auth() }),
  mybusinessInfo: () =>
    google.mybusinessbusinessinformation({ version: 'v1', auth: auth() }),

  // API Key (no requieren OAuth)
  placesKey: () => config.apiKeys.places,
  mapsKey: () => config.apiKeys.maps,
  youtubeKey: () => config.apiKeys.youtube,

  // Meta
  oauthClient: auth,
};

module.exports = clients;
