# Database Schema — HappyPet

Base de données : `happy_pet_db` (PostgreSQL 17.7)

---

## Relations

```
┌──────────────┐         ┌─────────────────────┐
│     cats     │         │   injection_logs    │
├──────────────┤         ├─────────────────────┤
│ id (PK)      │───┐     │ id (PK)             │
│ name         │   │     │ cat_id (FK) ─────────┘
│ date_of_birth│   │     │ dosage              │
│ breed        │   └────>│ notes               │
│ sex          │         │ created_at          │
│ diabetes     │         └─────────────────────┘
│ color        │
│ weight       │         1 cat ──> * injection_logs
│ image_url    │
│ food_per_ration        CASCADE à la suppression
│ food_name    │
│ created_at   │
│ updated_at   │
└──────────────┘
```

---

## Table : `cats`

| Colonne         | Type               | Contraintes                          | Description                          |
|-----------------|--------------------|--------------------------------------|--------------------------------------|
| `id`            | SERIAL             | PRIMARY KEY                          | Identifiant auto-généré             |
| `name`          | VARCHAR(20)        | NOT NULL                             | Nom du chat                          |
| `date_of_birth` | DATE               | NOT NULL                             | Date de naissance (âge dérivé)       |
| `breed`         | VARCHAR(30)        | NOT NULL                             | Race                                 |
| `sex`           | VARCHAR(6)         | NOT NULL, CHECK IN ('Male','Female') | Sexe                                 |
| `diabetes`      | BOOLEAN            | NOT NULL DEFAULT FALSE               | Diabétique ou non                    |
| `color`         | VARCHAR(20)        | NOT NULL                             | Couleur                              |
| `weight`        | DOUBLE PRECISION   | NOT NULL                             | Poids en kg                          |
| `image_url`     | VARCHAR(255)       | NULLABLE                             | URL photo de profil                  |
| `food_per_ration`| DOUBLE PRECISION  | NULLABLE                             | Grammes par repas                    |
| `food_name`     | VARCHAR(50)        | NULLABLE                             | Nom de la nourriture                 |
| `created_at`    | TIMESTAMP          | NOT NULL DEFAULT NOW()               | Date de création                     |
| `updated_at`    | TIMESTAMP          | NOT NULL DEFAULT NOW()               | Dernière mise à jour                 |

**Index :**
- `idx_cats_name` sur `name`

---

## Table : `injection_logs`

| Colonne     | Type             | Contraintes                | Description                      |
|-------------|------------------|----------------------------|----------------------------------|
| `id`        | SERIAL           | PRIMARY KEY                | Identifiant auto-généré         |
| `cat_id`    | INTEGER          | NOT NULL, FK → cats(id)    | Référence au chat                |
| `dosage`    | DOUBLE PRECISION | NOT NULL                   | Dosage en ml                     |
| `notes`     | TEXT             | NULLABLE                   | Notes optionnelles               |
| `created_at`| TIMESTAMP        | NOT NULL DEFAULT NOW()     | Date/heure de l'injection        |

**Contraintes FK :**
- `cat_id` → `cats.id` ON DELETE CASCADE

**Index :**
- `idx_injection_logs_cat_id` sur `cat_id`
- `idx_injection_logs_created_at` sur `created_at DESC`

---

## Correspondance Frontend ↔ Database

| Frontend (TypeScript)      | Backend (SQL)          | Notes                                    |
|----------------------------|------------------------|------------------------------------------|
| `Cat.id`                   | `cats.id`              | string côté frontend, SERIAL côté DB     |
| `Cat.name`                 | `cats.name`            |                                          |
| `Cat.breed`                | `cats.breed`           |                                          |
| `Cat.color`                | `cats.color`           |                                          |
| `Cat.weight`               | `cats.weight`          |                                          |
| `Cat.dateOfBirth`          | `cats.date_of_birth`   | `calculateAge()` dérive l'âge affiché   |
| `Cat.imageUrl`             | `cats.image_url`       | Non utilisé pour l'instant               |
| `Cat.foodPerRation`        | `cats.food_per_ration` | État local → à persister via API        |
| `foodName` (état local)    | `cats.food_name`       | État local → à persister via API        |
| `InjectionLogs.date`       | `injection_logs.created_at` |                                        |
| `InjectionLogs.unit`       | `injection_logs.dosage`     |                                        |
| `DiabetesInjection.notes`  | `injection_logs.notes`      | Interface définie mais non utilisée    |

---

## SQL de création

```sql
CREATE TABLE cats (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(20) NOT NULL,
    date_of_birth   DATE NOT NULL,
    breed           VARCHAR(30) NOT NULL,
    sex             VARCHAR(6) NOT NULL CHECK (sex IN ('Male', 'Female')),
    diabetes        BOOLEAN NOT NULL DEFAULT FALSE,
    color           VARCHAR(20) NOT NULL,
    weight          DOUBLE PRECISION NOT NULL,
    image_url       VARCHAR(255),
    food_per_ration DOUBLE PRECISION,
    food_name       VARCHAR(50),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cats_name ON cats(name);

CREATE TABLE injection_logs (
    id         SERIAL PRIMARY KEY,
    cat_id     INTEGER NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
    dosage     DOUBLE PRECISION NOT NULL,
    notes      TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_injection_logs_cat_id ON injection_logs(cat_id);
CREATE INDEX idx_injection_logs_created_at ON injection_logs(created_at DESC);
```
