package com.buscador.semantico.duplicados;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SimilitudConceptualRepository extends JpaRepository<SimilitudConceptual, Long> {

    Page<SimilitudConceptual> findByRevisadoFalseOrderByScoreDesc(Pageable pageable);

    boolean existsByTrabajoAIdAndTrabajoBId(Long aId, Long bId);
}
