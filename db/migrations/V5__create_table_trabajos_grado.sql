-- V5: Tabla principal de trabajos de grado con soporte para embeddings vectoriales
CREATE TYPE estado_trabajo AS ENUM ('BORRADOR', 'EN_REVISION', 'PUBLICADO', 'PRIVADO');

CREATE TABLE trabajos_grado (
    id               BIGSERIAL      PRIMARY KEY,
    titulo           VARCHAR(500)   NOT NULL,
    resumen          TEXT,
    anio_publicacion SMALLINT,
    facultad_id      BIGINT,        -- FK a catalogos, se agrega en V10
    programa_id      BIGINT,        -- FK a catalogos, se agrega en V10
    linea_id         BIGINT,        -- FK a catalogos, se agrega en V10
    estado           estado_trabajo NOT NULL DEFAULT 'BORRADOR',
    url_pdf          TEXT,
    embedding        vector(1536),  -- OpenAI text-embedding-ada-002 (1536 dims)
    creado_en        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    actualizado_en   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
