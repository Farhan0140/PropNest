-- +migrate Up
CREATE TABLE IF NOT EXISTS electricity_bills (
    id SERIAL PRIMARY KEY,

    unit_id BIGINT NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,

    previous_reading NUMERIC(10,2),
    current_reading NUMERIC(10,2),

    unit_used NUMERIC(10,2),
    per_unit_price NUMERIC(10,2),

    total_amount NUMERIC(10,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (unit_id, year, month),

    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);