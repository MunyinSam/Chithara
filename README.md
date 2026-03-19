# Chithara

Chithara is a full-stack web application for generating AI-powered songs based on a user prompt, genre, and mood.

## Repository Structure

```
backend/
	appname/          # Django app (models, serializers, viewsets, routes)
	backend/          # Django project settings and root URLs
	manage.py

frontend/
	src/app/          # Next.js app router pages
	src/components/   # Shared UI components
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MunyinSam/Chithara.git
cd Chithara
```

### 2. Backend Setup (Django)

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

- Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

- Windows CMD:

```bat
.venv\Scripts\activate.bat
```

- macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies and run the server:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at http://127.0.0.1:8000

### 3. Frontend Setup (Next.js)

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:3000

*Note If the frontend has an error regarding tailwindcss
try running
```
npm i --save-dev @types/swagger-ui-react
```

## API Overview

The backend exposes RESTful CRUD endpoints using Django REST Framework routers.

- Users: /api/users/
- Songs: /api/songs/
- Generation History: /api/history/

## API Documentation

- OpenAPI schema: http://127.0.0.1:8000/api/schema/
- Swagger UI page (frontend): http://localhost:3000/api-docs
