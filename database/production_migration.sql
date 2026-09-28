CREATE TABLE IF NOT EXISTS production_jobs (
  id VARCHAR(128) PRIMARY KEY,
  pjo_number VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(191) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  specs_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS production_job_orders (
  order_id VARCHAR(128) PRIMARY KEY,
  production_job_id VARCHAR(128) NOT NULL,
  INDEX idx_production_job (production_job_id),
  FOREIGN KEY (production_job_id) REFERENCES production_jobs(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
