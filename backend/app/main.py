from fastapi import FastAPI
from app.routers import cats
from database import init_db

app = FastAPI(
    title="HappyPet",
    description="Rest API of Happy pet application",
    version="v1",
)

# Initialisation of database
init_db()

# Add routes
app.include_router(cats.router, prefix="/api/v1/cats")
