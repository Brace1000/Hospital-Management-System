# Hospital Management System (HMS)

A full-stack HMS built with **FastAPI**, **PostgreSQL**, **React**, and **Tailwind CSS**.

## Features
- Role-based authentication (admin, doctor, nurse, pharmacist, receptionist, patient)
- Patient registration & management
- Appointment scheduling
- Pharmacy inventory & prescription dispensing
- Billing & Stripe payment integration
- Reports dashboard (summary, appointments, pharmacy stock)

## Quick Start (Docker)

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your Stripe key if needed
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs

## Local Development

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # edit DATABASE_URL to point to your local Postgres
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure
```
├── backend/
│   ├── app/
│   │   ├── core/        # config, database, security
│   │   ├── models/      # SQLAlchemy models
│   │   ├── routers/     # API endpoints
│   │   ├── schemas/     # Pydantic schemas
│   │   └── main.py
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/       # Dashboard, Patients, Appointments, Pharmacy, Billing, Reports
│       ├── components/  # Layout, Navbar
│       ├── context/     # AuthContext
│       └── api/         # Axios client
└── docker-compose.yml
```

## Default Roles
Register a user with role `admin` to access all reports and features.
