package com.buscador.semantico.busqueda;

import com.buscador.semantico.busqueda.dto.BusquedaRequest;
import com.buscador.semantico.busqueda.dto.BusquedaResultado;
import com.buscador.semantico.embedding.EmbeddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BusquedaSemanticaService {

    private final EmbeddingService embeddingService;
    private final JdbcTemplate jdbc;

    public List<BusquedaResultado> buscar(BusquedaRequest req) {
        return embeddingService.isConfigured()
                ? buscarSemantico(req)
                : buscarPorTexto(req);
    }

    private List<BusquedaResultado> buscarSemantico(BusquedaRequest req) {
        float[] queryEmbedding = embeddingService.obtenerEmbeddingTexto(req.getConsulta());
        String vectorStr = EmbeddingService.vectorToString(queryEmbedding);

        String sql = """
                SELECT
                    id,
                    titulo,
                    resumen,
                    anio_publicacion,
                    estado,
                    1 - (embedding <=> CAST(? AS vector)) AS similitud
                FROM trabajos_grado
                WHERE embedding IS NOT NULL
                  AND estado = 'PUBLICADO'
                ORDER BY embedding <=> CAST(? AS vector)
                LIMIT ?
                """;

        return jdbc.query(sql, this::mapResultado, vectorStr, vectorStr, req.getLimite());
    }

    private List<BusquedaResultado> buscarPorTexto(BusquedaRequest req) {
        log.warn("OpenAI API key no configurada — usando búsqueda por texto para: {}", req.getConsulta());
        String patron = "%" + req.getConsulta() + "%";

        String sql = """
                SELECT
                    id,
                    titulo,
                    resumen,
                    anio_publicacion,
                    estado,
                    NULL AS similitud
                FROM trabajos_grado
                WHERE estado = 'PUBLICADO'
                  AND (titulo ILIKE ? OR resumen ILIKE ?)
                ORDER BY titulo
                LIMIT ?
                """;

        return jdbc.query(sql, this::mapResultado, patron, patron, req.getLimite());
    }

    private BusquedaResultado mapResultado(java.sql.ResultSet rs, int rowNum) throws java.sql.SQLException {
        double similitud = rs.getDouble("similitud");
        return BusquedaResultado.builder()
                .id(rs.getLong("id"))
                .titulo(rs.getString("titulo"))
                .resumen(rs.getString("resumen"))
                .anioPublicacion(rs.getShort("anio_publicacion"))
                .estado(com.buscador.semantico.trabajogrado.EstadoTrabajo
                        .valueOf(rs.getString("estado")))
                .similitud(rs.wasNull() ? null : similitud)
                .build();
    }
}
