import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.models import Alumni, CompanyAlumni

db = SessionLocal()

# 30 new alumni (IDs will be 8-37)
new_alumni = [
    Alumni(college_id=4, name="Aryan Kapoor", batch_year=2022, current_role="SDE at Google", linkedin_url="linkedin.com/in/aryankapoor", photo_url=""),
    Alumni(college_id=4, name="Priya Singh", batch_year=2023, current_role="ML Engineer at Uber", linkedin_url="linkedin.com/in/priyasingh", photo_url=""),
    Alumni(college_id=5, name="Rahul Verma", batch_year=2022, current_role="SDE at Microsoft", linkedin_url="linkedin.com/in/rahulverma", photo_url=""),
    Alumni(college_id=5, name="Sneha Iyer", batch_year=2023, current_role="Data Engineer at Flipkart", linkedin_url="linkedin.com/in/snehaiyer", photo_url=""),
    Alumni(college_id=6, name="Vikram Reddy", batch_year=2022, current_role="SDE at Amazon", linkedin_url="linkedin.com/in/vikramreddy", photo_url=""),
    Alumni(college_id=6, name="Ananya Krishnan", batch_year=2023, current_role="Product Manager at Zomato", linkedin_url="linkedin.com/in/ananyakrishnan", photo_url=""),
    Alumni(college_id=7, name="Karan Mehta", batch_year=2022, current_role="Quant Developer at JP Morgan", linkedin_url="linkedin.com/in/karanmehta", photo_url=""),
    Alumni(college_id=7, name="Divya Sharma", batch_year=2023, current_role="SDE at Adobe", linkedin_url="linkedin.com/in/divyasharma", photo_url=""),
    Alumni(college_id=8, name="Rohan Gupta", batch_year=2022, current_role="Backend Engineer at Razorpay", linkedin_url="linkedin.com/in/rohangupta", photo_url=""),
    Alumni(college_id=8, name="Neha Joshi", batch_year=2023, current_role="SDE at Atlassian", linkedin_url="linkedin.com/in/nehajoshi", photo_url=""),
    Alumni(college_id=9, name="Aditya Kumar", batch_year=2022, current_role="SDE at Salesforce", linkedin_url="linkedin.com/in/adityakumar", photo_url=""),
    Alumni(college_id=9, name="Pooja Nair", batch_year=2023, current_role="Data Scientist at Swiggy", linkedin_url="linkedin.com/in/poojanair", photo_url=""),
    Alumni(college_id=10, name="Siddharth Rao", batch_year=2022, current_role="SDE at CRED", linkedin_url="linkedin.com/in/siddharthrao", photo_url=""),
    Alumni(college_id=10, name="Ishaan Malhotra", batch_year=2023, current_role="Backend Engineer at PhonePe", linkedin_url="linkedin.com/in/ishaanmalhotra", photo_url=""),
    Alumni(college_id=11, name="Tanvi Agarwal", batch_year=2022, current_role="Analyst at McKinsey", linkedin_url="linkedin.com/in/tanviagarwal", photo_url=""),
    Alumni(college_id=11, name="Harsh Pandey", batch_year=2023, current_role="SDE at Oracle", linkedin_url="linkedin.com/in/harshpandey", photo_url=""),
    Alumni(college_id=12, name="Ritika Bansal", batch_year=2022, current_role="ML Engineer at Google", linkedin_url="linkedin.com/in/ritikabansal", photo_url=""),
    Alumni(college_id=12, name="Varun Saxena", batch_year=2023, current_role="SDE at Microsoft", linkedin_url="linkedin.com/in/varunsaxena", photo_url=""),
    Alumni(college_id=13, name="Meera Pillai", batch_year=2022, current_role="Analyst at Accenture", linkedin_url="linkedin.com/in/meerapillai", photo_url=""),
    Alumni(college_id=13, name="Arjun Nambiar", batch_year=2023, current_role="SDE at Wipro", linkedin_url="linkedin.com/in/arjunnambiar", photo_url=""),
    Alumni(college_id=14, name="Shweta Mishra", batch_year=2022, current_role="SDE at TCS", linkedin_url="linkedin.com/in/shwetamishra", photo_url=""),
    Alumni(college_id=14, name="Gaurav Tiwari", batch_year=2023, current_role="Backend Engineer at Paytm", linkedin_url="linkedin.com/in/gauravtiwari", photo_url=""),
    Alumni(college_id=15, name="Simran Kaur", batch_year=2022, current_role="SDE at Meesho", linkedin_url="linkedin.com/in/simrankaur", photo_url=""),
    Alumni(college_id=15, name="Deepak Choudhary", batch_year=2023, current_role="Data Analyst at Groww", linkedin_url="linkedin.com/in/deepakchoudhary", photo_url=""),
    Alumni(college_id=1, name="Ayush Rawat", batch_year=2022, current_role="Technology Analyst at Morgan Stanley", linkedin_url="linkedin.com/in/ayushrawat", photo_url=""),
    Alumni(college_id=2, name="Kavya Menon", batch_year=2023, current_role="SDE at Flipkart", linkedin_url="linkedin.com/in/kavyamenon", photo_url=""),
    Alumni(college_id=3, name="Nikhil Dubey", batch_year=2022, current_role="Consultant at Deloitte", linkedin_url="linkedin.com/in/nikhildubey", photo_url=""),
    Alumni(college_id=16, name="Riya Chatterjee", batch_year=2023, current_role="SDE at Amazon", linkedin_url="linkedin.com/in/riyachatterjee", photo_url=""),
    Alumni(college_id=17, name="Sumit Yadav", batch_year=2022, current_role="DevOps at Razorpay", linkedin_url="linkedin.com/in/sumityadav", photo_url=""),
    Alumni(college_id=18, name="Prachi Desai", batch_year=2023, current_role="Product Manager at CRED", linkedin_url="linkedin.com/in/prachidesai", photo_url=""),
]

