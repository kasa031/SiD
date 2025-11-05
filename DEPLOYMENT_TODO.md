# 🚀 Deployment TODO - Railway Setup

## ✅ Valgt løsning: Railway

**Hvorfor Railway:**
- ✅ **Gratis tier:** $5/måned kreditt (nok for testing)
- ✅ **Ingen sleep:** Backend kjører 24/7
- ✅ **Enklest setup:** Automatisk fra GitHub
- ✅ **Perfekt for mobil/nettbrett:** Rask respons, alltid oppe
- ✅ **Gratis database:** PostgreSQL inkludert
- ✅ **Automatisk deploy:** Push til GitHub = deploy automatisk

## 📋 TODO Liste

### ✅ 1. Opprett Railway konto
- [ ] Gå til: https://railway.app
- [ ] Login med GitHub
- [ ] Autoriser Railway tilgang

### ✅ 2. Deploy backend
- [ ] "New Project" → "Deploy from GitHub repo"
- [ ] Velg `kasa031/SiD` repository
- [ ] Sett "Root Directory" til `backend`
- [ ] Railway deployer automatisk

### ✅ 3. Legg til PostgreSQL database
- [ ] I Railway project → "New" → "Database" → "PostgreSQL"
- [ ] Railway oppretter database automatisk
- [ ] `DATABASE_URL` settes automatisk

### ✅ 4. Sett environment variables
I backend service → "Variables" tab:
- [ ] `JWT_SECRET` - generer med `openssl rand -base64 32`
- [ ] `FRONTEND_URL=https://kasa031.github.io`
- [ ] `OPENROUTER_API_KEY=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`
- [ ] `PORT=3001` (valgfritt, Railway setter automatisk)
- [ ] `DATABASE_URL` - settes automatisk av Railway når du legger til database

### ✅ 5. Kjør database migrations
- [ ] Installer Railway CLI: `npm i -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Link project: `railway link`
- [ ] Kjør migrations:
  ```bash
  railway run psql $DATABASE_URL -f database/migrations/001_initial_schema.sql
  railway run psql $DATABASE_URL -f database/migrations/002_add_categories_and_badges.sql
  ```

**Eller manuelt:**
- [ ] I Railway → Database → "Connect" → "psql"
- [ ] Kjør SQL-filene manuelt

### ✅ 6. Få backend URL
- [ ] Backend service → "Settings"
- [ ] Kopier "Public URL" eller sett custom domain
- [ ] Eksempel: `https://sid-production.up.railway.app`

### ✅ 7. Oppdater frontend
- [ ] Åpne `frontend/src/services/api.js`
- [ ] Erstatt `your-backend-url.railway.app` med din Railway URL
- [ ] Commit og push

### ✅ 8. Oppdater GitHub Actions
- [ ] Legg til backend URL som GitHub Secret:
  - Repository → Settings → Secrets → Actions
  - Ny secret: `VITE_API_URL` = din Railway backend URL
- [ ] Eller oppdater `.github/workflows/deploy.yml` direkte

### ✅ 9. Test på mobil
- [ ] Åpne `https://kasa031.github.io/SiD/` på mobil
- [ ] Test alle funksjoner:
  - [ ] Login/Registrering
  - [ ] Opprett poll
  - [ ] Stemme
  - [ ] Kommentarer
  - [ ] Statistikk

### ✅ 10. Test på nettbrett
- [ ] Åpne nettsiden på iPad/nettbrett
- [ ] Test responsivt design
- [ ] Test alle funksjoner

## 💰 Kostnader

**Railway Free Tier:**
- $5/måned kreditt
- Backend: ~$0.01-0.05/time (~$0.50-3/måned)
- Database: Gratis inkludert
- **Total: GRATIS for liten til medium trafikk!**

## 🎯 Resultat

Etter dette:
- ✅ Backend kjører 24/7 (ingen sleep)
- ✅ Frontend på GitHub Pages
- ✅ Fungerer perfekt på mobil og nettbrett
- ✅ Alle kan bruke nettsiden
- ✅ Automatisk deploy ved push til GitHub
- ✅ Gratis!

## 📱 Mobil/Nettbrett Testing

**Viktig for mobil/nettbrett:**
- ✅ Backend må være tilgjengelig fra internett
- ✅ Railway gir offentlig URL (fungerer på mobil)
- ✅ CORS er konfigurert for GitHub Pages
- ✅ Responsivt design er allerede implementert

## 🔄 Automatisk deploy

Når du pusher til GitHub:
- ✅ Railway redeployer backend automatisk
- ✅ GitHub Actions redeployer frontend automatisk
- ✅ Ingen manuell handling nødvendig!

