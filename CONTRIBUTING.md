# Contributing to HappyPet

Thank you for your interest in contributing to HappyPet! This guide will help you get started.

## Project Overview

HappyPet is a pet management application with:

- **Frontend** — Expo / React Native app (TypeScript, NativeWind, expo-router)
- **Backend** — Rust API (Axum + SeaORM)
- **Database** — PostgreSQL 17.7
- **Infrastructure** — Docker Compose

## Tech Stack

| Layer    | Technology                   | Details                                            |
| -------- | ---------------------------- | -------------------------------------------------- |
| Frontend | Expo ~57, React Native 0.81  | TypeScript, NativeWind (Tailwind CSS), expo-router |
| Backend  | Rust, Axum 0.8               | SeaORM, serde, tokio                               |
| Database | PostgreSQL 17.7              | Via Docker                                         |
| Tooling  | pre-commit, oxlint, Prettier | Linting, formatting, type checking                 |

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Rust](https://www.rust-lang.org/tools/install) (stable)
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

3. **Start the database**

   ```bash
   docker compose up -d postgres
   ```

4. **Set up the frontend**

   ```bash
   cd frontend
   npm install
   npx expo start
   ```

5. **Set up the backend** (once implemented)

   ```bash
   cd backend
   cargo run
   ```

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
├── backend/                # Rust API (Axum + SeaORM)
├── docker-compose.yaml     # Docker services
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

- **Frontend**: `cd frontend && npx expo start`
- **Database**: `docker compose up -d postgres`
- **Full stack**: `docker compose up`

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
- **Rust** — Follow standard Rust conventions (`rustfmt` defaults)
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
