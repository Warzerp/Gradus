package com.buscador.semantico.autor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AutorRepository extends JpaRepository<Autor, Long> {
    Page<Autor> findByActivoTrue(Pageable pageable);
    boolean existsByEmail(String email);
    Optional<Autor> findByIdAndActivoTrue(Long id);
}
