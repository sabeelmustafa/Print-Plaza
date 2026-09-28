module.exports = function orderFinance({ pool, parseJson, normalizeCurrency }) {
  return async (req, res, next) => {
    const details = req.body || {};
    for (const key of ['costPrice', 'sellPrice']) {
      if (details[key] !== undefined && (details[key] === null || details[key] === '' || !Number.isFinite(Number(details[key])) || Number(details[key]) < 0)) return res.status(400).json({ error: 'Prices must be valid non-negative amounts.' });
    }
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      const [rows] = await conn.query('SELECT * FROM orders WHERE id = ? FOR UPDATE', [req.params.id]);
      if (!rows.length) { await conn.rollback(); return res.status(404).json({ error: 'Order not found.' }); }
      const order = rows[0];
      const options = { ...parseJson(order.options_json, {}) };
      // PJO membership is controlled exclusively by the production API.
      for (const key of ['isQuotation', 'quoteStatus', 'finishingSpecs']) if (details[key] !== undefined) options[key] = details[key];
      const sell = details.sellPrice !== undefined ? Number(details.sellPrice) : Number(order.sell_price ?? order.total_price ?? 0);
      await conn.query(`UPDATE orders SET cost_price = ?, sell_price = ?, total_price = ?, currency_code = ?, invoice_notes = ?, payment_due_date = ?, options_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [
        details.costPrice !== undefined ? Number(details.costPrice) : order.cost_price,
        sell, sell,
        details.currency !== undefined ? normalizeCurrency(details.currency) : order.currency_code,
        details.invoiceNotes !== undefined ? String(details.invoiceNotes || '').trim() || null : order.invoice_notes,
        details.paymentDueDate !== undefined ? details.paymentDueDate || null : order.payment_due_date,
        JSON.stringify(options), req.params.id,
      ]);
      await conn.commit();
      res.json({ ok: true });
    } catch (error) { if (conn) await conn.rollback(); next(error); }
    finally { conn?.release(); }
  };
};
