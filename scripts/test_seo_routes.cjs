/**
 * Automated Verification Script for SEO Routes & Metadata
 */

const fs = require('fs');
const path = require('path');
const { ROUTES, renderRouteHtml, BUSINESS_INFO } = require('../serverSeoData.cjs');

const templatePath = path.join(__dirname, '..', 'dist', 'index.html');
const templateHtml = fs.readFileSync(templatePath, 'utf8');

const routesToTest = Object.keys(ROUTES);
const seenTitles = new Set();
const seenDescriptions = new Set();
const seenCanonicals = new Set();

let failures = 0;

console.log(`\n======================================================`);
console.log(`Running SEO Metadata Verification on ${routesToTest.length} Routes`);
console.log(`======================================================\n`);

routesToTest.forEach((route) => {
  const html = renderRouteHtml(templateHtml, route);

  // 1. Title Check
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  if (!title) {
    console.error(`❌ [${route}] Missing <title> tag!`);
    failures++;
  } else if (seenTitles.has(title)) {
    console.error(`❌ [${route}] Duplicate <title>: "${title}"`);
    failures++;
  } else {
    seenTitles.add(title);
  }

  // 2. Meta Description Check
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';

  if (!desc || desc.length < 30) {
    console.error(`❌ [${route}] Missing or too short meta description!`);
    failures++;
  } else if (seenDescriptions.has(desc)) {
    console.error(`❌ [${route}] Duplicate meta description!`);
    failures++;
  } else {
    seenDescriptions.add(desc);
  }

  // 3. Canonical Link Check
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';
  const expectedCanonical = `https://printplaza.net${route === '/' ? '/' : route}`;

  if (canonical !== expectedCanonical) {
    console.error(`❌ [${route}] Canonical mismatch! Expected "${expectedCanonical}", got "${canonical}"`);
    failures++;
  } else {
    seenCanonicals.add(canonical);
  }

  // 4. JSON-LD Schema Check
  const schemaMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  let parsedSchema = null;
  try {
    parsedSchema = schemaMatch ? JSON.parse(schemaMatch[1]) : null;
  } catch (err) {
    console.error(`❌ [${route}] Invalid JSON-LD Schema JSON:`, err.message);
    failures++;
  }

  if (!parsedSchema || !parsedSchema['@context']) {
    console.error(`❌ [${route}] Missing @context in JSON-LD schema!`);
    failures++;
  }

  // 5. Pre-rendered HTML Body Check
  const noscriptMatch = html.match(/<noscript>([\s\S]*?)<\/noscript>/i);
  const bodyText = noscriptMatch ? noscriptMatch[1].replace(/<[^>]+>/g, ' ') : '';
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  if (wordCount < 100) {
    console.error(`❌ [${route}] Pre-rendered body content too sparse: only ${wordCount} words.`);
    failures++;
  }

  console.log(`✓ [${route}]`);
  console.log(`   Title:       ${title}`);
  console.log(`   Canonical:   ${canonical}`);
  console.log(`   Schema Type: ${parsedSchema ? parsedSchema['@type'] : 'N/A'}`);
  console.log(`   Body Words:  ${wordCount} words\n`);
});

console.log(`======================================================`);
if (failures === 0) {
  console.log(`🎉 ALL ${routesToTest.length} ROUTES PASSED VERIFICATION! 0 DUPLICATES.`);
} else {
  console.error(`⚠️ Verification completed with ${failures} error(s).`);
  process.exit(1);
}
console.log(`======================================================\n`);
