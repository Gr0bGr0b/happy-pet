from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, LargeBinary, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class CatImage(Base):
    """The cat's photo, one row per cat.

    Deliberately its own table rather than a column on `cats`: SQLAlchemy loads every
    mapped column by default, so bytes on the Cat model would ride along on every
    GET /cats/ and every get_cat_or_404 lookup. cat_id as the primary key is what makes
    it one photo per cat.
    """

    __tablename__ = "cat_images"

    cat_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("cats.id", ondelete="CASCADE"), primary_key=True
    )
    content_type: Mapped[str] = mapped_column(String(32), nullable=False)
    data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    # Set by the caller rather than by onupdate: the upload handler needs the value
    # before the commit, to build the ?v= URL without reading the row back.
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
