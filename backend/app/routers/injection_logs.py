from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.schemas.injection_log import InjectionLogCreate, InjectionLogResponse
from app.services import cat_service, injection_log_service

router = APIRouter(tags=["injection_logs"])


@router.get("/", response_model=list[InjectionLogResponse])
async def list_injection_logs(
    cat_id: int = Query(..., description="Return every log of this cat"),
    db: AsyncSession = Depends(get_db),
):
    cat = await cat_service.get_cat(db, cat_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Cat not found")
    return await injection_log_service.get_injection_logs(db, cat_id)


@router.post("/", response_model=InjectionLogResponse, status_code=201)
async def create_injection_log(
    injection_log: InjectionLogCreate, db: AsyncSession = Depends(get_db)
):
    cat = await cat_service.get_cat(db, injection_log.cat_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Cat not found")
    return await injection_log_service.create_injection_log(db, injection_log)
