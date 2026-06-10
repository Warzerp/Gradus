package com.buscador.semantico.duplicados;

import com.buscador.semantico.duplicados.dto.SimilitudResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DuplicadoService {

    private static final double UMBRAL_SIMILITUD = 0.85;

    private final JdbcTemplate jdbc;
    private final SimilitudConceptualRepository repository;

    @Transactional(readOnly = true)
    public Page<SimilitudResponse> listarPendientes(Pageable pageable) {
        return repository.findByRevisadoFalseOrderByScoreDesc(pageable)
                .map(SimilitudResponse::fromEntity);
    }

    @Transactional
    public int detectarDuplicados() {
        String sql = """
                SELECT
                    a.id AS id_a,
                    b.id AS id_b,
                    1 - (a.embedding <=> b.embedding) AS score
                FROM trabajos_grado a
                JOIN trabajos_grado b ON b.id > a.id
                WHERE a.embedding IS NOT NULL
                  AND b.embedding IS NOT NULL
                  AND a.estado = 'PUBLICADO'
                  AND b.estado = 'PUBLICADO'
                  AND (1 - (a.embedding <=> b.embedding)) >= ?
                """;

        List<Map<String, Object>> pares = jdbc.queryForList(sql, UMBRAL_SIMILITUD);
        int nuevos = 0;

        for (Map<String, Object> par : pares) {
            Long idA = ((Number) par.get("id_a")).longValue();
            Long idB = ((Number) par.get("id_b")).longValue();
            double score = ((Number) par.get("score")).doubleValue();

            if (!repository.existsByTrabajoAIdAndTrabajoBId(idA, idB)) {
                SimilitudConceptual sim = SimilitudConceptual.builder()
                        .trabajoAId(idA)
                        .trabajoBId(idB)
                        .score(BigDecimal.valueOf(score))
                        .revisado(false)
                        .requiereAccion(score >= 0.95)
                        .build();
                repository.save(sim);
                nuevos++;
                log.info("Duplicado detectado: ({}, {}) score={}", idA, idB, score);
            }
        }

        log.info("Detección finalizada. {} nuevos pares con similitud >= {}", nuevos, UMBRAL_SIMILITUD);
        return nuevos;
    }

    @Transactional
    public SimilitudResponse marcarRevisado(Long id, boolean requiereAccion) {
        SimilitudConceptual sim = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Similitud no encontrada: " + id));
        sim.setRevisado(true);
        sim.setRequiereAccion(requiereAccion);
        return SimilitudResponse.fromEntity(repository.save(sim));
    }
}
