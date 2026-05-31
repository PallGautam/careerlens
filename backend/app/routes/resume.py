from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/resume", tags=["Resume"])

class ResumeRequest(BaseModel):
    text: str
    target_role: str  # "software", "data", "devops", "general"

# Keyword banks per role
ROLE_SKILLS = {
    "software": ["python", "java", "javascript", "c++", "react", "node", "sql",
                 "git", "dsa", "system design", "rest api", "docker", "linux"],
    "data":     ["python", "sql", "machine learning", "pandas", "numpy", "tableau",
                 "power bi", "statistics", "deep learning", "tensorflow", "excel"],
    "devops":   ["docker", "kubernetes", "aws", "ci/cd", "linux", "terraform",
                 "jenkins", "git", "bash", "monitoring", "nginx"],
    "general":  ["python", "java", "sql", "git", "communication", "teamwork",
                 "problem solving", "excel", "project management"]
}

SECTION_KEYWORDS = {
    "education":    ["education", "academic", "university", "college", "degree", "b.tech", "b.e", "gpa", "cgpa"],
    "experience":   ["experience", "internship", "intern", "worked", "employment", "job", "role"],
    "projects":     ["project", "built", "developed", "created", "implemented"],
    "skills":       ["skills", "technologies", "tech stack", "tools", "languages"],
    "achievements": ["achievement", "award", "winner", "rank", "certification", "certified", "hackathon"],
    "contact":      ["email", "phone", "linkedin", "github", "portfolio"]
}

ACTION_VERBS = [
    "developed", "built", "designed", "implemented", "led", "managed",
    "created", "improved", "optimized", "deployed", "automated", "reduced",
    "increased", "launched", "collaborated", "architected", "integrated"
]

WEAK_PHRASES = [
    "responsible for", "worked on", "helped with", "assisted in",
    "was involved in", "participated in", "tried to", "familiar with"
]

@router.post("/check")
def check_resume(request: ResumeRequest):
    text_lower = request.text.lower()
    words = text_lower.split()
    score = 0
    feedback = []
    sections_found = []
    sections_missing = []

    # --- 1. Section detection (25 points) ---
    for section, keywords in SECTION_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            sections_found.append(section)
        else:
            sections_missing.append(section)

    section_score = min(len(sections_found) * 4, 25)
    score += section_score

    if sections_missing:
        feedback.append({
            "type": "warning",
            "category": "Missing Sections",
            "message": f"Add these sections: {', '.join(sections_missing).title()}. "
                       f"Recruiters scan for these in the first 10 seconds."
        })
    else:
        feedback.append({
            "type": "success",
            "category": "Sections",
            "message": "All key sections detected. Good structure overall."
        })

    # --- 2. Skills match (30 points) ---
    role_skills = ROLE_SKILLS.get(request.target_role, ROLE_SKILLS["general"])
    matched_skills = [s for s in role_skills if s in text_lower]
    missing_skills = [s for s in role_skills if s not in text_lower]
    skills_score = min(len(matched_skills) * 3, 30)
    score += skills_score

    if matched_skills:
        feedback.append({
            "type": "success",
            "category": "Skills Match",
            "message": f"Found {len(matched_skills)} relevant skills: {', '.join(matched_skills[:6])}{'...' if len(matched_skills) > 6 else ''}."
        })
    if missing_skills:
        feedback.append({
            "type": "warning",
            "category": "Missing Skills",
            "message": f"Consider adding: {', '.join(missing_skills[:5])}. "
                       f"These are commonly expected for {request.target_role} roles."
        })

    # --- 3. Action verbs (20 points) ---
    found_verbs = [v for v in ACTION_VERBS if v in text_lower]
    verb_score = min(len(found_verbs) * 2, 20)
    score += verb_score

    if len(found_verbs) >= 5:
        feedback.append({
            "type": "success",
            "category": "Action Verbs",
            "message": f"Strong use of action verbs: {', '.join(found_verbs[:5])}. Keep it up."
        })
    else:
        feedback.append({
            "type": "warning",
            "category": "Weak Language",
            "message": f"Use stronger action verbs. Found only: {', '.join(found_verbs) if found_verbs else 'none'}. "
                       f"Try: developed, optimized, automated, reduced, launched."
        })

    # --- 4. Weak phrases check (up to -10 penalty) ---
    found_weak = [p for p in WEAK_PHRASES if p in text_lower]
    weak_penalty = min(len(found_weak) * 3, 10)
    score = max(score - weak_penalty, 0)

    if found_weak:
        feedback.append({
            "type": "error",
            "category": "Weak Phrases",
            "message": f"Remove passive phrases: '{', '.join(found_weak[:3])}'. "
                       f"Replace with direct action verbs — e.g. 'Responsible for building' → 'Built'."
        })

    # --- 5. Quantification check (15 points) ---
    import re
    numbers = re.findall(r'\b\d+[%x]?\b', request.text)
    quant_score = min(len(numbers) * 3, 15)
    score += quant_score

    if len(numbers) >= 3:
        feedback.append({
            "type": "success",
            "category": "Quantified Impact",
            "message": f"Good — found {len(numbers)} numbers/metrics. Quantified achievements stand out to recruiters."
        })
    else:
        feedback.append({
            "type": "warning",
            "category": "Quantified Impact",
            "message": "Add numbers to your achievements. Instead of 'improved performance', "
                       "write 'improved performance by 40%'. Even rough estimates help."
        })

    # --- 6. Length check (10 points) ---
    word_count = len(words)
    if 300 <= word_count <= 700:
        score += 10
        feedback.append({
            "type": "success",
            "category": "Resume Length",
            "message": f"Good length ({word_count} words). Fits neatly on one page."
        })
    elif word_count < 300:
        score += 3
        feedback.append({
            "type": "error",
            "category": "Resume Too Short",
            "message": f"Only {word_count} words — too thin. Add more project details, "
                       "skills, and achievements. Target 400–600 words."
        })
    else:
        score += 5
        feedback.append({
            "type": "warning",
            "category": "Resume Too Long",
            "message": f"{word_count} words is too long for a fresher resume. "
                       "Trim to 1 page — remove old/irrelevant content."
        })

    # --- Final rating ---
    score = min(round(score), 100)
    if score >= 80:
        rating = "Strong"
        color = "green"
        summary = "Excellent resume. Minor polish and you're interview-ready."
    elif score >= 60:
        rating = "Good"
        color = "blue"
        summary = "Solid foundation. Fix the warnings above to stand out more."
    elif score >= 40:
        rating = "Needs Work"
        color = "yellow"
        summary = "Several gaps that recruiters will notice. Work through each issue below."
    else:
        rating = "Weak"
        color = "red"
        summary = "Significant improvements needed before applying. Follow the feedback below."

    return {
        "score": score,
        "rating": rating,
        "color": color,
        "summary": summary,
        "sections_found": sections_found,
        "sections_missing": sections_missing,
        "matched_skills": matched_skills,
        "feedback": feedback,
        "word_count": word_count
    }