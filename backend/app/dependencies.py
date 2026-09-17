from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.cat import Cat
from app.services import cat_service

__all__ = ["get_db", "get_cat_or_404"]


async def get_cat_or_404(cat_id: int, db: AsyncSession = Depends(get_db)) -> Cat:
    """Resolve the {cat_id} path parameter, or answer 404.

    Every /cats/{cat_id} route needs the row anyway, so the lookup and the 404 live
    here instead of opening each handler.
    """
    cat = await cat_service.get_cat(db, cat_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Cat not found")
    return cat
