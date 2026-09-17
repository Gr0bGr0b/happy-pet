from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Index, Integer, text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class WeightHistory(Base):
    """One row per recorded weight.

    `cats.weight` stays the current value — this table is what makes a trend possible.
    A row is written when a cat is created and on every PATCH that changes the weight.
    """

    __tablename__ = "weight_history"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    cat_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("cats.id", ondelete="CASCADE"), nullable=False
    )
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Serves the only query there is: one cat's points, newest first.
    __table_args__ = (
        Index("idx_weight_history_cat_recorded", "cat_id", text("recorded_at DESC")),
    )
