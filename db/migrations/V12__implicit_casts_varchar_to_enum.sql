-- V12: Casts implícitos varchar → enum para compatibilidad con Hibernate 6
-- Hibernate 6 envía enums como character varying; PostgreSQL necesita este cast explícito.
DO $$ BEGIN
    CREATE CAST (character varying AS rol_usuario) WITH INOUT AS IMPLICIT;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE CAST (character varying AS estado_trabajo) WITH INOUT AS IMPLICIT;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
