"""Demo cat for development, so the app opens on the dashboard rather than the start view.

Runs on every dev container start: it does nothing unless SEED_DEMO_CAT is true, and
nothing once a cat exists. The prod image never calls it.
"""

import asyncio
import os
from datetime import date

from sqlalchemy import select

from app.database import async_session
from app.models.cat import Cat
from app.schemas.cat import CatCreate
from app.services import cat_service

DEMO_CAT = CatCreate(
    name="Minou",
    date_of_birth=date(2020, 3, 15),
    breed="European Shorthair",
    sex="Female",
    color="black",
    weight=4.5,
    diabetes=True,
    food_per_ration=50.0,
    food_name="Royal Canin Diabetic",
)


async def seed():
    async with async_session() as session:
        if await session.scalar(select(Cat.id).limit(1)) is not None:
            print("Seed skipped: a cat already exists")
            return
        cat = await cat_service.create_cat(session, DEMO_CAT)
        print(f"Seeded cat: {cat.name} (id={cat.id})")


if __name__ == "__main__":
    if os.getenv("SEED_DEMO_CAT", "false").lower() == "true":
        asyncio.run(seed())
