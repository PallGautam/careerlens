from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import College, PlacementStat
from pydantic import BaseModel
from typing import List
import pandas as pd

router = APIRouter(prefix="/colleges", tags=["Colleges"])

class CollegeCompareRequest(BaseModel):
    college_ids: List[int]

@router.get("/")
def get_all_colleges(db: Session = Depends(get_db)):
    colleges = db.query(College).all()
    return colleges

@router.post("/compare")
def compare_colleges(request: CollegeCompareRequest, db: Session = Depends(get_db)):
    if len(request.college_ids) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 college IDs")

    result = []
    for college_id in request.college_ids:
        college = db.query(College).filter(College.id == college_id).first()
        if not college:
            raise HTTPException(status_code=404, detail=f"College {college_id} not found")

        stats = db.query(PlacementStat).filter(
            PlacementStat.college_id == college_id
        ).all()

        if not stats:
            result.append({
                "id": college.id,
                "name": college.name,
                "location": college.location,
                "campus_type": college.campus_type,
                "overall_avg_ctc": 0,
                "overall_placement_percent": 0,
                "best_year": None,
                "yearly_stats": []
            })
            continue

        df = pd.DataFrame([{
            "year": s.year,
            "placed": s.placed_count,
            "total": s.total_students,
            "avg_ctc": s.avg_ctc_lpa
        } for s in stats])
        df["placement_percent"] = ((df["placed"] / df["total"]) * 100).round(1)

        result.append({
            "id": college.id,
            "name": college.name,
            "location": college.location,
            "campus_type": college.campus_type,
            "overall_avg_ctc": round(df["avg_ctc"].mean(), 2),
            "overall_placement_percent": round(df["placement_percent"].mean(), 1),
            "best_year": int(df.loc[df["placed"].idxmax(), "year"]),
            "yearly_stats": df.to_dict(orient="records")
        })

    return {"comparison": result}

@router.get("/{college_id}")
def get_college(college_id: int, db: Session = Depends(get_db)):
    college = db.query(College).filter(College.id == college_id).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    return college

@router.get("/{college_id}/stats")
def get_college_stats(college_id: int, db: Session = Depends(get_db)):
    college = db.query(College).filter(College.id == college_id).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    stats = db.query(PlacementStat).filter(
        PlacementStat.college_id == college_id
    ).all()
    if not stats:
        return {"college": college.name, "stats": []}
    df = pd.DataFrame([{
        "year": s.year,
        "placed": s.placed_count,
        "total": s.total_students,
        "avg_ctc": s.avg_ctc_lpa
    } for s in stats])
    df["placement_percent"] = ((df["placed"] / df["total"]) * 100).round(1)
    return {
        "college": college.name,
        "location": college.location,
        "campus_type": college.campus_type,
        "overall_avg_ctc": round(df["avg_ctc"].mean(), 2),
        "overall_placement_percent": round(df["placement_percent"].mean(), 1),
        "best_year": int(df.loc[df["placed"].idxmax(), "year"]),
        "yearly_stats": df.to_dict(orient="records")
    }