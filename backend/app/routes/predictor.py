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

# Resource library — used to build contextual tips
RESOURCES = {
    "dsa": {
        "free": "Striver's A2Z DSA Sheet (free) → takeuforward.org",
        "paid": "Udemy: 'Master the Coding Interview' by Andrei Neagoie (~₹500)",
        "youtube": "YouTube: Striver's DSA playlist (450+ problems, Hindi+English)"
    },
    "python": {
        "free": "CS50P by Harvard (free) → cs50.harvard.edu/python",
        "paid": "Udemy: '100 Days of Code – Python' by Angela Yu (~₹500)",
        "youtube": "YouTube: Corey Schafer's Python series"
    },
    "system_design": {
        "free": "GitHub: 'system-design-primer' by donnemartin (free)",
        "paid": "Educative.io: 'Grokking System Design' (~₹1500)",
        "youtube": "YouTube: Gaurav Sen's System Design playlist"
    },
    "sql": {
        "free": "SQLZoo (free, interactive) → sqlzoo.net",
        "paid": "Udemy: 'The Complete SQL Bootcamp' by Jose Portilla (~₹500)",
        "youtube": "YouTube: Tech TFQ SQL playlist"
    },
    "machine_learning": {
        "free": "fast.ai (free) → fast.ai/courses",
        "paid": "Coursera: Andrew Ng's ML Specialization (~₹3000 or audit free)",
        "youtube": "YouTube: StatQuest with Josh Starmer"
    },
    "javascript": {
        "free": "The Odin Project (free) → theodinproject.com",
        "paid": "Udemy: 'The Complete JavaScript Course' by Jonas Schmedtmann (~₹500)",
        "youtube": "YouTube: Traversy Media JS Crash Course"
    },
    "react": {
        "free": "react.dev official docs + tutorial (free)",
        "paid": "Udemy: 'React – The Complete Guide' by Maximilian (~₹500)",
        "youtube": "YouTube: Codevolution React series"
    },
    "cgpa": {
        "free": "Focus on NPTEL courses for extra credit where applicable",
        "paid": "Seek campus tutoring or peer study groups",
        "youtube": "YouTube: search your specific subject + GATE/university syllabus"
    }
}

def build_tips(cgpa: float, skills_lower: List[str], skills_score: float,
               cgpa_score: float, percentage: float, matched_skills: List[str]) -> List[str]:
    tips = []
    missing_core = [s for s in ["dsa", "sql", "system design"] if s not in skills_lower]
    has_no_lang = not any(s in skills_lower for s in ["python", "java", "javascript", "c++"])

    # --- HIGH tier (75+): light polish tips ---
    if percentage >= 75:
        tips.append("Strong profile overall. Focus on mock interviews — use Pramp (free) or Interviewing.io.")
        tips.append("Practice 2–3 LeetCode medium problems daily to stay sharp on DSA.")
        if "system design" not in skills_lower:
            tips.append(f"Add system design to your skillset: {RESOURCES['system_design']['youtube']}")
        tips.append("Research the company's tech stack and tailor your projects to match.")
        return tips

    # --- MEDIUM tier (50–74): targeted gaps ---
    if percentage >= 50:
        tips.append("You're close — a focused 4–6 week push can move you to the high-chance zone.")
        if skills_score < 20:
            tips.append(
                f"DSA is your biggest gap (scored {round(skills_score,1)}/40). "
                f"Start here: {RESOURCES['dsa']['youtube']} — aim for 3 problems/day."
            )
        if cgpa < 7.0:
            tips.append(
                "CGPA is below 7.0, which filters you out at some companies. "
                "Counter this by building 2 strong GitHub projects to demonstrate skills directly."
            )
        if "sql" not in skills_lower:
            tips.append(f"SQL is asked in almost every technical round. Quick win: {RESOURCES['sql']['free']}")
        if has_no_lang:
            tips.append(
                f"You haven't listed a primary programming language. "
                f"Pick Python and start here: {RESOURCES['python']['paid']}"
            )
        tips.append("Apply to 2–3 similar but slightly less competitive companies in parallel to build interview confidence.")
        return tips

    # --- LOW tier (below 50): detailed recovery plan ---
    tips.append("Your profile needs a 2–3 month structured improvement plan. Here's exactly where to start:")

    # CGPA advice
    if cgpa < 6.5:
        tips.append(
            f"CGPA of {cgpa} will auto-reject you at most product companies. "
            f"Prioritise improving it this semester AND build a strong project portfolio to compensate. "
            f"{RESOURCES['cgpa']['free']}"
        )
    elif cgpa < 7.5:
        tips.append(
            f"CGPA of {cgpa} is borderline. Build 2 solid projects on GitHub to give recruiters "
            "something concrete to evaluate instead of just your grades."
        )

    # DSA — most critical for low scorers
    if "dsa" not in skills_lower:
        tips.append(
            f"DSA is non-negotiable for placements. Start from scratch: "
            f"{RESOURCES['dsa']['youtube']} (free, structured, beginner-friendly). "
            f"Commit to 1 problem/day minimum."
        )
    elif skills_score < 15:
        tips.append(
            f"Your listed skills are weak for this company's bar. "
            f"Take a structured DSA course: {RESOURCES['dsa']['paid']}"
        )

    # Language gap
    if has_no_lang:
        tips.append(
            f"You need a primary language first. Learn Python in 30 days: "
            f"{RESOURCES['python']['free']} (free) or {RESOURCES['python']['paid']}"
        )

    # Missing core skills
    for skill in missing_core:
        key = skill.replace(" ", "_")
        if key in RESOURCES:
            r = RESOURCES[key]
            tips.append(
                f"Learn {skill.upper()}: {r['youtube']} (free) "
                f"or {r['paid']} for a structured course."
            )

    # SQL specific
    if "sql" not in skills_lower and "sql" not in missing_core:
        tips.append(f"Add SQL — it's asked in 80% of tech interviews: {RESOURCES['sql']['free']}")

    # Final actionable step
    tips.append(
        "Set a 60-day target: finish one DSA sheet + build one full-stack project. "
        "Re-run this predictor after — your score will look very different."
    )

    return tips[:6]  # cap at 6 tips max


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
    skills_lower = [s.lower().strip() for s in request.skills]

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
        message = "Strong profile. Focus on interview prep and company research."
        color = "green"
    elif percentage >= 50:
        rating = "Medium"
        message = "You're competitive but have clear gaps. A focused 4–6 week push can make the difference."
        color = "yellow"
    else:
        rating = "Low"
        message = "Don't be discouraged — most strong candidates started here. Follow the plan below."
        color = "red"

    tips = build_tips(request.cgpa, skills_lower, skills_score,
                      cgpa_score, percentage, matched_skills)

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
        "tips": tips
    }
