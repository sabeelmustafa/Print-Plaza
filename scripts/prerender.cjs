/**
 * Static Site Pre-renderer for Print Plaza (printplaza.net)
 * Generates per-route static HTML files in dist/ with unique metadata and pre-rendered HTML.
 */

const fs = require('fs');
const path = require('path');
const { ROUTES, renderRouteHtml } = require('../serverSeoData.cjs');

const distDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.log('[PRERENDER] dist/ directory not found. Please run vite build first.');
  process.exit(0);
}

const templatePath = path.join(distDir, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.log('[PRERENDER] dist/index.html not found.');
  process.exit(0);
}

const baseHtml = fs.readFileSync(templatePath, 'utf8');

console.log('[PRERENDER] Generating static pre-rendered HTML for all routes...');

Object.keys(ROUTES).forEach((route) => {
  const renderedHtml = renderRouteHtml(baseHtml, route);

  if (route === '/') {
    fs.writeFileSync(templatePath, renderedHtml, 'utf8');
    console.log(`  ✓ Prerendered ${route} -> dist/index.html`);
  } else {
    const routeDirName = route.replace(/^\//, '');
    const routeDir = path.join(distDir, routeDirName);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    const targetFile = path.join(routeDir, 'index.html');
    fs.writeFileSync(targetFile, renderedHtml, 'utf8');
    console.log(`  ✓ Prerendered ${route} -> dist/${routeDirName}/index.html`);
  }
});

console.log('[PRERENDER] Completed static HTML generation for all routes.');
