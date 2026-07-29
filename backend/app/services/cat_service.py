from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.cat import Cat
from app.schemas.cat import CatCreate


async def create_cat(db: AsyncSession, cat: CatCreate) -> Cat:
    db_cat = Cat(**cat.model_dump())
    db.add(db_cat)
    await db.commit()
    await db.refresh(db_cat)
    return db_cat


async def get_cats(db: AsyncSession) -> list[Cat]:
    result = await db.execute(select(Cat))
    return list(result.scalars().all())


async def get_cat(db: AsyncSession, cat_id: int) -> Cat | None:
    result = await db.execute(select(Cat).where(Cat.id == cat_id))
    return result.scalar_one_or_none()
