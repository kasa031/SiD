# 🚂 Railway Quick Start - GRATIS!

## ✅ Railway er 100% GRATIS for dette prosjektet!

**Hvorfor gratis:**
- $5 kreditt per måned (gratis tier)
- Backend koster ~$0.01-0.05/time = ~$0.50-3/måned
- Database er GRATIS inkludert
- **Du får $5, bruker ~$2-3 = GRATIS!** 🎉

## 📋 5 Enkle Steg (10 minutter)

### Steg 1: Opprett Railway konto
1. Gå til: https://railway.app
2. Klikk "Login" → "Login with GitHub"
3. Autoriser Railway tilgang
4. **GRATIS!** Ingen kredittkort nødvendig

### Steg 2: Deploy backend
1. Klikk "New Project"
2. Klikk "Deploy from GitHub repo"
3. Velg `kasa031/SiD` repository
4. Railway begynner automatisk deploy
5. **Vent 2-3 minutter** mens Railway bygger

### Steg 3: Legg til PostgreSQL database
1. I Railway project → Klikk "New"
2. Velg "Database" → "Add PostgreSQL"
3. Railway oppretter database automatisk
4. **DATABASE_URL settes automatisk!**

### Steg 4: Sett environment variables
1. I backend service → Klikk "Variables" tab
2. Legg til disse variablene:

**Obligatorisk:**
```
JWT_SECRET=din_jwt_secret_her
FRONTEND_URL=https://kasa031.github.io
OPENROUTER_API_KEY=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
```

**Database (automatisk):**
- Railway setter `DATABASE_URL` automatisk når du legger til database
- **Ikke legg til manuelt!**

**Generer JWT_SECRET:**
- I PowerShell: `[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`
- Eller bruk: https://randomkeygen.com/ (velg "CodeIgniter Encryption Keys")

### Steg 5: Kjør migrations
**Metode 1: Railway CLI (anbefalt)**
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Kjør migrations
railway run npm run migrate
```

**Metode 2: Manuelt via Railway**
1. Backend service → "Settings" → "Connect"
2. Velg "PostgreSQL" → "psql"
3. Kopier innholdet fra `database/migrations/001_initial_schema.sql`
4. Klikk "Run"
5. Gjenta for `002_add_categories_and_badges.sql`

### Steg 6: Få backend URL
1. Backend service → "Settings"
2. Kopier "Public URL"
   - Eksempel: `https://sid-production.up.railway.app`
3. **Dette er din backend URL!**

### Steg 7: Oppdater frontend
1. Åpne `frontend/src/services/api.js`
2. Erstatt `your-backend-url.railway.app` med din Railway URL
3. Commit og push:
```bash
git add frontend/src/services/api.js
git commit -m "Oppdater API URL med Railway backend"
git push
```

### Steg 8: Test!
1. Vent på GitHub Actions deploy (2-3 minutter)
2. Åpne: https://kasa031.github.io/SiD/
3. Test på mobil og nettbrett! 📱

## 🎯 Alt er automatisk!

- ✅ Railway redeployer automatisk når du pusher til GitHub
- ✅ GitHub Pages redeployer automatisk frontend
- ✅ Ingen manuell start nødvendig!

## 💰 Kostnader

**Månedlig:**
- Railway backend: ~$2-3
- Database: GRATIS
- **Total: ~$2-3**

**Gratis tier:**
- $5 kreditt per måned
- **Du bruker ~$2-3 = GRATIS!** ✅

## 📱 Mobil/Nettbrett

Railway gir offentlig URL som fungerer perfekt på:
- ✅ iPhone
- ✅ iPad
- ✅ Android
- ✅ Alle nettbrett

## ❓ Hjelp

Hvis noe ikke fungerer:
1. Sjekk Railway logs: Backend service → "Deployments" → "View Logs"
2. Sjekk at alle environment variables er satt
3. Sjekk at migrations er kjørt
4. Test health endpoint: `https://din-url.railway.app/api/health`

## 🎉 Klar!

Etter dette kjører nettsiden din 24/7, gratis, og fungerer på alle enheter!

