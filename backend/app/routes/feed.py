from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Experience, Alumni, Company

router = APIRouter(prefix="/feed", tags=["Feed"])

@router.get("/")
def get_experience_feed(db: Session = Depends(get_db)):
    experiences = db.query(Experience).all()
    result = []
    for exp in experiences:
        alumni = db.query(Alumni).filter(Alumni.id == exp.alumni_id).first()
        company = db.query(Company).filter(Company.id == exp.company_id).first()
        result.append({
            "id": exp.id,
            "alumni_name": alumni.name,
            "batch_year": alumni.batch_year,
            "company_name": company.name,
            "company_sector": company.sector,
            "stage": exp.stage,
            "description": exp.description,
            "tips": exp.tips,
            "outcome": exp.outcome
        })
    return result