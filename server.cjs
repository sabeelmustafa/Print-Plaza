const path = require('path');
const crypto = require('crypto');
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const distDir = path.join(__dirname, 'dist');

app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));
app.use(function securityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  charset: 'utf8mb4',
};

const hasDbConfig = Boolean(dbConfig.host && dbConfig.user && dbConfig.database);
const pool = hasDbConfig ? mysql.createPool(dbConfig) : null;

function requireDb(_req, res, next) {
  if (!pool) {
    res.status(503).json({ error: 'Database is not configured on this server.' });
    return;
  }
  next();
}

function requireAdmin(req, res, next) {
  if (isAdminRequest(req)) {
    next();
    return;
  }

  res.status(401).json({ error: 'Admin access required.' });
}

function isAdminRequest(req) {
  const configuredSecret = process.env.ADMIN_API_SECRET;
  const sentSecret = req.get('x-admin-secret');
  const sessionToken = getCookie(req, 'pp_admin_session');

  if (configuredSecret && sentSecret === configuredSecret) {
    return true;
  }

  if (process.env.ADMIN_SESSION_SECRET && sessionToken === signAdminSession()) {
    return true;
  }

  return false;
}

function getCookie(req, name) {
  const cookies = req.get('cookie');
  if (!cookies) return null;

  for (const part of cookies.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }

  return null;
}

function signAdminSession() {
  return crypto
    .createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
    .update('print-plaza-admin')
    .digest('hex');
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left || '');
  const rightBuffer = Buffer.from(right || '');

  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

app.post('/api/admin/login', (req, res) => {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    res.status(503).json({ error: 'Admin login is not configured.' });
    return;
  }

  if (!safeEqual(req.body.password, process.env.ADMIN_PASSWORD)) {
    res.status(401).json({ error: 'Admin access required.' });
    return;
  }

  res.cookie('pp_admin_session', signAdminSession(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 12,
    path: '/',
  });
  res.json({ ok: true });
});

app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie('pp_admin_session', { path: '/' });
  res.json({ ok: true });
});

app.get('/api/admin/session', (req, res) => {
  const sessionToken = getCookie(req, 'pp_admin_session');
  res.json({
    authenticated: Boolean(
      process.env.ADMIN_SESSION_SECRET && sessionToken === signAdminSession()
    ),
  });
});

function normalizeProduct(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: Number(row.price || 0),
    unit: row.unit || '',
    image: row.image || '',
    categoryId: row.category_id,
    maxQuantity: row.max_quantity == null ? undefined : Number(row.max_quantity),
    options: parseJson(row.options_json, []),
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order || 0),
  };
}

function normalizeCategory(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    icon: row.icon || 'Package',
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order || 0),
  };
}

function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (_error) {
    return fallback;
  }
}

function createId(prefix) {
  return `${prefix}-${crypto.randomBytes(6).toString('hex')}`;
}

app.get('/api/health', async (_req, res) => {
  if (!pool) {
    res.json({ ok: true, database: 'not-configured' });
    return;
  }

  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (error) {
    res.status(500).json({ ok: false, database: 'error', error: error.message });
  }
});

app.get('/api/categories', requireDb, async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE active = 1 ORDER BY sort_order ASC, title ASC'
    );
    res.json(rows.map(normalizeCategory));
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/categories', requireDb, requireAdmin, async (req, res, next) => {
  try {
    const category = req.body;
    const id = category.id || createId('category');
    await pool.query(
      `INSERT INTO categories (id, title, description, icon, active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         description = VALUES(description),
         icon = VALUES(icon),
         active = VALUES(active),
         sort_order = VALUES(sort_order)`,
      [
        id,
        category.title || '',
        category.description || '',
        category.icon || 'Package',
        category.active === false ? 0 : 1,
        Number(category.sortOrder || 0),
      ]
    );
    res.json({ id });
  } catch (error) {
    next(error);
  }
});

