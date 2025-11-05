# 🚀 Deploy Nå - Fullstendig Guide (10 minutter)

## ✅ Hva du får:
- ✅ Backend kjører 24/7 på Railway (GRATIS)
- ✅ Frontend på GitHub Pages (allerede klar)
- ✅ Teste fra mobil/nettbrett uten å starte noe lokalt
- ✅ Alt er automatisk - ingen manuell start!

---

## 📋 Steg 1: Sett opp Railway (5 minutter)

### 1.1 Opprett konto
1. Gå til: https://railway.app
2. Klikk **"Login"** → **"Login with GitHub"**
3. Autoriser Railway (gratis, ingen kredittkort)

### 1.2 Deploy backend
1. Klikk **"New Project"**
2. Klikk **"Deploy from GitHub repo"**
3. Velg **`kasa031/SiD`** repository
4. Railway starter automatisk deploy!
   - Vent 2-3 minutter mens Railway bygger
   - Se "Deployments" tab for status

### 1.3 Legg til PostgreSQL database
1. I Railway project → Klikk **"New"**
2. Klikk **"Database"** → **"Add PostgreSQL"**
3. Railway oppretter database automatisk
4. ✅ **DATABASE_URL settes automatisk!**

---

## 🔧 Steg 2: Sett environment variables (2 minutter)

1. I Railway project → Klikk på **backend service**
2. Gå til **"Variables"** tab
3. Klikk **"New Variable"** og legg til:

**Obligatorisk:**
```
JWT_SECRET=superhemmelig_jwt_secret_key_2026_change_in_production
FRONTEND_URL=https://kasa031.github.io
OPENROUTER_API_KEY=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
```

**Viktig:**
- **Ikke legg til DATABASE_URL** - Railway setter den automatisk!
- Generer JWT_SECRET hvis du vil (se nedenfor)

**Generer JWT_SECRET (valgfritt):**
- PowerShell: `[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`
- Eller: https://randomkeygen.com/ (velg "CodeIgniter Encryption Keys")

---

## 🗄️ Steg 3: Kjør database migrations (2 minutter)

**Metode 1: Railway CLI (anbefalt)**

```powershell
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project (velg ditt SiD project)
railway link

# Kjør migrations
railway run npm run migrate
```

**Metode 2: Manuelt via Railway Dashboard**
1. Backend service → **"Settings"** → **"Connect"**
2. Velg **"PostgreSQL"** → **"psql"**
3. Åpne `database/migrations/001_initial_schema.sql` lokalt
4. Kopier alt innhold og lim inn i psql
5. Klikk **"Run"**
6. Gjenta for `002_add_categories_and_badges.sql`

---

## 🔗 Steg 4: Få backend URL (1 minutt)

1. Backend service → **"Settings"**
2. Kopier **"Public URL"**
   - Eksempel: `https://sid-production.up.railway.app`
3. ✅ **Dette er din backend URL!**

---

## 🌐 Steg 5: Oppdater frontend API URL (1 minutt)

1. Åpne `frontend/src/services/api.js`
2. Erstatt `your-backend-url.railway.app` med din faktiske Railway URL
3. Commit og push:

```powershell
cd frontend
# Rediger api.js med din Railway URL
git add frontend/src/services/api.js
git commit -m "Oppdater API URL med Railway backend"
git push
```

4. Deploy frontend:
```powershell
cd frontend
npm run deploy
```

---

## ✅ Steg 6: Test! (1 minutt)

1. Vent på GitHub Pages deploy (2-3 minutter)
2. Åpne på mobil/nettbrett: **https://kasa031.github.io/SiD/**
3. Test innlogging, opprett poll, stemme osv.
4. 🎉 **Alt fungerer uten å starte noe lokalt!**

---

## 🎯 Hva skjer nå?

**Automatisk:**
- ✅ Railway redeployer backend automatisk når du pusher til GitHub
- ✅ GitHub Pages redeployer frontend automatisk
- ✅ Alt kjører 24/7, gratis!

**Du trenger ikke:**
- ❌ Kjøre `npm start` lokalt
- ❌ Kjøre `npm run dev` lokalt
- ❌ Starte database lokalt
- ❌ Noe manuelt!

---

## 📱 Test fra mobil/nettbrett

1. Åpne nettleser på mobil
2. Gå til: **https://kasa031.github.io/SiD/**
3. Test alt! 🎉

---

## 💰 Kostnader

**Railway gratis tier:**
- $5 kreditt per måned (gratis)
- Backend koster ~$2-3/måned
- Database: GRATIS
- **Total: GRATIS!** ✅

---

## ❓ Hjelp

**Hvis backend ikke fungerer:**
1. Sjekk Railway logs: Backend service → **"Deployments"** → **"View Logs"**
2. Test health endpoint: `https://din-url.railway.app/api/health`
3. Sjekk at alle environment variables er satt
4. Sjekk at migrations er kjørt

**Hvis frontend ikke finner backend:**
1. Sjekk at `frontend/src/services/api.js` har riktig Railway URL
2. Sjekk CORS i Railway (skal være satt med `FRONTEND_URL`)
3. Test backend URL direkte i nettleser: `https://din-url.railway.app/api/health`

---

## 🎉 Klar!

Etter dette:
- ✅ Alt kjører 24/7
- ✅ Test fra mobil/nettbrett når som helst
- ✅ Ingen lokale servere nødvendig
- ✅ GRATIS!

