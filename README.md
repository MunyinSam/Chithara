# Chithara

Chithara is a full-stack web application for generating AI-powered songs from a prompt, genre, and mood — powered by the [Suno API](https://sunoapi.org).

## Repository Structure

```
backend/
  api/
    controllers/    # Request handlers
    models/         # Django ORM models
    services/       # Suno strategy pattern (real, mock, context)
  config/           # Django project settings, URLs
  manage.py

frontend/
  src/
    app/            # Next.js App Router pages
    components/     # Shared UI components
    services/       # API client functions

docker-compose.yml
```

---

## Quick Start — Docker

The recommended way to run the full stack. Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### 1. Clone

```bash
git clone https://github.com/MunyinSam/Chithara.git
cd Chithara
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in the required values in `.env`:

| Variable | Where to get it |
|---|---|
| `SECRET_KEY` | Any long random string |
| `SUNO_API_KEY` | [sunoapi.org/dashboard](https://sunoapi.org/dashboard) → API Key |
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | See [Google OAuth Setup](docs/google-oauth.md) |
| `GOOGLE_CLIENT_SECRET` | See [Google OAuth Setup](docs/google-oauth.md) |

> **ngrok is optional.** Song generation works via polling without it. If you want Suno to push results instantly, see [ngrok Setup](docs/ngrok.md).

### 3. Start

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| API Docs | http://localhost:3000/api-docs |
| ngrok dashboard | http://localhost:4040 (if NGROK_AUTHTOKEN set) |

---

## Guides

- [Google OAuth Setup](docs/google-oauth.md) — create credentials and configure sign-in
- [ngrok Setup](docs/ngrok.md) — enable Suno push callbacks (optional)
- [Local Setup (no Docker)](docs/local-setup.md) — manual backend + frontend setup
- [Using the App](docs/usage.md) — how to generate songs, manage your library, and share

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/google/` | POST | Sign in / register via Google |
| `/api/songs/` | GET | List your songs |
| `/api/generate/` | POST | Submit a generation job |
| `/api/history/` | GET | Generation history |
| `/api/history/{id}/` | GET | Poll generation status |
| `/api/songs/public/{token}/` | GET | Public song (no auth) |

Full interactive docs available at http://localhost:3000/api-docs
