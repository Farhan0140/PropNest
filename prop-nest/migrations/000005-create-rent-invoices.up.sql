-- +migrate Up
CREATE TABLE IF NOT EXISTS rent_invoices (
    id BIGSERIAL PRIMARY KEY,

    renter_id INTEGER NOT NULL,
    unit_id INTEGER,

    month INTEGER NOT NULL,
    year INTEGER NOT NULL,

    rent_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    late_fee NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,

    status VARCHAR(20) CHECK (status IN ('paid', 'unpaid', 'partial')),

    due_date DATE NOT NULL,
    paid_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rent_invoice_renter
        FOREIGN KEY (renter_id)
        REFERENCES renters(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rent_invoice_unit
        FOREIGN KEY (unit_id)
        REFERENCES units(id)
        ON DELETE SET NULL
);