app.get('/api/products', requireDb, async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE active = 1 ORDER BY sort_order ASC, name ASC'
    );
    res.json(rows.map(normalizeProduct));
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/products', requireDb, requireAdmin, async (req, res, next) => {
  try {
    const product = req.body;
    const id = product.id || createId('product');
    await pool.query(
      `INSERT INTO products (
         id, category_id, name, description, price, unit, image, max_quantity,
         options_json, active, sort_order
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         category_id = VALUES(category_id),
         name = VALUES(name),
         description = VALUES(description),
         price = VALUES(price),
         unit = VALUES(unit),
         image = VALUES(image),
         max_quantity = VALUES(max_quantity),
         options_json = VALUES(options_json),
         active = VALUES(active),
         sort_order = VALUES(sort_order)`,
      [
        id,
        product.categoryId,
        product.name || '',
        product.description || '',
        Number(product.price || 0),
        product.unit || '',
        product.image || '',
        product.maxQuantity || null,
        JSON.stringify(product.options || []),
        product.active === false ? 0 : 1,
        Number(product.sortOrder || 0),
      ]
    );
    res.json({ id });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/products/:id', requireDb, requireAdmin, async (req, res, next) => {
  try {
    await pool.query('UPDATE products SET active = 0 WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get('/api/orders', requireDb, async (req, res, next) => {
  try {
    const userId = req.query.userId;
    if (!userId && !isAdminRequest(req)) {
      res.status(401).json({ error: 'Admin access required.' });
      return;
    }

    const query = userId
      ? 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
      : 'SELECT * FROM orders ORDER BY created_at DESC';
    const params = userId ? [userId] : [];
    const [rows] = await pool.query(query, params);
    res.json(rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      userEmail: row.user_email,
      productId: row.product_id,
      productName: row.product_name,
      quantity: Number(row.quantity),
      options: parseJson(row.options_json, {}),
      totalPrice: Number(row.total_price),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })));
  } catch (error) {
    next(error);
  }
});

app.post('/api/orders', requireDb, async (req, res, next) => {
  try {
    const order = req.body;
    const id = createId('order');
    await pool.query(
      `INSERT INTO orders (
         id, user_id, user_name, user_email, product_id, product_name,
         quantity, options_json, total_price, status
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        id,
        order.userId,
        order.userName || null,
        order.userEmail || '',
        order.productId,
        order.productName,
        Number(order.quantity || 1),
        JSON.stringify(order.options || {}),
        Number(order.totalPrice || 0),
      ]
    );
    res.status(201).json({ id, status: 'pending' });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/admin/orders/:id/status', requireDb, requireAdmin, async (req, res, next) => {
  try {
    const allowed = ['pending', 'processing', 'completed', 'cancelled'];
    if (!allowed.includes(req.body.status)) {
      res.status(400).json({ error: 'Invalid status.' });
      return;
    }

    await pool.query(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [req.body.status, req.params.id]
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get('/api/site-settings', requireDb, async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    const settings = {};
    for (const row of rows) {
      settings[row.setting_key] = parseJson(row.setting_value, row.setting_value);
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/site-settings/:key', requireDb, requireAdmin, async (req, res, next) => {
  try {
    await pool.query(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [req.params.key, JSON.stringify(req.body.value)]
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get('/api/media', requireDb, requireAdmin, async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM media_assets ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/media', requireDb, requireAdmin, async (req, res, next) => {
  try {
    const id = req.body.id || createId('media');
    await pool.query(
      `INSERT INTO media_assets (id, title, url, alt_text)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         url = VALUES(url),
         alt_text = VALUES(alt_text)`,
      [id, req.body.title || '', req.body.url || '', req.body.altText || '']
    );
    res.json({ id });
  } catch (error) {
    next(error);
  }
});

app.use(express.static(distDir, {
  index: false,
  setHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  },
}));

app.use((_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Server error.' });
});

app.listen(port, () => {
  console.log(`Print Plaza server running on port ${port}`);
});
