from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.routers import cats, injection_logs
from app.services.image_storage import STATIC_PREFIX

app = FastAPI(
    title="HappyPet",
    description="REST API of Happy pet application",
    version="v1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Uploaded cat photos. Created up front because StaticFiles refuses to mount a
# directory that does not exist, and the volume starts empty on a fresh install.
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount(STATIC_PREFIX, StaticFiles(directory=settings.UPLOAD_DIR), name="static")


@app.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(cats.router, prefix="/api/v1/cats")
app.include_router(injection_logs.router, prefix="/api/v1/injections")
