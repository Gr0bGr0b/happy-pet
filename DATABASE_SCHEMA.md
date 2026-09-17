# Database Schema — HappyPet

Base de données : `happy_pet_db` (PostgreSQL 17.7)

---

## Relations

```
┌──────────────────────────┐         ┌─────────────────────┐
│           cats           │         │   injection_logs    │
├──────────────────────────┤         ├─────────────────────┤
│ id (PK)                  │───┬────>│ id (PK)             │
│ name                     │   │     │ cat_id (FK)         │
│ date_of_birth            │   │     │ dosage              │
│ breed                    │   │     │ notes               │
│ sex                      │   │     │ created_at          │
│ diabetes                 │   │     └─────────────────────┘
│ color                    │   │
│ weight                   │   │     ┌─────────────────────┐
│ image_url                │   │     │   weight_history    │
│ food_per_ration          │   │     ├─────────────────────┤
│ food_name                │   ├────>│ id (PK)             │
│ injection_interval_hours │   │     │ cat_id (FK)         │
│ created_at               │   │     │ weight              │
│ updated_at               │   │     │ recorded_at         │
└──────────────────────────┘   │     └─────────────────────┘
                               │
                               │     ┌─────────────────────┐
                               │     │     cat_images      │
                               │     ├─────────────────────┤
                               └────>│ cat_id (PK, FK)     │
                                     │ content_type        │
                                     │ data                │
                                     │ updated_at          │
                                     └─────────────────────┘

1 cat ──> * injection_logs           CASCADE à la suppression
1 cat ──> * weight_history
1 cat ──> 0..1 cat_images
```

---

## Table : `cats`

| Colonne                    | Type             | Contraintes                          | Description                    |
| -------------------------- | ---------------- | ------------------------------------ | ------------------------------ |
| `id`                       | SERIAL           | PRIMARY KEY                          | Identifiant auto-généré        |
| `name`                     | VARCHAR(20)      | NOT NULL                             | Nom du chat                    |
| `date_of_birth`            | DATE             | NOT NULL                             | Date de naissance (âge dérivé) |
| `breed`                    | VARCHAR(30)      | NOT NULL                             | Race                           |
| `sex`                      | VARCHAR(6)       | NOT NULL, CHECK IN ('Male','Female') | Sexe                           |
| `diabetes`                 | BOOLEAN          | NOT NULL DEFAULT FALSE               | Diabétique ou non              |
| `color`                    | VARCHAR(20)      | NOT NULL                             | Couleur                        |
| `weight`                   | DOUBLE PRECISION | NOT NULL                             | Poids en kg                    |
| `image_url`                | VARCHAR(255)     | NULLABLE                             | URL photo de profil            |
| `food_per_ration`          | DOUBLE PRECISION | NULLABLE                             | Grammes par repas              |
| `food_name`                | VARCHAR(50)      | NULLABLE                             | Nom de la nourriture           |
| `injection_interval_hours` | INTEGER          | NOT NULL DEFAULT 12                  | Heures entre deux injections   |
| `created_at`               | TIMESTAMP        | NOT NULL DEFAULT NOW()               | Date de création               |
| `updated_at`               | TIMESTAMP        | NOT NULL DEFAULT NOW()               | Dernière mise à jour           |

**Index :**

- `idx_cats_name` sur `name`

---

## Table : `injection_logs`

| Colonne      | Type             | Contraintes             | Description               |
| ------------ | ---------------- | ----------------------- | ------------------------- |
| `id`         | SERIAL           | PRIMARY KEY             | Identifiant auto-généré   |
| `cat_id`     | INTEGER          | NOT NULL, FK → cats(id) | Référence au chat         |
| `dosage`     | DOUBLE PRECISION | NOT NULL                | Dosage en ml              |
| `notes`      | TEXT             | NULLABLE                | Notes optionnelles        |
| `created_at` | TIMESTAMP        | NOT NULL DEFAULT NOW()  | Date/heure de l'injection |

**Contraintes FK :**

- `cat_id` → `cats.id` ON DELETE CASCADE

**Index :**

- `idx_injection_logs_cat_id` sur `cat_id`
- `idx_injection_logs_created_at` sur `created_at DESC`

---

## Table : `weight_history`

Une ligne par pesée. `cats.weight` reste le poids courant ; cette table est ce qui rend
la courbe de tendance possible. Une ligne est écrite à la création du chat et à chaque
`PATCH` qui change le poids.

| Colonne       | Type             | Contraintes             | Description             |
| ------------- | ---------------- | ----------------------- | ----------------------- |
| `id`          | SERIAL           | PRIMARY KEY             | Identifiant auto-généré |
| `cat_id`      | INTEGER          | NOT NULL, FK → cats(id) | Référence au chat       |
| `weight`      | DOUBLE PRECISION | NOT NULL                | Poids en kg             |
| `recorded_at` | TIMESTAMP        | NOT NULL DEFAULT NOW()  | Date de la pesée        |

**Contraintes FK :**

- `cat_id` → `cats.id` ON DELETE CASCADE

**Index :**

