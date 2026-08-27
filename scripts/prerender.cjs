/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs');
const path = require('path');
const { ALL_SEO_ROUTES, renderRouteHtml } = require('../serverSeoData.cjs');

const distDir = path.join(__dirname, '..', 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[PRERENDER] dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf8');

console.log('[PRERENDER] Generating static pre-rendered HTML for all routes...');

for (const [routePath] of Object.entries(ALL_SEO_ROUTES)) {
  const renderedHtml = renderRouteHtml(templateHtml, routePath);

  if (routePath === '/') {
    fs.writeFileSync(path.join(distDir, 'index.html'), renderedHtml, 'utf8');
    console.log(`  ✓ Prerendered / -> dist/index.html`);
  } else {
    const routeFolder = path.join(distDir, routePath.replace(/^\//, ''));
    if (!fs.existsSync(routeFolder)) {
      fs.mkdirSync(routeFolder, { recursive: true });
    }
    fs.writeFileSync(path.join(routeFolder, 'index.html'), renderedHtml, 'utf8');
    console.log(`  ✓ Prerendered ${routePath} -> dist/${routePath.replace(/^\//, '')}/index.html`);
  }
}

console.log('[PRERENDER] Completed static HTML generation for all routes.');
