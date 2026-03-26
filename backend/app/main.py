from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.routers import auth, patients, pharmacy, billing, reports

# Import all models so SQLAlchemy creates tables
from app.models import user, patient, pharmacy as pharmacy_model, billing as billing_model  # noqa

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hospital Management System", version="1.0.0")

# Allow all origins during development to avoid CORS issues across localhost ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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
