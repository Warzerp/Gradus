-- V11: Índices de rendimiento y vista materializada

-- ─── Índice HNSW para búsqueda vectorial eficiente (cosine similarity) ───────
-- m=16 y ef_construction=64 son valores balanceados para recall/velocidad
CREATE INDEX idx_tg_embedding_hnsw
    ON trabajos_grado
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- ─── Índices de búsqueda textual frecuente ────────────────────────────────────
CREATE INDEX idx_tg_titulo      ON trabajos_grado USING gin(to_tsvector('spanish', titulo));
CREATE INDEX idx_autores_nombre ON autores (nombre, apellido);
CREATE INDEX idx_usuarios_email ON usuarios (email);
CREATE INDEX idx_auditoria_ts   ON auditoria (registrado_en DESC);

-- ─── Vista materializada de estadísticas por facultad ────────────────────────
-- Se pobla en Sprint 3; aquí solo se define la estructura
CREATE MATERIALIZED VIEW mv_stats_por_facultad AS
SELECT
    c.nombre                   AS facultad,
    COUNT(tg.id)               AS total_trabajos,
    MAX(tg.anio_publicacion)   AS anio_mas_reciente
FROM trabajos_grado tg
JOIN catalogos c ON tg.facultad_id = c.id
GROUP BY c.nombre
WITH NO DATA;
