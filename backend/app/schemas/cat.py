from datetime import date, datetime
from typing import Annotated

from pydantic import BaseModel, Field

from app.models.cat import SexEnum

# Declared once and shared by create and update: the two schemas validated the same
# columns, so duplicated bounds could drift apart silently. Each bound matches the
# column it is written to in app/models/cat.py.
CatName = Annotated[str, Field(min_length=1, max_length=20)]
CatBreed = Annotated[str, Field(min_length=1, max_length=30)]
CatColor = Annotated[str, Field(min_length=1, max_length=20)]
WeightKg = Annotated[float, Field(gt=0, le=25)]
ImageUrl = Annotated[str, Field(max_length=255)]
FoodGrams = Annotated[float, Field(ge=0, le=2000)]
FoodName = Annotated[str, Field(max_length=50)]
IntervalHours = Annotated[int, Field(ge=1, le=48)]


class CatCreate(BaseModel):
    name: CatName
    date_of_birth: date
    breed: CatBreed
    sex: SexEnum
    diabetes: bool = False
    color: CatColor
    weight: WeightKg
    image_url: ImageUrl | None = None
    food_per_ration: FoodGrams | None = None
    food_name: FoodName | None = None
    injection_interval_hours: IntervalHours = 12


class CatUpdate(BaseModel):
    """Partial update: every field is optional and only the sent ones are applied.

    `extra="forbid"` answers 422 on a misspelled field rather than dropping it silently.
    """

    name: CatName | None = None
    date_of_birth: date | None = None
    breed: CatBreed | None = None
    sex: SexEnum | None = None
    diabetes: bool | None = None
    color: CatColor | None = None
    weight: WeightKg | None = None
    image_url: ImageUrl | None = None
    food_per_ration: FoodGrams | None = None
    food_name: FoodName | None = None
    injection_interval_hours: IntervalHours | None = None

    model_config = {"extra": "forbid"}


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
    injection_interval_hours: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class WeightPointResponse(BaseModel):
    id: int
    cat_id: int
    weight: float
    recorded_at: datetime

    model_config = {"from_attributes": True}


class CatImageResponse(BaseModel):
    image_url: str
