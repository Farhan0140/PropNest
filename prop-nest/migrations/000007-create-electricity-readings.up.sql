-- +migrate Up
CREATE TABLE IF NOT EXISTS electricity_readings (
    id SERIAL PRIMARY KEY,

    unit_id INTEGER NOT NULL,

    year INT NOT NULL,
    month INT NOT NULL,
    reading_value NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_unit
        FOREIGN KEY (unit_id)
        REFERENCES units(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_unit_date UNIQUE (unit_id, year, month)
);

