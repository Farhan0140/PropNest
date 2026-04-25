-- +migrate Up
CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,

    invoice_id BIGINT NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- rent, electricity, gas, water, etc.

    quantity NUMERIC(10,2) CHECK (quantity >= 0),         -- e.g. units (for electricity)
    unit_price NUMERIC(10,2) CHECK (unit_price >= 0),       -- price per unit

    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),  -- final calculated amount

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_invoice
        FOREIGN KEY (invoice_id)
        REFERENCES rent_invoices(id)
        ON DELETE CASCADE
);