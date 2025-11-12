# 🚀 Fly.io Setup Guide - SiD Backend

## ✅ Hva du får:
- ✅ 100% GRATIS (ingen credits nødvendig)
- ✅ Ingen sleep (backend kjører alltid)
- ✅ Umiddelbar respons
- ✅ PostgreSQL database inkludert
- ✅ Automatisk deploy fra GitHub

---

## 📋 Steg 1: Installer Fly CLI (2 minutter)

### Windows (PowerShell):
```powershell
# Installer Fly CLI
iwr https://fly.io/install.ps1 -useb | iex
```

### Mac/Linux:
```bash
curl -L https://fly.io/install.sh | sh
```

### Verifiser installasjon:
```bash
flyctl version
```

---

## 📋 Steg 2: Login til Fly.io (1 minutt)

```bash
flyctl auth login
```

Dette åpner nettleseren din. Logg inn med:
- GitHub (anbefalt)
- Eller e-post

---

## 📋 Steg 3: Deploy backend (5 minutter)

### 3.1 Naviger til backend mappen:
```bash
cd backend
```

### 3.2 Initialiser Fly.io app:
```bash
flyctl launch
```

**Svar på spørsmålene:**
- **App name:** `sid-backend` (eller hva du vil)
- **Region:** Velg `iad` (Washington DC - nærmest Norge)
- **PostgreSQL:** **JA** (trykk Enter for å opprette database)
- **Redis:** Nei (trykk n)
- **Deploy now:** Nei (trykk n - vi setter opp env vars først)

---

## 📋 Steg 4: Sett environment variables (2 minutter)

```bash
flyctl secrets set JWT_SECRET=superhemmelig_jwt_secret_key_2026_change_in_production
flyctl secrets set FRONTEND_URL=https://kasa031.github.io
flyctl secrets set OPENROUTER_API_KEY=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
```

**Viktig:** 
- `DATABASE_URL` settes automatisk av Fly.io når du oppretter PostgreSQL
- Du trenger ikke sette den manuelt!

---

## 📋 Steg 5: Kjør database migrations (2 minutter)

### Metode 1: Via Fly CLI (anbefalt)
```bash
# Kjør migrations direkte på Fly.io
flyctl ssh console -C "npm run migrate"
```

### Metode 2: Lokalt (hvis du har DATABASE_URL)
```bash
# Få DATABASE_URL fra Fly.io
flyctl postgres connect -a sid-backend-db

# Eller sett lokalt og kjør:
export DATABASE_URL="postgresql://..."
cd backend
npm run migrate
```

---

## 📋 Steg 6: Deploy backend (2 minutter)

```bash
flyctl deploy
```

Dette tar 2-3 minutter. Fly.io vil:
- Bygge backend
- Deploye til produksjon
- Gi deg en URL

---

## 📋 Steg 7: Få backend URL (30 sekunder)

```bash
flyctl status
```

Eller sjekk i Fly.io dashboard:
- Gå til: https://fly.io/dashboard
- Klikk på `sid-backend` app
- Se "Hostname" → Dette er din backend URL!

**Eksempel:** `https://sid-backend.fly.dev`

---

## 📋 Steg 8: Oppdater frontend API URL (1 minutt)

1. Åpne `frontend/src/services/api.js`
2. Erstatt `your-backend-url.railway.app` med din Fly.io URL:

```javascript
// I produksjon, bruk Fly.io URL
if (import.meta.env.PROD) {
  return 'https://sid-backend.fly.dev/api';  // ← Din Fly.io URL
}
```

3. Deploy frontend:
```bash
cd frontend
npm run deploy
```

---

## 📋 Steg 9: Test! (1 minutt)

1. Vent 1-2 minutter
2. Åpne på mobil: `https://kasa031.github.io/SiD/`
3. Test innlogging, opprett poll, osv.
4. 🎉 Alt fungerer!

---

## 🔧 Troubleshooting

### Problem: "flyctl: command not found"
**Løsning:** Installer Fly CLI (se Steg 1)

### Problem: "App already exists"
**Løsning:** 
```bash
flyctl apps list
# Velg et annet navn, eller slett eksisterende app
```

### Problem: Database migrations feiler
**Løsning:**
```bash
# Sjekk at DATABASE_URL er satt
flyctl secrets list

# Kjør migrations manuelt
flyctl ssh console -C "cd /app && npm run migrate"
```

### Problem: Backend starter ikke
**Løsning:**
```bash
# Sjekk logs
flyctl logs

# Sjekk status
flyctl status
```

---

## ✅ Checklist

- [ ] Fly CLI installert
- [ ] Logget inn på Fly.io
- [ ] App initialisert (`flyctl launch`)
- [ ] PostgreSQL database opprettet
- [ ] Environment variables satt
- [ ] Database migrations kjørt
- [ ] Backend deployet (`flyctl deploy`)
- [ ] Backend URL kopiert
- [ ] Frontend API URL oppdatert
- [ ] Frontend deployet
- [ ] Testet på mobil!

---

## 🎯 Resultat

Etter dette:
- ✅ Backend kjører 24/7 på Fly.io (gratis)
- ✅ Ingen sleep (umiddelbar respons)
- ✅ Frontend på GitHub Pages
- ✅ Test fra mobil uten lokal backend
- ✅ Alt er automatisk!

---

## 💰 Kostnader

**Fly.io gratis tier:**
- 3 shared-cpu VMs
- 256MB RAM per VM
- 3GB persistent storage
- 160GB outbound data transfer
- **Total: 100% GRATIS!** ✅

---

## 📱 Neste Steg

1. Følg guiden over
2. Test på mobil
3. Nyt gratis backend uten sleep! 🎉

