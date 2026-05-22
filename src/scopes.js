'use strict';

/**
 * Scopes OAuth para todas las APIs del ecosistema Google.
 * Se solicitan todos en el primer flujo OAuth para que la cuenta
 * booking@artesbuhomanagement.com quede autorizada de una sola vez.
 *
 * APIs que requieren autenticacion de USUARIO (OAuth2).
 * Las APIs publicas (Places, Maps, YouTube Data read) van por API Key.
 */

const SCOPES = {
  gmail: [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.labels',
    'https://www.googleapis.com/auth/gmail.settings.basic',
  ],
  drive: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata',
  ],
  sheets: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
  docs: [
    'https://www.googleapis.com/auth/documents',
  ],
  slides: [
    'https://www.googleapis.com/auth/presentations',
  ],
  calendar: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
  contacts: [
    'https://www.googleapis.com/auth/contacts',
    'https://www.googleapis.com/auth/contacts.other.readonly',
    'https://www.googleapis.com/auth/directory.readonly',
  ],
  tasks: [
    'https://www.googleapis.com/auth/tasks',
  ],
  // keep: scope no publico - requiere allowlist de Google. Omitido.
  forms: [
    'https://www.googleapis.com/auth/forms.body',
    'https://www.googleapis.com/auth/forms.responses.readonly',
  ],
  youtube: [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly',
  ],
  photos: [
    'https://www.googleapis.com/auth/photoslibrary',
  ],
  analytics: [
    'https://www.googleapis.com/auth/analytics.readonly',
  ],
  searchconsole: [
    'https://www.googleapis.com/auth/webmasters.readonly',
  ],
  mybusiness: [
    'https://www.googleapis.com/auth/business.manage',
  ],
  chat: [
    'https://www.googleapis.com/auth/chat.messages',
    'https://www.googleapis.com/auth/chat.spaces',
  ],
  meet: [
    'https://www.googleapis.com/auth/meetings.space.created',
    'https://www.googleapis.com/auth/meetings.space.readonly',
  ],
  profile: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
  ],
};

/** Devuelve todos los scopes como array plano y deduplicado. */
function allScopes() {
  const set = new Set();
  Object.values(SCOPES).forEach((arr) => arr.forEach((s) => set.add(s)));
  return [...set];
}

module.exports = { SCOPES, allScopes };
