from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import models
from app.routes import colleges, companies, alumni, compare, feed
from app.routes import predictor
from app.routes import resume

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CareerLens API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(colleges.router)
app.include_router(companies.router)
app.include_router(alumni.router)
app.include_router(compare.router)
app.include_router(feed.router)
app.include_router(predictor.router)
app.include_router(resume.router)

@app.get("/")
def root():
    return {"message": "CareerLens API is running"}