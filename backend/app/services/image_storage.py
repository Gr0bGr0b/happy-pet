"""Cat photo storage on the local filesystem.

Files land in `settings.UPLOAD_DIR/cats/` and are served by the /static mount in
app.main, so what is stored on the cat row is a root-relative path
("/static/cats/<id>-<uuid>.jpg") rather than an absolute URL: the same database then
works behind localhost, a LAN address or a domain name, and the client joins the path
onto whichever origin it already talks to.
"""

from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import settings

# Extension is decided here, not taken from the client's filename.
ALLOWED_CONTENT_TYPES: dict[str, str] = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

STATIC_PREFIX = "/static"
CATS_SUBDIR = "cats"
_CHUNK_SIZE = 64 * 1024


class UnsupportedImageType(Exception):
    """Content-Type outside ALLOWED_CONTENT_TYPES."""


class ImageTooLarge(Exception):
    """Body over settings.MAX_IMAGE_BYTES."""


def cats_dir() -> Path:
    return settings.UPLOAD_DIR / CATS_SUBDIR


async def save_cat_image(cat_id: int, file: UploadFile) -> str:
    """Stream the upload to disk and return its root-relative URL path."""
    content_type = (file.content_type or "").lower()
    extension = ALLOWED_CONTENT_TYPES.get(content_type)
    if extension is None:
        raise UnsupportedImageType(content_type or "no Content-Type")

    directory = cats_dir()
    directory.mkdir(parents=True, exist_ok=True)
    destination = directory / f"{cat_id}-{uuid4().hex}{extension}"

    written = 0
    try:
        with destination.open("wb") as buffer:
            while chunk := await file.read(_CHUNK_SIZE):
                written += len(chunk)
                # Checked while streaming: a 200 MB body must not be buffered whole
                # just to be rejected afterwards.
                if written > settings.MAX_IMAGE_BYTES:
                    raise ImageTooLarge(written)
                buffer.write(chunk)
    except BaseException:
        # Includes the size rejection and a cancelled request: neither should leave a
        # half-written file behind.
        destination.unlink(missing_ok=True)
        raise

    return f"{STATIC_PREFIX}/{CATS_SUBDIR}/{destination.name}"


def delete_cat_image(url_path: str | None) -> None:
    """Remove a file this module stored earlier; ignore anything else.

    An image_url that is not one of our paths (an external URL set through PATCH) is
    left alone, and `.name` keeps a crafted value such as "../../etc/passwd" from
    resolving outside the upload directory.
    """
    prefix = f"{STATIC_PREFIX}/{CATS_SUBDIR}/"
    if not url_path or not url_path.startswith(prefix):
        return

    filename = Path(url_path[len(prefix) :]).name
    if filename:
        (cats_dir() / filename).unlink(missing_ok=True)
