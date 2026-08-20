const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const distDir = path.join(__dirname, 'dist');
const uploadDir = path.join(__dirname, 'uploads');

app.disable('x-powered-by');
app.use(express.json({ limit: '12mb' }));
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

async function ensureBusinessSchema() {
  if (!pool) return;
  await pool.query(`
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS cost_price DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER total_price,
      ADD COLUMN IF NOT EXISTS sell_price DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER cost_price,
      ADD COLUMN IF NOT EXISTS currency_code VARCHAR(8) NOT NULL DEFAULT 'PKR' AFTER sell_price,
      ADD COLUMN IF NOT EXISTS items_json JSON NULL AFTER currency_code,
      ADD COLUMN IF NOT EXISTS invoice_notes TEXT NULL AFTER items_json,
      ADD COLUMN IF NOT EXISTS payment_due_date DATE NULL AFTER invoice_notes
  `);
  await pool.query(`
    ALTER TABLE orders
      MODIFY currency_code VARCHAR(8) NOT NULL DEFAULT 'PKR'
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payment_records (
      id VARCHAR(128) PRIMARY KEY,
      order_id VARCHAR(128) NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      payment_method VARCHAR(80) NOT NULL DEFAULT 'bank_transfer',
      reference VARCHAR(220) NULL,
      notes TEXT NULL,
      paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_payments_order (order_id),
      INDEX idx_payments_paid_at (paid_at),
      CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id)
        ON UPDATE CASCADE ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quotations (
      id VARCHAR(128) PRIMARY KEY,
      quote_number VARCHAR(64) UNIQUE NULL,
      user_id VARCHAR(128) NULL,
      user_name VARCHAR(191) NOT NULL,
      user_email VARCHAR(191) NOT NULL,
      phone VARCHAR(64) NULL,
      company_name VARCHAR(191) NULL,
      product_id VARCHAR(128) NOT NULL,
      product_name VARCHAR(191) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      quoted_price DECIMAL(12,2) NOT NULL DEFAULT 0,
      currency_code VARCHAR(8) NOT NULL DEFAULT 'PKR',
      status VARCHAR(64) NOT NULL DEFAULT 'new',
      converted_pjo_number VARCHAR(64) NULL,
      converted_order_id VARCHAR(128) NULL,
      finishing_specs JSON NULL,
      options_json JSON NULL,
      notes TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_quotations_status (status),
      INDEX idx_quotations_email (user_email),
      INDEX idx_quotations_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
const nodemailer = require('nodemailer');

function createSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    if (!host || host.includes('gmail')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    }
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
}

async function sendWelcomeEmail(customerEmail, customerName, plainPassword) {
  const email = String(customerEmail).trim().toLowerCase();
  const name = String(customerName || 'Valued Customer').trim();
  const transporter = createSmtpTransporter();
  const fromAddress = process.env.SMTP_FROM || '"Print Plaza HQ" <noreply@printplaza.com>';
  const portalUrl = process.env.APP_URL || 'http://localhost:3000';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 30px;">
      <table max-width="600" align="center" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; width: 100%;">
        <tr style="background-color: #2D545E; color: #ffffff;">
          <td style="padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">PRINT PLAZA</h1>
            <p style="margin: 5px 0 0; font-size: 13px; opacity: 0.8;">Press & Packaging Production Portal</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 35px; color: #1e293b;">
            <h2 style="margin-top: 0; color: #2D545E; font-size: 20px;">Welcome to Print Plaza, ${name}!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Your customer account has been set up successfully. You can now log in to your personal Client Portal to view quotation requests, track Print Job Orders (PJOs), and download official invoices.
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #E17055; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #E17055;">Your Login Credentials</h3>
              <p style="margin: 8px 0; font-size: 14px;"><strong>Portal URL:</strong> <a href="${portalUrl}" style="color: #2D545E;">${portalUrl}</a></p>
              <p style="margin: 8px 0; font-size: 14px;"><strong>Username (Email):</strong> <span style="font-family: monospace; color: #0f172a;">${email}</span></p>
              <p style="margin: 8px 0; font-size: 14px;"><strong>Password:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #0f172a;">${plainPassword}</span></p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${portalUrl}" style="background-color: #2D545E; color: #ffffff; text-decoration: none; padding: 14px 30px; font-weight: bold; border-radius: 8px; display: inline-block; font-size: 14px;">Log In to Client Portal</a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; margin-top: 35px; line-height: 1.5;">
              If you have any questions or require custom print specifications, simply reply to this email or contact our support team.
            </p>
          </td>
        </tr>
        <tr style="background-color: #f1f5f9; color: #64748b; font-size: 11px; text-align: center;">
          <td style="padding: 15px;">
            &copy; ${new Date().getFullYear()} Print Plaza Press. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject: 'Welcome to Print Plaza - Your Account Credentials',
        html: htmlContent,
      });
      console.log(`[EMAIL] Live Welcome email sent to ${email}`);
      return { success: true, mode: 'live' };
    } catch (err) {
      console.error(`[EMAIL ERROR] Failed to send email to ${email}:`, err.message);
    }
  }

  console.log(`\n======================================================`);
  console.log(`[WELCOME EMAIL SIMULATION] To: ${email}`);
  console.log(`Name: ${name} | Username: ${email} | Password: ${plainPassword}`);
  console.log(`Portal Link: ${portalUrl}`);
  console.log(`======================================================\n`);

  return { success: true, mode: 'simulated' };
}

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id VARCHAR(128) PRIMARY KEY,
      user_email VARCHAR(191) UNIQUE NOT NULL,
      user_name VARCHAR(191) NOT NULL,
      phone VARCHAR(64) NULL,
      company_name VARCHAR(191) NULL,
      password_hash VARCHAR(255) NULL,
      password_plain VARCHAR(64) NULL,
      welcome_sent_at TIMESTAMP NULL,
      notes TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_customers_email (user_email),
      INDEX idx_customers_phone (phone)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  try {
    await pool.query('ALTER TABLE customers ADD COLUMN password_hash VARCHAR(255) NULL');
  } catch (_e) {}
  try {
    await pool.query('ALTER TABLE customers ADD COLUMN password_plain VARCHAR(64) NULL');
  } catch (_e) {}
  try {
    await pool.query('ALTER TABLE customers ADD COLUMN welcome_sent_at TIMESTAMP NULL');
  } catch (_e) {}

  try {
    const [existingOrders] = await pool.query('SELECT DISTINCT user_email, user_name, options_json FROM orders WHERE user_email IS NOT NULL AND TRIM(user_email) != ""');
    for (const o of existingOrders) {
      const opts = parseJson(o.options_json, {});
      await upsertCustomer(o.user_email, o.user_name, opts.phone || opts.Phone, opts.companyName);
    }
    const [existingQuotes] = await pool.query('SELECT DISTINCT user_email, user_name, phone, company_name, notes FROM quotations WHERE user_email IS NOT NULL AND TRIM(user_email) != ""');
    for (const q of existingQuotes) {
      await upsertCustomer(q.user_email, q.user_name, q.phone, q.company_name, q.notes);
    }
  } catch (_e) {
    // Ignore migration error
  }
  await pool.query('UPDATE orders SET sell_price = total_price WHERE sell_price = 0 AND total_price > 0');
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pass = 'PP-';
  for (let i = 0; i < 5; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

async function upsertCustomer(email, name, phone, companyName, notes) {
  if (!pool || !email) return null;
  const userEmail = String(email).trim().toLowerCase();
  if (!userEmail) return null;
  const userName = String(name || userEmail).trim();
  const phoneVal = phone ? String(phone).trim() : null;
  const companyVal = companyName ? String(companyName).trim() : null;
  const notesVal = notes ? String(notes).trim() : null;
  const id = createId('cust');

  const [existing] = await pool.query('SELECT * FROM customers WHERE LOWER(user_email) = ?', [userEmail]);

  if (!existing.length) {
    const plainPass = generatePassword();
    await pool.query(
      `INSERT INTO customers (id, user_email, user_name, phone, company_name, password_plain, notes, welcome_sent_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [id, userEmail, userName, phoneVal, companyVal, plainPass, notesVal]
    );

    // Auto send Welcome Email
    await sendWelcomeEmail(userEmail, userName, plainPass);
    return { id, isNew: true, plainPass };
  } else {
    const customer = existing[0];
    let plainPass = customer.password_plain;
    if (!plainPass) {
      plainPass = generatePassword();
      await pool.query('UPDATE customers SET password_plain = ? WHERE id = ?', [plainPass, customer.id]);
    }
    await pool.query(
      `UPDATE customers
       SET user_name = COALESCE(NULLIF(?, ''), user_name),
           phone = COALESCE(?, phone),
           company_name = COALESCE(?, company_name),
           notes = COALESCE(?, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [userName, phoneVal, companyVal, notesVal, customer.id]
    );
    return { id: customer.id, isNew: false, plainPass };
  }
}

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

function normalizeCurrency(value) {
  const currency = String(value || 'PKR').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(currency) ? currency : 'PKR';
}

function normalizeOrderItems(order) {
  const rawItems = Array.isArray(order.items) && order.items.length
    ? order.items
    : [{
        productId: order.productId,
        productName: order.productName,
        quantity: order.quantity,
        options: order.options || {},
        totalPrice: order.totalPrice,
      }];

  return rawItems.map((item) => ({
    productId: String(item.productId || 'manual-item'),
    productName: String(item.productName || 'Custom print item').trim(),
    quantity: Math.max(1, Number(item.quantity || 1)),
    options: item.options || {},
    totalPrice: Math.max(0, Number(item.totalPrice || 0)),
  })).filter((item) => item.productName);
}

function summarizeOrderTitle(items, fallback = 'Custom print order') {
  if (!items.length) return fallback;
  if (items.length === 1) return items[0].productName;
  return `${items[0].productName} + ${items.length - 1} more`;
}

function ensureUploadDir() {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function extensionForMime(mimeType) {
  const allowed = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
  };
  return allowed[mimeType] || null;
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
    const userId = String(req.query.userId || '').trim();
    const userEmail = String(req.query.userEmail || '').trim().toLowerCase();
    const adminRequest = isAdminRequest(req) || !process.env.ADMIN_PASSWORD || (!userId && !userEmail);
    if (!userId && !userEmail && !adminRequest) {
      res.status(401).json({ error: 'Admin access required.' });
      return;
    }

    const filters = [];
    const params = [];
    if (userId) {
      filters.push('o.user_id = ?');
      params.push(userId);
    }
    if (userEmail) {
      filters.push('LOWER(o.user_email) = ?');
      params.push(userEmail);
    }

    const query = `SELECT o.*,
        COALESCE((SELECT SUM(p.amount) FROM payment_records p WHERE p.order_id = o.id), 0) AS paid_amount
      FROM orders o
      ${filters.length ? `WHERE (${filters.join(' OR ')})` : ''}
      ORDER BY o.created_at DESC`;
    const [rows] = await pool.query(query, params);
    let paymentsByOrder = {};
    if (rows.length) {
      const [paymentRows] = await pool.query(
        `SELECT * FROM payment_records
         ${adminRequest ? '' : `WHERE order_id IN (${rows.map(() => '?').join(',')})`}
         ORDER BY paid_at DESC, created_at DESC`,
        adminRequest ? [] : rows.map((row) => row.id)
      );
      paymentsByOrder = paymentRows.reduce((result, payment) => {
        const orderId = payment.order_id;
        if (!result[orderId]) result[orderId] = [];
        result[orderId].push({
          id: payment.id,
          orderId,
          amount: Number(payment.amount),
          paymentMethod: payment.payment_method,
          reference: payment.reference || '',
          notes: payment.notes || '',
          paidAt: payment.paid_at,
          createdAt: payment.created_at,
        });
        return result;
      }, {});
    }
    res.json(rows.map((row) => {
      const optionsObj = parseJson(row.options_json, {});
      const isQuotation = Boolean(optionsObj.isQuotation);
      const pjoNumber = optionsObj.pjoNumber || (isQuotation ? null : (optionsObj.pjoNumber || `#${row.id.slice(0, 8)}`));
      const quoteStatus = optionsObj.quoteStatus || (isQuotation ? 'new' : 'converted');
      const finishingSpecs = optionsObj.finishingSpecs || null;

      return {
        ...(adminRequest ? {
          costPrice: Number(row.cost_price || 0),
        } : {}),
        paidAmount: Number(row.paid_amount || 0),
        balanceDue: row.status === 'cancelled' ? 0 : Math.max(0, Number(row.sell_price || row.total_price || 0) - Number(row.paid_amount || 0)),
        invoiceNotes: row.invoice_notes || '',
        paymentDueDate: row.payment_due_date,
        payments: paymentsByOrder[row.id] || [],
        id: row.id,
        userId: row.user_id,
        userName: row.user_name,
        userEmail: row.user_email,
        productId: row.product_id,
        productName: row.product_name,
        quantity: Number(row.quantity),
        items: parseJson(row.items_json, []),
        options: optionsObj,
        isQuotation,
        pjoNumber,
        quoteStatus,
        finishingSpecs,
        totalPrice: Number(row.total_price),
        currency: normalizeCurrency(row.currency_code),
        sellPrice: Number(row.sell_price || row.total_price || 0),
        paymentStatus: Number(row.paid_amount || 0) >= Number(row.sell_price || row.total_price || 0) && Number(row.sell_price || row.total_price || 0) > 0
          ? 'paid'
          : Number(row.paid_amount || 0) > 0 ? 'partial' : 'unpaid',
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }));
  } catch (error) {
    next(error);
  }
});

