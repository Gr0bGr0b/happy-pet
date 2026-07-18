# Plan: Reorganize into global/frontend/backend

## Context

The project has frontend code (Expo/React Native) mixed with global config at the root. docker-compose.yaml and dependabot.yml already expect `./frontend` and `./backend` directories, but the frontend files haven't been moved yet. This plan moves all frontend files into `frontend/`, keeping global config at the root.

## Current State

- Root has: `app/`, `types/`, `assets/`, `package.json`, `app.json`, `tsconfig.json`, `Dockerfile`, `eslint.config.js`, `.env`, `expo-env.d.ts`, `package-lock.json`, plus global files
- `docker-compose.yaml` already references `./frontend` and `./backend`
- `.github/dependabot.yml` already references `/frontend` and `/backend`
- `backend/` directory is gone (deleted earlier)
- `types/` is imported by `app/` via relative paths (`../types/`, `../../types/`)

## Target Structure

```
/
├── .env                          # GLOBAL
├── .gitignore                    # GLOBAL
├── .github/
│   └── dependabot.yml            # GLOBAL
├── .helix/
│   └── languages.toml            # GLOBAL
├── .opencode/                    # GLOBAL
├── .prettierrc                   # GLOBAL
├── .prettierignore               # GLOBAL
├── BACKEND_SPEC.md               # GLOBAL
├── README.md                     # GLOBAL
├── docker-compose.yaml           # GLOBAL
├── frontend/
│   ├── Dockerfile                # moved from root
│   ├── app.json                  # moved from root
│   ├── package.json              # moved from root
│   ├── package-lock.json         # moved from root
│   ├── tsconfig.json             # moved from root
│   ├── eslint.config.js          # moved from root
│   ├── expo-env.d.ts             # moved from root
│   ├── app/                      # moved from root
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── injection.tsx
│   │   ├── components/
│   │   │   ├── Info.tsx
│   │   │   ├── LogsTable.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── NextInjection.tsx
│   │   └── utils/
│   │       └── dateUtils.ts
│   ├── types/                    # moved from root
│   │   ├── Cat.ts
│   │   └── DiabetesInjection.ts
│   └── assets/                   # moved from root (empty)
└── backend/                      # (empty, user will create)
```

## Steps

### 1. Create `frontend/` directory

### 2. Move frontend files into `frontend/`

Move these files/dirs from root to `frontend/`:
- `app/` (entire directory)
- `types/` (entire directory)
- `assets/` (entire directory)
- `package.json`
- `package-lock.json`
- `app.json`
- `tsconfig.json`
- `eslint.config.js`
- `expo-env.d.ts`
- `Dockerfile`

### 3. Create empty `backend/` directory

### 4. Update `docker-compose.yaml`

The frontend service currently has:
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
```

This is already correct. No changes needed.

### 5. No source code changes needed

The `types/` imports in `app/` use relative paths like `../types/Cat` and `../../types/Cat`. Since both `app/` and `types/` move together into `frontend/`, the relative paths remain valid.

### 6. No tsconfig.json changes needed

The `@/*` alias maps to `./*` which will resolve to `frontend/./*` — correct since all source is under `frontend/`.

### 7. Update `.gitignore`

Remove `node_modules` (appears twice) and `build/Release` references that are frontend-specific since they'll now be under `frontend/`. Actually, these patterns work recursively so they'll still match `frontend/node_modules/` — no change needed.

### 8. Update `.prettierignore` if needed

Check if any paths are root-relative that should become `frontend/`-relative.

## Verification

- `ls frontend/` shows `app/`, `types/`, `assets/`, `package.json`, etc.
- `ls frontend/app/` shows `_layout.tsx`, `index.tsx`, etc.
- `ls frontend/types/` shows `Cat.ts`, `DiabetesInjection.ts`
- `docker-compose.yaml` still references `./frontend` correctly
- `ls backend/` exists (empty)
- No broken imports in `app/` files (relative paths to `types/` preserved)
