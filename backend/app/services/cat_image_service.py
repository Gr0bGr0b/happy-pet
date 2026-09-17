"""Cat photo bytes, stored in Postgres.

Storing the photo in the database rather than on a volume keeps a single `pg_dump` a
complete backup, and lets the bytes and the URL that points at them be written in one
transaction — see store_image below.
"""

from datetime import datetime

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.cat_image import CatImage

ALLOWED_CONTENT_TYPES = frozenset({"image/jpeg", "image/png", "image/webp"})
_CHUNK_SIZE = 64 * 1024


class UnsupportedImageType(Exception):
    """Content-Type outside ALLOWED_CONTENT_TYPES."""


class ImageTooLarge(Exception):
    """Body over settings.MAX_IMAGE_BYTES."""


async def store_image(db: AsyncSession, cat_id: int, file: UploadFile) -> datetime:
    """Queue the photo on the session and return the stamp its URL is versioned by.

    Nothing is committed here. The caller writes cats.image_url straight after, and
    that commit flushes both, so the bytes and the URL pointing at them cannot
    disagree. Replacing the row is also the delete: no orphan to clean up.
    """
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise UnsupportedImageType(content_type or "no Content-Type")

    data = bytearray()
    while chunk := await file.read(_CHUNK_SIZE):
        data.extend(chunk)
        # Checked while reading: a 200 MB body must not be held whole just to be
        # rejected afterwards.
        if len(data) > settings.MAX_IMAGE_BYTES:
            raise ImageTooLarge(len(data))

    updated_at = datetime.utcnow()
    # merge() is insert-or-replace on the primary key, so a second upload overwrites.
    await db.merge(
        CatImage(
            cat_id=cat_id,
            content_type=content_type,
            data=bytes(data),
            updated_at=updated_at,
        )
    )
    return updated_at


async def get_image(db: AsyncSession, cat_id: int) -> CatImage | None:
    return await db.get(CatImage, cat_id)
