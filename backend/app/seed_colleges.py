import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.models import College, PlacementStat

db = SessionLocal()

# 20 new colleges (IDs will be 4-23)
new_colleges = [
    # Tier 1
    College(name="IIT Bombay", location="Mumbai", campus_type="on_campus"),
    College(name="IIT Delhi", location="Delhi", campus_type="on_campus"),
    College(name="IIT Madras", location="Chennai", campus_type="on_campus"),
    College(name="IIT Kanpur", location="Kanpur", campus_type="on_campus"),
    College(name="IIT Kharagpur", location="Kharagpur", campus_type="on_campus"),
    College(name="IIT Roorkee", location="Roorkee", campus_type="on_campus"),
    College(name="BITS Pilani", location="Pilani", campus_type="on_campus"),
    College(name="NSUT Delhi", location="Delhi", campus_type="on_campus"),
    College(name="IIIT Hyderabad", location="Hyderabad", campus_type="on_campus"),
    College(name="NIT Trichy", location="Trichy", campus_type="on_campus"),

    # Tier 2
    College(name="VIT Vellore", location="Vellore", campus_type="on_campus"),
    College(name="SRM Institute of Science", location="Chennai", campus_type="on_campus"),
    College(name="Manipal Institute of Technology", location="Manipal", campus_type="on_campus"),
    College(name="Thapar Institute of Engineering", location="Patiala", campus_type="on_campus"),
    College(name="PES University", location="Bangalore", campus_type="on_campus"),
    College(name="Symbiosis Institute of Technology", location="Pune", campus_type="on_campus"),
    College(name="KIIT University", location="Bhubaneswar", campus_type="on_campus"),
    College(name="Chandigarh University", location="Chandigarh", campus_type="on_campus"),

    # Off campus
    College(name="IGNOU", location="Delhi", campus_type="off_campus"),
    College(name="Lovely Professional University", location="Jalandhar", campus_type="off_campus"),
]

db.add_all(new_colleges)
db.commit()
print(f"✅ Added {len(new_colleges)} colleges")

