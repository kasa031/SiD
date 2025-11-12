# 🗳️ SiD - Demokrati i Praksis

En interaktiv polls-nettside som kobler folket og politikere sammen gjennom meningsmålinger og dialog.

## 🚀 Kom i gang

### Forutsetninger
- Node.js (v18 eller nyere)
- PostgreSQL
- npm eller yarn

### Rask oppstart

1. **Database Setup:**
```bash
psql -U postgres -c "CREATE DATABASE polls_db;"
psql -U postgres -d polls_db -f database/migrations/001_initial_schema.sql
psql -U postgres -d polls_db -f database/migrations/002_add_categories_and_badges.sql
```

2. **Backend:**
```bash
cd backend
npm install
npm run dev
```
Backend kjører på http://localhost:3001

3. **Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend kjører på http://localhost:5173

📖 **For detaljert setup, se [docs/setup/QUICKSTART.md](docs/setup/QUICKSTART.md)**

## 📁 Prosjektstruktur

```
SiD/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, security
│   │   └── utils/       # Database, validation
│   └── env              # Environment variables
├── frontend/            # React applikasjon
│   ├── src/
│   │   ├── pages/      # React sider
│   │   ├── components/ # React komponenter
│   │   ├── services/   # API service
│   │   └── utils/      # Hjelpefunksjoner
│   └── public/         # Statiske filer
├── database/            # PostgreSQL migrasjoner
│   └── migrations/
├── docs/               # Dokumentasjon
│   ├── deployment/     # Deployment guider
│   ├── security/      # Sikkerhetsdokumentasjon
│   ├── setup/         # Oppsettguider
│   └── development/   # Utviklingsdokumentasjon
└── Bilder/            # Bilder for frontend
```

## 🎨 Funksjoner

- ✅ **Autentisering** - Brukernavn/passord med JWT
- ✅ **Polls** - Opprett, vis og stem på polls
- ✅ **Stemmer** - Maks én stemme per bruker per poll
- ✅ **Kommentarer** - Diskuter polls
- ✅ **Politiker-tagging** - Tag politikere i polls
- ✅ **Søk** - Søk etter polls, politikere, steder
- ✅ **Geografisk filtrering** - By eller hele landet
- ✅ **Profilbilder** - Last opp og vis profilbilder
- ✅ **Badges** - Tjen badges for aktivitet
- ✅ **Statistikk** - Se oversikt over aktivitet
- ✅ **Responsivt design** - Fungerer på alle enheter

## 🔧 Teknologi

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Deployment:** GitHub Pages (frontend), Railway/Fly.io (backend)

## 📚 Dokumentasjon

All dokumentasjon er organisert i `docs/` mappen:

- **[docs/README.md](docs/README.md)** - Oversikt over all dokumentasjon
- **[docs/setup/](docs/setup/)** - Oppsettguider
- **[docs/deployment/](docs/deployment/)** - Deployment guider
- **[docs/security/](docs/security/)** - Sikkerhetsdokumentasjon
- **[docs/development/](docs/development/)** - Utviklingsdokumentasjon

## 🌐 Deployment

- **Frontend:** Deployet til GitHub Pages
- **Backend:** Konfigurert for Railway/Fly.io

📖 **Se [docs/deployment/DEPLOYMENT.md](docs/deployment/DEPLOYMENT.md) for detaljer**

## 📋 Status

- ✅ **Kjernefunksjonalitet:** 100% ferdig
- ✅ **Frontend:** Deployet til GitHub Pages
- ⏳ **Backend:** Klar for deployment

Se [TODO_SAMLET.md](TODO_SAMLET.md) for gjenværende oppgaver.

## 🤝 Bidrag

Dette er et personlig prosjekt, men forslag og forbedringer er velkomne!

## 📝 Lisens

Privat prosjekt.
