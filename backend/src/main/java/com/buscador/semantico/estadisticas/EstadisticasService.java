package com.buscador.semantico.estadisticas;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EstadisticasService {

    private final JdbcTemplate jdbc;

    /** Estadísticas por facultad desde la vista materializada. */
    public List<Map<String, Object>> statsPorFacultad() {
        return jdbc.queryForList("""
                SELECT facultad, total_trabajos, anio_mas_reciente
                FROM mv_stats_por_facultad
                ORDER BY total_trabajos DESC
                """);
    }

    /** Tendencia de publicaciones por año (últimos 10 años). */
    public List<Map<String, Object>> tendenciaPorAnio() {
        return jdbc.queryForList("""
                SELECT anio_publicacion AS anio, COUNT(*) AS total
                FROM trabajos_grado
                WHERE estado = 'PUBLICADO'
                  AND anio_publicacion IS NOT NULL
                  AND anio_publicacion >= EXTRACT(YEAR FROM NOW()) - 10
                GROUP BY anio_publicacion
                ORDER BY anio_publicacion ASC
                """);
    }

    /** Distribución de trabajos por estado. */
    public List<Map<String, Object>> distribucionPorEstado() {
        return jdbc.queryForList("""
                SELECT estado::text AS estado, COUNT(*) AS total
                FROM trabajos_grado
                GROUP BY estado
                ORDER BY total DESC
                """);
    }

    /** Resumen global del sistema. */
    public Map<String, Object> resumenGlobal() {
        Map<String, Object> totales = jdbc.queryForMap("""
                SELECT
                    COUNT(*)                                        AS total_trabajos,
                    COUNT(*) FILTER (WHERE estado = 'PUBLICADO')   AS publicados,
                    COUNT(*) FILTER (WHERE estado = 'BORRADOR')    AS borradores,
                    COUNT(*) FILTER (WHERE embedding IS NOT NULL)  AS con_embedding
                FROM trabajos_grado
                """);

        Long totalAutores = jdbc.queryForObject("SELECT COUNT(*) FROM autores", Long.class);
        Long totalUsuarios = jdbc.queryForObject("SELECT COUNT(*) FROM usuarios", Long.class);
        Long totalDuplicados = jdbc.queryForObject(
                "SELECT COUNT(*) FROM similitud_conceptual WHERE revisado = false", Long.class);

        totales.put("total_autores", totalAutores);
        totales.put("total_usuarios", totalUsuarios);
        totales.put("alertas_duplicados_pendientes", totalDuplicados);
        return totales;
    }

    /** Refresca la vista materializada de estadísticas. Solo ADMIN. */
    public void refrescarVistaMaterializada() {
        log.info("Refrescando mv_stats_por_facultad...");
        jdbc.execute("SELECT refresh_stats_por_facultad()");
        log.info("Vista materializada refrescada");
    }
}
