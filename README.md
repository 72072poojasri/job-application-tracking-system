# Job Application Tracking System (ATS) – Backend

## 📌 Project Overview
This project is a backend implementation of a Job Application Tracking System (ATS) designed to model real-world recruitment workflows.
It goes beyond simple CRUD operations by enforcing application state transitions, role-based access control (RBAC), and maintaining an audit trail for compliance and traceability.

The system demonstrates backend engineering concepts such as authentication, authorization, workflow enforcement, and clean API design.

---

## 🎯 Objective
- Build a secure and scalable backend for managing job applications
- Enforce valid hiring workflow transitions using a state machine
- Implement Role-Based Access Control (RBAC)
- Maintain a complete audit trail of application state changes
- Design APIs aligned with real-world business logic

---

## 🏗️ Architecture Overview
The application follows a layered backend architecture to ensure clean separation of concerns.

### Technology Stack
- Node.js + Express.js – REST API framework
- MongoDB + Mongoose – Database and ODM
- JWT Authentication – Secure user sessions
- RBAC Middleware – Authorization control
- State Machine Logic – Application workflow enforcement

### Layered Design
- Routes / Controllers – Handle HTTP requests and responses
- Services – Business logic (workflow, validation, rules)
- Models – Database schemas
- Queues / Workers – Background processing

---

## 🔄 Application Workflow (State Machine)
Applications follow a strict, predefined workflow:

Applied → Screening → Interview → Offer → Hired

- An application can move to Rejected from any stage
- Invalid transitions (e.g., Applied → Offer) are blocked
- All state transitions are validated in a dedicated service

---

## 👥 Data Models

### User
- Roles: candidate, recruiter, hiring_manager
- Authentication handled using JWT

### Company
- Represents organizations posting jobs
- Recruiters are associated with a company

### Job
- Job postings created by recruiters
- Status: open or closed

### Application
- Represents a candidate’s application to a job
- Tracks current stage in the hiring workflow

### ApplicationHistory
- Audit log of all application stage changes
- Records who changed what and when

---

## 🔐 Role-Based Access Control (RBAC)

| Action | Candidate | Recruiter | Hiring Manager |
|------|-----------|-----------|----------------|
| Register / Login | ✅ | ✅ | ✅ |
| Create Job | ❌ | ✅ | ❌ |
| Update / Delete Job | ❌ | ✅ | ❌ |
| Apply for Job | ✅ | ❌ | ❌ |
| View Job Applications | ❌ | ✅ | ⚠️ Optional |
| Update Application Stage | ❌ | ✅ | ❌ |
| View Own Applications | ✅ | ❌ | ❌ |

All endpoints are protected based on the authenticated user’s role.

---

## 📡 API Features

### Authentication
- User registration
- User login with JWT token

### Jobs
- Recruiters can create, update, delete jobs
- All users can view jobs

### Applications
- Candidates can apply for jobs
- Recruiters can update application stages
- Candidates can view their own applications
- Recruiters can list applications per job with stage filtering

---

## 📧 Asynchronous Email Notifications
The system is designed with an asynchronous, queue-based architecture to handle email notifications without blocking API responses.

- Email events are dispatched to a background worker process
- Notifications are triggered for:
  - Successful job application submission
  - Application stage updates

For the scope of this assignment, email delivery is simulated.
The architecture allows easy integration with real message queues (Redis/RabbitMQ)
and email providers (SendGrid, SMTP) without modifying core business logic.

---

## 🗂️ Database Design (ERD – Logical View)

User ───< Job  
User ───< Application >─── Job  
Application ───< ApplicationHistory  

---

## ⚙️ Environment Variables
All sensitive configuration is managed using environment variables:

PORT  
MONGO_URI  
JWT_SECRET  

---

## ✅ Expected Outcomes Achieved
- Fully functional REST API with role-based access
- Correct implementation of hiring workflow state machine
- Audit trail for all application stage changes
- Non-blocking, asynchronous notification design
- Clean, maintainable backend architecture
- Clear documentation explaining design decisions

---

## 🏁 Conclusion
This project demonstrates a real-world backend system that prioritizes correctness,
scalability, and maintainability. It showcases backend engineering skills beyond CRUD,
with a focus on workflow enforcement, RBAC, and clean system design.
