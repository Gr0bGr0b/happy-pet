from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import cats, injection_logs


@asynccontextmanager
async def lifespan(app: FastAPI):
    # The schema is owned by Alembic; migrations run before the server starts.
    yield


app = FastAPI(
    title="HappyPet",
    description="REST API of Happy pet application",
    version="v1",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(cats.router, prefix="/api/v1/cats")
app.include_router(injection_logs.router, prefix="/api/v1/injections")
