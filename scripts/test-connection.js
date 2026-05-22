'use strict';

/**
 * Verifica que el token OAuth funciona contra varias APIs.
 * Ejecutar: `npm run test:connection`
 */

const { clients, config } = require('../src');

async function main() {
  console.log('Probando conexion con', config.account.email);
  console.log('---');

  const checks = [
    ['Gmail', async () => {
      const gmail = clients.gmail();
      const r = await gmail.users.getProfile({ userId: 'me' });
      return r.data.emailAddress;
    }],
    ['Drive', async () => {
      const drive = clients.drive();
      const r = await drive.about.get({ fields: 'user(emailAddress)' });
      return r.data.user.emailAddress;
    }],
    ['Calendar', async () => {
      const cal = clients.calendar();
      const r = await cal.calendarList.list({ maxResults: 1 });
      return `${r.data.items?.length || 0} calendarios visibles`;
    }],
    ['Sheets', async () => {
      const sheets = clients.sheets();
      // No hay endpoint ping: comprobamos que el cliente se construye.
      return sheets ? 'cliente ok' : 'sin cliente';
    }],
    ['People', async () => {
      const people = clients.people();
      const r = await people.people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses',
      });
      return r.data.emailAddresses?.[0]?.value || 'sin email';
    }],
    ['Tasks', async () => {
      const tasks = clients.tasks();
      const r = await tasks.tasklists.list({ maxResults: 1 });
      return `${r.data.items?.length || 0} listas`;
    }],
    ['YouTube', async () => {
      const yt = clients.youtube();
      const r = await yt.channels.list({ part: ['snippet'], mine: true });
      return r.data.items?.[0]?.snippet?.title || 'sin canal';
    }],
  ];

  let ok = 0;
  let fail = 0;
  for (const [name, fn] of checks) {
    try {
      const result = await fn();
      console.log(`  [OK]   ${name.padEnd(12)} -> ${result}`);
      ok++;
    } catch (err) {
      console.log(`  [FAIL] ${name.padEnd(12)} -> ${err.message}`);
      fail++;
    }
  }

  console.log('---');
  console.log(`Resultado: ${ok} OK, ${fail} FAIL`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
