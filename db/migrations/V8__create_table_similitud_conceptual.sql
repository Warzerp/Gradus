-- V8: Similitud conceptual entre pares de trabajos de grado
-- CHECK garantiza que trabajo_a_id < trabajo_b_id para evitar pares duplicados invertidos
CREATE TABLE IF NOT EXISTS similitud_conceptual (
    id              BIGSERIAL    PRIMARY KEY,
    trabajo_a_id    BIGINT       NOT NULL REFERENCES trabajos_grado(id),
    trabajo_b_id    BIGINT       NOT NULL REFERENCES trabajos_grado(id),
    score           NUMERIC(5,4) NOT NULL,  -- valor entre 0.0000 y 1.0000
    revisado        BOOLEAN      NOT NULL DEFAULT FALSE,
    requiere_accion BOOLEAN      NOT NULL DEFAULT FALSE,
    detectado_en    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (trabajo_a_id, trabajo_b_id),
    CHECK (trabajo_a_id < trabajo_b_id)
);
