package com.buscador.semantico.auditoria;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {

    Page<Auditoria> findAllByOrderByRegistradoEnDesc(Pageable pageable);

    Page<Auditoria> findByUsuarioIdOrderByRegistradoEnDesc(Long usuarioId, Pageable pageable);

    Page<Auditoria> findByAccionOrderByRegistradoEnDesc(AccionAuditoria accion, Pageable pageable);
}
