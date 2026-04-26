-- +migrate Up
CREATE TABLE IF NOT EXISTS rent_invoices (
    id BIGSERIAL PRIMARY KEY,

    renter_id INTEGER NOT NULL,
    unit_id INTEGER,

    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year >= 2000),

    rent_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    late_fee NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,

    status VARCHAR(20) DEFAULT 'unpaid'
    CHECK (status IN ('paid', 'unpaid', 'partial')),

    due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '7 days'),
    paid_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rent_invoice_renter
        FOREIGN KEY (renter_id)
        REFERENCES renters(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rent_invoice_unit
        FOREIGN KEY (unit_id)
        REFERENCES units(id)
        ON DELETE SET NULL,

    CONSTRAINT unique_unit_month_year UNIQUE (unit_id, month, year)
);