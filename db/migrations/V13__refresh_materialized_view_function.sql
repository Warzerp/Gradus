-- V13: Función para refrescar la vista materializada de estadísticas
-- y índices adicionales para consultas de tendencias

-- Función que refresca mv_stats_por_facultad y puede llamarse manualmente o desde un job
CREATE OR REPLACE FUNCTION refresh_stats_por_facultad()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_stats_por_facultad;
END;
$$;

-- Índice adicional para búsquedas por año y estado (frecuentes en tendencias)
CREATE INDEX IF NOT EXISTS idx_tg_anio_estado
    ON trabajos_grado (anio_publicacion, estado);

-- Índice para auditoría por usuario y acción (frecuente en panel de admin)
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario_accion
    ON auditoria (usuario_id, accion, registrado_en DESC);

-- Índice de soporte de similitud por estado de revisión
CREATE INDEX IF NOT EXISTS idx_similitud_revisado_score
    ON similitud_conceptual (revisado, score DESC);

-- Poblar la vista materializada con datos iniciales (sin CONCURRENTLY, no requiere unique index)
REFRESH MATERIALIZED VIEW mv_stats_por_facultad;
