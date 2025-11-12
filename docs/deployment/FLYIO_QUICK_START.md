# ⚡ Fly.io Quick Start - 10 Minutter

## 📋 Steg-for-steg (følg nøyaktig)

### Steg 1: Installer Fly CLI

**Windows PowerShell (kjør som Administrator):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Etter installasjon, restart PowerShell og verifiser:**
```powershell
flyctl version
```

---

### Steg 2: Login til Fly.io

```powershell
flyctl auth login
```

Dette åpner nettleseren. Logg inn med GitHub.

---

### Steg 3: Naviger til backend og initialiser

```powershell
cd backend
flyctl launch
```

**Svar på spørsmålene:**
- **App name:** `sid-backend` (eller hva du vil)
- **Region:** Velg `iad` (Washington DC)
- **PostgreSQL:** **JA** (trykk Enter)
- **Redis:** Nei (trykk `n`)
- **Deploy now:** Nei (trykk `n` - vi setter opp secrets først)

---

### Steg 4: Sett secrets (environment variables)

```powershell
flyctl secrets set JWT_SECRET=superhemmelig_jwt_secret_key_2026_change_in_production
flyctl secrets set FRONTEND_URL=https://kasa031.github.io
flyctl secrets set OPENROUTER_API_KEY=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
```

**Viktig:** `DATABASE_URL` settes automatisk - ikke sett den manuelt!

---

### Steg 5: Deploy backend

```powershell
flyctl deploy
```

Vent 2-3 minutter mens Fly.io bygger og deployer.

---

### Steg 6: Kjør database migrations

```powershell
flyctl ssh console -C "cd /app && npm run migrate"
```

Eller hvis det ikke fungerer:
```powershell
flyctl postgres connect -a sid-backend-db
# Kopier innholdet fra database/migrations/001_initial_schema.sql
# Og 002_add_categories_and_badges.sql
```

---

### Steg 7: Få backend URL

```powershell
flyctl status
```

Eller sjekk i dashboard: https://fly.io/dashboard

**Kopier URL-en** (f.eks. `https://sid-backend.fly.dev`)

---

### Steg 8: Oppdater frontend

1. Åpne `frontend/src/services/api.js`
2. Erstatt `your-backend-url.railway.app` med din Fly.io URL
3. Deploy:
```powershell
cd ..\frontend
npm run deploy
```

---

### Steg 9: Test!

Åpne på mobil: `https://kasa031.github.io/SiD/`

🎉 Alt fungerer!

---

## ❓ Hjelp

**Hvis noe feiler:**
- Sjekk logs: `flyctl logs`
- Sjekk status: `flyctl status`
- Se full guide: `FLYIO_SETUP.md` (i samme mappe)

