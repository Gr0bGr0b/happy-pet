from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Index, Integer, Text, text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class InjectionLog(Base):
    __tablename__ = "injection_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    cat_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("cats.id", ondelete="CASCADE"), nullable=False
    )
    dosage: Mapped[float] = mapped_column(Float, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_injection_logs_cat_id", "cat_id"),
        Index("idx_injection_logs_created_at", text("created_at DESC")),
    )
