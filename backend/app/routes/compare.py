from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Company, CompanyAlumni, ProsCons
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/compare", tags=["Compare"])

# Detailed pros/cons per company — keyed by company name
DETAILED_PROS_CONS = {
    "Google": {
        "pros": [
            {"point": "Highest paying tech company for freshers in India — avg 40+ LPA", "category": "Salary"},
            {"point": "World-class engineering infrastructure — you work with tools built for billions of users", "category": "Work Quality"},
            {"point": "20% time policy encourages side projects and innovation", "category": "Culture"},
            {"point": "Exceptional learning resources — internal courses, Google I/O access, research exposure", "category": "Growth"},
            {"point": "Strong brand — a Google stint opens doors globally for the rest of your career", "category": "Career Value"},
            {"point": "Flat hierarchy — engineers have real influence on product decisions", "category": "Culture"},
        ],
        "cons": [
            {"point": "One of the hardest interview processes globally — DSA + System Design + Googleyness rounds", "category": "Hiring"},
            {"point": "Very high performance bar — underperformers face PIP within 2 review cycles", "category": "Pressure"},
            {"point": "Large org size means some teams feel bureaucratic and slow-moving", "category": "Work Style"},
            {"point": "Layoffs in 2023-24 affected thousands — job security less certain than before", "category": "Stability"},
        ]
    },
    "Microsoft": {
        "pros": [
            {"point": "Best work-life balance among FAANG — most teams follow strict 9-6 culture", "category": "Work-Life Balance"},
            {"point": "Excellent employee benefits — health insurance, stock (ESOP), education reimbursement", "category": "Benefits"},
            {"point": "Strong internal mobility — easy to switch teams or move to Azure, Office, Xbox divisions", "category": "Growth"},
            {"point": "Satya Nadella's growth mindset culture — learning is actively rewarded", "category": "Culture"},
            {"point": "Azure is the #2 cloud globally — gives you highly marketable cloud skills", "category": "Skill Value"},
            {"point": "Interview process is more structured and predictable than Google", "category": "Hiring"},
        ],
        "cons": [
            {"point": "Slower promotion cycle — L59 to L60 can take 3-4 years vs 2 at Amazon", "category": "Growth"},
            {"point": "Some legacy teams still work on decades-old Windows/Office codebases", "category": "Tech Stack"},
            {"point": "Stock growth slower than Google/Amazon over the last 5 years", "category": "Compensation"},
            {"point": "Large company inertia — shipping features takes longer due to approvals", "category": "Work Style"},
        ]
    },
    "Amazon": {
        "pros": [
            {"point": "Fastest career growth track — L4 to L6 in 3-4 years is achievable", "category": "Growth"},
            {"point": "Massive engineering scale — your code serves 300M+ customers daily", "category": "Impact"},
            {"point": "Leadership Principles create a strong, consistent decision-making culture", "category": "Culture"},
            {"point": "AWS experience is the most in-demand cloud skill globally in 2024", "category": "Skill Value"},
            {"point": "Internal transfer opportunities across 50+ product lines worldwide", "category": "Mobility"},
        ],
        "cons": [
            {"point": "Work-life balance is consistently rated the worst among top tech companies", "category": "Work-Life Balance"},
            {"point": "PIP (Performance Improvement Plan) culture — bottom 5% are managed out annually", "category": "Pressure"},
            {"point": "On-call rotations are common — expect weekend alerts for production issues", "category": "Work Style"},
            {"point": "Signing bonus clawback policy if you leave within 2 years", "category": "Compensation"},
            {"point": "Very process-heavy — every decision needs a 6-page doc (PRFAQ)", "category": "Work Style"},
        ]
    },
    "Deloitte": {
        "pros": [
            {"point": "Top consulting brand — Deloitte on your resume opens doors in consulting, finance, and tech", "category": "Brand Value"},
            {"point": "Exposure to 15+ industries in the first 2 years — banking, healthcare, retail, government", "category": "Exposure"},
            {"point": "Strong structured training program for freshers — Deloitte University curriculum", "category": "Learning"},
            {"point": "Good work-life balance in non-peak periods — project-based work has natural breaks", "category": "Work-Life Balance"},
            {"point": "Clear promotion path — Analyst → Senior → Manager in 5-6 years", "category": "Growth"},
        ],
        "cons": [
            {"point": "Package significantly lower than product companies — 12 LPA vs 30-40 LPA at FAANG", "category": "Salary"},
            {"point": "Extremely long hours during project deadlines — 70-80 hour weeks are common", "category": "Work-Life Balance"},
            {"point": "Heavy travel requirements — client sites can mean weeks away from home", "category": "Lifestyle"},
            {"point": "Work is often repetitive — Excel, PowerPoint, and client presentations dominate", "category": "Work Quality"},
        ]
    },
    "Goldman Sachs": {
        "pros": [
            {"point": "Highest paying non-tech company for engineers in India — 20+ LPA for freshers", "category": "Salary"},
            {"point": "Exposure to high-stakes financial systems — trading platforms, risk engines", "category": "Work Quality"},
            {"point": "Strong alumni network — Goldman alumni run major hedge funds and startups globally", "category": "Network"},
            {"point": "Engineering at Goldman is taken seriously — not just IT support for bankers", "category": "Culture"},
            {"point": "Annual bonus can double your base salary in good years", "category": "Compensation"},
        ],
        "cons": [
            {"point": "Finance domain knowledge required — pure CS grads have a steep learning curve", "category": "Learning Curve"},
            {"point": "Work hours are long — 60-70 hour weeks are standard in most divisions", "category": "Work-Life Balance"},
            {"point": "Tech stack is often legacy — SLANG, Java, and proprietary tools from the 1990s", "category": "Tech Stack"},
            {"point": "Bonus is heavily tied to firm performance — bad market years mean minimal payout", "category": "Compensation"},
        ]
    },
    "Infosys": {
        "pros": [
            {"point": "Easiest entry point into IT industry — CGPA cutoff as low as 6.5", "category": "Accessibility"},
            {"point": "Massive training program (Mysore campus) — 5 months of structured tech training", "category": "Learning"},
            {"point": "Job stability — Infosys has never had mass layoffs unlike startups or FAANG", "category": "Stability"},
            {"point": "Global client exposure — chance to work on US/UK/EU projects from day one", "category": "Exposure"},
            {"point": "Good stepping stone — Infosys experience helps you move to product companies in 2 years", "category": "Career Path"},
        ],
        "cons": [
            {"point": "Lowest package among listed companies — 6.5 LPA for freshers", "category": "Salary"},
            {"point": "Bench period after training — freshers can wait 3-6 months for project allocation", "category": "Work"},
            {"point": "Limited innovation — most work is client maintenance, not product building", "category": "Work Quality"},
            {"point": "Slow salary growth — increments average 8-10% annually unless you switch companies", "category": "Growth"},
            {"point": "Strict attendance and HR policies — feels more corporate than tech-first", "category": "Culture"},
        ]
    }
}

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

        alumni_count = db.query(CompanyAlumni).filter(
            CompanyAlumni.company_id == company_id
        ).count()

        # Use detailed hardcoded pros/cons if available, else fall back to DB
        if company.name in DETAILED_PROS_CONS:
            pros = DETAILED_PROS_CONS[company.name]["pros"]
            cons = DETAILED_PROS_CONS[company.name]["cons"]
        else:
            db_pros = db.query(ProsCons).filter(
                ProsCons.company_id == company_id,
                ProsCons.type == "pro"
            ).all()
            db_cons = db.query(ProsCons).filter(
                ProsCons.company_id == company_id,
                ProsCons.type == "con"
            ).all()
            pros = [{"point": p.point, "category": p.category} for p in db_pros]
            cons = [{"point": c.point, "category": c.category} for c in db_cons]

        result.append({
            "id": company.id,
            "name": company.name,
            "sector": company.sector,
            "avg_package_lpa": company.avg_package_lpa,
            "roles_offered": company.roles_offered,
            "alumni_count": alumni_count,
            "pros": pros,
            "cons": cons,
        })

    return {"comparison": result}