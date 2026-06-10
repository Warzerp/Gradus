package com.buscador.semantico.pdf;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TextoCompletoRepository extends JpaRepository<TextoCompleto, Long> {
    Optional<TextoCompleto> findByTrabajoId(Long trabajoId);
}