- `idx_weight_history_cat_recorded` sur `(cat_id, recorded_at DESC)` — sert la seule
  requête existante : les pesées d'un chat, de la plus récente à la plus ancienne

---

## Table : `cat_images`

La photo du chat, une ligne par chat. Les octets vivent en base plutôt que sur un volume
Docker : un seul `pg_dump` suffit alors à tout sauvegarder, et l'upload écrit les octets
et `cats.image_url` dans la même transaction. Table séparée et non colonne sur `cats` :
SQLAlchemy charge toutes les colonnes mappées par défaut, donc des octets sur `cats`
seraient tirés à chaque `GET /cats/`.

| Colonne        | Type        | Contraintes                | Description                |
| -------------- | ----------- | -------------------------- | -------------------------- |
| `cat_id`       | INTEGER     | PRIMARY KEY, FK → cats(id) | Une photo par chat         |
| `content_type` | VARCHAR(32) | NOT NULL                   | image/jpeg, png ou webp    |
| `data`         | BYTEA       | NOT NULL                   | Octets de l'image, ≤ 5 Mo  |
| `updated_at`   | TIMESTAMP   | NOT NULL                   | Sert de clé de cache `?v=` |

**Contraintes FK :**

- `cat_id` → `cats.id` ON DELETE CASCADE

---

## Correspondance Frontend ↔ Database

| Frontend (TypeScript)        | Backend (SQL)                   | Notes                                 |
| ---------------------------- | ------------------------------- | ------------------------------------- |
| `Cat.id`                     | `cats.id`                       | string côté frontend, SERIAL côté DB  |
| `Cat.name`                   | `cats.name`                     |                                       |
| `Cat.breed`                  | `cats.breed`                    |                                       |
| `Cat.color`                  | `cats.color`                    |                                       |
| `Cat.weight`                 | `cats.weight`                   |                                       |
| `Cat.dateOfBirth`            | `cats.date_of_birth`            | `calculateAge()` dérive l'âge affiché |
| `Cat.imageUrl`               | `cats.image_url`                | Chemin `/static/...`, résolu côté app |
| `Cat.foodPerRation`          | `cats.food_per_ration`          | Édité via `PATCH /cats/{id}`          |
| `Cat.foodName`               | `cats.food_name`                | Édité via `PATCH /cats/{id}`          |
| `Cat.injectionIntervalHours` | `cats.injection_interval_hours` | Pilote le cooldown du bouton          |
| `WeightPoint.weight`         | `weight_history.weight`         | Série de la courbe de poids           |
| `WeightPoint.recordedAt`     | `weight_history.recorded_at`    |                                       |
| `InjectionLogs.date`         | `injection_logs.created_at`     |                                       |
| `InjectionLogs.unit`         | `injection_logs.dosage`         |                                       |
| `DiabetesInjection.notes`    | `injection_logs.notes`          | Interface définie mais non utilisée   |

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
    injection_interval_hours INTEGER NOT NULL DEFAULT 12,
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

CREATE TABLE weight_history (
    id          SERIAL PRIMARY KEY,
    cat_id      INTEGER NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
    weight      DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weight_history_cat_recorded
    ON weight_history(cat_id, recorded_at DESC);

CREATE TABLE cat_images (
    cat_id       INTEGER PRIMARY KEY REFERENCES cats(id) ON DELETE CASCADE,
    content_type VARCHAR(32) NOT NULL,
    data         BYTEA NOT NULL,
    updated_at   TIMESTAMP NOT NULL
);
```

---

## Migrations (Alembic)

Le schema est gere via Alembic. Les migrations se trouvent dans `backend/alembic/versions/`.

### Commandes utiles

```bash
# Depuis backend/
# Appliquer toutes les migrations
alembic upgrade head

# Revenir en arriere d'une migration
alembic downgrade -1

# Creer une nouvelle migration apres un changement de model
alembic revision --autogenerate -m "description"

# Voir l'historique des migrations
alembic history

# Voir la migration courante
alembic current
```

### Fichiers

| Fichier                                                   | Role                                                                                                                |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `alembic.ini`                                             | Configuration Alembic (URL de DB, chemin du script)                                                                 |
| `alembic/env.py`                                          | Environnement async, charge les models SQLAlchemy                                                                   |
| `alembic/versions/001_create_cats_table.py`               | Premiere migration : creation de la table `cats`                                                                    |
| `alembic/versions/002_create_injection_logs_table.py`     | Creation de la table `injection_logs` (+ renomme l'index `created_at` de `cats`, mal nomme dans 001)                |
| `alembic/versions/003_add_weight_history_and_interval.py` | Creation de `weight_history` (avec backfill d'un point par chat existant) + colonne `cats.injection_interval_hours` |
| `alembic/versions/004_store_cat_images_in_db.py`          | Creation de `cat_images` : les photos passent du volume Docker a la base                                            |

### Note

La migration `001_create_cats_table.py` est equivalente au SQL de creation ci-dessus. En development, on peut aussi utiliser `Base.metadata.create_all()` dans `app/main.py` (via le lifespan) pour creer les tables directement sans Alembic. Alembic est utile pour les migrations futures quand le schema evolue.
