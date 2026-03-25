from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.patient import Patient, Doctor, Appointment
from app.schemas.patient import PatientCreate, PatientOut, DoctorCreate, DoctorOut, AppointmentCreate, AppointmentOut

router = APIRouter(tags=["patients"])

# --- Patients ---
@router.post("/patients", response_model=PatientOut)
def create_patient(data: PatientCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = Patient(**data.model_dump())
    db.add(p); db.commit(); db.refresh(p)
    return p

@router.get("/patients", response_model=List[PatientOut])
def list_patients(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Patient).all()

@router.get("/patients/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p: raise HTTPException(404, "Patient not found")
    return p

@router.put("/patients/{patient_id}", response_model=PatientOut)
def update_patient(patient_id: int, data: PatientCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p: raise HTTPException(404, "Patient not found")
    for k, v in data.model_dump().items(): setattr(p, k, v)
    db.commit(); db.refresh(p)
    return p

# --- Doctors ---
@router.post("/doctors", response_model=DoctorOut)
def create_doctor(data: DoctorCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    d = Doctor(**data.model_dump())
    db.add(d); db.commit(); db.refresh(d)
    return d

@router.get("/doctors", response_model=List[DoctorOut])
def list_doctors(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Doctor).all()

# --- Appointments ---
@router.post("/appointments", response_model=AppointmentOut)
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    a = Appointment(**data.model_dump())
    db.add(a); db.commit(); db.refresh(a)
    return a

@router.get("/appointments", response_model=List[AppointmentOut])
def list_appointments(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Appointment).all()

@router.put("/appointments/{appt_id}/status")
def update_appointment_status(appt_id: int, status: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    a = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if not a: raise HTTPException(404, "Appointment not found")
    a.status = status
    db.commit()
    return {"message": "Status updated"}
