package com.buscador.semantico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BuscadorSemanticoApplication {

    public static void main(String[] args) {
        SpringApplication.run(BuscadorSemanticoApplication.class, args);
    }
}
