-- V10: Tabla genérica de catálogos + datos semilla + FKs diferidas

CREATE TABLE catalogos (
    id     BIGSERIAL    PRIMARY KEY,
    tipo   VARCHAR(50)  NOT NULL,    -- 'FACULTAD', 'PROGRAMA', 'LINEA', 'AREA'
    nombre VARCHAR(200) NOT NULL,
    activo BOOLEAN      NOT NULL DEFAULT TRUE,
    UNIQUE (tipo, nombre)
);

-- Datos iniciales — facultades, líneas de investigación y programas académicos
INSERT INTO catalogos (tipo, nombre) VALUES
    ('FACULTAD', 'Ingeniería'),
    ('FACULTAD', 'Ciencias Exactas'),
    ('FACULTAD', 'Ciencias Sociales'),
    ('PROGRAMA', 'Ingeniería de Sistemas'),
    ('PROGRAMA', 'Ingeniería Electrónica'),
    ('PROGRAMA', 'Ingeniería Civil'),
    ('LINEA', 'Inteligencia Artificial'),
    ('LINEA', 'Bases de Datos'),
    ('LINEA', 'Redes y Comunicaciones'),
    ('LINEA', 'Desarrollo de Software'),
    ('AREA', 'Computación'),
    ('AREA', 'Matemáticas');

-- FKs diferidas: se agregan aquí porque catalogos ya existe
ALTER TABLE trabajos_grado
    ADD CONSTRAINT fk_tg_facultad FOREIGN KEY (facultad_id) REFERENCES catalogos(id),
    ADD CONSTRAINT fk_tg_programa FOREIGN KEY (programa_id) REFERENCES catalogos(id),
    ADD CONSTRAINT fk_tg_linea    FOREIGN KEY (linea_id)    REFERENCES catalogos(id);

ALTER TABLE autores
    ADD CONSTRAINT fk_autor_programa FOREIGN KEY (programa_id) REFERENCES catalogos(id);
