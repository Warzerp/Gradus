-- V7: Texto completo extraído del PDF, dividido por sección semántica
CREATE TABLE IF NOT EXISTS texto_completo (
    id           BIGSERIAL PRIMARY KEY,
    trabajo_id   BIGINT    NOT NULL REFERENCES trabajos_grado(id) ON DELETE CASCADE UNIQUE,
    resumen      TEXT,
    introduccion TEXT,
    metodologia  TEXT,
    resultados   TEXT,
    conclusiones TEXT,
    referencias  TEXT
);
