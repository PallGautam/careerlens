from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class College(Base):
    __tablename__ = "colleges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
    campus_type = Column(String)  # "on_campus" or "off_campus"
    created_at = Column(DateTime, server_default=func.now())

    placement_stats = relationship("PlacementStat", back_populates="college")
    alumni = relationship("Alumni", back_populates="college")


class PlacementStat(Base):
    __tablename__ = "placement_stats"

    id = Column(Integer, primary_key=True, index=True)
    college_id = Column(Integer, ForeignKey("colleges.id"))
    year = Column(Integer, nullable=False)
    placed_count = Column(Integer)
    total_students = Column(Integer)
    avg_ctc_lpa = Column(Float)

    college = relationship("College", back_populates="placement_stats")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sector = Column(String)
    avg_package_lpa = Column(Float)
    roles_offered = Column(String)
    website = Column(String)

    alumni_links = relationship("CompanyAlumni", back_populates="company")
    experiences = relationship("Experience", back_populates="company")
    pros_cons = relationship("ProsCons", back_populates="company")


class Alumni(Base):
    __tablename__ = "alumni"

    id = Column(Integer, primary_key=True, index=True)
    college_id = Column(Integer, ForeignKey("colleges.id"))
    name = Column(String, nullable=False)
    batch_year = Column(Integer)
    current_role = Column(String)
    linkedin_url = Column(String)
    photo_url = Column(String)

    college = relationship("College", back_populates="alumni")
    company_links = relationship("CompanyAlumni", back_populates="alumni")
    experiences = relationship("Experience", back_populates="alumni")


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    alumni_id = Column(Integer, ForeignKey("alumni.id"))
    company_id = Column(Integer, ForeignKey("companies.id"))
    stage = Column(String)
    description = Column(Text)
    tips = Column(Text)
    outcome = Column(String)

    alumni = relationship("Alumni", back_populates="experiences")
    company = relationship("Company", back_populates="experiences")


class CompanyAlumni(Base):
    __tablename__ = "company_alumni"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    alumni_id = Column(Integer, ForeignKey("alumni.id"))
    role = Column(String)
    year_joined = Column(Integer)

    company = relationship("Company", back_populates="alumni_links")
    alumni = relationship("Alumni", back_populates="company_links")


class ProsCons(Base):
    __tablename__ = "pros_cons"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    type = Column(String)  # "pro" or "con"
    point = Column(Text)
    category = Column(String)  # "salary", "culture", "growth", etc.

    company = relationship("Company", back_populates="pros_cons")