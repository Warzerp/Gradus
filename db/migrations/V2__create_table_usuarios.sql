-- V2: Tabla de usuarios del sistema
DO $$ BEGIN
    CREATE TYPE rol_usuario AS ENUM ('ADMIN', 'BIBLIOTECARIO', 'DOCENTE', 'ESTUDIANTE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS usuarios (
    id             BIGSERIAL    PRIMARY KEY,
    nombre         VARCHAR(150) NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    rol            rol_usuario  NOT NULL DEFAULT 'ESTUDIANTE',
    activo         BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