app.post('/api/orders', requireDb, async (req, res, next) => {
  try {
    const order = req.body;
    const id = createId('order');
    const items = normalizeOrderItems(order);
    const totalPrice = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    const quantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 1;
    const productName = summarizeOrderTitle(items, order.productName);
    const optionsObj = {
      ...(order.options || {}),
      isQuotation: true,
      quoteStatus: 'new',
    };

    await pool.query(
      `INSERT INTO orders (
         id, user_id, user_name, user_email, product_id, product_name,
         quantity, options_json, items_json, total_price, sell_price, currency_code, status
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        id,
        order.userId,
        order.userName || null,
        order.userEmail || '',
        items[0]?.productId || order.productId,
        productName,
        quantity,
        JSON.stringify(optionsObj),
        JSON.stringify(items),
        totalPrice,
        totalPrice,
        normalizeCurrency(order.currency),
      ]
    );
    res.status(201).json({ id, status: 'pending' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/orders', requireDb, requireAdmin, async (req, res, next) => {
  try {
    const order = req.body;
    const id = createId('order');
    const allowedStatuses = ['pending', 'processing', 'completed', 'delivered', 'cancelled'];
    const status = allowedStatuses.includes(order.status) ? order.status : 'pending';
    const items = normalizeOrderItems(order);
    const itemsSellPrice = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    const sellPrice = Math.max(0, Number(order.sellPrice || itemsSellPrice || 0));
    const costPrice = Math.max(0, Number(order.costPrice || 0));
    const quantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || Math.max(1, Number(order.quantity || 1));
    const productName = summarizeOrderTitle(items, order.productName);
    const optionsObj = {
      ...(order.options || {}),
      isQuotation: Boolean(order.isQuotation),
      quoteStatus: order.quoteStatus || (order.isQuotation ? 'new' : 'converted'),
      ...(order.pjoNumber ? { pjoNumber: order.pjoNumber } : {}),
      ...(order.finishingSpecs ? { finishingSpecs: order.finishingSpecs } : {}),
    };

    await pool.query(
      `INSERT INTO orders (
         id, user_id, user_name, user_email, product_id, product_name,
         quantity, options_json, items_json, total_price, cost_price, sell_price, currency_code,
         invoice_notes, payment_due_date, status
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        String(order.userId || order.userEmail || 'manual-customer'),
        String(order.userName || '').trim() || null,
        String(order.userEmail || '').trim(),
        String(items[0]?.productId || order.productId || 'manual-order'),
        productName,
        quantity,
        JSON.stringify(optionsObj),
        JSON.stringify(items),
        sellPrice,
        costPrice,
        sellPrice,
        normalizeCurrency(order.currency),
        String(order.invoiceNotes || '').trim() || null,
        order.paymentDueDate || null,
        status,
      ]
    );
    res.status(201).json({ id });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/admin/orders/:id/finance', requireDb, requireAdmin, async (req, res, next) => {
  try {
    const costPrice = Math.max(0, Number(req.body.costPrice || 0));
    const sellPrice = Math.max(0, Number(req.body.sellPrice || 0));
    await pool.query(
      `UPDATE orders
       SET cost_price = ?, sell_price = ?, total_price = ?, currency_code = ?,
           invoice_notes = ?, payment_due_date = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        costPrice,
        sellPrice,
        sellPrice,
        normalizeCurrency(req.body.currency),
        String(req.body.invoiceNotes || '').trim() || null,
        req.body.paymentDueDate || null,
        req.params.id,
      ]
    );

    // Update options_json for quotation & finishing fields
    if (req.body.isQuotation !== undefined || req.body.pjoNumber || req.body.finishingSpecs || req.body.quoteStatus) {
      const [orderRows] = await pool.query('SELECT options_json FROM orders WHERE id = ?', [req.params.id]);
      if (orderRows.length) {
        const currentOpts = parseJson(orderRows[0].options_json, {});
        const updatedOpts = {
          ...currentOpts,
          ...(req.body.isQuotation !== undefined ? { isQuotation: req.body.isQuotation } : {}),
          ...(req.body.pjoNumber ? { pjoNumber: req.body.pjoNumber } : {}),
          ...(req.body.quoteStatus ? { quoteStatus: req.body.quoteStatus } : {}),
          ...(req.body.finishingSpecs ? { finishingSpecs: req.body.finishingSpecs } : {}),
        };
        await pool.query('UPDATE orders SET options_json = ? WHERE id = ?', [JSON.stringify(updatedOpts), req.params.id]);
      }
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/orders/:id/payments', requireDb, requireAdmin, async (req, res, next) => {
  try {
    const amount = Number(req.body.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ error: 'Payment amount must be greater than zero.' });
      return;
    }
    const id = createId('payment');
    await pool.query(
      `INSERT INTO payment_records
       (id, order_id, amount, payment_method, reference, notes, paid_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        req.params.id,
        amount,
        String(req.body.paymentMethod || 'bank_transfer'),
        String(req.body.reference || '').trim() || null,
        String(req.body.notes || '').trim() || null,
        req.body.paidAt || new Date(),
      ]
    );
    res.status(201).json({ id });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/payments/:id', requireDb, requireAdmin, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM payment_records WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/admin/orders/:id/status', requireDb, requireAdmin, async (req, res, next) => {
  try {
    const allowed = ['pending', 'processing', 'completed', 'delivered', 'cancelled'];
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

/* -------------------------------------------------------------------------- */
/*                            QUOTATIONS MANAGEMENT                           */
/* -------------------------------------------------------------------------- */

app.get('/api/quotations', requireDb, async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM quotations ORDER BY created_at DESC');
    res.json(rows.map((row) => ({
      id: row.id,
      quoteNumber: row.quote_number,
      userId: row.user_id,
      userName: row.user_name,
      userEmail: row.user_email,
      phone: row.phone || '',
      companyName: row.company_name || '',
      productId: row.product_id,
      productName: row.product_name,
      quantity: Number(row.quantity),
      quotedPrice: Number(row.quoted_price),
      currency: normalizeCurrency(row.currency_code),
      quoteStatus: row.status,
      convertedPjoNumber: row.converted_pjo_number || null,
      convertedOrderId: row.converted_order_id || null,
      finishingSpecs: parseJson(row.finishing_specs, {}),
      options: parseJson(row.options_json, {}),
      notes: row.notes || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isQuotation: true,
      totalPrice: Number(row.quoted_price),
      sellPrice: Number(row.quoted_price),
    })));
  } catch (error) {
    next(error);
  }
});

app.post('/api/quotations', requireDb, async (req, res, next) => {
  try {
    const quote = req.body;
    const id = quote.id || createId('quote');
    const quoteNumber = quote.quoteNumber || `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const optionsObj = quote.options || {};
    const finishingSpecs = quote.finishingSpecs || {};
    const phone = quote.phone || optionsObj.phone || '';
    const companyName = quote.companyName || optionsObj.companyName || '';
    const quotedPrice = Math.max(0, Number(quote.quotedPrice || quote.totalPrice || quote.sellPrice || 0));

    await pool.query(
      `INSERT INTO quotations (
         id, quote_number, user_id, user_name, user_email, phone, company_name,
         product_id, product_name, quantity, quoted_price, currency_code, status,
         finishing_specs, options_json, notes
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        quoteNumber,
        String(quote.userId || quote.userEmail || 'guest-quote'),
        String(quote.userName || 'Customer').trim(),
        String(quote.userEmail || '').trim(),
        String(phone).trim(),
        String(companyName).trim(),
        String(quote.productId || 'custom-packaging'),
        String(quote.productName || 'Packaging Quotation Request'),
        Math.max(1, Number(quote.quantity || 1)),
        quotedPrice,
        normalizeCurrency(quote.currency),
        quote.quoteStatus || 'new',
        JSON.stringify(finishingSpecs),
        JSON.stringify(optionsObj),
        String(quote.notes || optionsObj.specifications || '').trim(),
      ]
    );

    await upsertCustomer(quote.userEmail, quote.userName, phone, companyName, quote.notes);

    res.status(201).json({ id, quoteNumber, status: 'new' });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/quotations/:id', requireDb, async (req, res, next) => {
  try {
    const quoteId = req.params.id;
    const { quotedPrice, quoteStatus, phone, companyName, finishingSpecs, notes, currency } = req.body;

    const updates = [];
    const params = [];

    if (quotedPrice !== undefined) {
      updates.push('quoted_price = ?');
      params.push(Math.max(0, Number(quotedPrice)));
    }
    if (quoteStatus !== undefined) {
      updates.push('status = ?');
      params.push(String(quoteStatus));
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(String(phone));
    }
    if (companyName !== undefined) {
      updates.push('company_name = ?');
      params.push(String(companyName));
    }
    if (finishingSpecs !== undefined) {
      updates.push('finishing_specs = ?');
      params.push(JSON.stringify(finishingSpecs));
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(String(notes));
    }
    if (currency !== undefined) {
      updates.push('currency_code = ?');
      params.push(normalizeCurrency(currency));
    }

    if (!updates.length) {
      res.json({ ok: true });
      return;
    }

    params.push(quoteId);
    await pool.query(`UPDATE quotations SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post('/api/quotations/:id/convert', requireDb, async (req, res, next) => {
  try {
    const quoteId = req.params.id;
    const [rows] = await pool.query('SELECT * FROM quotations WHERE id = ?', [quoteId]);
    if (!rows.length) {
      res.status(404).json({ error: 'Quotation not found.' });
      return;
    }

    const quote = rows[0];
    const pjoNumber = req.body.pjoNumber || `PJO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = createId('order');
    const sellPrice = Math.max(0, Number(req.body.sellPrice || quote.quoted_price || 0));
    const costPrice = Math.max(0, Number(req.body.costPrice || 0));
    const finishingSpecs = req.body.finishingSpecs || parseJson(quote.finishing_specs, {});
    const optionsObj = {
      ...parseJson(quote.options_json, {}),
      phone: quote.phone,
      companyName: quote.company_name,
      pjoNumber,
      quoteStatus: 'converted',
      finishingSpecs,
    };

    await pool.query(
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
        quote.currency_code || 'PKR',
        quote.notes || `Converted from Quote #${quote.quote_number || quoteId}`,
        'pending',
      ]
    );

    await pool.query(
      `UPDATE quotations SET status = 'converted', converted_pjo_number = ?, converted_order_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [pjoNumber, orderId, quoteId]
    );

    await upsertCustomer(quote.user_email, quote.user_name, quote.phone, quote.company_name, quote.notes);

    res.json({ ok: true, orderId, pjoNumber });
  } catch (error) {
    next(error);
  }
});

/* -------------------------------------------------------------------------- */
/*                            CUSTOMERS MANAGEMENT                            */
/* -------------------------------------------------------------------------- */

app.get('/api/admin/customers', requireDb, async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*,
        COALESCE(SUM(CASE WHEN o.status != 'cancelled' AND (o.options_json IS NULL OR JSON_UNQUOTE(JSON_EXTRACT(o.options_json, '$.isQuotation')) != 'true') THEN COALESCE(o.sell_price, o.total_price, 0) ELSE 0 END), 0) AS total_spent,
        COUNT(DISTINCT CASE WHEN o.status != 'cancelled' AND (o.options_json IS NULL OR JSON_UNQUOTE(JSON_EXTRACT(o.options_json, '$.isQuotation')) != 'true') THEN o.id END) AS total_orders,
        MAX(o.created_at) AS last_order_at
      FROM customers c
      LEFT JOIN orders o ON LOWER(o.user_email) = LOWER(c.user_email)
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json(rows.map((row) => ({
      id: row.id,
      email: row.user_email,
      name: row.user_name || 'Customer',
      phone: row.phone || '',
      company: row.company_name || '',
      companyName: row.company_name || '',
      notes: row.notes || '',
      totalOrders: Number(row.total_orders || 0),
      totalSpent: Number(row.total_spent || 0),
      lastOrder: row.last_order_at || row.created_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })));
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/customers', requireDb, async (req, res, next) => {
  try {
    const { userEmail, email, userName, name, phone, companyName, company, notes } = req.body;
    const targetEmail = String(userEmail || email || '').trim().toLowerCase();
    const targetName = String(userName || name || targetEmail).trim();
    const targetPhone = String(phone || '').trim();
    const targetCompany = String(companyName || company || '').trim();
    const targetNotes = String(notes || '').trim();

    if (!targetEmail) {
      res.status(400).json({ error: 'Customer email is required.' });
      return;
    }

    // Check if customer email already exists in customers table
    const [existing] = await pool.query('SELECT id, user_name FROM customers WHERE LOWER(user_email) = ?', [targetEmail]);
    if (existing.length) {
      res.status(409).json({
        error: `Customer email '${targetEmail}' is already registered in the directory.`,
        alreadyExists: true,
        customerId: existing[0].id,
      });
      return;
    }

    const upserted = await upsertCustomer(targetEmail, targetName, targetPhone, targetCompany, targetNotes);
    res.status(201).json({ id: upserted.id, email: targetEmail, name: targetName });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/admin/customers/:id', requireDb, async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const { userName, phone, companyName, notes } = req.body;

    await pool.query(
      `UPDATE customers
       SET user_name = COALESCE(?, user_name),
           phone = COALESCE(?, phone),
           company_name = COALESCE(?, company_name),
           notes = COALESCE(?, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        userName ? String(userName).trim() : null,
        phone ? String(phone).trim() : null,
        companyName ? String(companyName).trim() : null,
        notes ? String(notes).trim() : null,
        customerId,
      ]
    );

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/customers/:id/send-welcome-email', requireDb, async (req, res, next) => {
  try {
    const rawIdOrEmail = decodeURIComponent(req.params.id || '');
    const { email, name, phone, companyName } = req.body || {};
    const targetEmail = String(email || (rawIdOrEmail.includes('@') ? rawIdOrEmail : '')).trim().toLowerCase();

    let customer = null;

    // 1. Try finding by ID
    let [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [rawIdOrEmail]);
    if (rows.length) {
      customer = rows[0];
    } else if (targetEmail) {
      // 2. Try finding by email
      [rows] = await pool.query('SELECT * FROM customers WHERE LOWER(user_email) = ?', [targetEmail]);
      if (rows.length) {
        customer = rows[0];
      }
    }

    // 3. If customer is not in DB yet, create profile on the fly!
    if (!customer) {
      const finalEmail = targetEmail || (rawIdOrEmail.includes('@') ? rawIdOrEmail : '');
      if (!finalEmail) {
        res.status(400).json({ error: 'Customer profile or email is required.' });
        return;
      }
      const upserted = await upsertCustomer(finalEmail, name || finalEmail, phone, companyName);
      const [newRows] = await pool.query('SELECT * FROM customers WHERE id = ? OR LOWER(user_email) = ?', [upserted.id, finalEmail]);
      customer = newRows[0];
    }

    let plainPass = customer.password_plain;
    if (!plainPass) {
      plainPass = generatePassword();
      await pool.query('UPDATE customers SET password_plain = ? WHERE id = ?', [plainPass, customer.id]);
    }

    const emailResult = await sendWelcomeEmail(customer.user_email, customer.user_name, plainPass);
    await pool.query('UPDATE customers SET welcome_sent_at = CURRENT_TIMESTAMP WHERE id = ?', [customer.id]);

    res.json({
      ok: true,
      email: customer.user_email,
      name: customer.user_name,
      mode: emailResult.mode,
      message: `Welcome credentials email sent to ${customer.user_email}!`,
    });
  } catch (error) {
    next(error);
  }
});

/* -------------------------------------------------------------------------- */
/*                        CUSTOMER AUTHENTICATION & PORTAL                     */
/* -------------------------------------------------------------------------- */

app.post('/api/customer/login', requireDb, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const targetEmail = String(email || '').trim().toLowerCase();
    const targetPass = String(password || '').trim();

    if (!targetEmail || !targetPass) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const [rows] = await pool.query('SELECT * FROM customers WHERE LOWER(user_email) = ?', [targetEmail]);

    if (!rows.length) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const customer = rows[0];
    const match = (customer.password_plain && customer.password_plain === targetPass) ||
                  (customer.password_hash && customer.password_hash === targetPass);

    if (!match) {
      res.status(401).json({ error: 'Invalid password. Please check your credentials or welcome email.' });
      return;
    }

    res.json({
      authenticated: true,
      user: {
        uid: customer.id,
        email: customer.user_email,
        name: customer.user_name,
        phone: customer.phone || '',
        company: customer.company_name || '',
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/customer/session', requireDb, async (_req, res) => {
  res.json({ authenticated: false });
});

app.post('/api/customer/logout', (_req, res) => {
  res.json({ ok: true });
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

app.post('/api/admin/uploads', requireAdmin, async (req, res, next) => {
  try {
    const { fileName, mimeType, data, title, altText } = req.body;
    const extension = extensionForMime(mimeType);

    if (!extension || !data) {
      res.status(400).json({ error: 'Only JPG, PNG, WebP, GIF, and SVG images can be uploaded.' });
      return;
    }

    const buffer = Buffer.from(String(data), 'base64');
    if (buffer.length > 8 * 1024 * 1024) {
      res.status(413).json({ error: 'Image is too large. Please upload an image under 8MB.' });
      return;
    }

    ensureUploadDir();
    const safeName = String(fileName || 'image')
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'image';
    const storedName = `${Date.now()}-${safeName}-${crypto.randomBytes(4).toString('hex')}${extension}`;
    const filePath = path.join(uploadDir, storedName);
    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/${storedName}`;

    if (pool) {
      const id = createId('media');
      await pool.query(
        `INSERT INTO media_assets (id, title, url, alt_text)
         VALUES (?, ?, ?, ?)`,
        [id, title || safeName, url, altText || title || safeName]
      );
    }

    res.status(201).json({ url });
  } catch (error) {
    next(error);
  }
});

app.use('/uploads', express.static(uploadDir, {
  index: false,
  setHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  },
}));

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

ensureBusinessSchema()
  .catch((error) => console.error('Business schema setup failed:', error.message))
  .finally(() => {
    app.listen(port, () => {
      console.log(`PlazaHQ server running on port ${port}`);
    });
  });
