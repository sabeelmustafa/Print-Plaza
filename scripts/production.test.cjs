const { test } = require('node:test');
const assert = require('node:assert/strict');
const { registerProduction, validateJob } = require('../production.cjs');
const confirmation = require('../quotationConfirmation.cjs');

const parseJson = (value, fallback) => typeof value === 'string' ? JSON.parse(value) : value || fallback;
const valid = () => ({ title: 'Business cards / silk 350', orderIds: ['a', 'b'], specs: { paper: [{ type: 'Silk', cutSize: '20 × 30 inches', sheets: '1200' }], finishing: [{ operation: 'Lamination', details: 'Matt, front only', orderIds: ['a'] }] } });
function fixture(query) {
  const calls = [];
  const conn = {
    query: async (sql, params) => { calls.push({ sql, params }); return [await query(sql, params)]; },
    beginTransaction: async () => calls.push('begin'), commit: async () => calls.push('commit'),
    rollback: async () => calls.push('rollback'), release: () => calls.push('release'),
  };
  return { calls, pool: { getConnection: async () => conn, query: conn.query } };
}
async function invoke(handler, body, id = 'job') {
  const res = { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  await handler({ body, params: { id } }, res, error => { res.error = error; });
  return res;
}
function routes(pool) {
  const handlers = {};
  const app = Object.fromEntries(['get', 'post', 'patch', 'put'].map(method => [method, (path, ...args) => { handlers[`${method} ${path}`] = args.at(-1); }]));
  registerProduction(app, { pool, requireDb() {}, requireAdmin() {}, parseJson });
  return handlers;
}

test('requires orders, valid paper and finishing scope without throwing on malformed input', () => {
  assert.equal(validateJob(valid()), null);
  for (const update of [{ orderIds: [] }, { orderIds: ['a', 'a'] }, { title: ' ' }, { specs: { paper: [null] } }, { specs: { paper: [{ type: 4 }] } }, { specs: { ...valid().specs, finishing: [{ operation: 'Foil', details: 'Gold', orderIds: ['unselected'] }] } }]) assert.ok(validateJob({ ...valid(), ...update }));
  assert.ok(validateJob({ ...valid(), specs: { ...valid().specs, paper: [{ type: 'Silk', cutSize: '20x30', sheets: '0' }] } }));
});

test('creates one PJO for two orders in one transaction and preserves order requirements', async () => {
  const f = fixture(sql => sql.startsWith('SELECT * FROM orders') ? ['a', 'b'].map(id => ({ id, status: 'pending', options_json: { artworkFile: `${id}.pdf` } })) : []);
  const result = await invoke(routes(f.pool)['post /api/admin/production-jobs'], valid());
  assert.equal(result.code, 201);
  assert.match(result.body.pjoNumber, /^PJO-/);
  assert.equal(f.calls.filter(c => c.sql?.startsWith('INSERT INTO production_jobs ')).length, 1);
  assert.equal(f.calls.filter(c => c.sql?.startsWith('INSERT INTO production_job_orders')).length, 2);
  const updates = f.calls.filter(c => c.sql?.startsWith('UPDATE orders'));
  assert.equal(JSON.parse(updates[0].params[0]).artworkFile, 'a.pdf');
  assert.equal(JSON.parse(updates[0].params[0]).pjoNumber, JSON.parse(updates[1].params[0]).pjoNumber);
  assert.ok(f.calls.includes('commit'));
  assert.ok(!f.calls.some(c => c.sql?.includes('sell_price')));
});

test('rejects stale, missing, quotation, legacy PJO and already assigned selections', async () => {
  for (const mode of ['missing', 'quotation', 'legacy', 'assigned', 'completed']) {
    const f = fixture(sql => sql.startsWith('SELECT * FROM orders') ? (mode === 'missing' ? [] : ['a', 'b'].map(id => ({ id, status: mode === 'completed' ? 'completed' : 'pending', options_json: mode === 'quotation' ? { isQuotation: true } : mode === 'legacy' ? { pjoNumber: 'OLD-PJO' } : {} }))) : sql.startsWith('SELECT order_id') && mode === 'assigned' ? [{ order_id: 'a' }] : []);
    assert.equal((await invoke(routes(f.pool)['post /api/admin/production-jobs'], valid())).code, 409);
    assert.ok(f.calls.includes('rollback'));
    assert.ok(!f.calls.some(c => c.sql?.startsWith('INSERT')));
  }
});

test('rolls back the entire PJO if an order assignment fails', async () => {
  const f = fixture(sql => { if (sql.startsWith('SELECT * FROM orders')) return ['a', 'b'].map(id => ({ id, status: 'pending', options_json: {} })); if (sql.startsWith('INSERT INTO production_job_orders')) throw new Error('Assignment failed'); return []; });
  const result = await invoke(routes(f.pool)['post /api/admin/production-jobs'], valid());
  assert.equal(result.error.message, 'Assignment failed');
  assert.ok(f.calls.includes('rollback'));
  assert.ok(!f.calls.includes('commit'));
  assert.equal(f.calls.at(-1), 'release');
});

test('production status updates grouped orders while excluding delivered and cancelled orders', async () => {
  const f = fixture(sql => sql.startsWith('SELECT id') ? [{ id: 'job' }] : []);
  const result = await invoke(routes(f.pool)['patch /api/admin/production-jobs/:id'], { status: 'completed' });
  assert.equal(result.code, 200);
  const update = f.calls.find(c => c.sql?.startsWith('UPDATE orders'));
  assert.match(update.sql, /NOT IN \('delivered', 'cancelled'\)/);
  assert.equal(update.params[0], 'completed');
  assert.ok(f.calls.includes('commit'));
});

test('confirms quotation into a pending order with no PJO and respects a zero price', async () => {
  const f = fixture(sql => sql.startsWith('SELECT * FROM quotations') ? [{ id: 'quote', user_email: 'client@example.test', quantity: 1000, quoted_price: 500, options_json: { isQuotation: true, pjoNumber: 'stale' }, finishing_specs: { lamination: 'Matt' } }] : []);
  const result = await invoke(confirmation({ pool: f.pool, parseJson, isAdminRequest: () => true, createId: () => 'new-order' }), { sellPrice: 0 });
  assert.equal(result.body.orderId, 'new-order');
  assert.equal(result.body.pjoNumber, undefined);
  const insert = f.calls.find(c => c.sql?.includes('INSERT INTO orders'));
  const options = JSON.parse(insert.params[7]);
  assert.equal(options.isQuotation, false);
  assert.equal(options.pjoNumber, undefined);
  assert.equal(options.finishingSpecs.lamination, 'Matt');
  assert.equal(insert.params[9], 0);
  assert.equal(insert.params.at(-1), 'pending');
  assert.ok(f.calls.includes('commit'));
});

test('repeated quotation confirmation returns existing order instead of duplicating it', async () => {
  const f = fixture(() => [{ converted_order_id: 'existing' }]);
  const result = await invoke(confirmation({ pool: f.pool, parseJson, isAdminRequest: () => true, createId: () => 'unexpected' }), {});
  assert.equal(result.body.orderId, 'existing');
  assert.ok(!f.calls.some(c => c.sql?.includes('INSERT')));
});

test('quotation update failure rolls back the newly inserted order', async () => {
  const f = fixture(sql => { if (sql.startsWith('SELECT')) return [{ user_email: 'client@example.test' }]; if (sql.includes('UPDATE quotations')) throw new Error('Write failed'); return []; });
  const result = await invoke(confirmation({ pool: f.pool, parseJson, isAdminRequest: () => true, createId: () => 'new-order' }), {});
  assert.equal(result.error.message, 'Write failed');
  assert.ok(f.calls.includes('rollback'));
  assert.ok(!f.calls.includes('commit'));
});

test('completed PJO specifications cannot be changed', async () => {
  const f = fixture(() => [{ status: 'completed' }]);
  const result = await invoke(routes(f.pool)['put /api/admin/production-jobs/:id/specs'], valid());
  assert.equal(result.code, 409);
  assert.ok(f.calls.includes('rollback'));
});
