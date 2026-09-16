from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.injection_log import InjectionLog
from app.schemas.injection_log import InjectionLogCreate


async def create_injection_log(
    db: AsyncSession, injection_log: InjectionLogCreate
) -> InjectionLog:
    db_injection_log = InjectionLog(**injection_log.model_dump())
    db.add(db_injection_log)
    await db.commit()
    await db.refresh(db_injection_log)
    return db_injection_log


async def get_injection_logs(db: AsyncSession, cat_id: int) -> list[InjectionLog]:
    result = await db.execute(
        select(InjectionLog)
        .where(InjectionLog.cat_id == cat_id)
        .order_by(InjectionLog.created_at.desc())
    )
    return list(result.scalars().all())
