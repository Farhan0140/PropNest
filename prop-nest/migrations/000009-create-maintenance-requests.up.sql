-- +migrate Up
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id BIGSERIAL PRIMARY KEY,

    renter_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    unit_id INTEGER NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'low',

    image_attachment TEXT,

    status VARCHAR(15) CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,


    CONSTRAINT fk_tenant
        FOREIGN KEY (renter_id)
        REFERENCES renters(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_property
        FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_unit
        FOREIGN KEY (unit_id)
        REFERENCES units(id)
        ON DELETE CASCADE
);