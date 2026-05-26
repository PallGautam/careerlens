from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Company, Alumni, CompanyAlumni, Experience

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.get("/")
def get_all_companies(db: Session = Depends(get_db)):
    companies = db.query(Company).all()
    return companies

@router.get("/{company_id}")
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.get("/{company_id}/alumni")
def get_company_alumni(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    links = db.query(CompanyAlumni).filter(
        CompanyAlumni.company_id == company_id
    ).all()

    result = []
    for link in links:
        alumni = db.query(Alumni).filter(Alumni.id == link.alumni_id).first()
        result.append({
            "id": alumni.id,
            "name": alumni.name,
            "batch_year": alumni.batch_year,
            "current_role": alumni.current_role,
            "role_at_company": link.role,
            "year_joined": link.year_joined,
            "linkedin_url": alumni.linkedin_url,
            "photo_url": alumni.photo_url
        })

    return {"company": company.name, "alumni": result}

@router.get("/{company_id}/roadmap")
def get_company_roadmap(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    experiences = db.query(Experience).filter(
        Experience.company_id == company_id
    ).all()

    stages = {}
    for exp in experiences:
        alumni = db.query(Alumni).filter(Alumni.id == exp.alumni_id).first()
        if exp.stage not in stages:
            stages[exp.stage] = []
        stages[exp.stage].append({
            "alumni_name": alumni.name,
            "batch_year": alumni.batch_year,
            "description": exp.description,
            "tips": exp.tips,
            "outcome": exp.outcome
        })

    roadmap = [{"stage": stage, "experiences": exps}
               for stage, exps in stages.items()]

    return {"company": company.name, "roadmap": roadmap}