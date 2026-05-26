import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models.models import College, PlacementStat, Company, Alumni, Experience, CompanyAlumni, ProsCons

db = SessionLocal()

# 1. COLLEGES
colleges = [
    College(name="Delhi Technological University", location="Delhi", campus_type="on_campus"),
    College(name="Indraprastha Institute of Technology", location="Delhi", campus_type="on_campus"),
    College(name="Amity University", location="Noida", campus_type="off_campus"),
]
db.add_all(colleges)
db.commit()
print("Colleges added!")

# 2. PLACEMENT STATS
stats = [
    PlacementStat(college_id=1, year=2022, placed_count=420, total_students=500, avg_ctc_lpa=8.5),
    PlacementStat(college_id=1, year=2023, placed_count=460, total_students=500, avg_ctc_lpa=10.2),
    PlacementStat(college_id=1, year=2024, placed_count=480, total_students=500, avg_ctc_lpa=12.1),
    PlacementStat(college_id=2, year=2022, placed_count=310, total_students=400, avg_ctc_lpa=7.2),
    PlacementStat(college_id=2, year=2023, placed_count=340, total_students=400, avg_ctc_lpa=8.8),
    PlacementStat(college_id=2, year=2024, placed_count=370, total_students=400, avg_ctc_lpa=9.5),
    PlacementStat(college_id=3, year=2022, placed_count=200, total_students=350, avg_ctc_lpa=5.5),
    PlacementStat(college_id=3, year=2023, placed_count=230, total_students=350, avg_ctc_lpa=6.2),
    PlacementStat(college_id=3, year=2024, placed_count=260, total_students=350, avg_ctc_lpa=7.0),
]
db.add_all(stats)
db.commit()
print("Placement stats added!")

# 3. COMPANIES
companies = [
    Company(name="Google", sector="Tech", avg_package_lpa=40.0, roles_offered="SWE, ML Engineer", website="google.com"),
    Company(name="Microsoft", sector="Tech", avg_package_lpa=35.0, roles_offered="SWE, Product Manager", website="microsoft.com"),
    Company(name="Amazon", sector="Tech", avg_package_lpa=30.0, roles_offered="SDE, Data Engineer", website="amazon.com"),
    Company(name="Deloitte", sector="Consulting", avg_package_lpa=12.0, roles_offered="Analyst, Consultant", website="deloitte.com"),
    Company(name="Goldman Sachs", sector="Finance", avg_package_lpa=20.0, roles_offered="Analyst, Associate", website="goldmansachs.com"),
    Company(name="Infosys", sector="IT Services", avg_package_lpa=6.5, roles_offered="Systems Engineer, Analyst", website="infosys.com"),
]
db.add_all(companies)
db.commit()
print("Companies added!")

# 4. ALUMNI
alumni = [
    Alumni(college_id=1, name="Rahul Sharma", batch_year=2022, current_role="SWE at Google", linkedin_url="linkedin.com/in/rahulsharma", photo_url=""),
    Alumni(college_id=1, name="Priya Mehta", batch_year=2022, current_role="SDE at Amazon", linkedin_url="linkedin.com/in/priyamehta", photo_url=""),
    Alumni(college_id=1, name="Arjun Singh", batch_year=2023, current_role="Analyst at Goldman Sachs", linkedin_url="linkedin.com/in/arjunsingh", photo_url=""),
    Alumni(college_id=1, name="Sneha Gupta", batch_year=2023, current_role="SWE at Microsoft", linkedin_url="linkedin.com/in/snehagupta", photo_url=""),
    Alumni(college_id=2, name="Vikram Nair", batch_year=2022, current_role="Consultant at Deloitte", linkedin_url="linkedin.com/in/vikramnair", photo_url=""),
    Alumni(college_id=2, name="Ananya Patel", batch_year=2023, current_role="SDE at Amazon", linkedin_url="linkedin.com/in/ananyapatel", photo_url=""),
    Alumni(college_id=3, name="Rohan Das", batch_year=2023, current_role="Systems Engineer at Infosys", linkedin_url="linkedin.com/in/rohandas", photo_url=""),
]
db.add_all(alumni)
db.commit()
print("Alumni added!")

# 5. COMPANY ALUMNI LINKS
links = [
    CompanyAlumni(company_id=1, alumni_id=1, role="Software Engineer", year_joined=2022),
    CompanyAlumni(company_id=3, alumni_id=2, role="SDE I", year_joined=2022),
    CompanyAlumni(company_id=5, alumni_id=3, role="Analyst", year_joined=2023),
    CompanyAlumni(company_id=2, alumni_id=4, role="Software Engineer", year_joined=2023),
    CompanyAlumni(company_id=4, alumni_id=5, role="Consultant", year_joined=2022),
    CompanyAlumni(company_id=3, alumni_id=6, role="SDE I", year_joined=2023),
    CompanyAlumni(company_id=6, alumni_id=7, role="Systems Engineer", year_joined=2023),
]
db.add_all(links)
db.commit()
print("Company-Alumni links added!")

