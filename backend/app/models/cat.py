from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class SexEnum(str, Enum):
    MALE = "Male"
    FEMALE = "Female"


class Cat(Base):
    __tablename__ = 'cats'

    id = Mapped[int] = Column(Integer, primary_key=True, index=True)
    name = Mapped[str] = Column(String, index=True)
    age = Mapped[int] = Column(Integer)
    breed = Mapped[str] = Column(String)
    sex = Mapped[SexEnum] = Column(String)
    diabetes = Mapped[bool] = Column(Boolean, default=False)
    color = Mapped[str] = Column(String)
    weight = Mapped[float] = Column(Float)

    