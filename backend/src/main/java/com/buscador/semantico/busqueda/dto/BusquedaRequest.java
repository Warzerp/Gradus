package com.buscador.semantico.busqueda.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class BusquedaRequest {

    @NotBlank
    private String consulta;

    @Min(1) @Max(50)
    private int limite = 10;
}
