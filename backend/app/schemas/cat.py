from datetime import date, datetime
from typing import Annotated

from pydantic import BaseModel, Field

from app.models.cat import SexEnum


class CatCreate(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=20)]
    date_of_birth: date
    breed: Annotated[str, Field(min_length=1, max_length=30)]
    sex: SexEnum
    diabetes: Annotated[bool, Field(default=False)]
    color: Annotated[str, Field(min_length=1, max_length=20)]
    weight: Annotated[float, Field(gt=0, le=25)]
    image_url: str | None = None
    food_per_ration: float | None = None
    food_name: str | None = None


class CatResponse(BaseModel):
    id: int
    name: str
    date_of_birth: date
    breed: str
    sex: SexEnum
    diabetes: bool
    color: str
    weight: float
    image_url: str | None
    food_per_ration: float | None
    food_name: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
