package com.buscador.semantico.trabajogrado;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TrabajoGradoRepository extends JpaRepository<TrabajoGrado, Long> {

    Page<TrabajoGrado> findAll(Pageable pageable);

    @Query("SELECT t FROM TrabajoGrado t WHERE t.estado = 'PUBLICADO'")
    List<TrabajoGrado> findAllPublicados();

    @Query(value = """
            SELECT id FROM trabajos_grado
            WHERE embedding IS NOT NULL
            ORDER BY embedding <-> CAST(:query AS vector)
            LIMIT :limit
            """, nativeQuery = true)
    List<Long> findSimilarIds(String query, int limit);
}
