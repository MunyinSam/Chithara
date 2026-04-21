# Local Setup (no Docker)

Run the backend and frontend manually without Docker. Useful for development when you want faster reloads or to debug individual services.

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ running locally

---

## 1. Clone the repo

```bash
git clone https://github.com/MunyinSam/Chithara.git
cd Chithara
```

---

## 2. Create the PostgreSQL database

Open a PostgreSQL shell (`psql`) and run:

```sql
CREATE DATABASE chithara;
CREATE USER chithara WITH PASSWORD 'chithara';
GRANT ALL PRIVILEGES ON DATABASE chithara TO chithara;
```

---

## 3. Backend setup

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

| Platform | Command |
|---|---|
| macOS / Linux | `source .venv/bin/activate` |
| Windows PowerShell | `.\.venv\Scripts\Activate.ps1` |
| Windows CMD | `.venv\Scripts\activate.bat` |

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the backend environment file:

```bash
cp .env.example .env
```

Fill in `backend/.env`:

```env
SECRET_KEY=any-long-random-string

SUNO_API_KEY=          # from sunoapi.org
SUNO_PROVIDER=real     # real | mock
NGROK_URL=             # optional — see docs/ngrok.md
SUNO_CALLBACK_URL=     # optional — see docs/ngrok.md

DB_NAME=chithara
DB_USER=chithara
DB_PASSWORD=chithara
DB_HOST=localhost
DB_PORT=5432
```

Run migrations and start the server:

```bash
python manage.py migrate
python manage.py runserver
```

Backend runs at http://127.0.0.1:8000

---

## 4. Frontend setup

Open a new terminal from the repo root:

```bash
cd frontend
npm install
```

Create the frontend environment file:

```bash
cp .env.example .env.local
```

Fill in `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_API_SCHEMA_URL=http://localhost:8000/api/schema/

AUTH_SECRET=           # run: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=      # see docs/google-oauth.md
GOOGLE_CLIENT_SECRET=  # see docs/google-oauth.md
```

Start the development server:

```bash
npm run dev
```

Frontend runs at http://localhost:3000

---

## Using mock mode (no Suno API key needed)

Set `SUNO_PROVIDER=mock` in `backend/.env`. The backend will return pre-recorded MP3 files instead of calling the real API. Useful for testing the UI without spending credits.

```env
SUNO_PROVIDER=mock
```

---

## Ports summary

| Service | URL |
|---|---|
| Django backend | http://127.0.0.1:8000 |
| Next.js frontend | http://localhost:3000 |
| API docs | http://localhost:3000/api-docs |
