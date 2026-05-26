from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Alumni

router = APIRouter(prefix="/alumni", tags=["Alumni"])

@router.get("/")
def get_all_alumni(db: Session = Depends(get_db)):
    alumni = db.query(Alumni).all()
    return alumni

@router.get("/{alumni_id}")
def get_alumni(alumni_id: int, db: Session = Depends(get_db)):
    alumni = db.query(Alumni).filter(Alumni.id == alumni_id).first()
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    return alumni