# 6. EXPERIENCES (ROADMAP DATA)
experiences = [
    Experience(alumni_id=1, company_id=1, stage="DSA Preparation", description="Solved 300+ Leetcode problems focusing on arrays, graphs and DP.", tips="Focus on Leetcode medium problems. Do at least 2 problems daily for 3 months.", outcome="Cleared"),
    Experience(alumni_id=1, company_id=1, stage="Online Assessment", description="2 coding problems in 90 minutes on Google's platform.", tips="Practice timed contests on Codeforces. Speed matters as much as accuracy.", outcome="Cleared"),
    Experience(alumni_id=1, company_id=1, stage="Technical Interview 1", description="Data structures and algorithms round. Asked about graph traversal and dynamic programming.", tips="Think out loud. Interviewers want to see your thought process.", outcome="Cleared"),
    Experience(alumni_id=1, company_id=1, stage="Technical Interview 2", description="System design round. Asked to design YouTube.", tips="Study Grokking the System Design Interview. Practice designing Instagram, WhatsApp.", outcome="Cleared"),
    Experience(alumni_id=1, company_id=1, stage="Final Result", description="Got the offer after 4 rounds. Total process took 3 weeks.", tips="Stay calm and be yourself in the Googleyness round.", outcome="Selected"),

    Experience(alumni_id=2, company_id=3, stage="DSA Preparation", description="Focused on arrays, trees and recursion. Used Striver's SDE sheet.", tips="Complete Striver's SDE sheet. It covers all important Amazon topics.", outcome="Cleared"),
    Experience(alumni_id=2, company_id=3, stage="Online Assessment", description="2 coding + 1 work simulation question.", tips="Amazon OA has behavioral questions too. Prepare STAR format answers.", outcome="Cleared"),
    Experience(alumni_id=2, company_id=3, stage="Technical Interview", description="Asked about arrays and leadership principles.", tips="Every answer should tie back to Amazon's leadership principles.", outcome="Cleared"),
    Experience(alumni_id=2, company_id=3, stage="Final Result", description="Offer received within a week of final interview.", tips="Negotiate salary. Amazon has good signing bonus flexibility.", outcome="Selected"),
]
db.add_all(experiences)
db.commit()
print("Experiences added!")

# 7. PROS CONS
pros_cons = [
    ProsCons(company_id=1, type="pro", point="Highest paying tech company in India", category="salary"),
    ProsCons(company_id=1, type="pro", point="World class engineering culture and tools", category="culture"),
    ProsCons(company_id=1, type="pro", point="Excellent learning and growth opportunities", category="growth"),
    ProsCons(company_id=1, type="con", point="Extremely competitive interview process", category="hiring"),
    ProsCons(company_id=1, type="con", point="High performance expectations and pressure", category="culture"),

    ProsCons(company_id=2, type="pro", point="Great work life balance compared to other tech giants", category="culture"),
    ProsCons(company_id=2, type="pro", point="Excellent employee benefits and perks", category="culture"),
    ProsCons(company_id=2, type="pro", point="Strong focus on learning and certifications", category="growth"),
    ProsCons(company_id=2, type="con", point="Slower promotion cycle than Google or Amazon", category="growth"),
    ProsCons(company_id=2, type="con", point="Some teams have legacy codebase challenges", category="work"),

    ProsCons(company_id=3, type="pro", point="Fast career growth with internal transfers", category="growth"),
    ProsCons(company_id=3, type="pro", point="Massive scale engineering problems to solve", category="work"),
    ProsCons(company_id=3, type="con", point="Work life balance can be challenging", category="culture"),
    ProsCons(company_id=3, type="con", point="High pressure performance review system (PIP culture)", category="culture"),

    ProsCons(company_id=4, type="pro", point="Great brand name for consulting career", category="growth"),
    ProsCons(company_id=4, type="pro", point="Exposure to multiple industries and clients", category="work"),
    ProsCons(company_id=4, type="con", point="Long working hours especially during project deadlines", category="culture"),
    ProsCons(company_id=4, type="con", point="Lower package compared to product companies", category="salary"),
]
db.add_all(pros_cons)
db.commit()
print("Pros/Cons added!")

db.close()
print("\n✅ All seed data inserted successfully!")