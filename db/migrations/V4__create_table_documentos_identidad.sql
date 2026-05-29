-- V4: Documentos de identidad de los autores
CREATE TYPE tipo_documento AS ENUM ('CC', 'TI', 'CE', 'PASAPORTE', 'OTRO');

CREATE TABLE documentos_identidad (
    id           BIGSERIAL      PRIMARY KEY,
    autor_id     BIGINT         NOT NULL REFERENCES autores(id) ON DELETE CASCADE,
    tipo         tipo_documento NOT NULL,
    numero       VARCHAR(50)    NOT NULL,
    pais_emision VARCHAR(50)    NOT NULL DEFAULT 'Colombia',
    UNIQUE (tipo, numero, pais_emision)
);
