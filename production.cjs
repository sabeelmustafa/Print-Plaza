const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const statuses = ['pending', 'processing', 'completed'];
function validateJob(body) {
  if (!body || typeof body !== 'object') return 'Production job details are required.';
  if (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 191) return 'Enter a production job name (maximum 191 characters).';
  if (!Array.isArray(body.orderIds) || !body.orderIds.length || body.orderIds.length > 200 || body.orderIds.some(id => typeof id !== 'string') || new Set(body.orderIds).size !== body.orderIds.length) return 'Select 1–200 distinct orders.';
  if (!body.specs || typeof body.specs !== 'object' || Array.isArray(body.specs)) return 'Production specifications are required.';
  if (!Array.isArray(body.specs.paper) || !body.specs.paper.length || body.specs.paper.some(p => !p || typeof p.type !== 'string' || !p.type.trim() || typeof p.cutSize !== 'string' || !p.cutSize.trim() || !Number.isSafeInteger(Number(p.sheets)) || Number(p.sheets) <= 0)) return 'Each paper stock needs a type, sheet cut size and positive whole sheet quantity.';
  if (!Array.isArray(body.specs.finishing) || body.specs.finishing.some(f => !f || typeof f.operation !== 'string' || !f.operation.trim() || typeof f.details !== 'string' || !f.details.trim() || !Array.isArray(f.orderIds) || f.orderIds.some(id => !body.orderIds.includes(id)))) return 'Finishing instructions must apply to orders selected in this PJO.';
  if (JSON.stringify(body.specs).length > 100000) return 'Production instructions are too large.';
  return null;
}

async function ensureSchema(pool) {
  for (const sql of fs.readFileSync(path.join(__dirname, 'database/production_migration.sql'), 'utf8').split(';').filter(s => s.trim())) await pool.query(sql);
}

function registerProduction(app, { pool, requireDb, requireAdmin, parseJson }) {
  app.get('/api/admin/production-jobs', requireDb, requireAdmin, async (_req, res, next) => {
    try {
      const [jobs] = await pool.query('SELECT * FROM production_jobs ORDER BY created_at DESC');
      const [links] = await pool.query('SELECT * FROM production_job_orders');
      res.json(jobs.map(j => ({ id: j.id, pjoNumber: j.pjo_number, title: j.title, status: j.status, specs: parseJson(j.specs_json, {}), orderIds: links.filter(l => l.production_job_id === j.id).map(l => l.order_id), createdAt: j.created_at, updatedAt: j.updated_at })));
    } catch (error) { next(error); }
  });

  app.post('/api/admin/production-jobs', requireDb, requireAdmin, async (req, res, next) => {
    const error = validateJob(req.body);
    if (error) return res.status(400).json({ error });
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      const ids = [...req.body.orderIds].sort();
      const [orders] = await conn.query('SELECT * FROM orders WHERE id IN (?) ORDER BY id FOR UPDATE', [ids]);
      const [links] = await conn.query('SELECT order_id FROM production_job_orders WHERE order_id IN (?)', [ids]);
      if (orders.length !== ids.length || links.length || orders.some(o => o.status !== 'pending' || parseJson(o.options_json, {}).isQuotation || parseJson(o.options_json, {}).pjoNumber)) {
        await conn.rollback();
        return res.status(409).json({ error: 'Some selected orders are no longer waiting for a PJO. Refresh the pipeline and try again.' });
      }
      const id = crypto.randomUUID();
      const pjoNumber = `PJO-${new Date().getFullYear()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
      await conn.query('INSERT INTO production_jobs (id, pjo_number, title, specs_json) VALUES (?, ?, ?, ?)', [id, pjoNumber, req.body.title.trim(), JSON.stringify(req.body.specs)]);
      for (const order of orders) {
        await conn.query('INSERT INTO production_job_orders (order_id, production_job_id) VALUES (?, ?)', [order.id, id]);
        await conn.query('UPDATE orders SET options_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [JSON.stringify({ ...parseJson(order.options_json, {}), pjoNumber, productionJobId: id }), order.id]);
      }
      await conn.commit();
      res.status(201).json({ id, pjoNumber });
    } catch (error) { if (conn) await conn.rollback(); next(error); }
    finally { conn?.release(); }
  });

  app.patch('/api/admin/production-jobs/:id', requireDb, requireAdmin, async (req, res, next) => {
    if (!statuses.includes(req.body.status)) return res.status(400).json({ error: 'Invalid production status.' });
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      const [jobs] = await conn.query('SELECT id FROM production_jobs WHERE id = ? FOR UPDATE', [req.params.id]);
      if (!jobs.length) { await conn.rollback(); return res.status(404).json({ error: 'PJO not found.' }); }
      await conn.query('UPDATE production_jobs SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
      await conn.query("UPDATE orders o JOIN production_job_orders l ON l.order_id = o.id SET o.status = ?, o.updated_at = CURRENT_TIMESTAMP WHERE l.production_job_id = ? AND o.status NOT IN ('delivered', 'cancelled')", [req.body.status, req.params.id]);
      await conn.commit();
      res.json({ ok: true });
    } catch (error) { if (conn) await conn.rollback(); next(error); }
    finally { conn?.release(); }
  });

  app.put('/api/admin/production-jobs/:id/specs', requireDb, requireAdmin, async (req, res, next) => {
    const error = validateJob(req.body);
    if (error) return res.status(400).json({ error });
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      const [jobs] = await conn.query('SELECT * FROM production_jobs WHERE id = ? FOR UPDATE', [req.params.id]);
      if (!jobs.length) { await conn.rollback(); return res.status(404).json({ error: 'PJO not found.' }); }
      if (jobs[0].status === 'completed') { await conn.rollback(); return res.status(409).json({ error: 'Completed PJOs cannot be edited.' }); }
      const [links] = await conn.query('SELECT order_id FROM production_job_orders WHERE production_job_id = ?', [req.params.id]);
      if (links.length !== req.body.orderIds.length || links.some(l => !req.body.orderIds.includes(l.order_id))) { await conn.rollback(); return res.status(409).json({ error: 'Order membership cannot be changed after creating a PJO.' }); }
      await conn.query('UPDATE production_jobs SET title = ?, specs_json = ? WHERE id = ?', [req.body.title.trim(), JSON.stringify(req.body.specs), req.params.id]);
      await conn.commit();
      res.json({ ok: true });
    } catch (error) { if (conn) await conn.rollback(); next(error); }
    finally { conn?.release(); }
  });
}

module.exports = { ensureSchema, registerProduction, validateJob };
