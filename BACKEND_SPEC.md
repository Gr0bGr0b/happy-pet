# Backend Specification — HappyPet

Reference documentation for recreating the backend in Rust (Axum + SeaORM).

---

## Tech Stack (Original)

| Component   | Technology         | Version   |
|-------------|-------------------|-----------|
| Language    | Python            | 3.10      |
| Framework   | FastAPI           | >=0.123.9 |
| ORM         | SQLAlchemy        | >=2.0.44  |
| Validation  | Pydantic          | >=2.12.5  |
| Server      | Uvicorn           | >=0.38.0  |
| Database    | PostgreSQL        | 17.7      |
| Pkg Manager | UV                | -         |

---

## Project Structure

```
backend/
├── Cargo.toml              # (to create)
├── Dockerfile
└── src/
    ├── main.rs
    ├── config.rs
    ├── db.rs
    ├── models/
    │   ├── mod.rs
    │   └── cat.rs
    ├── schemas/
    │   ├── mod.rs
    │   └── cat.rs
    └── routes/
        ├── mod.rs
        └── cats.rs
```

---

## Database Schema

### Table: `cats`

| Column     | Type         | Constraints / Notes                       |
|------------|-------------|-------------------------------------------|
| `id`       | INTEGER     | Primary key, auto-increment, indexed      |
| `name`     | VARCHAR     | Not null, indexed                         |
| `age`      | INTEGER     | Not null                                  |
| `breed`    | VARCHAR     | Not null                                  |
| `sex`      | VARCHAR     | Not null, enum: `"Male"` or `"Female"`    |
| `diabetes` | BOOLEAN     | Not null, default: `false`                |
| `color`    | VARCHAR     | Not null                                  |
| `weight`   | DOUBLE      | Not null                                  |

> **Note:** The original Python code has no explicit migrations. Tables are auto-created via `Base.metadata.create_all()`. You should use SeaORM migrations instead.

---

## API Endpoints

### `POST /api/v1/cats/`

Create a new cat.

**Request Content-Type:** `application/json`

**Request Body:**

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

**Validation Rules:**

| Field      | Type   | Rules                              |
|------------|--------|------------------------------------|
| `name`     | string | min 1, max 20 characters           |
| `age`      | int    | min 0, max 25                      |
| `breed`    | string | min 1, max 30 characters           |
| `sex`      | enum   | `"Male"` or `"Female"`             |
| `diabetes` | bool   | optional, defaults to `false`      |
| `color`    | string | min 1, max 20 characters           |
| `weight`   | float  | > 0, <= 25                         |

**Response (200 OK):**

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

> **Note:** The response returns the same shape as the request, plus the auto-generated `id`.

---

## Docker Setup

### docker-compose.yaml (backend service)

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  container_name: backend_app
  ports:
    - "8080:8080"
  depends_on:
    - postgres
  environment:
    DB_HOST: postgres
    DB_USER: postgres
    DB_PASSWORD: postgres
    DB_NAME: happy_pet_db
```

### PostgreSQL service

```yaml
postgres:
  image: postgres:17.7
  container_name: postgres
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: happy_pet_db
  volumes:
    - postgres_data:/var/lib/postgresql/data
  ports:
    - "5432:5432"
  restart: unless-stopped
```

### Connection URL

```
postgresql://postgres:postgres@localhost:5432/happy_pet_db
```

Or when running via Docker Compose (host is the service name):

```
postgresql://postgres:postgres@postgres:5432/happy_pet_db
```

### Environment Variables

| Variable    | Value             |
|-------------|-------------------|
| `DB_HOST`   | `postgres` (Docker) or `localhost` (local) |
| `DB_USER`   | `postgres`        |
| `DB_PASSWORD`| `postgres`       |
| `DB_NAME`   | `happy_pet_db`    |

> Alternatively, use a single `DATABASE_URL` env var: `postgresql://postgres:postgres@localhost:5432/happy_pet_db`

---

## Known Bugs in Original Code

These existed in the Python implementation. **Do not recreate them.**

1. **`database.py`** — hardcoded DB URL uses `happy-pet-db` (with hyphen) but docker-compose uses `happy_pet_db` (with underscore). Use `happy_pet_db`.

2. **`models/cat.py`** — imports `Mapped` and `Float` from SQLAlchemy but never actually imports them (missing import statements).

3. **`schemas/cat.py`** — uses `Annotation` from `typing` without importing it.

4. **`routers/cats.py`** — `response_model` is misspelled as `responce_model`. Also imports `from app.services.cat import create_cat` but the file is `app/services/cat_service.py`.

5. **`services/cat_service.py`** — passes Pydantic model directly to ORM constructor (`Cat(cat)`) instead of using keyword arguments. Also `db.refresh()` is called without the required `db_cat` argument.

6. **`config.py`** — `SettingsConfigDict` is never imported, and `Config = Settings()` at module level is incorrect (should be an instance used elsewhere).

7. **`main.py`** — imports `from database import init_db` (missing `app.` prefix).

---

## Frontend TypeScript Types

Keep these in sync with your backend schemas:

### `types/Cat.ts`

```typescript
export interface Cat {
  id: string;
  name: string;
  breed: string;
  color: string;
  weight: number;
  imageUrl: string | undefined;
  dateOfBirth: string;
}
```

### `types/DiabetesInjection.ts`

```typescript
export interface DiabetesInjection {
  id: string;
  type: string;
  date: string;
  dosage: number;
  notes?: string;
}

export interface InjectionLogs {
  date: string;
  unit: number;
}
```

> **Note:** The frontend `Cat` interface has `dateOfBirth` and `imageUrl` which the backend `cats` table does not currently store. The backend `cats` table stores `age` (integer) instead of `dateOfBirth`. You may want to align these when implementing.

---

## CORS

The frontend runs on port `3000` (Expo dev server) and the backend on port `8080`. Configure CORS to allow requests from `http://localhost:3000`.

---

## Suggested Rust Crates

| Purpose       | Crate       | Notes                                    |
|---------------|-------------|------------------------------------------|
| Web framework | `axum`      | 0.8.x                                    |
| ORM           | `sea-orm`   | 1.1.x, with `sqlx-postgres` feature      |
| Serialization | `serde`     | With `derive` feature                     |
| JSON          | `serde_json`|                                           |
| Async runtime | `tokio`     | With `full` feature                       |
| Env vars      | `dotenvy`   |                                           |
| CORS          | `tower-http`| With `cors` feature                       |
| Validation    | `validator` | With `derive` feature                     |
