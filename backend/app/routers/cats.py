from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.dependencies import get_cat_or_404, get_db
from app.models.cat import Cat
from app.schemas.cat import (
    CatCreate,
    CatImageResponse,
    CatResponse,
    CatUpdate,
    WeightPointResponse,
)
from app.services import cat_service
from app.services.image_storage import (
    ImageTooLarge,
    UnsupportedImageType,
    delete_cat_image,
    save_cat_image,
)

router = APIRouter(tags=["cats"])


@router.get("/", response_model=list[CatResponse])
async def list_cats(db: AsyncSession = Depends(get_db)):
    return await cat_service.get_cats(db)


@router.get("/{cat_id}", response_model=CatResponse)
async def get_cat(cat: Cat = Depends(get_cat_or_404)):
    return cat


@router.post("/", response_model=CatResponse, status_code=201)
async def create_cat(cat: CatCreate, db: AsyncSession = Depends(get_db)):
    return await cat_service.create_cat(db, cat)


@router.patch("/{cat_id}", response_model=CatResponse)
async def update_cat(
    patch: CatUpdate,
    cat: Cat = Depends(get_cat_or_404),
    db: AsyncSession = Depends(get_db),
):
    return await cat_service.update_cat(db, cat, patch)


@router.get("/{cat_id}/weights", response_model=list[WeightPointResponse])
async def list_weight_history(
    since: datetime | None = Query(
        None, description="Only points recorded at or after this instant (ISO 8601)"
    ),
    limit: int | None = Query(None, ge=1, le=1000, description="Newest N points"),
    cat: Cat = Depends(get_cat_or_404),
    db: AsyncSession = Depends(get_db),
):
    return await cat_service.get_weight_history(db, cat.id, since=since, limit=limit)


@router.post("/{cat_id}/image", response_model=CatImageResponse, status_code=201)
async def upload_cat_image(
    file: UploadFile = File(..., description="image/jpeg, image/png or image/webp"),
    cat: Cat = Depends(get_cat_or_404),
    db: AsyncSession = Depends(get_db),
):
    previous_url = cat.image_url
    try:
        image_url = await save_cat_image(cat.id, file)
    except UnsupportedImageType as exc:
        raise HTTPException(
            status_code=415, detail=f"Unsupported image type: {exc}"
        ) from exc
    except ImageTooLarge as exc:
        limit_mb = settings.MAX_IMAGE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=413, detail=f"Image exceeds {limit_mb} MB"
        ) from exc

    # Same write path as any other field change.
    await cat_service.update_cat(db, cat, CatUpdate(image_url=image_url))
    # Only once the new path is committed, so a failed write never leaves the cat
    # pointing at a file that is already gone.
    delete_cat_image(previous_url)
    return CatImageResponse(image_url=image_url)
