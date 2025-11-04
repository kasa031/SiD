# 📋 Setup Guide

## Forutsetninger

- Node.js (v18 eller nyere)
- PostgreSQL
- npm eller yarn

## Steg 1: Database Setup

1. Opprett database:
```bash
psql -U postgres -c "CREATE DATABASE polls_db;"
```

2. Kjør migrasjoner:
```bash
psql -U postgres -d polls_db -f database/migrations/001_initial_schema.sql
```

## Steg 2: Backend Setup

1. Naviger til backend-mappen:
```bash
cd backend
```

2. Installer avhengigheter:
```bash
npm install
```

3. Konfigurer environment variables i `backend/env`:
   - Sjekk at `DATABASE_URL` er riktig
   - `JWT_SECRET` er allerede satt
   - `PORT` er satt til 3001

4. Start backend serveren:
```bash
npm run dev
```

Backend kjører nå på http://localhost:3001

## Steg 3: Frontend Setup

1. Naviger til frontend-mappen:
```bash
cd frontend
```

2. Installer avhengigheter:
```bash
npm install
```

3. Start utviklingsserveren:
```bash
npm run dev
```

Frontend kjører nå på http://localhost:5173

## Steg 4: Test

1. Åpne http://localhost:5173 i nettleseren
2. Registrer en ny bruker
3. Opprett en poll
4. Test funksjonalitet

## Troubleshooting

### Database connection error
- Sjekk at PostgreSQL kjører
- Verifiser `DATABASE_URL` i `backend/env`
- Sjekk at database `polls_db` eksisterer

### Port already in use
- Endre `PORT` i `backend/env`
- Eller endre port i `frontend/vite.config.js`

### CORS errors
- Sjekk at `FRONTEND_URL` i `backend/env` matcher frontend URL
- Sjekk at backend kjører på riktig port