db.add_all(new_alumni)
db.commit()
print(f"✅ Added {len(new_alumni)} alumni")

# Link alumni to companies (alumni IDs 8-37)
links = [
    CompanyAlumni(company_id=1,  alumni_id=8,  role="Software Engineer",      year_joined=2022),
    CompanyAlumni(company_id=22, alumni_id=9,  role="ML Engineer",             year_joined=2022),
    CompanyAlumni(company_id=2,  alumni_id=10, role="Software Engineer",       year_joined=2022),
    CompanyAlumni(company_id=7,  alumni_id=11, role="Data Engineer",           year_joined=2023),
    CompanyAlumni(company_id=3,  alumni_id=12, role="SDE I",                   year_joined=2022),
    CompanyAlumni(company_id=8,  alumni_id=13, role="Product Manager",         year_joined=2023),
    CompanyAlumni(company_id=20, alumni_id=14, role="Quant Developer",         year_joined=2022),
    CompanyAlumni(company_id=13, alumni_id=15, role="Software Engineer",       year_joined=2023),
    CompanyAlumni(company_id=12, alumni_id=16, role="Backend Engineer",        year_joined=2022),
    CompanyAlumni(company_id=23, alumni_id=17, role="Software Engineer",       year_joined=2023),
    CompanyAlumni(company_id=14, alumni_id=18, role="Software Engineer",       year_joined=2022),
    CompanyAlumni(company_id=9,  alumni_id=19, role="Data Scientist",          year_joined=2023),
    CompanyAlumni(company_id=11, alumni_id=20, role="Software Engineer",       year_joined=2022),
    CompanyAlumni(company_id=24, alumni_id=21, role="Backend Engineer",        year_joined=2023),
    CompanyAlumni(company_id=19, alumni_id=22, role="Business Analyst",        year_joined=2022),
    CompanyAlumni(company_id=15, alumni_id=23, role="Software Engineer",       year_joined=2023),
    CompanyAlumni(company_id=1,  alumni_id=24, role="ML Engineer",             year_joined=2022),
    CompanyAlumni(company_id=2,  alumni_id=25, role="Software Engineer",       year_joined=2023),
    CompanyAlumni(company_id=18, alumni_id=26, role="Technology Associate",    year_joined=2022),
    CompanyAlumni(company_id=10, alumni_id=27, role="Software Engineer",       year_joined=2023),
    CompanyAlumni(company_id=17, alumni_id=28, role="Software Engineer",       year_joined=2022),
    CompanyAlumni(company_id=10, alumni_id=29, role="Backend Engineer",        year_joined=2023),
    CompanyAlumni(company_id=25, alumni_id=30, role="Software Engineer",       year_joined=2022),
    CompanyAlumni(company_id=26, alumni_id=31, role="Data Analyst",            year_joined=2023),
    CompanyAlumni(company_id=21, alumni_id=32, role="Technology Analyst",      year_joined=2022),
    CompanyAlumni(company_id=7,  alumni_id=33, role="Software Engineer",       year_joined=2023),
    CompanyAlumni(company_id=4,  alumni_id=34, role="Consultant",              year_joined=2022),
    CompanyAlumni(company_id=3,  alumni_id=35, role="SDE I",                   year_joined=2023),
    CompanyAlumni(company_id=12, alumni_id=36, role="DevOps Engineer",         year_joined=2022),
    CompanyAlumni(company_id=11, alumni_id=37, role="Product Manager",         year_joined=2023),
]

db.add_all(links)
db.commit()
print(f"✅ Linked all alumni to companies")

db.close()
print("\n✅ Seed complete! You now have 37 alumni in CareerLens.")
