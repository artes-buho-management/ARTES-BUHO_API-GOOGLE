'use strict';

const { SCOPES, allScopes } = require('../src/scopes');

console.log('Scopes por servicio:');
for (const [service, list] of Object.entries(SCOPES)) {
  console.log(`\n[${service}]`);
  list.forEach((s) => console.log('  -', s));
}
console.log('\nTotal unicos:', allScopes().length);
