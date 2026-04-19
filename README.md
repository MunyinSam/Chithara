# Chithara

Chithara is a full-stack web application for generating AI-powered songs based on a user prompt, genre, and mood — powered by the Suno API.

## Repository Structure

```
backend/          # Django REST Framework API
  api/            # Models, serializers, viewsets, services
  backend/        # Django project settings and root URLs
  manage.py

frontend/         # Next.js 16 (App Router)
  src/app/        # Pages
  src/components/ # Shared UI components

docker-compose.yml
```

---

## Option A — Docker (Recommended)

The easiest way to run the full stack. Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### 1. Clone the repo

```bash
git clone https://github.com/MunyinSam/Chithara.git
cd Chithara
```

### 2. Create the root `.env` file

Copy the example and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```env
SECRET_KEY=             # any long random string
SUNO_API_KEY=           # from sunoapi.org — see Suno API Setup below
NGROK_URL=              # your ngrok https URL — see ngrok Setup below
SUNO_CALLBACK_URL=      # your ngrok URL + /api/generate/callback/

AUTH_SECRET=        # any long random string (run: openssl rand -base64 32)
GOOGLE_CLIENT_ID=       # from Google Cloud Console — see Google OAuth Setup below
GOOGLE_CLIENT_SECRET=   # from Google Cloud Console — see Google OAuth Setup below

# These defaults work as-is, no changes needed
DB_NAME=chithara
DB_USER=chithara
DB_PASSWORD=chithara
```

> **ngrok is required** — Suno needs a public URL to send a callback when your song finishes generating. See the ngrok Setup section below before starting.

### 3. Start ngrok

In a separate terminal, tunnel to port 8000 (where the backend will run):

```bash
ngrok http 8000
```

Copy the `https://` URL and update `NGROK_URL` and `SUNO_CALLBACK_URL` in your `.env`.

### 4. Start everything

```bash
docker compose up --build
```

This will:
- Start a PostgreSQL database
- Run Django migrations automatically
- Start the Django backend on http://localhost:8000
- Start the Next.js frontend on http://localhost:3000

---

## Option B — Manual Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ running locally

### 1. Clone the repo

```bash
git clone https://github.com/MunyinSam/Chithara.git
cd Chithara
```

### 2. Create the PostgreSQL database

```sql
CREATE DATABASE chithara;
CREATE USER chithara WITH PASSWORD 'chithara';
GRANT ALL PRIVILEGES ON DATABASE chithara TO chithara;
```

### 3. Backend setup

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

- macOS/Linux: `source .venv/bin/activate`
- Windows PowerShell: `.\.venv\Scripts\Activate.ps1`
- Windows CMD: `.venv\Scripts\activate.bat`

```bash
pip install -r requirements.txt
```

Create `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Fill in the values:

```env
SUNO_API_KEY=           # from sunoapi.org — see Suno API Setup below
NGROK_URL=              # your ngrok https URL — see ngrok Setup below
SUNO_CALLBACK_URL=      # your ngrok URL + /api/generate/callback/

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

### 4. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

Fill in the values:

```env
NEXT_PUBLIC_API_SCHEMA_URL=http://localhost:8000/api/schema/
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

AUTH_SECRET=            # any long random string (run: openssl rand -base64 32)
GOOGLE_CLIENT_ID=       # from Google Cloud Console — see Google OAuth Setup below
GOOGLE_CLIENT_SECRET=   # from Google Cloud Console — see Google OAuth Setup below
```

```bash
npm run dev
```

Frontend runs at http://localhost:3000

> If you see a Tailwind error, run: `npm i --save-dev @types/swagger-ui-react`

---

## Suno API Setup

Chithara uses [sunoapi.org](https://sunoapi.org) as the Suno API provider.

1. Go to [sunoapi.org/dashboard](https://sunoapi.org/dashboard) and sign in
2. Click **API Key** in the top-right corner
3. Generate a key and copy it into `SUNO_API_KEY` in your `.env`

> Free accounts come with a small credit balance (enough to generate 3–4 songs to test with).

---

## ngrok Setup (for song generation callbacks)

Suno needs a public URL to notify your local backend when a song finishes generating. ngrok creates a temporary public tunnel to your local machine.

1. Download and install [ngrok](https://ngrok.com/download)
2. Sign up for a free account and connect your auth token (one-time setup):
   ```bash
   ngrok config add-authtoken <your-token>
   ```
3. Start a tunnel to the backend port:
   ```bash
   ngrok http 8000
   ```
4. Copy the `https://` URL ngrok gives you (e.g. `https://xxxx-xx-xx.ngrok-free.app`)
5. Set these two variables in your `.env`:
   ```
   NGROK_URL=https://xxxx-xx-xx.ngrok-free.app
   SUNO_CALLBACK_URL=https://xxxx-xx-xx.ngrok-free.app/api/generate/callback/
   ```

> You need to update these values each time you restart ngrok, as the URL changes every session.

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:3000` to Authorised JavaScript origins
4. Add `http://localhost:3000/api/auth/callback/google` to Authorised redirect URIs
5. Copy the Client ID and Client Secret into your `.env`

---

## API Reference

| Endpoint | Description |
|---|---|
| `POST /api/auth/google/` | Google OAuth login / register |
| `GET /api/songs/` | List user's songs |
| `POST /api/generate/` | Submit a song generation job |
| `GET /api/history/` | Generation history |
| `GET /api/songs/public/{token}/` | Public song (no auth) |

Full interactive docs: http://localhost:3000/api-docs
