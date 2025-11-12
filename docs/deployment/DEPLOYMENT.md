# 🚀 Deployment Guide

## GitHub Pages Setup

### 1. Opprett GitHub Repository

1. Opprett et nytt repository på GitHub (f.eks. `polls-nettside`)
2. Push koden til repositoryet:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ditt-brukernavn/polls-nettside.git
git push -u origin main
```

### 2. Konfigurer GitHub Pages

1. Gå til repository-innstillinger på GitHub
2. Gå til "Pages" i venstre meny
3. Under "Source", velg "GitHub Actions"
4. Workflow vil automatisk kjøre når du pusher til `main` branch

### 3. Oppdater Vite Base Path

I `frontend/vite.config.js`, endre `base` til ditt repository-navn:
```js
base: '/ditt-repository-navn/',
```

Eller for root domain:
```js
base: '/',
```

### 4. Backend Deployment

Backend må deployes separat. Du kan bruke:
- Heroku
- Railway
- Render
- DigitalOcean
- Eller din egen server

Oppdater `frontend/src/services/api.js` med backend URL:
```js
const API_BASE_URL = 'https://din-backend-url.com/api';
```

### 5. Database Setup

Sørg for at database er tilgjengelig for backend. Oppdater `backend/env` med produksjonsdatabase URL.

### 6. Environment Variables

Ikke glem å sette opp environment variables i produksjon:
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `PORT`

## Lokal Testing

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database
```bash
psql -U postgres -d polls_db -f ../database/migrations/001_initial_schema.sql
```

