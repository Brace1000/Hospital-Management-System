import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.routers import auth, patients, pharmacy, billing, reports

# Import all models so SQLAlchemy creates tables
from app.models import user, patient, pharmacy as pharmacy_model, billing as billing_model  # noqa

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hospital Management System", version="1.0.0")

# Read allowed origins from env (comma-separated) or fall back to localhost
raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001"
)
allowed_origins = [o.strip() for o in raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(pharmacy.router)
app.include_router(billing.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {"message": "HMS API is running"}
