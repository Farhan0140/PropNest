-- +migrate Up
CREATE TABLE IF NOT EXISTS renters (
    id BIGSERIAL PRIMARY KEY,

    unit_id BIGINT,

    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,

    nid_number VARCHAR(50) UNIQUE,

    status VARCHAR(10) DEFAULT 'active'
        CHECK (status IN ('active', 'left')),

    date_of_birth DATE,

    move_in_date DATE DEFAULT CURRENT_DATE,
    move_out_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_renter_unit
        FOREIGN KEY (unit_id)
        REFERENCES units(id)
        ON DELETE SET NULL
);