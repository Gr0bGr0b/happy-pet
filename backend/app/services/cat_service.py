from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.cat import Cat
from app.models.weight_history import WeightHistory
from app.schemas.cat import CatCreate, CatUpdate


async def create_cat(db: AsyncSession, cat: CatCreate) -> Cat:
    db_cat = Cat(**cat.model_dump())
    db.add(db_cat)
    await db.flush()
    # First point of the trend: without it a new cat's chart is empty until its first
    # weight edit, and migration 003 backfills exactly this row for existing cats.
    db.add(WeightHistory(cat_id=db_cat.id, weight=db_cat.weight))
    await db.commit()
    await db.refresh(db_cat)
    return db_cat


async def get_cats(db: AsyncSession) -> list[Cat]:
    result = await db.execute(select(Cat))
    return list(result.scalars().all())


async def get_cat(db: AsyncSession, cat_id: int) -> Cat | None:
    result = await db.execute(select(Cat).where(Cat.id == cat_id))
    return result.scalar_one_or_none()


async def update_cat(db: AsyncSession, cat: Cat, patch: CatUpdate) -> Cat:
    """Apply the sent fields only, and record a weight point when the weight moves."""
    changes = patch.model_dump(exclude_unset=True)
    previous_weight = cat.weight

    for field, value in changes.items():
        setattr(cat, field, value)

    if "weight" in changes and changes["weight"] != previous_weight:
        db.add(WeightHistory(cat_id=cat.id, weight=changes["weight"]))

    await db.commit()
    await db.refresh(cat)
    return cat


async def get_weight_history(
    db: AsyncSession,
    cat_id: int,
    since: datetime | None = None,
    limit: int | None = None,
) -> list[WeightHistory]:
    """Weight points for a cat, newest first."""
    query = select(WeightHistory).where(WeightHistory.cat_id == cat_id)
    if since is not None:
        query = query.where(WeightHistory.recorded_at >= since)
    query = query.order_by(WeightHistory.recorded_at.desc())
    if limit is not None:
        query = query.limit(limit)

    result = await db.execute(query)
    return list(result.scalars().all())
