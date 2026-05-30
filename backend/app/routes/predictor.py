from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import CompanyAlumni
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/predictor", tags=["Predictor"])

class PredictorRequest(BaseModel):
    cgpa: float
    skills: List[str]
    college_id: int
    company_id: int

@router.post("/")
def predict_placement(request: PredictorRequest, db: Session = Depends(get_db)):

    # CGPA score (max 40)
    cgpa_score = min((request.cgpa / 10) * 40, 40)

    # Skills score (max 40)
    key_skills = {
        "python": 8, "java": 8, "javascript": 7, "c++": 7,
        "dsa": 10, "sql": 6, "machine learning": 9, "react": 7,
        "node": 6, "system design": 9, "os": 6, "networking": 5
    }
    skills_score = 0
    matched_skills = []
    for skill in request.skills:
        skill_lower = skill.lower().strip()
        if skill_lower in key_skills:
            skills_score += key_skills[skill_lower]
            matched_skills.append(skill)
    skills_score = min(skills_score, 40)

    # Alumni history score (max 20)
    alumni_count = db.query(CompanyAlumni).filter(
        CompanyAlumni.company_id == request.company_id
    ).count()
    history_score = min(alumni_count * 5, 20)

    # Total
    total_score = cgpa_score + skills_score + history_score
    percentage = round(min(total_score, 100), 1)

    if percentage >= 75:
        rating = "High"
        message = "You have a strong profile for this company. Focus on mock interviews."
        color = "green"
    elif percentage >= 50:
        rating = "Medium"
        message = "You have a decent profile. Work on your weak areas before applying."
        color = "yellow"
    else:
        rating = "Low"
        message = "Consider strengthening your DSA and core skills before applying."
        color = "red"

    return {
        "percentage": percentage,
        "rating": rating,
        "message": message,
        "color": color,
        "breakdown": {
            "cgpa_score": round(cgpa_score, 1),
            "skills_score": round(skills_score, 1),
            "history_score": round(history_score, 1),
        },
        "matched_skills": matched_skills,
        "tips": [
            "Practice DSA on Leetcode daily" if skills_score < 20 else "Good DSA foundation",
            "Improve CGPA if possible" if request.cgpa < 7.5 else "Good academic record",
            "Research the company culture and values",
            "Prepare for system design if applying for senior roles"
        ]
    }