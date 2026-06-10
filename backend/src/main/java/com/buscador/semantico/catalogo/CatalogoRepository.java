package com.buscador.semantico.catalogo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatalogoRepository extends JpaRepository<Catalogo, Long> {
    List<Catalogo> findByTipoAndActivoTrue(String tipo);
}
