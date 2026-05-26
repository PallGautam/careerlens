from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Company, CompanyAlumni, ProsCons
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/compare", tags=["Compare"])

class CompareRequest(BaseModel):
    company_ids: List[int]

@router.post("/")
def compare_companies(request: CompareRequest, db: Session = Depends(get_db)):
    if len(request.company_ids) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 company IDs")

    result = []
    for company_id in request.company_ids:
        company = db.query(Company).filter(Company.id == company_id).first()
        if not company:
            raise HTTPException(status_code=404, detail=f"Company {company_id} not found")

        pros = db.query(ProsCons).filter(
            ProsCons.company_id == company_id,
            ProsCons.type == "pro"
        ).all()

        cons = db.query(ProsCons).filter(
            ProsCons.company_id == company_id,
            ProsCons.type == "con"
        ).all()

        alumni_count = db.query(CompanyAlumni).filter(
            CompanyAlumni.company_id == company_id
        ).count()

        result.append({
            "id": company.id,
            "name": company.name,
            "sector": company.sector,
            "avg_package_lpa": company.avg_package_lpa,
            "roles_offered": company.roles_offered,
            "alumni_count": alumni_count,
            "pros": [{"point": p.point, "category": p.category} for p in pros],
            "cons": [{"point": c.point, "category": c.category} for c in cons],
        })

    return {"comparison": result}