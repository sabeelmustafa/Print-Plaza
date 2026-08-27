const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

let renderRouteHtml = (html) => html;
try {
  const seoDataModule = require('./serverSeoData.cjs');
  if (typeof seoDataModule.renderRouteHtml === 'function') {
    renderRouteHtml = seoDataModule.renderRouteHtml;
  }
} catch (err) {
  console.warn('[SEO] serverSeoData.cjs fallback active:', err.message);
}

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
  maxIdle: Number(process.env.DB_MAX_IDLE || 10),
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  queueLimit: 0,
  charset: 'utf8mb4',
};

const hasDbConfig = Boolean(dbConfig.host && dbConfig.user && dbConfig.database);
const pool = hasDbConfig ? mysql.createPool(dbConfig) : null;

if (pool) {
  // Keep-alive heartbeat ping every 30 seconds to prevent MySQL wait_timeout disconnections
  setInterval(async () => {
    try {
      await pool.query('SELECT 1');
    } catch (err) {
      console.warn('[DB KEEPALIVE WARNING] Connection check ping failed:', err.message);
    }
  }, 30000);
}

async function ensureBusinessSchema() {
  if (!pool) return;

  // Helper: silently ignore errors on individual migration steps
  const safe = async (label, sql) => {
    try {
      await pool.query(sql);
    } catch (e) {
      console.warn(`[SCHEMA] Skipped "${label}":`, e.message);
    }
  };

  // ── orders: add columns one-by-one (safe on all MySQL versions) ──────────
  await safe('orders.cost_price',       "ALTER TABLE orders ADD COLUMN cost_price DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER total_price");
  await safe('orders.sell_price',       "ALTER TABLE orders ADD COLUMN sell_price DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER cost_price");
  await safe('orders.currency_code',    "ALTER TABLE orders ADD COLUMN currency_code VARCHAR(8) NOT NULL DEFAULT 'PKR' AFTER sell_price");
  await safe('orders.items_json',       "ALTER TABLE orders ADD COLUMN items_json JSON NULL AFTER currency_code");
  await safe('orders.invoice_notes',    "ALTER TABLE orders ADD COLUMN invoice_notes TEXT NULL AFTER items_json");
  await safe('orders.payment_due_date', "ALTER TABLE orders ADD COLUMN payment_due_date DATE NULL AFTER invoice_notes");
  await safe('orders.currency_modify',  "ALTER TABLE orders MODIFY currency_code VARCHAR(8) NOT NULL DEFAULT 'PKR'");
  await safe('orders.status_modify',    "ALTER TABLE orders MODIFY status VARCHAR(64) NOT NULL DEFAULT 'pending'");

  // ── payment_records table ─────────────────────────────────────────────────
  await safe('create payment_records', `
    CREATE TABLE IF NOT EXISTS payment_records (
      id VARCHAR(128) PRIMARY KEY,
      order_id VARCHAR(128) NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      currency_code VARCHAR(8) NOT NULL DEFAULT 'PKR',
      pkr_amount DECIMAL(12,2) NULL,
      exchange_rate DECIMAL(12,4) NULL,
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

  await safe('payment_records.currency_code', "ALTER TABLE payment_records ADD COLUMN currency_code VARCHAR(8) NOT NULL DEFAULT 'PKR' AFTER amount");
  await safe('payment_records.pkr_amount',    "ALTER TABLE payment_records ADD COLUMN pkr_amount DECIMAL(12,2) NULL AFTER currency_code");
  await safe('payment_records.exchange_rate', "ALTER TABLE payment_records ADD COLUMN exchange_rate DECIMAL(12,4) NULL AFTER pkr_amount");

  // ── quotations table ──────────────────────────────────────────────────────
  await safe('create quotations', `
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

  // ── customers table ───────────────────────────────────────────────────────
  await safe('create customers', `
    CREATE TABLE IF NOT EXISTS customers (
      id VARCHAR(128) PRIMARY KEY,
      user_email VARCHAR(191) UNIQUE NOT NULL,
      user_name VARCHAR(191) NOT NULL DEFAULT '',
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

  // Ensure individual customer columns exist on older installs
  await safe('customers.password_hash',    "ALTER TABLE customers ADD COLUMN password_hash VARCHAR(255) NULL");
  await safe('customers.password_plain',   "ALTER TABLE customers ADD COLUMN password_plain VARCHAR(64) NULL");
  await safe('customers.welcome_sent_at',  "ALTER TABLE customers ADD COLUMN welcome_sent_at TIMESTAMP NULL");
  await safe('customers.notes',            "ALTER TABLE customers ADD COLUMN notes TEXT NULL");
  await safe('customers.company_name',     "ALTER TABLE customers ADD COLUMN company_name VARCHAR(191) NULL");

  // Back-fill customers from existing orders / quotations
  try {
    const [existingOrders] = await pool.query(
      'SELECT DISTINCT user_email, user_name, options_json FROM orders WHERE user_email IS NOT NULL AND TRIM(user_email) != ""'
    );
    for (const o of existingOrders) {
      const opts = parseJson(o.options_json, {});
      await upsertCustomer(o.user_email, o.user_name, opts.phone || opts.Phone, opts.companyName);
    }
    const [existingQuotes] = await pool.query(
      'SELECT DISTINCT user_email, user_name, phone, company_name, notes FROM quotations WHERE user_email IS NOT NULL AND TRIM(user_email) != ""'
    );
    for (const q of existingQuotes) {
      await upsertCustomer(q.user_email, q.user_name, q.phone, q.company_name, q.notes);
    }
  } catch (_e) {
    console.warn('[SCHEMA] Customer back-fill skipped:', _e.message);
  }

  // Sync sell_price from total_price for legacy rows
  await safe('orders.sell_price backfill',
    'UPDATE orders SET sell_price = total_price WHERE sell_price = 0 AND total_price > 0'
  );
}

/* -------------------------------------------------------------------------- */
/*                           EMAIL / NODEMAILER                               */
/* -------------------------------------------------------------------------- */

const nodemailer = require('nodemailer');

function createSmtpTransporter() {
  const host = (process.env.SMTP_HOST || '').trim().replace(/^["']|["']$/g, '');
  const port = parseInt((process.env.SMTP_PORT || '587').trim(), 10) || 587;
  const user = (process.env.SMTP_USER || '').trim().replace(/^["']|["']$/g, '');
  const pass = (process.env.SMTP_PASS || '').trim().replace(/^["']|["']$/g, '');

  if (!user || !pass) {
    console.warn('[SMTP] No credentials configured — running in simulation mode.');
    return null;
  }

  if (host && host.toLowerCase().includes('gmail')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host: host || 'localhost',
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

function buildFromAddress() {
  const rawFrom = (process.env.SMTP_FROM || '').trim();
  const smtpUser = (process.env.SMTP_USER || 'sales@printplaza.net').trim().replace(/^["']|["']$/g, '');

  if (rawFrom) {
    const match = rawFrom.match(/^(?:"?([^"<]+)"?\s*)?<([^>]+)>$/);
    if (match) {
      const name = (match[1] || 'Print Plaza').trim();
      const email = match[2].trim();
      return `"${name}" <${email}>`;
    }
  }

  return `"Print Plaza" <${smtpUser}>`;
}

async function sendWelcomeEmail(customerEmail, customerName, plainPassword) {
  const toEmail = String(customerEmail || '').trim().toLowerCase();
  const toName  = String(customerName  || 'Valued Customer').trim();

  if (!toEmail) {
    console.error('[EMAIL] sendWelcomeEmail called with no recipient email.');
    return { success: false, error: 'No recipient email address provided.' };
  }

  const portalUrl = (process.env.APP_URL || 'https://printplaza.net').replace(/\/$/, '');
  const logoUrl   = `${portalUrl}/brand/print-plaza-logo.png`;
  const fromAddress = buildFromAddress();
  const transporter  = createSmtpTransporter();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#F1F5F9;margin:0;padding:24px 12px">
<table align="center" style="background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;width:100%;max-width:600px;box-shadow:0 4px 16px rgba(0,0,0,0.04)" cellpadding="0" cellspacing="0" border="0">
  <!-- Dual Accent Top Border -->
  <tr>
    <td style="padding:0">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height:4px">
        <tr>
          <td width="50%" style="background:#2D545E;height:4px;font-size:1px;line-height:1px">&nbsp;</td>
          <td width="50%" style="background:#E17055;height:4px;font-size:1px;line-height:1px">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- Clean High-Contrast White Header -->
  <tr>
    <td style="background:#FFFFFF;padding:32px 24px 24px;text-align:center;border-bottom:1px solid #F1F5F9">
      <a href="${portalUrl}" style="text-decoration:none;display:inline-block" target="_blank">
        <img src="${logoUrl}" alt="Print Plaza" width="220" style="max-height:56px;max-width:240px;width:auto;height:auto;display:inline-block;border:0;outline:none;text-decoration:none;margin:0 auto" />
      </a>
      <p style="margin:10px 0 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#64748B;font-weight:700">Press &amp; Packaging Production Portal</p>
    </td>
  </tr>
  <!-- Content Body -->
  <tr>
    <td style="padding:36px 32px;color:#1E293B">
      <h2 style="margin:0 0 12px;color:#0F172A;font-size:22px;font-weight:800;letter-spacing:-0.5px">Welcome to Print Plaza, ${toName}!</h2>
      <p style="font-size:15px;line-height:1.65;color:#475569;margin:0 0 24px">
        Your client account has been configured. You can now access your dedicated Client Portal to review instant quotes, download invoices, check job proofs, and track real-time press production.
      </p>

      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-left:4px solid #E17055;padding:22px;border-radius:10px;margin:24px 0">
        <h3 style="margin:0 0 14px;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:#E17055;font-weight:800">Your Login Credentials</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;color:#334155;line-height:1.7">
          <tr>
            <td width="100" style="color:#64748B;font-weight:600">Portal URL:</td>
            <td><a href="${portalUrl}" style="color:#2D545E;font-weight:700;text-decoration:none">${portalUrl}</a></td>
          </tr>
          <tr>
            <td style="color:#64748B;font-weight:600">Email:</td>
            <td><strong style="color:#0F172A">${toEmail}</strong></td>
          </tr>
          <tr>
            <td style="color:#64748B;font-weight:600">Password:</td>
            <td><code style="font-family:Consolas,Monaco,monospace;background:#E2E8F0;padding:3px 8px;border-radius:4px;color:#0F172A;font-weight:700;font-size:14px">${plainPassword}</code></td>
          </tr>
        </table>
      </div>

      <div style="text-align:center;margin:32px 0 16px">
        <a href="${portalUrl}" style="background:#2D545E;color:#FFFFFF;text-decoration:none;padding:14px 34px;font-weight:800;border-radius:8px;display:inline-block;font-size:14px;letter-spacing:0.5px;text-transform:uppercase">Access Client Portal &rarr;</a>
      </div>

      <p style="font-size:13px;color:#94A3B8;margin:32px 0 0;line-height:1.5;border-top:1px solid #F1F5F9;padding-top:20px;text-align:center">
        Need assistance with your artwork or print job? Reply directly to this email or reach us at <a href="mailto:sales@printplaza.net" style="color:#2D545E;text-decoration:none;font-weight:600">sales@printplaza.net</a>.
      </p>
    </td>
  </tr>
  <!-- Footer -->
  <tr style="background:#F8FAFC;border-top:1px solid #E2E8F0">
    <td style="padding:18px 24px;text-align:center;color:#64748B;font-size:12px;line-height:1.5">
      &copy; ${new Date().getFullYear()} <strong>Print Plaza</strong>. Main Talagang Road, Chakwal 48800, Punjab, Pakistan.
    </td>
  </tr>
</table>
</body></html>`;

  if (transporter) {
    try {
      await transporter.sendMail({
        from:    fromAddress,
        to:      toEmail,
        subject: 'Welcome to Print Plaza — Your Account Credentials',
        html:    htmlContent,
      });
      console.log(`[EMAIL] Welcome email sent to ${toEmail}`);
      return { success: true, mode: 'live' };
    } catch (err) {
      console.error('[EMAIL ERROR] sendWelcomeEmail failed:', err.message, err.stack);
      return { success: false, error: err.message, mode: 'live' };
    }
  }

  // Simulation mode
  console.log(`\n=== [WELCOME EMAIL SIMULATION] ===`);
  console.log(`To: ${toEmail} | Name: ${toName} | Password: ${plainPassword}`);
  console.log(`From: ${fromAddress}`);
  console.log(`Portal: ${portalUrl}`);
  console.log(`===================================\n`);
  return { success: true, mode: 'simulated' };
}

async function sendQuotationUpdateEmail(customerEmail, customerName, quoteObj) {
  const toEmail = String(customerEmail || '').trim().toLowerCase();
  const toName  = String(customerName  || 'Valued Customer').trim();

  if (!toEmail) return { success: false, error: 'No recipient email.' };

  const transporter = createSmtpTransporter();
  const fromAddress = buildFromAddress();
  const portalUrl   = (process.env.APP_URL || 'https://printplaza.net').replace(/\/$/, '');
  const logoUrl     = `${portalUrl}/brand/print-plaza-logo.png`;

  const quoteId     = String(quoteObj.id || quoteObj.quote_number || 'QUOTE').slice(0, 12).toUpperCase();
  const quotedPrice = Number(quoteObj.quoted_price || quoteObj.quotedPrice || 0).toFixed(2);
  const currency    = String(quoteObj.currency_code || quoteObj.currency || 'PKR').toUpperCase();
  const productName = quoteObj.product_name || quoteObj.productName || 'Custom Print Job';
  const quantity    = quoteObj.quantity || 1;
  const status      = String(quoteObj.status || quoteObj.quoteStatus || 'updated').toUpperCase();
  const specs       = parseJson(quoteObj.finishing_specs, {});

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#F1F5F9;margin:0;padding:24px 12px">
<table align="center" style="background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;width:100%;max-width:600px;box-shadow:0 4px 16px rgba(0,0,0,0.04)" cellpadding="0" cellspacing="0" border="0">
  <!-- Dual Accent Top Border -->
  <tr>
    <td style="padding:0">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height:4px">
        <tr>
          <td width="50%" style="background:#2D545E;height:4px;font-size:1px;line-height:1px">&nbsp;</td>
          <td width="50%" style="background:#E17055;height:4px;font-size:1px;line-height:1px">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- Clean High-Contrast White Header -->
  <tr>
    <td style="background:#FFFFFF;padding:32px 24px 24px;text-align:center;border-bottom:1px solid #F1F5F9">
      <a href="${portalUrl}" style="text-decoration:none;display:inline-block" target="_blank">
        <img src="${logoUrl}" alt="Print Plaza" width="220" style="max-height:56px;max-width:240px;width:auto;height:auto;display:inline-block;border:0;outline:none;text-decoration:none;margin:0 auto" />
      </a>
      <p style="margin:10px 0 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#64748B;font-weight:700">Quotation Notification Desk</p>
    </td>
  </tr>
  <!-- Content Body -->
  <tr>
    <td style="padding:36px 32px;color:#1E293B">
      <h2 style="margin:0 0 12px;color:#0F172A;font-size:22px;font-weight:800;letter-spacing:-0.5px">Quotation Update — #${quoteId}</h2>
      <p style="font-size:15px;line-height:1.65;color:#475569;margin:0 0 24px">
        Hello <strong>${toName}</strong>, your quotation request <strong>#${quoteId}</strong> has been reviewed and updated by our production estimating team.
      </p>

      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-left:4px solid #2D545E;padding:22px;border-radius:10px;margin:24px 0">
        <h3 style="margin:0 0 14px;font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:#2D545E;font-weight:800">Job Specifications</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;color:#334155;line-height:1.7">
          <tr>
            <td width="110" style="color:#64748B;font-weight:600">Product:</td>
            <td><strong style="color:#0F172A">${productName}</strong></td>
          </tr>
          <tr>
            <td style="color:#64748B;font-weight:600">Quantity:</td>
            <td><strong>${quantity} pcs</strong></td>
          </tr>
          <tr>
            <td style="color:#64748B;font-weight:600">Quoted Price:</td>
            <td><span style="font-size:18px;font-weight:800;color:#2D545E">${currency} ${quotedPrice}</span></td>
          </tr>
          <tr>
            <td style="color:#64748B;font-weight:600">Status:</td>
            <td><span style="background:#E2E8F0;padding:2px 8px;border-radius:4px;font-weight:700;font-size:12px;color:#0F172A">${status}</span></td>
          </tr>
          ${specs.lamination ? `<tr><td style="color:#64748B;font-weight:600">Lamination:</td><td>${specs.lamination}</td></tr>` : ''}
          ${specs.foiling    ? `<tr><td style="color:#64748B;font-weight:600">Foil Stamping:</td><td>${specs.foiling}</td></tr>` : ''}
          ${specs.uv         ? `<tr><td style="color:#64748B;font-weight:600">Spot UV:</td><td>${specs.uv}</td></tr>` : ''}
          ${specs.emboss     ? `<tr><td style="color:#64748B;font-weight:600">Embossing:</td><td>${specs.emboss}</td></tr>` : ''}
        </table>
      </div>

      <div style="text-align:center;margin:32px 0 16px">
        <a href="${portalUrl}" style="background:#E17055;color:#FFFFFF;text-decoration:none;padding:14px 34px;font-weight:800;border-radius:8px;display:inline-block;font-size:14px;letter-spacing:0.5px;text-transform:uppercase">Review &amp; Approve Quote &rarr;</a>
      </div>

      <p style="font-size:13px;color:#94A3B8;margin:32px 0 0;line-height:1.5;border-top:1px solid #F1F5F9;padding-top:20px;text-align:center">
        Questions regarding this quote? Reply to this email or contact our estimating team at <a href="mailto:sales@printplaza.net" style="color:#2D545E;text-decoration:none;font-weight:600">sales@printplaza.net</a>.
      </p>
    </td>
  </tr>
  <!-- Footer -->
  <tr style="background:#F8FAFC;border-top:1px solid #E2E8F0">
    <td style="padding:18px 24px;text-align:center;color:#64748B;font-size:12px;line-height:1.5">
      &copy; ${new Date().getFullYear()} <strong>Print Plaza</strong>. Main Talagang Road, Chakwal 48800, Punjab, Pakistan.
    </td>
  </tr>
</table>
</body></html>`;

  if (transporter) {
    try {
      await transporter.sendMail({
        from:    fromAddress,
        to:      toEmail,
        subject: `Print Plaza — Quotation Update #${quoteId}`,
        html:    htmlContent,
      });
      console.log(`[EMAIL] Quote update email sent to ${toEmail}`);
      return { success: true, mode: 'live' };
    } catch (err) {
      console.error('[EMAIL ERROR] sendQuotationUpdateEmail failed:', err.message);
      return { success: false, error: err.message, mode: 'live' };
    }
  }

  console.log(`[QUOTE EMAIL SIMULATION] To:${toEmail} | #${quoteId} | ${currency} ${quotedPrice} | From: ${fromAddress}`);
  return { success: true, mode: 'simulated' };
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pass = 'PP-';
  for (let i = 0; i < 5; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

async function upsertCustomer(email, name, phone, companyName, notes, autoSendWelcome = false) {
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ${autoSendWelcome ? 'CURRENT_TIMESTAMP' : 'NULL'})`,
      [id, userEmail, userName, phoneVal, companyVal, plainPass, notesVal]
    );

    if (autoSendWelcome) {
      try {
        await sendWelcomeEmail(userEmail, userName, plainPass);
      } catch (err) {
        console.error('[UPSERT CUSTOMER] Welcome email failed:', err.message);
      }
    }
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

app.get('/api/health', async (_req, res) => {
  if (!pool) {
    return res.status(503).json({
      status: 'error',
      database: 'disconnected',
      message: 'Database connection pool is not configured.',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    const latencyMs = Date.now() - start;
    res.json({
      status: 'ok',
      database: 'connected',
      latencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

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
          currency: normalizeCurrency(payment.currency_code),
          pkrAmount: payment.pkr_amount != null ? Number(payment.pkr_amount) : Number(payment.amount),
          exchangeRate: payment.exchange_rate != null ? Number(payment.exchange_rate) : undefined,
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
    const currency = normalizeCurrency(req.body.currency || 'PKR');
    const pkrAmount = req.body.pkrAmount != null && req.body.pkrAmount !== ''
      ? Number(req.body.pkrAmount)
      : (currency === 'PKR' ? amount : Number(req.body.amount || 0));
    const exchangeRate = req.body.exchangeRate
      ? Number(req.body.exchangeRate)
      : (pkrAmount && amount && amount > 0 ? Number((pkrAmount / amount).toFixed(4)) : 1);

    await pool.query(
      `INSERT INTO payment_records
       (id, order_id, amount, currency_code, pkr_amount, exchange_rate, payment_method, reference, notes, paid_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        req.params.id,
        amount,
        currency,
        pkrAmount,
        exchangeRate,
        String(req.body.paymentMethod || 'bank_transfer'),
        String(req.body.reference || '').trim() || null,
        String(req.body.notes || '').trim() || null,
        req.body.paidAt || new Date(),
      ]
    );
    res.status(201).json({ id, pkrAmount });
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
  } catch (err) {
    console.error('[DB ERROR] POST /api/quotations:', err);
    return res.status(500).json({
      ok: false,
      error:      err.message   || 'Failed to save quotation',
      code:       err.code      || 'DB_ERROR',
      sqlMessage: err.sqlMessage || undefined,
    });
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

    if (updates.length) {
      params.push(quoteId);
      await pool.query(`UPDATE quotations SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params);
    }

    let emailSent = false;
    if (req.body.notifyCustomer) {
      const [updatedRows] = await pool.query('SELECT * FROM quotations WHERE id = ?', [quoteId]);
      if (updatedRows.length) {
        const quoteObj = updatedRows[0];
        await sendQuotationUpdateEmail(quoteObj.user_email, quoteObj.user_name, quoteObj);
        emailSent = true;
      }
    }

    res.json({ ok: true, emailSent });
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

app.get('/api/admin/customers', requireDb, async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        c.*,
        COALESCE(SUM(CASE
          WHEN o.status != 'cancelled'
           AND (o.options_json IS NULL OR JSON_UNQUOTE(JSON_EXTRACT(o.options_json, '$.isQuotation')) != 'true')
          THEN COALESCE(o.sell_price, o.total_price, 0)
          ELSE 0
        END), 0) AS total_spent,
        COUNT(DISTINCT CASE
          WHEN o.status != 'cancelled'
           AND (o.options_json IS NULL OR JSON_UNQUOTE(JSON_EXTRACT(o.options_json, '$.isQuotation')) != 'true')
          THEN o.id
        END) AS total_orders,
        MAX(o.created_at) AS last_order_at
      FROM customers c
      LEFT JOIN orders o ON LOWER(o.user_email) = LOWER(c.user_email)
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    return res.json(rows.map((row) => ({
      id:          row.id,
      email:       row.user_email,
      name:        row.user_name || 'Customer',
      phone:       row.phone || '',
      company:     row.company_name || '',
      companyName: row.company_name || '',
      notes:       row.notes || '',
      totalOrders: Number(row.total_orders || 0),
      totalSpent:  Number(row.total_spent  || 0),
      lastOrder:   row.last_order_at || row.created_at,
      createdAt:   row.created_at,
      updatedAt:   row.updated_at,
    })));
  } catch (err) {
    console.error('[DB ERROR] GET /api/admin/customers:', err);
    return res.status(500).json({
      ok: false,
      error:      err.message  || 'Database query failed',
      code:       err.code     || 'DB_ERROR',
      sqlMessage: err.sqlMessage || undefined,
    });
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

app.post('/api/admin/customers/:id/send-welcome-email', requireDb, async (req, res) => {
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

    // 3. If customer is not in DB yet, create profile on the fly
    if (!customer) {
      const finalEmail = targetEmail || (rawIdOrEmail.includes('@') ? rawIdOrEmail : '');
      if (!finalEmail) {
        return res.status(400).json({ ok: false, error: 'Customer profile or email is required.' });
      }
      const upserted = await upsertCustomer(finalEmail, name || finalEmail, phone, companyName);
      if (!upserted) {
        return res.status(500).json({ ok: false, error: 'Failed to create or find customer record.' });
      }
      const [newRows] = await pool.query(
        'SELECT * FROM customers WHERE id = ? OR LOWER(user_email) = ?',
        [upserted.id, finalEmail]
      );
      customer = newRows[0];
    }

    if (!customer || !customer.user_email) {
      return res.status(400).json({ ok: false, error: 'Valid customer email not found.' });
    }

    let plainPass = customer.password_plain;
    if (!plainPass) {
      plainPass = generatePassword();
      await pool.query('UPDATE customers SET password_plain = ? WHERE id = ?', [plainPass, customer.id]);
    }

    const emailResult = await sendWelcomeEmail(customer.user_email, customer.user_name, plainPass);

    // Check if SMTP actually failed
    if (emailResult && !emailResult.success && emailResult.mode === 'live') {
      return res.status(500).json({
        ok: false,
        error: emailResult.error || 'SMTP send failed',
        code: 'SMTP_ERROR',
        hint: 'Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in cPanel environment variables.',
      });
    }

    await pool.query('UPDATE customers SET welcome_sent_at = CURRENT_TIMESTAMP WHERE id = ?', [customer.id]);

    return res.json({
      ok: true,
      email: customer.user_email,
      name: customer.user_name,
      mode: emailResult.mode,
      message: `Welcome credentials email sent to ${customer.user_email}!`,
    });
  } catch (err) {
    console.error('[API ERROR] /send-welcome-email:', err.message, err.stack);
    return res.status(500).json({
      ok: false,
      error: err.message || 'Email sending failed',
      code: err.code || 'UNKNOWN_ERROR',
      details: String(err),
    });
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

let cachedTemplateHtml = null;
let lastTemplateReadTime = 0;

function getIndexTemplate() {
  const now = Date.now();
  if (cachedTemplateHtml && (now - lastTemplateReadTime < 5000)) {
    return cachedTemplateHtml;
  }
  const indexPath = fs.existsSync(path.join(distDir, 'index.html'))
    ? path.join(distDir, 'index.html')
    : path.join(__dirname, 'index.html');
  try {
    cachedTemplateHtml = fs.readFileSync(indexPath, 'utf8');
    lastTemplateReadTime = now;
    return cachedTemplateHtml;
  } catch (err) {
    console.error('Failed to read index.html template:', err);
    return cachedTemplateHtml || '<!doctype html><html><head><title>Print Plaza</title></head><body><div id="root"></div></body></html>';
  }
}

app.use((req, res) => {
  // If the request looks like a static asset that wasn't found, return 404
  if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|json|map|woff|woff2|ttf|eot)$/i.test(req.path)) {
    res.status(404).send('Asset not found');
    return;
  }

  const templateHtml = getIndexTemplate();
  const renderedHtml = renderRouteHtml(templateHtml, req.path);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.send(renderedHtml);
});

app.use((error, _req, res, _next) => {
  console.error('[UNHANDLED ERROR]', error);
  res.status(500).json({
    error: error.message || 'Server error.',
    code: error.code || undefined,
    details: process.env.NODE_ENV !== 'production' ? String(error.stack || error) : undefined,
  });
});

app.listen(port, () => {
  console.log(`PlazaHQ server running on port ${port}`);
  if (hasDbConfig) {
    ensureBusinessSchema().catch((error) => {
      console.warn('[SCHEMA] Background schema setup notice:', error.message);
    });
  }
});
