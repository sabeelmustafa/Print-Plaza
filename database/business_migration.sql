ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS cost_price DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER total_price,
  ADD COLUMN IF NOT EXISTS sell_price DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER cost_price,
  ADD COLUMN IF NOT EXISTS currency_code VARCHAR(8) NOT NULL DEFAULT 'PKR' AFTER sell_price,
  ADD COLUMN IF NOT EXISTS items_json JSON NULL AFTER currency_code,
  ADD COLUMN IF NOT EXISTS invoice_notes TEXT NULL AFTER items_json,
  ADD COLUMN IF NOT EXISTS payment_due_date DATE NULL AFTER invoice_notes;

ALTER TABLE orders
  MODIFY currency_code VARCHAR(8) NOT NULL DEFAULT 'PKR';

UPDATE orders
SET sell_price = total_price
WHERE sell_price = 0 AND total_price > 0;

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
  CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
