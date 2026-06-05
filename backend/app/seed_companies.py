import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.models import Company, CompanyAlumni, Alumni, ProsCons

db = SessionLocal()

# 20 new companies to add (IDs will be 7-26)
new_companies = [
    Company(name="Flipkart", sector="E-Commerce", avg_package_lpa=28.0, roles_offered="SDE, Data Engineer, Product Manager", website="flipkart.com"),
    Company(name="Zomato", sector="Startup", avg_package_lpa=22.0, roles_offered="SDE, Backend Engineer, Data Analyst", website="zomato.com"),
    Company(name="Swiggy", sector="Startup", avg_package_lpa=20.0, roles_offered="SDE, ML Engineer, Product Manager", website="swiggy.com"),
    Company(name="Paytm", sector="Fintech", avg_package_lpa=18.0, roles_offered="SDE, Data Scientist, Backend Engineer", website="paytm.com"),
    Company(name="CRED", sector="Startup", avg_package_lpa=25.0, roles_offered="SDE, Frontend Engineer, Product Manager", website="cred.club"),
    Company(name="Razorpay", sector="Fintech", avg_package_lpa=24.0, roles_offered="SDE, Backend Engineer, DevOps", website="razorpay.com"),
    Company(name="Adobe", sector="Tech", avg_package_lpa=32.0, roles_offered="SDE, UX Engineer, Data Scientist", website="adobe.com"),
    Company(name="Salesforce", sector="Tech", avg_package_lpa=30.0, roles_offered="SDE, Solutions Engineer, Product Manager", website="salesforce.com"),
    Company(name="Oracle", sector="Tech", avg_package_lpa=22.0, roles_offered="SDE, Cloud Engineer, Database Administrator", website="oracle.com"),
    Company(name="Wipro", sector="IT Services", avg_package_lpa=7.0, roles_offered="Software Engineer, Analyst, Consultant", website="wipro.com"),
    Company(name="TCS", sector="IT Services", avg_package_lpa=7.5, roles_offered="Software Engineer, Systems Analyst, DevOps", website="tcs.com"),
    Company(name="Accenture", sector="Consulting", avg_package_lpa=9.0, roles_offered="Analyst, Consultant, Technology Associate", website="accenture.com"),
    Company(name="McKinsey & Company", sector="Consulting", avg_package_lpa=25.0, roles_offered="Business Analyst, Associate, Digital Analyst", website="mckinsey.com"),
    Company(name="JP Morgan", sector="Finance", avg_package_lpa=18.0, roles_offered="Software Engineer, Analyst, Quant Developer", website="jpmorgan.com"),
    Company(name="Morgan Stanley", sector="Finance", avg_package_lpa=17.0, roles_offered="Technology Analyst, Quant, Risk Analyst", website="morganstanley.com"),
    Company(name="Uber", sector="Tech", avg_package_lpa=35.0, roles_offered="SDE, ML Engineer, Data Scientist", website="uber.com"),
    Company(name="Atlassian", sector="Tech", avg_package_lpa=38.0, roles_offered="SDE, Site Reliability Engineer, Product Manager", website="atlassian.com"),
    Company(name="PhonePe", sector="Fintech", avg_package_lpa=22.0, roles_offered="SDE, Data Engineer, Backend Engineer", website="phonepe.com"),
    Company(name="Meesho", sector="Startup", avg_package_lpa=20.0, roles_offered="SDE, Data Scientist, Product Manager", website="meesho.com"),
    Company(name="Groww", sector="Fintech", avg_package_lpa=21.0, roles_offered="SDE, Backend Engineer, Data Analyst", website="groww.in"),
]

db.add_all(new_companies)
db.commit()
print(f"✅ Added {len(new_companies)} companies")

