-- V3: Tabla de autores (la FK a catalogos se agrega en V10)
CREATE TABLE IF NOT EXISTS autores (
    id          BIGSERIAL    PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,
    apellido    VARCHAR(150) NOT NULL,
    email       VARCHAR(255) UNIQUE,
    programa_id BIGINT,          -- FK a catalogos, se agrega en V10
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
