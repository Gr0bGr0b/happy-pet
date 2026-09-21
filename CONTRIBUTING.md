# Contributing to HappyPet

Thank you for your interest in contributing to HappyPet! This guide will help you get started.

## Project Overview

HappyPet is a pet management application with:

- **Frontend** — Expo / React Native app (TypeScript, NativeWind, expo-router)
- **Backend** — Python API (FastAPI + SQLAlchemy)
- **Database** — PostgreSQL 17.7
- **Infrastructure** — Docker Compose

## Tech Stack

| Layer    | Technology                   | Details                                            |
| -------- | ---------------------------- | -------------------------------------------------- |
| Frontend | Expo ~57, React Native 0.81  | TypeScript, NativeWind (Tailwind CSS), expo-router |
| Backend  | Python 3.12, FastAPI         | SQLAlchemy (asyncio), Alembic, uvicorn             |
| Database | PostgreSQL 17.7              | Via Docker                                         |
| Tooling  | pre-commit, oxlint, Prettier | Linting, formatting, type checking                 |

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Python](https://www.python.org/downloads/) 3.12 (only needed to run the backend outside Docker)
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose
- [pre-commit](https://pre-commit.com/) (optional, but recommended)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/happy-pet.git
   cd happy-pet
   ```

2. **Install pre-commit hooks**

   ```bash
   pre-commit install
   ```

3. **Configure your environment**

   ```bash
   cp .env.example .env
   ```

   Uncomment `COMPOSE_FILE` in `.env` if you want every `docker compose`
   command to include the hot-reload overlay automatically.

4. **Start the whole stack with hot reload**

   ```bash
   docker compose --profile dev up
   ```

   The frontend is on <http://localhost:3000>, the API on
   <http://localhost:8080>, and Postgres on `5432`.

## Project Structure

```
happy-pet/
├── frontend/               # Expo React Native app
│   ├── app/                # File-based routing (expo-router)
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   └── utils/          # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # Images, fonts, etc.
│   └── .oxlintrc.json      # oxlint configuration
├── backend/                # Python API (FastAPI + SQLAlchemy)
├── docker-compose.yaml     # Docker services (dev + prod profiles)
├── .pre-commit-config.yaml # Pre-commit hooks
└── CONTRIBUTING.md         # This file
```

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feat/add-cat-profile` — new feature
- `fix/resolve-login-error` — bug fix
- `chore/update-dependencies` — maintenance

### Running Locally

`docker-compose.yaml` defines two profiles. `postgres` has no profile, so it
starts with either one.

| Profile | Services                      | Behaviour                                                |
| ------- | ----------------------------- | -------------------------------------------------------- |
| `dev`   | `backend-dev`, `frontend-dev` | Source mounted from the host, watching dev servers       |
| `prod`  | `backend`, `frontend`         | Production images, no reload — what CI and deploys build |

```bash
docker compose --profile dev up      # hot reload
docker compose --profile prod up     # production images
docker compose up -d postgres        # database only
```

Set `COMPOSE_PROFILES=dev` in `.env` (the default in `.env.example`) and plain
`docker compose up` picks the dev profile.

In the `dev` profile the backend runs `uvicorn --reload`, so any change under
`backend/app/` restarts the API, and the frontend runs `expo start --web`, so
Metro rebuilds on save with Fast Refresh. Open <http://localhost:3000>; the
container does not open a browser for you.

Rebuild only when dependencies change:

```bash
docker compose --profile dev build backend-dev    # requirements.txt
docker compose --profile dev build frontend-dev   # package.json
```

The two profiles use separate image tags (`happy-pet-backend-dev` and
`happy-pet-backend`, likewise for the frontend), so building one never
overwrites the other.

Alembic migrations run on every backend start, so adding a revision and
restarting the service applies it.

**Native (iOS/Android) development** runs outside Docker — the dev container
builds the web target only:

```bash
cd frontend && npm install && npx expo start
```

To reach Metro's interactive shortcuts (`r` to reload, `j` for the debugger):

```bash
docker attach frontend_dev   # Ctrl-P Ctrl-Q detaches without killing it
```

**If edits are not picked up**, the bind mount is probably not delivering
inotify events (common on Docker Desktop for Windows/macOS). Set
`WATCHFILES_FORCE_POLLING=true` in `.env` for the backend; for the frontend,
attach and press `r`. Note that `CI=true` in your environment silently disables
Metro's watch mode.

### Pre-commit Hooks

The following hooks run automatically on `git commit`:

| Hook                    | Scope       | What it does                              |
| ----------------------- | ----------- | ----------------------------------------- |
| **oxlint**              | `frontend/` | Lints TypeScript/JavaScript with auto-fix |
| **Prettier**            | All files   | Formats code with auto-fix                |
| **TypeScript check**    | `frontend/` | Runs `tsc --noEmit` for type safety       |
| **check-yaml**          | YAML files  | Validates YAML syntax                     |
| **end-of-file-fixer**   | All files   | Ensures files end with a newline          |
| **trailing-whitespace** | All files   | Removes trailing whitespace               |

## Code Style

- **TypeScript** — Follow the existing patterns in `frontend/app/`
- **Python** — Follow PEP 8; keep routers thin and put logic in `app/services/`
- **Commits** — Write clear, concise commit messages (e.g., `feat: add cat profile screen`)
- **PRs** — Keep pull requests focused on a single change

## Submitting a Pull Request

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Ensure all pre-commit hooks pass
5. Open a pull request with a clear description of what changed and why

## Reporting Issues

Use the [GitHub issue templates](https://github.com/sevrus/happy-pet/issues/new/choose) to report bugs or request features. Please fill out all relevant fields to help us understand the problem.

## Questions?

If you have questions, feel free to open a [discussion](https://github.com/sevrus/happy-pet/issues) or reach out to the maintainers.
