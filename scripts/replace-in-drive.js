const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(__dirname, '..', 'config', 'token.json');
const ENV_PATH = path.join(__dirname, '..', '.env');

// Load .env manually
const envContent = fs.readFileSync(ENV_PATH, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const CLIENT_ID = env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = env.GOOGLE_OAUTH_CLIENT_SECRET;

async function refreshToken() {
  const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));

  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: tokenData.refresh_token,
      grant_type: 'refresh_token'
    }).toString();

    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const json = JSON.parse(data);
        if (json.error) return reject(new Error(json.error_description || json.error));
        // Update token file
        tokenData.access_token = json.access_token;
        tokenData.expiry_date = Date.now() + (json.expires_in * 1000);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
        resolve(json.access_token);
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function searchFiles(accessToken, fileName, folderId) {
  const query = encodeURIComponent(
    `name='${fileName.replace(/'/g, "\\'")}' and '${folderId}' in parents and trashed=false`
  );

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: `/drive/v3/files?q=${query}&fields=files(id,name)`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Search failed ${res.statusCode}: ${data}`));
        }
        const json = JSON.parse(data);
        resolve(json.files || []);
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function deleteFile(accessToken, fileId) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: `/drive/v3/files/${fileId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        // 204 No Content = success
        if (res.statusCode === 204 || res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Delete failed ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function uploadFile(accessToken, filePath, fileName, mimeType, folderId) {
  const fileSize = fs.statSync(filePath).size;
  console.log(`Uploading ${fileName} (${(fileSize / 1024 / 1024).toFixed(1)} MB)...`);

  // Step 1: Initiate resumable upload
  const initUrl = await new Promise((resolve, reject) => {
    const metadata = JSON.stringify({
      name: fileName,
      parents: [folderId]
    });

    const req = https.request({
      hostname: 'www.googleapis.com',
      path: '/upload/drive/v3/files?uploadType=resumable',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(metadata),
        'X-Upload-Content-Type': mimeType,
        'X-Upload-Content-Length': fileSize
      }
    }, (res) => {
      if (res.statusCode === 200) {
        resolve(res.headers.location);
      } else {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => reject(new Error(`Init failed ${res.statusCode}: ${data}`)));
      }
    });
    req.on('error', reject);
    req.write(metadata);
    req.end();
  });

  console.log('Resumable session started. Uploading...');

  // Step 2: Upload in chunks (5 MB each)
  const CHUNK_SIZE = 5 * 1024 * 1024;
  const fd = fs.openSync(filePath, 'r');
  let offset = 0;

  while (offset < fileSize) {
    const chunkEnd = Math.min(offset + CHUNK_SIZE, fileSize);
    const chunkLen = chunkEnd - offset;
    const buffer = Buffer.alloc(chunkLen);
    fs.readSync(fd, buffer, 0, chunkLen, offset);

    const result = await new Promise((resolve, reject) => {
      const url = new URL(initUrl);
      const req = https.request({
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'PUT',
        headers: {
          'Content-Length': chunkLen,
          'Content-Range': `bytes ${offset}-${chunkEnd - 1}/${fileSize}`
        }
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve({ done: true, data: JSON.parse(data) });
          } else if (res.statusCode === 308) {
            resolve({ done: false });
          } else {
            reject(new Error(`Upload chunk failed ${res.statusCode}: ${data}`));
          }
        });
      });
      req.on('error', reject);
      req.write(buffer);
      req.end();
    });

    const pct = ((chunkEnd / fileSize) * 100).toFixed(0);
    console.log(`  ${pct}% (${(chunkEnd / 1024 / 1024).toFixed(1)} MB / ${(fileSize / 1024 / 1024).toFixed(1)} MB)`);

    if (result.done) {
      fs.closeSync(fd);
      return result.data;
    }
    offset = chunkEnd;
  }
  fs.closeSync(fd);
}

async function main() {
  const filePath = process.argv[2];
  const fileName = process.argv[3] || path.basename(filePath);
  const folderId = process.argv[4] || '';
  const mimeType = process.argv[5] || 'application/octet-stream';

  if (!filePath || !folderId) {
    console.log('Usage: node replace-in-drive.js <filePath> <fileName> <folderId> [mimeType]');
    process.exit(1);
  }

  console.log('Refreshing OAuth token...');
  const token = await refreshToken();
  console.log('Token refreshed OK');

  // Search for existing files with the same name in the folder
  console.log(`Searching for existing files named "${fileName}" in folder ${folderId}...`);
  const existing = await searchFiles(token, fileName, folderId);

  if (existing.length === 0) {
    console.log('No existing file found. Uploading as new file...');
  } else {
    console.log(`Found ${existing.length} existing file(s). Deleting...`);
    for (const file of existing) {
      console.log(`  Deleting: ${file.name} (${file.id})`);
      await deleteFile(token, file.id);
      console.log(`  Deleted OK`);
    }
  }

  // Upload the new file
  const result = await uploadFile(token, filePath, fileName, mimeType, folderId);
  console.log(`\nDONE! File ID: ${result.id}`);
  console.log(`View: https://drive.google.com/file/d/${result.id}/view`);
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
