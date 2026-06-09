from sqlalchemy.orm import Session
from app.models.cat import Cat
from app.schemas.cat import CatCreate

def create_cat(db: Session, cat: CatCreate):
    db_cat = Cat(cat)
    db.add(db_cat)
    db.commit()
    db.refresh()
    return db_cat

