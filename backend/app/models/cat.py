from datetime import date, datetime
from enum import Enum

from sqlalchemy import String, Boolean, Float, Date, DateTime, Integer, Text, Index
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SexEnum(str, Enum):
    MALE = "Male"
    FEMALE = "Female"


class Cat(Base):
    __tablename__ = "cats"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    name: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=False)
    breed: Mapped[str] = mapped_column(String(30), nullable=False)
    sex: Mapped[SexEnum] = mapped_column(String(6), nullable=False)
    diabetes: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    color: Mapped[str] = mapped_column(String(20), nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    food_per_ration: Mapped[float | None] = mapped_column(Float, nullable=True)
    food_name: Mapped[str | None] = mapped_column(String(50), nullable=True)
    # Hours between two injections — drives the cooldown on the dashboard CTA.
    injection_interval_hours: Mapped[int] = mapped_column(
        Integer, nullable=False, default=12, server_default="12"
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
