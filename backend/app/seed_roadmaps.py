import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import random
from app.database import SessionLocal
from app.models.models import Company, Alumni, CompanyAlumni, Experience

db = SessionLocal()

# Only generate for companies that don't already have alumni/experience data
existing_company_ids_with_data = {1, 3}  # Google, Amazon already seeded originally

companies = db.query(Company).filter(~Company.id.in_(existing_company_ids_with_data)).all()

FIRST_NAMES = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna",
               "Ishaan", "Shaurya", "Ananya", "Diya", "Saanvi", "Anika", "Myra", "Pari",
               "Aadhya", "Kiara", "Riya", "Avni", "Aryan", "Dhruv", "Yash", "Rohit"]
LAST_NAMES = ["Sharma", "Verma", "Iyer", "Reddy", "Kapoor", "Mehta", "Gupta", "Joshi",
              "Nair", "Pillai", "Bose", "Chatterjee", "Khanna", "Malhotra", "Saxena", "Dubey"]

ROLES_GENERIC = ["Software Engineer", "Analyst", "Associate", "SDE I", "Business Analyst", "Consultant"]

STAGE_TEMPLATES = [
    {
        "stage": "DSA Preparation",
        "descriptions": [
            "Spent 2 months solving DSA problems focused on arrays, trees, and graphs.",
            "Practiced 250+ problems on LeetCode, focusing on medium and hard difficulty.",
            "Followed a structured sheet covering all core data structures and algorithms.",
        ],
        "tips": [
            "Consistency matters more than intensity — solve 2-3 problems daily without skipping.",
            "Revisit your weak topics every week instead of moving on too fast.",
            "Time yourself during practice to simulate real interview pressure.",
        ],
        "outcome": "Cleared"
    },
    {
        "stage": "Online Assessment",
        "descriptions": [
            "2 coding questions and an aptitude section, completed in 90 minutes.",
            "A mix of coding problems and MCQs on CS fundamentals and logical reasoning.",
            "Hackerrank-style assessment with 3 problems of increasing difficulty.",
        ],
        "tips": [
            "Read all questions first before starting — pick the easiest one to build confidence.",
            "Don't get stuck on one problem — partial marks matter, attempt everything.",
            "Practice typing speed and reading problem statements quickly under time pressure.",
        ],
        "outcome": "Cleared"
    },
    {
        "stage": "Technical Interview",
        "descriptions": [
            "Asked to solve a medium-level DSA problem and explain time complexity trade-offs.",
            "Discussion around past projects followed by a coding round on data structures.",
            "System design basics combined with a live coding problem on the spot.",
        ],
        "tips": [
            "Think out loud — interviewers care about your approach, not just the final answer.",
            "Be ready to discuss your resume projects in technical depth.",
            "Ask clarifying questions before jumping into a solution.",
        ],
        "outcome": "Cleared"
    },
    {
        "stage": "HR / Managerial Round",
        "descriptions": [
            "Behavioral questions about teamwork, conflict resolution, and career goals.",
            "Discussion on why this company, salary expectations, and relocation flexibility.",
            "Questions about leadership experience and how I handle ambiguous situations.",
        ],
        "tips": [
            "Prepare 2-3 strong stories using the STAR format in advance.",
            "Research the company's recent news and values before this round.",
            "Be honest about salary expectations but know your market value.",
        ],
        "outcome": "Cleared"
    },
    {
        "stage": "Final Result",
        "descriptions": [
            "Received the offer letter within a week of the final round.",
            "Got the call confirming selection after a short wait of 10 days.",
            "Offer came through with a slight negotiation on the joining bonus.",
        ],
        "tips": [
            "Don't hesitate to negotiate — most companies have some flexibility.",
            "Ask for the offer in writing before resigning from your current role, if applicable.",
            "Stay in touch with your future team on LinkedIn before joining.",
        ],
        "outcome": "Selected"
    },
]

alumni_created = 0
experiences_created = 0
links_created = 0

for company in companies:
    roles = company.roles_offered.split(",") if company.roles_offered else ROLES_GENERIC
    roles = [r.strip() for r in roles] if roles else ROLES_GENERIC

    for i in range(3):
        name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
        batch_year = random.choice([2022, 2023, 2024])
        role = random.choice(roles) if roles else random.choice(ROLES_GENERIC)

        alumni = Alumni(
            name=name,
            batch_year=batch_year,
            current_role=f"{role} at {company.name}",
            linkedin_url=f"linkedin.com/in/{name.lower().replace(' ', '')}",
            photo_url="",
            college_id=random.choice([1, 2, 3])
        )
        db.add(alumni)
        db.flush()  # get alumni.id without committing
        alumni_created += 1

        db.add(CompanyAlumni(
            company_id=company.id,
            alumni_id=alumni.id,
            role=role,
            year_joined=batch_year
        ))
        links_created += 1

        for stage_template in STAGE_TEMPLATES:
            db.add(Experience(
                alumni_id=alumni.id,
                company_id=company.id,
                stage=stage_template["stage"],
                description=random.choice(stage_template["descriptions"]),
                tips=random.choice(stage_template["tips"]),
                outcome=stage_template["outcome"]
            ))
            experiences_created += 1

db.commit()
db.close()

print(f"✅ Created {alumni_created} alumni")
print(f"✅ Created {links_created} company-alumni links")
print(f"✅ Created {experiences_created} experience entries")
print(f"✅ Roadmap data now exists for {len(companies)} additional companies")