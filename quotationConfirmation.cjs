module.exports = function quotationConfirmation({ pool, parseJson, createId }) {
  return async (req, res, next) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const quoteId = req.params.id;
    const [rows] = await conn.query('SELECT * FROM quotations WHERE id = ? FOR UPDATE', [quoteId]);
    if (!rows.length) {
      await conn.rollback();
      res.status(404).json({ error: 'Quotation not found.' });
      return;
    }

    const quote = rows[0];
    if (quote.converted_order_id) {
      await conn.commit();
      return res.json({ ok: true, orderId: quote.converted_order_id });
    }
    const orderId = createId('order');
    const sellPrice = Math.max(0, Number(req.body.sellPrice ?? quote.quoted_price ?? 0));
    const costPrice = Math.max(0, Number(req.body.costPrice || 0));
    const finishingSpecs = req.body.finishingSpecs || parseJson(quote.finishing_specs, {});
    const optionsObj = {
      ...parseJson(quote.options_json, {}),
      phone: quote.phone,
      companyName: quote.company_name,
      isQuotation: false,
      quoteStatus: 'converted',
      finishingSpecs,
    };

    delete optionsObj.pjoNumber;
    delete optionsObj.productionJobId;
    if (!Number.isFinite(sellPrice) || !Number.isFinite(costPrice)) {
      await conn.rollback();
      return res.status(400).json({ error: 'Enter valid prices.' });
    }
    await conn.query(
      `INSERT INTO orders (
         id, user_id, user_name, user_email, product_id, product_name,
         quantity, options_json, items_json, total_price, cost_price, sell_price, currency_code,
         invoice_notes, status
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        quote.user_id || quote.user_email,
        quote.user_name,
        quote.user_email,
        quote.product_id,
        quote.product_name,
        quote.quantity,
        JSON.stringify(optionsObj),
        JSON.stringify([{
          productId: quote.product_id,
          productName: quote.product_name,
          quantity: quote.quantity,
          options: optionsObj,
          totalPrice: sellPrice
        }]),
        sellPrice,
        costPrice,
        sellPrice,
        req.body.currency || quote.currency_code || 'PKR',
        quote.notes || `Converted from Quote #${quote.quote_number || quoteId}`,
        'pending',
      ]
    );

    await conn.query(
      `UPDATE quotations SET status = 'converted', converted_pjo_number = NULL, converted_order_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [orderId, quoteId]
    );
    await conn.commit();
    res.json({ ok: true, orderId });
  } catch (error) {
    if (conn) await conn.rollback();
    next(error);
  } finally { conn?.release(); }
  };
};
