# ⚡ Quick Start Guide

## Snarvei for å komme i gang

### 1. Database (én gang)
```bash
# Opprett database
psql -U postgres -c "CREATE DATABASE polls_db;"

# Kjør migrasjoner
psql -U postgres -d polls_db -f database/migrations/001_initial_schema.sql
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```
✅ Backend kjører på http://localhost:3001

### 3. Frontend (nytt terminalvindu)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend kjører på http://localhost:5173

### 4. Test
1. Åpne http://localhost:5173
2. Registrer deg
3. Opprett en poll
4. Stem på polls
5. Legg til kommentarer

## API Endpoints

### Autentisering
- `POST /api/auth/register` - Registrer bruker
- `POST /api/auth/login` - Logg inn
- `GET /api/auth/me` - Hent brukerinfo

### Polls
- `GET /api/polls` - Hent alle polls (med søk/filtrering)
- `GET /api/polls/:id` - Hent en poll
- `POST /api/polls` - Opprett poll (krever auth)

### Stemmer
- `POST /api/votes/:pollId` - Stem på poll (krever auth)
- `GET /api/votes/:pollId/status` - Sjekk om bruker har stemt

### Kommentarer
- `GET /api/comments/poll/:pollId` - Hent kommentarer
- `POST /api/comments/poll/:pollId` - Legg til kommentar (krever auth)

### Brukere
- `GET /api/users/:id` - Hent brukerprofil
- `POST /api/users/profile-picture` - Last opp profilbilde (krever auth)

## Troubleshooting

**Database connection error?**
- Sjekk at PostgreSQL kjører
- Verifiser `DATABASE_URL` i `backend/env`

**Port allerede i bruk?**
- Endre `PORT` i `backend/env`
- Eller endre port i `frontend/vite.config.js`

**CORS errors?**
- Sjekk at `FRONTEND_URL` i `backend/env` matcher frontend URL

