const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { createCachedLoader } = require('../publicCatalog.cjs');
const session = require('../customerSession.cjs');
const { decodeArtwork } = require('../artwork.cjs');
const finance = require('../orderFinance.cjs');
const confirm = require('../quotationConfirmation.cjs');

const parseJson = (value, fallback) => typeof value === 'string' ? JSON.parse(value) : value || fallback;
const response = () => ({ code: 200, status(value) { this.code = value; return this; }, json(value) { this.body = value; return this; } });

test('customer sessions reject tampering, malformed cookies and expired logins', () => {
  const user = { uid: 'customer-a', email: 'a@example.test' };
  const token = session.sign(user, 1000);
  assert.deepEqual(session.verify(token, 2000), user);
  assert.equal(session.verify(token, 1000 + 12 * 60 * 60 * 1000), null);
  assert.equal(session.verify(token.replace(token[0], token[0] === 'a' ? 'b' : 'a'), 2000), null);
  assert.equal(session.verify('bad.cookie'), null);
  assert.equal(session.verify(null), null);
});

test('catalog cache coalesces simultaneous loads and invalidates after a save', async () => {
  let calls = 0;
  const cache = createCachedLoader(async () => ({ version: ++calls }));
  const values = await Promise.all([cache.get(), cache.get(), cache.get()]);
  assert.equal(calls, 1);
  assert.deepEqual(values.map(x => x.version), [1, 1, 1]);
  await cache.get(); assert.equal(calls, 1);
  cache.invalidate(); assert.equal((await cache.get()).version, 2);
});

test('failed catalog loads are retried; invalidating an in-flight request cannot restore stale data', async () => {
  let rejectLoad;
  const failed = createCachedLoader(() => new Promise((_, reject) => { rejectLoad = reject; }));
  const waiting = failed.get(); await Promise.resolve(); rejectLoad(new Error('Database unavailable'));
  await assert.rejects(waiting);
  let resolveOld;
  let calls = 0;
  const cache = createCachedLoader(() => ++calls === 1 ? new Promise(resolve => { resolveOld = resolve; }) : 'new');
  const old = cache.get(); await Promise.resolve(); cache.invalidate();
  assert.equal(await cache.get(), 'new'); resolveOld('old'); await old;
  assert.equal(await cache.get(), 'new');
});

test('artwork accepts supported binary files and rejects empty, oversized and executable uploads', () => {
  assert.equal(decodeArtwork({ fileName: 'proof.pdf', data: Buffer.from('%PDF-test').toString('base64') }).extension, '.pdf');
  for (const input of [{ fileName: 'page.html', data: 'YQ==' }, { fileName: 'proof.pdf', data: '' }, { fileName: 'proof.pdf', data: 'invalid!' }, { fileName: 'proof.zip', data: Buffer.alloc(8 * 1024 * 1024 + 1).toString('base64') }]) assert.throws(() => decodeArtwork(input));
});

test('price-only edits preserve notes, due dates, currency and PJO membership, including a zero selling price', async () => {
  let update;
  const conn = { beginTransaction: async () => {}, commit: async () => {}, rollback: async () => {}, release() {}, query: async (sql, args) => {
    if (sql.startsWith('SELECT')) return [[{ cost_price: 12, sell_price: 25, currency_code: 'USD', invoice_notes: 'Keep this', payment_due_date: '2026-10-01', options_json: { productionJobId: 'pjo-a', pjoNumber: 'PJO-A' } }]];
    update = args; return [{}];
  } };
  const res = response();
  await finance({ pool: { getConnection: async () => conn }, parseJson, normalizeCurrency: x => x })({ params: { id: 'order-a' }, body: { sellPrice: 0, pjoNumber: 'FORGED' } }, res, error => { throw error; });
  assert.equal(res.code, 200); assert.equal(update[1], 0); assert.equal(update[3], 'USD'); assert.equal(update[4], 'Keep this'); assert.equal(update[5], '2026-10-01'); assert.equal(JSON.parse(update[6]).pjoNumber, 'PJO-A');
});

