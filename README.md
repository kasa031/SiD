# 🗳️ Polls-Nettside

En interaktiv polls-nettside som kobler folket og politikere sammen gjennom meningsmålinger.

## 🚀 Kom i gang

### Backend Setup

1. Naviger til backend-mappen:
```bash
cd backend
```

2. Installer avhengigheter:
```bash
npm install
```

3. Opprett database (PostgreSQL):
```bash
psql -U postgres -c "CREATE DATABASE polls_db;"
```

4. Kjør migrasjoner:
```bash
psql -U postgres -d polls_db -f ../database/migrations/001_initial_schema.sql
```

5. Start serveren:
```bash
npm run dev
```

Backend kjører på http://localhost:3001

### Frontend Setup

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

Frontend kjører på http://localhost:5173

## 📁 Prosjektstruktur

- `backend/` - Node.js/Express API
- `frontend/` - React applikasjon
- `database/` - PostgreSQL migrasjoner

## 🎨 Design

Nettsiden bruker knalle farger (rødt, grønt, blått) med riktig kontrast for lesbarhet.

## 📝 Funksjoner

- ✅ Autentisering (brukernavn/passord med JWT)
- ✅ Opprette og stemme på polls (maks én stemme per bruker)
- ✅ Kommentarer på polls
- ✅ Politiker-tagging og søk
- ✅ Geografisk søk (by/land)
- ✅ Profilbilder med opplasting
- ✅ Beskyttede ruter (kun innloggede kan opprette polls)
- ✅ Responsivt design
- ✅ Norsk tekst overalt

## 🌐 Deployment

Prosjektet er konfigurert for GitHub Pages deployment.

