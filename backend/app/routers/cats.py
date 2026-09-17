from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Query,
    Request,
    Response,
    UploadFile,
)
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
from app.services import cat_image_service, cat_service
from app.services.cat_image_service import ImageTooLarge, UnsupportedImageType

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


@router.get("/{cat_id}/image", response_class=Response)
async def get_cat_image(
    cat: Cat = Depends(get_cat_or_404), db: AsyncSession = Depends(get_db)
):
    image = await cat_image_service.get_image(db, cat.id)
    if image is None:
        raise HTTPException(status_code=404, detail="Cat has no photo")

    return Response(
        content=image.data,
        media_type=image.content_type,
        # Safe only because the URL carries ?v=<updated_at>: a replaced photo is a
        # different URL, so nothing has to expire.
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )


@router.post("/{cat_id}/image", response_model=CatImageResponse, status_code=201)
async def upload_cat_image(
    request: Request,
    file: UploadFile = File(..., description="image/jpeg, image/png or image/webp"),
    cat: Cat = Depends(get_cat_or_404),
    db: AsyncSession = Depends(get_db),
):
    try:
        version = await cat_image_service.store_image(db, cat.id, file)
    except UnsupportedImageType as exc:
        raise HTTPException(
            status_code=415, detail=f"Unsupported image type: {exc}"
        ) from exc
    except ImageTooLarge as exc:
        limit_mb = settings.MAX_IMAGE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=413, detail=f"Image exceeds {limit_mb} MB"
        ) from exc

    # Reversed from the route rather than spelled out, so the /api/v1 prefix stays
    # defined in app.main alone. The stored value is root-relative on purpose: the same
    # database then works behind localhost, a LAN address or a domain name.
    # Milliseconds, not seconds: two uploads inside the same second would otherwise
    # share a URL while holding different bytes, which "immutable" would then pin.
    path = request.app.url_path_for("get_cat_image", cat_id=cat.id)
    image_url = f"{path}?v={int(version.timestamp() * 1000)}"

    # One commit covers both: the image row queued by store_image flushes with this
    # update, so the bytes and the URL pointing at them can never disagree.
    await cat_service.update_cat(db, cat, CatUpdate(image_url=image_url))
    return CatImageResponse(image_url=image_url)
