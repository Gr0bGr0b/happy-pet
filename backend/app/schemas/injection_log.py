from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, Field


class InjectionLogCreate(BaseModel):
    cat_id: int
    dosage: Annotated[float, Field(gt=0)]
    notes: str | None = None


class InjectionLogResponse(BaseModel):
    id: int
    cat_id: int
    dosage: float
    notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