test('customer confirmation cannot change quoted prices or confirm someone else’s quotation', async () => {
  let insert;
  const quote = { id: 'q', status: 'approved', user_email: 'owner@example.test', quoted_price: 500, currency_code: 'PKR', options_json: {} };
  const conn = { beginTransaction: async () => {}, commit: async () => {}, rollback: async () => {}, release() {}, query: async (sql, args) => { if (sql.startsWith('SELECT')) return [[quote]]; if (sql.includes('INSERT INTO orders')) insert = args; return [{}]; } };
  const handler = confirm({ pool: { getConnection: async () => conn }, parseJson, createId: () => 'o' });
  const req = { params: { id: 'q' }, customer: { email: 'owner@example.test' }, body: { sellPrice: 1, costPrice: 100, currency: 'USD' } };
  const res = response(); await handler(req, res, error => { throw error; });
  assert.equal(insert[9], 500); assert.equal(insert[10], 0); assert.equal(insert[12], 'PKR');
  const denied = response(); await handler({ ...req, customer: { email: 'other@example.test' } }, denied, error => { throw error; });
  assert.equal(denied.code, 403);
  quote.status = 'new'; const unreviewed = response(); await handler(req, unreviewed, error => { throw error; }); assert.equal(unreviewed.code, 409);
});

test('HTTP access checks, customer login/session/logout, and account-scoped queries', async t => {
  const root = path.resolve(__dirname, '..');
  const rootRequire = createRequire(path.join(root, 'server.cjs'));
  const express = rootRequire('express');
  let app, listen;
  const queries = [];
  const customer = { id: 'a', user_email: 'owner@example.test', user_name: 'Owner', password_plain: 'test-password' };
  const pool = { query: async (sql, args = []) => {
    queries.push({ sql, args });
    if (sql.startsWith('SELECT * FROM customers WHERE LOWER')) return [[customer]];
    if (sql.startsWith('SELECT id, name, max_quantity FROM products')) return [args[0] === 'listed-card' ? [{ id: 'listed-card', name: 'Listed Business Cards', max_quantity: 10000 }] : []];
    return [[]];
  } };
  const fakeExpress = Object.assign(() => { app = express(); listen = app.listen.bind(app); app.listen = () => {}; return app; }, express);
  const sandbox = { require: name => name === 'express' ? fakeExpress : name === 'mysql2/promise' ? { createPool: () => pool } : name === 'dotenv' ? { config() {} } : rootRequire(name), __dirname: root, console: { log() {}, warn() {}, error() {} }, process: { env: { DB_HOST: 'test', DB_USER: 'test', DB_NAME: 'test', ADMIN_PASSWORD: 'admin-password', ADMIN_SESSION_SECRET: 'unit-test-secret' } }, Buffer, setInterval() {}, clearInterval() {}, setTimeout, URL, module: { exports: {} } };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'server.cjs'), 'utf8'), sandbox, { filename: 'server.cjs' });
  const server = listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const url of ['/api/orders', '/api/quotations', '/api/admin/customers']) assert.equal((await fetch(base + url)).status, 401);
  const login = await fetch(base + '/api/customer/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: customer.user_email, password: customer.password_plain }) });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  assert.match(login.headers.get('set-cookie'), /HttpOnly/);
  const restored = await fetch(base + '/api/customer/session', { headers: { cookie } });
  assert.equal((await restored.json()).user.email, customer.user_email);
  await fetch(base + '/api/orders?userEmail=victim@example.test', { headers: { cookie } });
  const orderQuery = queries.find(q => q.sql.startsWith('SELECT o.*'));
  assert.equal(orderQuery.args[0], customer.user_email);
  await fetch(base + '/api/quotations', { headers: { cookie } });
  assert.equal(queries.find(q => q.sql.startsWith('SELECT * FROM quotations')).args[0], customer.user_email);
  assert.equal((await fetch(base + '/api/admin/customers', { headers: { cookie } })).status, 401);
  const logout = await fetch(base + '/api/customer/logout', { method: 'POST', headers: { cookie } });
  assert.match(logout.headers.get('set-cookie'), /Expires=Thu, 01 Jan 1970/);
  assert.equal((await fetch(base + '/api/does-not-exist')).status, 404);
  assert.equal((await fetch(base + '/api/admin/session', { headers: { cookie: 'pp_admin_session=%ZZ' } })).status, 200);
  const postQuote = productId => fetch(base + '/api/quotations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, productName: 'Invented packaging name', userName: 'Owner', userEmail: customer.user_email, quantity: 1000, quoteStatus: 'approved', quotedPrice: 1 }) });
  assert.equal((await postQuote('unlisted-product')).status, 400);
  assert.equal((await postQuote('listed-card')).status, 201);
  const insertedQuote = queries.find(q => q.sql.includes('INSERT INTO quotations'));
  assert.equal(insertedQuote.args[8], 'Listed Business Cards');
  assert.equal(insertedQuote.args[10], 0);
  assert.equal(insertedQuote.args[12], 'new');
  assert.ok(!queries.some(q => q.sql.includes('UPDATE customers')));
});
