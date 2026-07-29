import asyncio

from app.database import async_session, engine, Base
from app.models.cat import Cat


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        cat = Cat(
            name="Minou",
            date_of_birth="2020-05-15",
            breed="Persan",
            sex="Male",
            diabetes=False,
            color="#FF6B9D",
            weight=4.5,
        )
        session.add(cat)
        await session.commit()
        print(f"Seeded cat: {cat.name} (id={cat.id})")


if __name__ == "__main__":
    asyncio.run(seed())