# Pros/Cons for new companies
pros_cons = [
    # Flipkart
    ProsCons(company_id=7, type="pro", point="Largest e-commerce company in India — massive scale engineering", category="Impact"),
    ProsCons(company_id=7, type="pro", point="Strong internal mobility — easy to move between teams", category="Growth"),
    ProsCons(company_id=7, type="pro", point="Competitive package with good ESOPs", category="Salary"),
    ProsCons(company_id=7, type="con", point="High pressure during sale seasons (Big Billion Days)", category="Work-Life Balance"),
    ProsCons(company_id=7, type="con", point="Acquired by Walmart — some bureaucracy has crept in", category="Culture"),

    # Zomato
    ProsCons(company_id=8, type="pro", point="Fast-paced startup culture — ship features quickly", category="Culture"),
    ProsCons(company_id=8, type="pro", point="Strong brand and interesting engineering challenges at scale", category="Work Quality"),
    ProsCons(company_id=8, type="pro", point="Good ESOPs that have real value post-IPO", category="Salary"),
    ProsCons(company_id=8, type="con", point="Work-life balance can be poor during peak growth phases", category="Work-Life Balance"),
    ProsCons(company_id=8, type="con", point="Frequent restructuring — teams and priorities shift often", category="Stability"),

    # Swiggy
    ProsCons(company_id=9, type="pro", point="Hyper-growth company — lots of ownership for engineers", category="Growth"),
    ProsCons(company_id=9, type="pro", point="Interesting ML and logistics optimization problems", category="Work Quality"),
    ProsCons(company_id=9, type="con", point="Pre-IPO uncertainty — stock value not yet realized", category="Compensation"),
    ProsCons(company_id=9, type="con", point="High attrition — teams change frequently", category="Stability"),

    # Paytm
    ProsCons(company_id=10, type="pro", point="Fintech pioneer in India — work on payment infrastructure used by millions", category="Impact"),
    ProsCons(company_id=10, type="pro", point="Broad tech stack exposure — payments, banking, insurance", category="Learning"),
    ProsCons(company_id=10, type="con", point="Stock value has declined significantly post-IPO", category="Compensation"),
    ProsCons(company_id=10, type="con", point="Business model uncertainty affects team morale", category="Culture"),

    # CRED
    ProsCons(company_id=11, type="pro", point="Best engineering culture among Indian startups — extremely high bar", category="Culture"),
    ProsCons(company_id=11, type="pro", point="Top of market compensation for Indian product company", category="Salary"),
    ProsCons(company_id=11, type="pro", point="Small focused teams — high ownership and impact per engineer", category="Impact"),
    ProsCons(company_id=11, type="con", point="Very difficult to get in — interview bar is extremely high", category="Hiring"),
    ProsCons(company_id=11, type="con", point="Business profitability still being established", category="Stability"),

    # Razorpay
    ProsCons(company_id=12, type="pro", point="Fastest growing fintech in India — unicorn with strong fundamentals", category="Growth"),
    ProsCons(company_id=12, type="pro", point="Developer-first culture — engineering is respected and valued", category="Culture"),
    ProsCons(company_id=12, type="pro", point="Work on payment infrastructure used by 8M+ businesses", category="Impact"),
    ProsCons(company_id=12, type="con", point="Intense work culture — long hours are common", category="Work-Life Balance"),
    ProsCons(company_id=12, type="con", point="High growth means processes are still maturing", category="Work Style"),

    # Adobe
    ProsCons(company_id=13, type="pro", point="Excellent work-life balance — 9-6 culture strictly followed", category="Work-Life Balance"),
    ProsCons(company_id=13, type="pro", point="Strong creative culture — work on Photoshop, Premiere, Acrobat", category="Work Quality"),
    ProsCons(company_id=13, type="pro", point="Great benefits and generous stock grants", category="Compensation"),
    ProsCons(company_id=13, type="con", point="Slower pace compared to startups — bureaucracy in large teams", category="Work Style"),
    ProsCons(company_id=13, type="con", point="Legacy codebase in some older products", category="Tech Stack"),

    # Salesforce
    ProsCons(company_id=14, type="pro", point="Ohana culture — genuinely cares about employee wellbeing", category="Culture"),
    ProsCons(company_id=14, type="pro", point="Top compensation in the industry with strong RSUs", category="Salary"),
    ProsCons(company_id=14, type="pro", point="Great for career growth in enterprise tech and cloud", category="Growth"),
    ProsCons(company_id=14, type="con", point="Slower innovation — large enterprise company feel", category="Work Style"),
    ProsCons(company_id=14, type="con", point="Recent layoffs have affected morale", category="Stability"),

    # Oracle
    ProsCons(company_id=15, type="pro", point="Job stability — Oracle has never had mass layoffs", category="Stability"),
    ProsCons(company_id=15, type="pro", point="Strong cloud push — OCI is growing fast", category="Growth"),
    ProsCons(company_id=15, type="con", point="Legacy culture — slower to adopt modern engineering practices", category="Culture"),
    ProsCons(company_id=15, type="con", point="Lower compensation compared to other tech giants", category="Salary"),

    # Wipro
    ProsCons(company_id=16, type="pro", point="Global exposure — projects across US, UK, EU clients", category="Exposure"),
    ProsCons(company_id=16, type="pro", point="Good stepping stone — Wipro experience helps move to product companies", category="Career Path"),
    ProsCons(company_id=16, type="con", point="Service-based work — limited innovation and product ownership", category="Work Quality"),
    ProsCons(company_id=16, type="con", point="Slow salary growth — increments average 8-10% annually", category="Salary"),

    # TCS
    ProsCons(company_id=17, type="pro", point="Largest IT employer in India — best job security", category="Stability"),
    ProsCons(company_id=17, type="pro", point="Massive training infrastructure — good for freshers", category="Learning"),
    ProsCons(company_id=17, type="con", point="Service-based work — repetitive maintenance projects", category="Work Quality"),
    ProsCons(company_id=17, type="con", point="Very slow career progression without switching companies", category="Growth"),

    # Accenture
    ProsCons(company_id=18, type="pro", point="Exposure to 40+ industries in first 3 years", category="Exposure"),
    ProsCons(company_id=18, type="pro", point="Strong global network and client relationships", category="Network"),
    ProsCons(company_id=18, type="con", point="Heavy travel requirements during project phases", category="Lifestyle"),
    ProsCons(company_id=18, type="con", point="Lower package than product companies", category="Salary"),

    # McKinsey
    ProsCons(company_id=19, type="pro", point="Most prestigious consulting firm globally — opens every door", category="Brand Value"),
    ProsCons(company_id=19, type="pro", point="Work with C-suite executives on billion-dollar decisions", category="Impact"),
    ProsCons(company_id=19, type="pro", point="Best MBA sponsorship and alumni network in the world", category="Network"),
    ProsCons(company_id=19, type="con", point="Brutal work hours — 80+ hour weeks are standard", category="Work-Life Balance"),
    ProsCons(company_id=19, type="con", point="Up-or-out culture — constant performance pressure", category="Pressure"),

    # JP Morgan
    ProsCons(company_id=20, type="pro", point="World's largest bank — your code handles trillions in transactions", category="Impact"),
    ProsCons(company_id=20, type="pro", point="Strong tech investment — $12B annual tech budget", category="Resources"),
    ProsCons(company_id=20, type="con", point="Strict return-to-office policy — 5 days/week mandatory", category="Work Style"),
    ProsCons(company_id=20, type="con", point="Finance domain steep learning curve for CS freshers", category="Learning Curve"),

    # Morgan Stanley
    ProsCons(company_id=21, type="pro", point="Prestigious finance brand with strong alumni network", category="Brand Value"),
    ProsCons(company_id=21, type="pro", point="Exposure to high-frequency trading and quant systems", category="Work Quality"),
    ProsCons(company_id=21, type="con", point="Legacy tech stack — COBOL and proprietary systems still in use", category="Tech Stack"),
    ProsCons(company_id=21, type="con", point="Very long hours in front-office tech roles", category="Work-Life Balance"),

    # Uber
    ProsCons(company_id=22, type="pro", point="World-class engineering — Kafka, Jaeger, and many OSS tools built here", category="Tech Stack"),
    ProsCons(company_id=22, type="pro", point="Top compensation globally — one of the highest paying tech cos", category="Salary"),
    ProsCons(company_id=22, type="pro", point="Interesting distributed systems and real-time problems", category="Work Quality"),
    ProsCons(company_id=22, type="con", point="Culture has had challenges — still recovering from historical issues", category="Culture"),
    ProsCons(company_id=22, type="con", point="High performance bar — low performers are managed out", category="Pressure"),

    # Atlassian
    ProsCons(company_id=23, type="pro", point="Best work-life balance in the industry — fully remote-first", category="Work-Life Balance"),
    ProsCons(company_id=23, type="pro", point="Top compensation — among the highest paying mid-size tech cos", category="Salary"),
    ProsCons(company_id=23, type="pro", point="Strong engineering culture — quarterly ShipIt hackathons", category="Culture"),
    ProsCons(company_id=23, type="con", point="Slower growth than FAANG — less prestige on resume", category="Brand Value"),
    ProsCons(company_id=23, type="con", point="Some legacy Jira/Confluence codebases are painful to work on", category="Tech Stack"),

    # PhonePe
    ProsCons(company_id=24, type="pro", point="Spun out from Flipkart — operates like a startup with backing", category="Culture"),
    ProsCons(company_id=24, type="pro", point="Processes 5B+ transactions/month — serious scale problems", category="Impact"),
    ProsCons(company_id=24, type="con", point="High pressure during UPI peak hours and festival seasons", category="Work-Life Balance"),
    ProsCons(company_id=24, type="con", point="Limited brand recognition outside India", category="Brand Value"),

    # Meesho
    ProsCons(company_id=25, type="pro", point="Fastest growing social commerce platform — interesting GTM problems", category="Work Quality"),
    ProsCons(company_id=25, type="pro", point="High ownership — small teams with big impact", category="Impact"),
    ProsCons(company_id=25, type="con", point="Pre-IPO — stock value uncertain", category="Compensation"),
    ProsCons(company_id=25, type="con", point="High growth pace means work-life balance is inconsistent", category="Work-Life Balance"),

    # Groww
    ProsCons(company_id=26, type="pro", point="Fastest growing investment platform in India — 7M+ users", category="Impact"),
    ProsCons(company_id=26, type="pro", point="Strong engineering culture — moved from monolith to microservices at scale", category="Tech Stack"),
    ProsCons(company_id=26, type="con", point="Fintech regulations add complexity to product development", category="Work Style"),
    ProsCons(company_id=26, type="con", point="Pre-IPO company — compensation partly in illiquid stock", category="Compensation"),
]

db.add_all(pros_cons)
db.commit()
print(f"✅ Added pros/cons for all new companies")

db.close()
print("\n✅ Seed complete! You now have 26 companies in CareerLens.")