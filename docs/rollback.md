# Rollback de Migraciones Flyway

## ¿Qué es el rollback?
Es el proceso de revertir una migración fallida o incorrecta en la base de datos.

## Importante
Flyway Community Edition no soporta rollback automático. El proceso es manual.

## Pasos para hacer rollback

### 1. Identificar la migración fallida
```bash
psql -U postgres -d buscador_semantico -c "SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank;"
```

### 2. Conectarse a la base de datos
```bash
psql -U postgres -d buscador_semantico
```

### 3. Revertir manualmente los cambios
Ejecutar el DROP correspondiente a la migración fallida. Por ejemplo:

- Si falló V2 (tabla usuarios):
```sql
DROP TABLE IF EXISTS usuarios CASCADE;
```
- Si falló V10 (catálogos):
```sql
DROP TABLE IF EXISTS catalogos CASCADE;
```

### 4. Eliminar el registro de la migración fallida
```sql
DELETE FROM flyway_schema_history WHERE version = 'N';
```
Reemplaza `N` con el número de versión que falló (ej: `2`, `10`).

### 5. Corregir el script SQL
Abre el archivo correspondiente en `db/migrations/` y corrige el error.

### 6. Volver a ejecutar las migraciones
```bash
$env:JWT_SECRET="mi-clave"; $env:DB_PASS="tu_password"; mvn spring-boot:run
```

## Ejemplo completo
Si falla `V5__create_table_trabajos_grado.sql`:
1. `DROP TABLE IF EXISTS trabajos_grado CASCADE;`
2. `DELETE FROM flyway_schema_history WHERE version = '5';`
3. Corregir `V5__create_table_trabajos_grado.sql`
4. Volver a correr la app