@router.post("/prep-plan")
def generate_prep_plan(request: PredictorRequest, db: Session = Depends(get_db)):

    # Re-run scoring to determine tier
    cgpa_score = min((request.cgpa / 10) * 40, 40)
    key_skills = {
        "python": 8, "java": 8, "javascript": 7, "c++": 7,
        "dsa": 10, "sql": 6, "machine learning": 9, "react": 7,
        "node": 6, "system design": 9, "os": 6, "networking": 5
    }
    skills_score = 0
    skills_lower = [s.lower().strip() for s in request.skills]
    for skill in request.skills:
        if skill.lower().strip() in key_skills:
            skills_score += key_skills[skill.lower().strip()]
    skills_score = min(skills_score, 40)

    alumni_count = db.query(CompanyAlumni).filter(
        CompanyAlumni.company_id == request.company_id
    ).count()
    history_score = min(alumni_count * 5, 20)
    percentage = round(min(cgpa_score + skills_score + history_score, 100), 1)

    # Determine plan duration
    if percentage >= 75:
        duration = 30
    elif percentage >= 50:
        duration = 60
    else:
        duration = 90

    has_dsa        = "dsa" in skills_lower
    has_lang       = any(s in skills_lower for s in ["python", "java", "javascript", "c++"])
    has_sql        = "sql" in skills_lower
    has_sd         = "system design" in skills_lower
    weak_academics = request.cgpa < 7.5

    # Build the 3 phases
    if duration == 30:
        phases = [
            {
                "phase": 1,
                "label": "Week 1–2: Sharpen DSA",
                "goal": "Solve 30 medium LeetCode problems across arrays, trees, and graphs.",
                "tasks": [
                    "10 problems/week on LeetCode (medium difficulty)",
                    "Revise time complexity for every solution",
                    "Mock interview on Pramp — 2 sessions",
                    "Review your best 2 projects and polish README files on GitHub",
                ]
            },
            {
                "phase": 2,
                "label": "Week 3: Company Research + System Design",
                "goal": "Know the company inside-out and be ready for design rounds.",
                "tasks": [
                    "Study the company's tech blog and recent engineering posts",
                    "Watch 3 system design videos on Gaurav Sen's YouTube channel",
                    "Practice 1 full system design question end-to-end (e.g. design Twitter)",
                    "Prepare answers for top 10 HR questions (STAR format)",
                ]
            },
            {
                "phase": 3,
                "label": "Week 4: Full Mock + Final Prep",
                "goal": "Simulate the real interview experience before the drive.",
                "tasks": [
                    "Do 2 full mock interviews (DSA + HR combined)",
                    "Revise all matched skills and project talking points",
                    "Prepare questions to ask the interviewer",
                    "Sleep well, review notes, submit application early",
                ]
            }
        ]

    elif duration == 60:
        phases = [
            {
                "phase": 1,
                "label": "Weeks 1–3: Fix the Foundations",
                "goal": "Close your biggest skill gaps before touching interview prep.",
                "tasks": [
                    f"{'Start Striver A2Z DSA sheet from scratch (takeuforward.org)' if not has_dsa else 'Resume DSA — target 5 problems/week on LeetCode'}",
                    f"{'Learn Python basics in 2 weeks: CS50P (free) → cs50.harvard.edu/python' if not has_lang else 'Pick one language and solve all problems in it consistently'}",
                    f"{'Complete SQLZoo beginner track (sqlzoo.net)' if not has_sql else 'Practice 10 SQL query problems on HackerRank'}",
                    "Build or update 1 project that uses your target company's tech stack",
                ]
            },
            {
                "phase": 2,
                "label": "Weeks 4–6: Interview-Specific Prep",
                "goal": "Shift from learning mode to interview mode.",
                "tasks": [
                    "Solve 20 LeetCode problems tagged with the target company name",
                    "Watch Gaurav Sen's system design playlist (first 5 videos)",
                    "Do 3 mock interviews on Pramp or with a friend",
                    f"{'Aim to bring CGPA above 7.5 — attend extra classes or NPTEL if available' if weak_academics else 'Highlight your CGPA confidently in your resume'}",
                    "Write a strong resume — 1 page, project-focused, quantify impact",
                ]
            },
            {
                "phase": 3,
                "label": "Weeks 7–8: Final Sprint",
                "goal": "Polish everything and simulate the actual interview.",
                "tasks": [
                    "Revise all data structures: arrays, linked lists, trees, graphs, DP",
                    "Do 2 full-length timed mock interviews",
                    "Prepare 5 project stories using STAR format",
                    "Research company culture, values, and recent news",
                    "Apply early and follow up professionally",
                ]
            }
        ]

    else:  # 90 days — most detailed
        phases = [
            {
                "phase": 1,
                "label": "Month 1: Build the Base",
                "goal": "Get fundamentals locked in — no interview prep yet, just building.",
                "tasks": [
                    f"{'Learn Python in 30 days: Angela Yu Udemy course (~₹500) or CS50P (free)' if not has_lang else 'Solidify your primary language — solve 30 easy LeetCode problems'}",
                    f"{'Start Striver A2Z DSA — complete arrays + linked lists module' if not has_dsa else 'Resume DSA from where you left off — 1 problem/day minimum'}",
                    f"{'Complete SQLZoo beginner + intermediate tracks' if not has_sql else 'Practice 15 SQL problems on HackerRank'}",
                    "Build a small full-stack project (any CRUD app) and push to GitHub",
                    f"{'Focus on this semester — attend all classes, aim to raise CGPA above 7.0' if weak_academics else 'Keep academics stable while building projects'}",
                ]
            },
            {
                "phase": 2,
                "label": "Month 2: Go Deeper",
                "goal": "Move from basics to interview-level problem solving.",
                "tasks": [
                    "Complete trees, graphs, recursion, and DP on Striver sheet",
                    "Solve 40 LeetCode problems — mix of easy and medium",
                    f"{'Watch first 6 videos of Gaurav Sen system design playlist' if not has_sd else 'Practice 2 full system design questions end-to-end'}",
                    "Build a second project specifically using the target company's tech stack",
                    "Join a competitive programming contest (Codeforces/LeetCode weekly)",
                ]
            },
            {
                "phase": 3,
                "label": "Month 3: Interview Mode",
                "goal": "Stop learning new things — simulate, refine, and apply.",
                "tasks": [
                    "Solve 30 LeetCode problems tagged with the target company",
                    "Do 4 mock interviews on Pramp (free) or Interviewing.io",
                    "Prepare system design answer for 3 common questions",
                    "Write final resume — 1 page, quantified achievements, strong GitHub links",
                    "Prepare STAR answers for 8 common HR questions",
                    "Apply 2 weeks before the drive opens — early applicants get noticed",
                ]
            }
        ]

    return {
        "duration": duration,
        "percentage": percentage,
        "phases": phases,
        "summary": f"Based on your profile, a {duration}-day plan gives you the best shot at this company."
    }