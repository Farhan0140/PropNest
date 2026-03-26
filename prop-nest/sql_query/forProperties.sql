CREATE TABLE IF NOT EXISTS properties (
    id BIGSERIAL PRIMARY KEY,

    owner_id INTEGER NOT NULL,
    
    house_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),

    number_of_floors INTEGER NOT NULL DEFAULT 1,
    total_units INTEGER NOT NULL DEFAULT 0,
    base_rent NUMERIC(12,2) DEFAULT 0,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    CONSTRAINT fk_owner
        FOREIGN KEY(owner_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
);