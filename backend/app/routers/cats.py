from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.schemas.cat import CatCreate, CatResponse
from app.services import cat_service

router = APIRouter(tags=["cats"])


@router.get("/", response_model=list[CatResponse])
async def list_cats(db: AsyncSession = Depends(get_db)):
    return await cat_service.get_cats(db)


@router.get("/{cat_id}", response_model=CatResponse)
async def get_cat(cat_id: int, db: AsyncSession = Depends(get_db)):
    cat = await cat_service.get_cat(db, cat_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Cat not found")
    return cat


@router.post("/", response_model=CatResponse, status_code=201)
async def create_cat(cat: CatCreate, db: AsyncSession = Depends(get_db)):
    return await cat_service.create_cat(db, cat)
