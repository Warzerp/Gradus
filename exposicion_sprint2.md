# Gradus 2 — Exposición Sprint 2
## Buscador Semántico de Trabajos de Grado

---

## Slide 1 — Título

**Gradus 2: Buscador Semántico de Trabajos de Grado**

Sprint 2 — Resultados y Entregables

Equipo de Desarrollo · 2026

---

## Slide 2 — ¿Qué es Gradus 2?

Sistema web para buscar y gestionar trabajos de grado académicos usando **inteligencia artificial semántica**.

- Los estudiantes encuentran trabajos relacionados por **significado**, no solo palabras clave
- Los bibliotecarios gestionan autores y detectan documentos duplicados
- Los administradores controlan accesos y roles

**Stack tecnológico:**
- Backend: Spring Boot 3.2 + PostgreSQL 18 + pgvector
- Frontend: React 19 + Vite + Tailwind CSS
- IA: Embeddings vectoriales para búsqueda semántica

---

## Slide 3 — Objetivos del Sprint 2

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| GRAD-16 | API REST Gestión de Autores (CRUD) | ✅ Completado |
| GRAD-17 | Pantalla Gestión de Autores (frontend) | ✅ Completado |
| GRAD-18 | Carga y parsing de PDF | ⏭ Pospuesto a Sprint 3 |
| GRAD-19 | Generación de Embeddings con IA | ✅ Completado |
| GRAD-21 | Motor de búsqueda semántica | ✅ Completado |
| GRAD-22 | Pantalla búsqueda semántica y resultados | ✅ Completado |
| GRAD-23 | Detector automático de duplicados | ✅ Completado |

**6 de 7 tareas completadas en el sprint.**

---

## Slide 4 — GRAD-16 y GRAD-17: Gestión de Autores

**¿Qué se implementó?**

API REST completa y pantalla de administración para gestionar autores de trabajos de grado.

**Funcionalidades:**
- Listar autores con paginación
- Crear nuevos autores (nombre, apellido, email)
- Editar datos de un autor existente
- Desactivar autores (baja lógica, no se eliminan datos)

**Endpoints backend:**
- `GET /api/autores` — lista paginada
- `POST /api/autores` — crear autor
- `PATCH /api/autores/{id}` — actualizar autor
- `DELETE /api/autores/{id}` — desactivar autor

**Acceso en la app:** `/autores`

---

## Slide 5 — GRAD-19: Generación de Embeddings con IA

**¿Qué es un embedding?**

Un embedding es una representación numérica (vector) del contenido de un texto. Dos textos similares en significado tendrán vectores cercanos en el espacio matemático.

**¿Cómo funciona en Gradus 2?**
1. Se sube un trabajo de grado al sistema
2. El backend extrae el texto del resumen
3. Se llama a un modelo de IA para generar el vector (1536 dimensiones)
4. El vector se guarda en PostgreSQL usando la extensión **pgvector**

**Endpoint:**
- `POST /api/trabajos/{trabajoId}/embedding` — genera y guarda el embedding

---

## Slide 6 — GRAD-21: Motor de Búsqueda Semántica

**¿Cómo funciona?**

1. El usuario escribe una consulta en lenguaje natural
2. El backend convierte la consulta a un embedding usando IA
3. Se busca en la base de datos los vectores más cercanos (similitud coseno)
4. Se devuelven los trabajos ordenados por relevancia semántica

**Diferencia con búsqueda tradicional:**
- Búsqueda tradicional: busca la palabra exacta "redes neuronales"
- Búsqueda semántica: encuentra también "deep learning", "aprendizaje profundo", "modelos de IA"

**Endpoint:**
- `POST /api/busqueda/semantica` — recibe `{consulta, limite}`, devuelve lista con `similitud`

---

## Slide 7 — GRAD-22: Pantalla de Búsqueda Semántica

**Interfaz de usuario para la búsqueda semántica.**

