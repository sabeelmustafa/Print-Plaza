const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const net = require('node:net');

async function check() {
  const root = path.resolve(__dirname, '..');
  const target = path.join(root, '.deploy');
  for (const file of ['server.cjs', 'production.cjs', 'quotationConfirmation.cjs', 'serverSeoData.cjs', 'database/production_migration.sql', 'dist/index.html']) {
    assert.ok(fs.existsSync(path.join(target, file)), `Deployment is missing ${file}`);
  }
  const socket = net.createServer();
  await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  // Test startup without connecting to any real database or mail service.
  const env = { ...process.env, PORT: String(port), DB_HOST: '', DB_USER: '', DB_NAME: '', NODE_ENV: 'test' };
  const server = spawn(process.execPath, ['server.cjs'], { cwd: target, env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  let output = '';
  server.stdout.on('data', data => { output += data; });
  server.stderr.on('data', data => { output += data; });
  const exited = new Promise(resolve => server.once('exit', resolve));
  try {
    let ready = false;
    for (let i = 0; i < 300; i++) {
      if (server.exitCode !== null) throw new Error(`Packaged server failed to start:\n${output}`);
      try {
        const response = await fetch(`http://127.0.0.1:${port}/admin`);
        assert.equal(response.status, 200);
        assert.match(await response.text(), /<html/i);
        ready = true;
        break;
      } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
    }
    assert.ok(ready, `Packaged server did not serve the admin page:\n${output}`);
    console.log('Packaged server starts and serves /admin successfully.');
  } finally { server.kill(); await exited; }
}
check().catch(error => { console.error(error.message); process.exitCode = 1; });
