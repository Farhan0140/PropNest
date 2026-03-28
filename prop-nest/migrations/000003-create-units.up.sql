-- +migrate Up
CREATE TABLE IF NOT EXISTS units (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    unit_name VARCHAR(20) NOT NULL,
    rent_amount NUMERIC(12,2),
    status VARCHAR(20) DEFAULT 'vacant',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_property
        FOREIGN KEY(property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE
);