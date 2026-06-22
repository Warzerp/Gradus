-- V14: Soporte para trabajos privados con campo cifrado AES-256
ALTER TABLE trabajos_grado
    ADD COLUMN IF NOT EXISTS es_privado    BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS texto_cifrado TEXT;

CREATE INDEX IF NOT EXISTS idx_tg_es_privado ON trabajos_grado (es_privado);
