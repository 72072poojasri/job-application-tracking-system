# Job Application Tracking System (ATS) API

A robust backend system for managing complex job application workflows with state machine validation, role-based access control (RBAC), and asynchronous email notifications.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Data Models](#data-models)
- [Workflow State Machine](#workflow-state-machine)
- [API Endpoints](#api-endpoints)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Setup and Installation](#setup-and-installation)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Demo Video](#demo-video)

## Project Overview

This Job Application Tracking System (ATS) provides a comprehensive backend API for managing recruitment workflows. The system handles:

- Multi-role user management (Candidate, Recruiter, Hiring Manager)
- Job postings and management
- Application submissions and status tracking
- Workflow state transitions with validation
- Asynchronous email notifications for key events
- Complete audit trail of application changes
- Role-based access control for secure operations

## Architecture

The system follows a **layered architecture** pattern:

```
┌─────────────────────────────────────┐
│      API Layer (FastAPI/Django)     │
│   - Route Handlers                  │
│   - Request Validation              │
│   - Response Formatting             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Service Layer                  │
│   - Business Logic                  │
│   - State Machine Validation        │
│   - Authorization Checks            │
│   - Email Notification Dispatching  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Data Access Layer              │
│   - Database Queries                │
│   - Transaction Management          │
│   - Audit Logging                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      External Services              │
│   - Email Service (SendGrid)        │
│   - Message Queue (RabbitMQ/Redis)  │
│   - Database (PostgreSQL/MySQL)     │
└─────────────────────────────────────┘
```

## Data Models

### User
- **id**: Unique identifier
- **email**: User email (unique)
- **password_hash**: Hashed password
- **role**: One of `candidate`, `recruiter`, `hiring_manager`
- **created_at**: Timestamp

### Company
- **id**: Unique identifier
- **name**: Company name
- **description**: Company description
- **created_at**: Timestamp

### Job
- **id**: Unique identifier
- **company_id**: Reference to Company
- **title**: Job title
- **description**: Job description
- **status**: `open` or `closed`
- **created_by**: Reference to User (recruiter)
- **created_at**: Timestamp

### Application
- **id**: Unique identifier
- **job_id**: Reference to Job
- **candidate_id**: Reference to User (candidate)
- **stage**: Current workflow stage
- **created_at**: Timestamp
- **updated_at**: Timestamp

### ApplicationHistory
- **id**: Unique identifier
- **application_id**: Reference to Application
- **previous_stage**: Previous workflow stage
- **new_stage**: New workflow stage
- **changed_by**: Reference to User who made change
- **reason**: Optional reason for change
- **changed_at**: Timestamp

## Workflow State Machine

The application follows a strictly defined workflow with valid state transitions:

```
APPLIED → SCREENING → INTERVIEW → OFFER → HIRED
   ↓ (can be rejected from any state)
 REJECTED
```

### Valid State Transitions
- **Applied** → Screening, Rejected
- **Screening** → Interview, Rejected
- **Interview** → Offer, Rejected
- **Offer** → Hired, Rejected
- **Rejected** → (Terminal state)
- **Hired** → (Terminal state)

### State Transition Rules
- Only recruiters can initiate transitions
- Invalid transitions are blocked
- Each transition is logged in ApplicationHistory
- Email notifications are sent on each transition

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Jobs
- `GET /api/jobs` - List all jobs (with filtering)
- `POST /api/jobs` - Create job (recruiter only)
- `GET /api/jobs/{id}` - Get job details
- `PUT /api/jobs/{id}` - Update job (recruiter only)
- `DELETE /api/jobs/{id}` - Delete job (recruiter only)

### Applications
- `POST /api/applications` - Submit application (candidate)
- `GET /api/applications` - List applications (based on role)
- `GET /api/applications/{id}` - Get application details
- `PUT /api/applications/{id}/stage` - Update application stage (recruiter)
- `GET /api/applications/{id}/history` - Get application history

### Candidates
- `GET /api/candidates/my-applications` - List own applications (candidate)

## Role-Based Access Control (RBAC)

### RBAC Matrix

| Action | Candidate | Recruiter | Hiring Manager |
|--------|-----------|-----------|----------------|
| Apply for Job | ✓ | ✗ | ✗ |
| Create Job | ✗ | ✓ | ✗ |
| Update Job Status | ✗ | ✓ | ✗ |
| View Own Applications | ✓ | ✗ | ✗ |
| View All Applications | ✗ | ✓ | ✓ |
| Change Application Stage | ✗ | ✓ | ✓ |
| View Application History | ✓* | ✓ | ✓ |

*Candidates can only view their own applications

## Setup and Installation

### Prerequisites
- Python 3.9+
- PostgreSQL/MySQL
- Redis (for Celery)
- RabbitMQ (optional, for message queue)
- SendGrid API key

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/72072poojasri/job-application-tracking-system.git
cd job-application-tracking-system
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run database migrations:
```bash
python manage.py migrate
```

6. Start the development server:
```bash
python manage.py runserver
```

7. Start Celery worker (for async tasks):
```bash
celery -A project worker -l info
```

## Running Tests

```bash
# Run all tests
python manage.py test

# Run specific test file
python manage.py test tests.test_applications

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

## API Documentation

API documentation is available at `/docs` when running the server.

Key endpoints documented with examples:
- Authentication flows
- Application submission process
- Stage transition workflows
- Email notification triggers

## Asynchronous Email Notifications

Email notifications are triggered asynchronously using Celery:

### Email Events
- **Application Submitted**: Sent to candidate and recruiter
- **Stage Changed**: Sent to candidate with new status
- **Application Rejected**: Sent to candidate with reason
- **Application Hired**: Sent to candidate with offer details

### Email Service
- Provider: SendGrid
- Queue: Celery + Redis
- Retry Policy: 3 retries with exponential backoff

## Postman Collection

A Postman collection is available for testing all API endpoints:
- File: `postman_collection.json`
- Instructions for import in Postman documentation

## Video Demonstration

Watch the demo video at: [Link to demo]

Demonstration includes:
1. User registration and login
2. Job posting creation
3. Application submission
4. Application stage transitions
5. Email notification triggers
6. Application history audit trail

## Database Schema

See `DATABASE_SCHEMA.md` for detailed ER diagram and table definitions.

## Project Structure

```
job-application-tracking-system/
├── app/
│   ├── models.py          # Database models
│   ├── views.py           # API endpoints
│   ├── serializers.py     # Request/response serializers
│   ├── services.py        # Business logic
│   ├── permissions.py     # RBAC implementation
│   └── tasks.py           # Celery tasks
├── tests/
│   ├── test_models.py
│   ├── test_api.py
│   ├── test_workflow.py
│   └── test_permissions.py
├── config/
│   ├── settings.py        # Django settings
│   ├── urls.py            # URL routing
│   └── celery.py          # Celery configuration
├── requirements.txt
├── manage.py
└── README.md
```

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key
SENDGRID_API_KEY=your-sendgrid-key
REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1
DEBUG=True
```

## License

MIT License - See LICENSE file for details

## Contact

For questions or issues, please open an issue on GitHub.
