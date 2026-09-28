const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = path.join(root, '.deploy');
if (!fs.existsSync(path.join(root, 'dist/index.html'))) throw new Error('Build the frontend before preparing deployment.');
fs.mkdirSync(target, { recursive: true });
fs.cpSync(path.join(root, 'dist'), target, { recursive: true });
fs.cpSync(path.join(root, 'dist'), path.join(target, 'dist'), { recursive: true });
// Copy every root server module, including modules introduced by new features.
for (const name of fs.readdirSync(root).filter(name => name.endsWith('.cjs'))) {
  fs.copyFileSync(path.join(root, name), path.join(target, name));
}
for (const name of ['package.json', 'package-lock.json', '.npmrc']) {
  fs.copyFileSync(path.join(root, name), path.join(target, name));
}
fs.cpSync(path.join(root, 'database'), path.join(target, 'database'), { recursive: true });
fs.mkdirSync(path.join(target, 'tmp'), { recursive: true });
fs.writeFileSync(path.join(target, 'tmp/restart.txt'), new Date().toISOString());
console.log('Deployment package includes frontend, server modules, database migrations and Passenger restart marker.');
