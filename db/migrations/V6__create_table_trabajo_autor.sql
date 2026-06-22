-- V6: Tabla pivot N:M — Trabajo ↔ Autor
CREATE TABLE IF NOT EXISTS trabajo_autor (
    trabajo_id  BIGINT  NOT NULL REFERENCES trabajos_grado(id) ON DELETE CASCADE,
    autor_id    BIGINT  NOT NULL REFERENCES autores(id)        ON DELETE RESTRICT,
    es_director BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (trabajo_id, autor_id)
);
