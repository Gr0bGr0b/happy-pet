# ---- base -----------------------------------------------------------------
# Dependencies only, so a source change never re-runs pip install.
FROM python:3.12-slim AS base

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- dev ------------------------------------------------------------------
# No `COPY . .`: the dev profile bind-mounts ./backend over /app.
FROM base AS dev

# uvicorn --reload needs watchfiles, otherwise it stat-polls every file.
RUN pip install --no-cache-dir "uvicorn[standard]>=0.38.0"

EXPOSE 8080

CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload --reload-dir /app/app"]

# ---- runtime --------------------------------------------------------------
FROM base AS runtime

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8080"]
