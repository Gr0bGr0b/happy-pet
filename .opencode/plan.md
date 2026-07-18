# Backend Migration: Python (FastAPI) → Rust (Axum + SeaORM)

## Context

The current backend is a Python/FastAPI app with SQLAlchemy for PostgreSQL. It has a single `Cat` model and one `POST /api/v1/cats/` endpoint. The code also has several bugs (missing imports, misspelled fields, wrong import paths). The frontend does not call the backend yet — all data is hardcoded.

This plan migrates the backend to Rust using **Axum** (web framework) and **SeaORM** (async ORM), fixing the existing bugs along the way and maintaining the same API contract.

## Project Structure

```
backend/
├── Cargo.toml
├── Dockerfile
└── src/
    ├── main.rs              # Entry point: server setup, router, DB pool
    ├── config.rs            # App config from env vars
    ├── db.rs                # Database connection pool setup
    ├── models/
    │   ├── mod.rs
    │   └── cat.rs           # SeaORM entity for `cats` table
    ├── schemas/
    │   ├── mod.rs
    │   └── cat.rs           # Serde request/response types
    └── routes/
        ├── mod.rs
        └── cats.rs          # POST /api/v1/cats/ handler
```

## Steps

### 1. Remove Python backend files
Delete all Python backend code:
- `backend/app/` (all `.py` files and `__init__.py` files)
- `backend/pyproject.toml`
- `backend/uv.lock`
- `backend/.python-version`
- `backend/README.md`

### 2. Initialize Rust project
Run `cargo init` in `backend/` to create `Cargo.toml` and `src/main.rs`.

### 3. Configure `Cargo.toml`
Add dependencies:
```toml
[dependencies]
axum = "0.8"
sea-orm = { version = "1.1", features = ["sqlx-postgres", "runtime-tokio-native-tls", "macros"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
dotenvy = "0.15"
tower-http = { version = "0.6", features = ["cors"] }
```

### 4. Create `src/config.rs`
Read `DATABASE_URL` from environment (with fallback to `postgresql://postgres:postgres@localhost:5432/happy_pet_db`).

### 5. Create `src/db.rs`
Set up SeaORM `DatabaseConnection` pool from the config.

### 6. Create `src/models/cat.rs`
Define SeaORM entity matching the `cats` table:
- `id` (i32, primary key)
- `name` (String)
- `age` (i32)
- `breed` (String)
- `sex` (String — "Male" / "Female")
- `diabetes` (bool, default false)
- `color` (String)
- `weight` (f64)

### 7. Create `src/schemas/cat.rs`
Define `CatCreate` struct with serde + validation:
```rust
#[derive(Deserialize, Validate)]
pub struct CatCreate {
    #[validate(length(min = 1, max = 20))]
    pub name: String,
    #[validate(range(min = 0, max = 25))]
    pub age: i32,
    #[validate(length(min = 1, max = 30))]
    pub breed: String,
    pub sex: SexEnum,
    #[serde(default)]
    pub diabetes: bool,
    #[validate(length(min = 1, max = 20))]
    pub color: String,
    #[validate(range(min = 0.01, max = 25.0))]
    pub weight: f64,
}
```
Also define `SexEnum` as a serde-serializable enum (`"Male"` / `"Female"`).

### 8. Create `src/routes/cats.rs`
Implement the `POST /api/v1/cats/` handler:
- Accept `Json<CatCreate>` body
- Validate fields
- Insert into database via SeaORM
- Return JSON response

### 9. Create `src/routes/mod.rs`
Re-export the cats router.

### 10. Create `src/main.rs`
Wire everything together:
- Load `.env` via `dotenvy`
- Create DB pool
- Build Axum router with CORS middleware
- Mount routes at `/api/v1/cats/`
- Start server on `0.0.0.0:8080`

### 11. Create `backend/Dockerfile`
Multi-stage Docker build:
1. **Builder stage**: `rust:1.87-slim` — install `pkg-config`, `libssl-dev`, build with `cargo build --release`
2. **Runtime stage**: `debian:bookworm-slim` — copy binary, expose 8080

### 12. Update `docker-compose.yaml`
- Update `backend` service: remove `build.dockerfile` override (uses `./backend/Dockerfile` as-is)
- Pass `DATABASE_URL` env var: `postgresql://postgres:postgres@postgres:5432/happy_pet_db`
- Keep port mapping `8080:8080`

### 13. Update `.gitignore`
Add Rust-specific entries:
```
# Rust
/target
```

## API Contract (unchanged)

| Method | Path | Body | Response |
|--------|------|------|----------|
| `POST` | `/api/v1/cats/` | `CatCreate` JSON | `Cat` JSON (with `id`) |

Request body:
```json
{
  "name": "Whiskers",
  "age": 3,
  "breed": "Siamese",
  "sex": "Male",
  "diabetes": false,
  "color": "Black",
  "weight": 4.5
}
```

Response body (same shape, now with `id`):
```json
{
  "id": 1,
  "name": "Whiskers",
  "age": 3,
  "breed": "Siamese",
  "sex": "Male",
  "diabetes": false,
  "color": "Black",
  "weight": 4.5
}
```

## Verification

1. `cargo build` in `backend/` — compiles without errors
2. `cargo clippy` — no warnings
3. `docker compose up --build` — backend starts and connects to PostgreSQL
4. `curl -X POST http://localhost:8080/api/v1/cats/ -H 'Content-Type: application/json' -d '{"name":"Whiskers","age":3,"breed":"Siamese","sex":"Male","diabetes":false,"color":"Black","weight":4.5}'` — returns 201 with created cat
