# Hospital Management System (HMS)

A full-stack Hospital Management System with **role-based access control**, built with **FastAPI**, **PostgreSQL/SQLite**, **React**, and **Tailwind CSS**.

## Features

### Core Functionality
- ✅ **Role-based authentication** (admin, doctor, nurse, pharmacist, receptionist, patient)
- ✅ **Patient registration & management** with user account linking
- ✅ **Appointment scheduling** (staff can book for patients, patients can self-book)
- ✅ **Doctor management** (admin/receptionist can add doctors)
- ✅ **Pharmacy inventory** with prescription dispensing
- ✅ **Billing & invoicing** with Stripe payment integration
- ✅ **Reports dashboard** (summary, appointments, pharmacy stock)

### Role-Based Permissions

| Feature | Patient | Doctor | Nurse | Pharmacist | Receptionist | Admin |
|---------|---------|--------|-------|------------|--------------|-------|
| View own appointments | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Book own appointment | ✅ | — | — | — | — | — |
| Cancel own appointment | ✅ | — | — | — | — | — |
| Book appointment for others | — | ✅ | — | — | ✅ | ✅ |
| Manage appointment status | — | ✅ | — | — | ✅ | ✅ |
| View patients | — | ✅ | ✅ | — | ✅ | ✅ |
| Add/edit patients | — | ✅ | ✅ | — | ✅ | ✅ |
| Add doctors | — | — | — | — | ✅ | ✅ |
| View pharmacy | — | ✅ | — | ✅ | — | ✅ |
| Add/edit drugs | — | — | — | ✅ | — | ✅ |
| Create prescriptions | — | ✅ | — | — | — | ✅ |
| Dispense prescriptions | — | — | — | ✅ | — | ✅ |
| View own invoices | ✅ | — | — | — | — | — |
| Pay invoices | ✅ | — | — | — | ✅ | ✅ |
| Create invoices | — | — | — | — | ✅ | ✅ |
| View reports | — | ✅ | — | ✅ | ✅ | ✅ |
| View full dashboard | — | — | — | — | — | ✅ |

## Quick Start (Local Development)

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env if needed (default uses SQLite)
uvicorn app.main:app --reload
```

Backend will run on **http://localhost:8000**
- API docs: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on **http://localhost:3000** (or port shown in terminal)

## Testing the System

### 1. Register Users

Register users with different roles:

```bash
# Admin user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@hospital.com","password":"admin123","role":"admin"}'

# Receptionist
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"receptionist","email":"receptionist@hospital.com","password":"recep123","role":"receptionist"}'

# Doctor
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"doctor","email":"doctor@hospital.com","password":"doc123","role":"doctor"}'

# Pharmacist
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"pharmacist","email":"pharmacist@hospital.com","password":"pharm123","role":"pharmacist"}'

# Patient
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"patient1","email":"patient1@example.com","password":"patient123","role":"patient"}'
```

### 2. Login and Test Workflows

#### As Admin/Receptionist:
1. Login with admin credentials
2. Go to **Appointments** → Add a doctor (e.g., Dr. Smith, Cardiology)
3. Go to **Patients** → Add a patient
   - Fill in patient details
   - **Important**: Link to User Account by entering the user ID (check Users table or register a patient user first)
4. Book an appointment for the patient
5. Go to **Pharmacy** → Add drugs to inventory
6. Go to **Billing** → Create an invoice for a patient
7. View **Reports** and **Dashboard**

#### As Patient:
1. Login with patient credentials
2. **Dashboard** shows your appointments and invoices
3. Go to **Appointments**:
   - If your account is linked to a patient profile, you can book appointments
   - If not linked, you'll see a message to contact a receptionist
   - Cancel your own scheduled appointments
4. Go to **Billing** → View and pay your invoices

#### As Doctor:
1. Login with doctor credentials
2. View and manage appointments
3. Add/edit patient records
4. Create prescriptions
5. View reports

#### As Pharmacist:
1. Login with pharmacist credentials
2. Manage drug inventory
3. Dispense prescriptions
4. View pharmacy stock reports

### 3. Linking Patient Accounts

For patients to self-book appointments:

1. Register a user with role `patient`
2. Login as admin/receptionist
3. Go to **Patients** → Add/Edit patient
4. Enter the **User ID** in the "Link to User Account" field
5. Now that patient can login and book their own appointments

## Docker Deployment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your Stripe key if needed
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── core/           # config, database, security
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API endpoints (auth, patients, pharmacy, billing, reports)
│   │   ├── schemas/        # Pydantic schemas
│   │   └── main.py         # FastAPI app
│   ├── requirements.txt
│   └── .env
├── frontend/
│   └── src/
│       ├── pages/          # Dashboard, Patients, Appointments, Pharmacy, Billing, Reports
│       ├── components/     # Layout, Navbar
│       ├── context/        # AuthContext
│       └── api/            # Axios client
└── docker-compose.yml
```

## Key Technical Decisions

### Security
- **bcrypt** for password hashing (replaced passlib due to compatibility issues)
- **JWT tokens** for authentication
- **Role-based access control** on all endpoints
- **CORS** configured for localhost development

### Database
- SQLite by default (easy setup)
- PostgreSQL support via DATABASE_URL env variable
- User-Patient linking via `user_id` foreign key

### Frontend
- **React Router** for navigation
- **TanStack Query** for data fetching and caching
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- Role-based UI rendering (hide features based on user role)

## Common Issues & Solutions

### Issue: "Address already in use" when starting backend
```bash
pkill -f "uvicorn app.main"
# Then restart
uvicorn app.main:app --reload
```

### Issue: Patient can't book appointments
**Solution**: The patient user must be linked to a patient profile:
1. Login as admin/receptionist
2. Go to Patients → Edit the patient
3. Enter the user ID in "Link to User Account"

### Issue: No doctors available for appointments
**Solution**: Login as admin/receptionist and add doctors via Appointments page

### Issue: CORS errors
**Solution**: Check that `frontend/.env` has `VITE_API_URL=http://localhost:8000`

## Environment Variables

### Backend (.env)
```
DATABASE_URL=sqlite:///./hms.db
SECRET_KEY=your-secret-key-here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## License

MIT

## Support

For issues or questions, please check the API documentation at `/docs` or review the role-based permissions table above.
