# Configuración de Protección de Ramas — Gradus

## Acceso rápido
Repositorio: https://github.com/Warzerp/Gradus

---

## Rama `main`

**Settings → Branches → Add branch protection rule → Branch name: `main`**

Marcar estas opciones:
- [x] **Require a pull request before merging**
  - [x] Require approvals: `1`
  - [x] Dismiss stale pull request approvals when new commits are pushed
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
- [x] **Do not allow bypassing the above settings**
- [x] **Restrict who can push to matching branches** → dejar vacío (nadie hace push directo)

---

## Rama `qa`

**Settings → Branches → Add branch protection rule → Branch name: `qa`**

Marcar estas opciones:
- [x] **Require a pull request before merging**
  - [x] Require approvals: `1`
- [x] **Do not allow bypassing the above settings**
- [x] **Restrict who can push to matching branches** → dejar vacío

---

## Flujo de trabajo

```
feature/mi-feature  →  develop  →  (PR)  →  qa  →  (PR)  →  main
```

1. Trabajar en rama `feature/*` o `fix/*` creada desde `develop`
2. PR: `feature/*` → `develop` (revisión de equipo)
3. PR: `develop` → `qa` (testing)
4. PR: `qa` → `main` (release)

---

## Estado actual del repositorio

| Rama | Commits | Protección |
|---|---|---|
| `main` | Initial commit | ⚠️ Pendiente configurar |
| `qa` | Initial commit | ⚠️ Pendiente configurar |
| `develop` | 5 commits (US-001 → US-005) | — |

Los commits del Sprint 1 están en `develop` y llegarán a `main`
a través del flujo PR: `develop` → `qa` → `main`.