# Placement stats for each new college (3 years each)
stats = [
    # IIT Bombay (id=4)
    PlacementStat(college_id=4, year=2022, placed_count=780, total_students=900, avg_ctc_lpa=28.5),
    PlacementStat(college_id=4, year=2023, placed_count=820, total_students=900, avg_ctc_lpa=32.1),
    PlacementStat(college_id=4, year=2024, placed_count=850, total_students=900, avg_ctc_lpa=35.4),

    # IIT Delhi (id=5)
    PlacementStat(college_id=5, year=2022, placed_count=760, total_students=880, avg_ctc_lpa=27.2),
    PlacementStat(college_id=5, year=2023, placed_count=800, total_students=880, avg_ctc_lpa=30.8),
    PlacementStat(college_id=5, year=2024, placed_count=830, total_students=880, avg_ctc_lpa=33.5),

    # IIT Madras (id=6)
    PlacementStat(college_id=6, year=2022, placed_count=740, total_students=860, avg_ctc_lpa=26.8),
    PlacementStat(college_id=6, year=2023, placed_count=780, total_students=860, avg_ctc_lpa=29.5),
    PlacementStat(college_id=6, year=2024, placed_count=810, total_students=860, avg_ctc_lpa=31.2),

    # IIT Kanpur (id=7)
    PlacementStat(college_id=7, year=2022, placed_count=700, total_students=820, avg_ctc_lpa=25.5),
    PlacementStat(college_id=7, year=2023, placed_count=740, total_students=820, avg_ctc_lpa=28.2),
    PlacementStat(college_id=7, year=2024, placed_count=770, total_students=820, avg_ctc_lpa=30.8),

    # IIT Kharagpur (id=8)
    PlacementStat(college_id=8, year=2022, placed_count=850, total_students=1000, avg_ctc_lpa=22.5),
    PlacementStat(college_id=8, year=2023, placed_count=890, total_students=1000, avg_ctc_lpa=25.1),
    PlacementStat(college_id=8, year=2024, placed_count=920, total_students=1000, avg_ctc_lpa=27.4),

    # IIT Roorkee (id=9)
    PlacementStat(college_id=9, year=2022, placed_count=680, total_students=800, avg_ctc_lpa=21.2),
    PlacementStat(college_id=9, year=2023, placed_count=710, total_students=800, avg_ctc_lpa=23.8),
    PlacementStat(college_id=9, year=2024, placed_count=740, total_students=800, avg_ctc_lpa=25.5),

    # BITS Pilani (id=10)
    PlacementStat(college_id=10, year=2022, placed_count=650, total_students=750, avg_ctc_lpa=20.5),
    PlacementStat(college_id=10, year=2023, placed_count=690, total_students=750, avg_ctc_lpa=22.8),
    PlacementStat(college_id=10, year=2024, placed_count=720, total_students=750, avg_ctc_lpa=24.2),

    # NSUT Delhi (id=11)
    PlacementStat(college_id=11, year=2022, placed_count=520, total_students=600, avg_ctc_lpa=14.5),
    PlacementStat(college_id=11, year=2023, placed_count=550, total_students=600, avg_ctc_lpa=16.2),
    PlacementStat(college_id=11, year=2024, placed_count=575, total_students=600, avg_ctc_lpa=17.8),

    # IIIT Hyderabad (id=12)
    PlacementStat(college_id=12, year=2022, placed_count=480, total_students=550, avg_ctc_lpa=18.5),
    PlacementStat(college_id=12, year=2023, placed_count=510, total_students=550, avg_ctc_lpa=20.2),
    PlacementStat(college_id=12, year=2024, placed_count=535, total_students=550, avg_ctc_lpa=22.5),

    # NIT Trichy (id=13)
    PlacementStat(college_id=13, year=2022, placed_count=580, total_students=680, avg_ctc_lpa=15.2),
    PlacementStat(college_id=13, year=2023, placed_count=610, total_students=680, avg_ctc_lpa=17.5),
    PlacementStat(college_id=13, year=2024, placed_count=640, total_students=680, avg_ctc_lpa=19.2),

    # VIT Vellore (id=14)
    PlacementStat(college_id=14, year=2022, placed_count=3200, total_students=4000, avg_ctc_lpa=8.5),
    PlacementStat(college_id=14, year=2023, placed_count=3500, total_students=4000, avg_ctc_lpa=9.8),
    PlacementStat(college_id=14, year=2024, placed_count=3700, total_students=4000, avg_ctc_lpa=11.2),

    # SRM (id=15)
    PlacementStat(college_id=15, year=2022, placed_count=2800, total_students=3500, avg_ctc_lpa=7.2),
    PlacementStat(college_id=15, year=2023, placed_count=3000, total_students=3500, avg_ctc_lpa=8.5),
    PlacementStat(college_id=15, year=2024, placed_count=3200, total_students=3500, avg_ctc_lpa=9.8),

    # Manipal (id=16)
    PlacementStat(college_id=16, year=2022, placed_count=1800, total_students=2200, avg_ctc_lpa=9.5),
    PlacementStat(college_id=16, year=2023, placed_count=1950, total_students=2200, avg_ctc_lpa=10.8),
    PlacementStat(college_id=16, year=2024, placed_count=2050, total_students=2200, avg_ctc_lpa=12.2),

    # Thapar (id=17)
    PlacementStat(college_id=17, year=2022, placed_count=920, total_students=1100, avg_ctc_lpa=10.5),
    PlacementStat(college_id=17, year=2023, placed_count=970, total_students=1100, avg_ctc_lpa=12.2),
    PlacementStat(college_id=17, year=2024, placed_count=1010, total_students=1100, avg_ctc_lpa=13.8),

    # PES University (id=18)
    PlacementStat(college_id=18, year=2022, placed_count=780, total_students=950, avg_ctc_lpa=11.2),
    PlacementStat(college_id=18, year=2023, placed_count=820, total_students=950, avg_ctc_lpa=13.5),
    PlacementStat(college_id=18, year=2024, placed_count=860, total_students=950, avg_ctc_lpa=15.2),

    # Symbiosis (id=19)
    PlacementStat(college_id=19, year=2022, placed_count=650, total_students=800, avg_ctc_lpa=8.8),
    PlacementStat(college_id=19, year=2023, placed_count=690, total_students=800, avg_ctc_lpa=10.2),
    PlacementStat(college_id=19, year=2024, placed_count=725, total_students=800, avg_ctc_lpa=11.8),

    # KIIT (id=20)
    PlacementStat(college_id=20, year=2022, placed_count=1200, total_students=1500, avg_ctc_lpa=7.5),
    PlacementStat(college_id=20, year=2023, placed_count=1300, total_students=1500, avg_ctc_lpa=8.8),
    PlacementStat(college_id=20, year=2024, placed_count=1380, total_students=1500, avg_ctc_lpa=10.2),

    # Chandigarh University (id=21)
    PlacementStat(college_id=21, year=2022, placed_count=1800, total_students=2500, avg_ctc_lpa=6.5),
    PlacementStat(college_id=21, year=2023, placed_count=2000, total_students=2500, avg_ctc_lpa=7.8),
    PlacementStat(college_id=21, year=2024, placed_count=2200, total_students=2500, avg_ctc_lpa=9.2),

    # IGNOU (id=22)
    PlacementStat(college_id=22, year=2022, placed_count=1500, total_students=5000, avg_ctc_lpa=4.5),
    PlacementStat(college_id=22, year=2023, placed_count=1800, total_students=5000, avg_ctc_lpa=5.2),
    PlacementStat(college_id=22, year=2024, placed_count=2000, total_students=5000, avg_ctc_lpa=6.0),

    # LPU (id=23)
    PlacementStat(college_id=23, year=2022, placed_count=2500, total_students=4000, avg_ctc_lpa=5.8),
    PlacementStat(college_id=23, year=2023, placed_count=2800, total_students=4000, avg_ctc_lpa=6.5),
    PlacementStat(college_id=23, year=2024, placed_count=3000, total_students=4000, avg_ctc_lpa=7.2),
]

db.add_all(stats)
db.commit()
print(f"✅ Added placement stats for all new colleges")

db.close()
print("\n✅ Seed complete! You now have 23 colleges in CareerLens.")