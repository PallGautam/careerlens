import numpy as np
import pandas as pd

np.random.seed(42)

N = 3000

KEY_SKILLS = ["python", "java", "javascript", "c++", "dsa", "sql",
              "machine learning", "react", "node", "system design", "os", "networking"]

SKILL_WEIGHTS = {
    "python": 8, "java": 8, "javascript": 7, "c++": 7,
    "dsa": 10, "sql": 6, "machine learning": 9, "react": 7,
    "node": 6, "system design": 9, "os": 6, "networking": 5
}

rows = []
for _ in range(N):
    cgpa = round(np.random.uniform(5.0, 10.0), 2)

    num_skills = np.random.choice([0, 1, 2, 3, 4, 5, 6, 7, 8],
                                   p=[0.05, 0.10, 0.15, 0.20, 0.20, 0.15, 0.08, 0.05, 0.02])
    student_skills = list(np.random.choice(KEY_SKILLS, size=num_skills, replace=False)) if num_skills > 0 else []
    skill_score = sum(SKILL_WEIGHTS.get(s, 0) for s in student_skills)
    skill_score = min(skill_score, 40)

    alumni_count = np.random.poisson(2)
    history_score = min(alumni_count * 5, 20)

    cgpa_score = min((cgpa / 10) * 40, 40)

    raw_score = cgpa_score + skill_score + history_score
    noise = np.random.normal(0, 8)
    final_score = np.clip(raw_score + noise, 0, 100)

    placement_prob = 1 / (1 + np.exp(-(final_score - 55) / 10))
    placed = np.random.binomial(1, placement_prob)

    rows.append({
        "cgpa": cgpa,
        "num_skills": num_skills,
        "skill_score": skill_score,
        "has_dsa": int("dsa" in student_skills),
        "has_python": int("python" in student_skills),
        "has_sql": int("sql" in student_skills),
        "has_system_design": int("system design" in student_skills),
        "alumni_count": alumni_count,
        "placed": placed
    })

df = pd.DataFrame(rows)
df.to_csv("placement_dataset.csv", index=False)
print(f"Generated {len(df)} synthetic student profiles")
print(f"Placement rate: {df['placed'].mean():.2%}")
print(df.head())