**Funcionalidades:**
- Campo de búsqueda en lenguaje natural
- Resultados ordenados por porcentaje de similitud semántica
- Chip de similitud (ej. "87% similitud") en cada resultado
- Resaltado del texto coincidente con la consulta
- Estado vacío con instrucciones para el usuario

**Acceso en la app:** `/buscar`

---

## Slide 8 — GRAD-23: Detector Automático de Duplicados

**¿Qué problema resuelve?**

Evita que se registren trabajos de grado con contenido muy similar al de trabajos ya existentes.

**¿Cómo funciona?**
1. Se ejecuta el detector sobre todos los trabajos con embedding generado
2. Calcula la similitud entre cada par de documentos
3. Los pares con similitud > umbral se marcan como posibles duplicados
4. Un bibliotecario o admin revisa y decide si requieren acción

**Endpoints:**
- `POST /api/duplicados/detectar` — ejecuta la detección
- `GET /api/duplicados` — lista los pares pendientes de revisión
- `PATCH /api/duplicados/{id}/revisar` — marca como revisado

---

## Slide 9 — Correcciones Técnicas del Sprint

Durante el sprint se identificaron y corrigieron problemas críticos de infraestructura:

**1. CORS bloqueaba el frontend (Spring Security 6)**
- Causa: Spring Security 6 requiere activar CORS explícitamente
- Solución: Se agregó `.cors(Customizer.withDefaults())` en `SecurityConfig`

**2. Error de tipos en PostgreSQL con enums nativos**
- Causa: Hibernate 6 enviaba enums como `VARCHAR`, PostgreSQL los rechazaba
- Solución: Se agregó `@JdbcType(PostgreSQLEnumJdbcType.class)` en las entidades `User` y `TrabajoGrado`

**Resultado:** Login y registro funcionando correctamente.

---

## Slide 10 — Arquitectura del Sistema

```
Frontend (React 19 + Vite)          Backend (Spring Boot 3.2)
┌─────────────────────┐             ┌──────────────────────────┐
│  /login             │  REST API   │  AuthController          │
│  /dashboard         │ ──────────► │  AutorController         │
│  /autores           │             │  BusquedaSemanticaController│
│  /buscar            │ ◄────────── │  DuplicadoController     │
└─────────────────────┘   JSON      │  EmbeddingController     │
         │                          └──────────┬───────────────┘
         │ JWT Auth                             │ JPA / JDBC
         │                          ┌──────────▼───────────────┐
         │                          │  PostgreSQL 18           │
         │                          │  + pgvector extension    │
         └──────────────────────────│  Tablas: usuarios,       │
                                    │  trabajos_grado, autores,│
                                    │  similitudes_conceptuales│
                                    └──────────────────────────┘
```

---

## Slide 11 — Demostración en Vivo

**Flujo a demostrar:**

1. **Login** → `admin@gradus.com`
2. **Dashboard** → pantalla de bienvenida con rol
3. **Gestión de Autores** (`/autores`) → crear y editar un autor
4. **Búsqueda Semántica** (`/buscar`) → buscar "aprendizaje automático en salud"
5. **Resultados** → mostrar % de similitud y resaltado de texto

---

## Slide 12 — Sprint 3 — Próximos Pasos

| Tarea | Descripción |
|-------|-------------|
| GRAD-18 | Carga y parsing de PDF (pospuesto) |
| Pendiente | Navegación sidebar con links a todas las secciones |
| Pendiente | Dashboard con métricas (total trabajos, autores, búsquedas) |
| Pendiente | Gestión de trabajos de grado completa |
| Pendiente | Panel de duplicados con interfaz de revisión |

---

## Resumen

- **Sprint 2 entregó** el núcleo funcional del sistema: autenticación, gestión de autores, búsqueda semántica con IA y detección de duplicados.
- **La arquitectura** está lista para escalar: PostgreSQL con pgvector, JWT stateless, React con rutas protegidas por rol.
- **Sprint 3** completa la carga de documentos PDF y los paneles de administración.
