# 🚀 Gratis Deployment Guide - SiD Prosjekt

## Problem

- GitHub Pages kan **KUN** serve statisk frontend (HTML/CSS/JS)
- Backend må kjøres separat (Node.js/Express)
- Du vil ha automatisk oppstart og tilgang fra mobil

## Løsning: Deploy backend til gratis hosting

### ✅ Beste gratis alternativer (i rekkefølge):

1. **Railway** ⭐ (Anbefalt - Enklest)
   - Gratis tier: $5/måned kreditt
   - Automatisk deploy fra GitHub
   - Enkelt setup
   - URL: `https://your-app.railway.app`

2. **Render**
   - Gratis tier: Sleeps etter 15 min inaktivitet
   - Automatisk deploy fra GitHub
   - Enkelt setup
   - URL: `https://your-app.onrender.com`

3. **Fly.io**
   - Gratis tier: 3 shared-cpu VMs
   - Automatisk deploy
   - URL: `https://your-app.fly.dev`

4. **Cyclic**
   - Gratis tier: Unlimited
   - Serverless
   - URL: `https://your-app.cyclic.app`

## 📋 Railway Setup (Anbefalt - Enklest)

### Steg 1: Opprett Railway konto

1. Gå til: https://railway.app
2. Klikk "Login with GitHub"
3. Autoriser Railway

### Steg 2: Deploy backend

1. I Railway dashboard, klikk "New Project"
2. Velg "Deploy from GitHub repo"
3. Velg `SiD` repository
4. Velg `backend` som root directory
5. Railway vil automatisk:
   - Detektere at det er Node.js
   - Installere dependencies
   - Starte serveren

### Steg 3: Sett environment variables

1. I Railway project, klikk på backend service
2. Gå til "Variables" tab
3. Legg til:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your_secret_here
   PORT=3001
   FRONTEND_URL=https://kasa031.github.io
   OPENROUTER_API_KEY=sk-or-v1-...
   ```

### Steg 4: Få URL

1. Railway gir deg en URL: `https://your-app.railway.app`
2. Backend kjører nå automatisk!

### Steg 5: Oppdater frontend

Oppdater `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-app.railway.app/api'  // ← Din Railway URL
    : 'http://localhost:3001/api');
```

### Steg 6: Deploy frontend til GitHub Pages

Frontend deployes automatisk via GitHub Actions (allerede satt opp).

## 📋 Render Setup (Alternativ)

### Steg 1: Opprett Render konto

1. Gå til: https://render.com
2. Klikk "Get Started for Free"
3. Login med GitHub

### Steg 2: Deploy backend

1. Klikk "New +" → "Web Service"
2. Connect GitHub repository: `SiD`
3. Settings:
   - **Name**: `sid-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Steg 3: Sett environment variables

1. I Render dashboard, gå til "Environment"
2. Legg til:
   ```
   DATABASE_URL=...
   JWT_SECRET=...
   PORT=3001
   FRONTEND_URL=https://kasa031.github.io
   OPENROUTER_API_KEY=...
   ```

### Steg 4: Deploy

1. Klikk "Create Web Service"
2. Render gir deg URL: `https://sid-backend.onrender.com`

### Steg 5: Oppdater frontend

Samme som Railway - oppdater `api.js` med Render URL.

## 🗄️ Database Setup

### Option 1: Railway PostgreSQL (Gratis)

1. I Railway project
2. Klikk "New" → "Database" → "PostgreSQL"
3. Railway gir deg `DATABASE_URL` automatisk
4. Kjør migrations manuelt første gang

### Option 2: Render PostgreSQL (Gratis)

1. I Render dashboard
2. Klikk "New +" → "PostgreSQL"
3. Render gir deg connection string
4. Kjør migrations manuelt første gang

### Option 3: Supabase (Gratis - Anbefalt)

1. Gå til: https://supabase.com
2. Opprett gratis prosjekt
3. Få connection string fra Settings → Database
4. Bruk `DATABASE_URL` i Railway/Render

## 🔧 Oppdater GitHub Actions

Oppdater `.github/workflows/deploy.yml`:

```yaml
- name: Build frontend
  run: |
    cd frontend
    npm install
    npm run build
  env:
    VITE_API_URL: https://your-app.railway.app/api  # ← Din backend URL
```

## 📱 Testing på mobil

Etter deployment:
- Frontend: `https://kasa031.github.io/SiD/`
- Backend: `https://your-app.railway.app/api`
- Fungerer på mobil uten lokal backend!

## 💰 Kostnader

**Railway:**
- Gratis: $5/måned kreditt
- Backend bruker ~$0.01-0.05/time
- Nok for liten trafikk

**Render:**
- Gratis: Sleeps etter 15 min inaktivitet
- Første oppstart kan ta 30-60 sekunder
- Perfekt for testing

**Fly.io:**
- Gratis: 3 shared VMs
- Ingen sleep
- Litt mer kompleks setup

## ✅ Checklist

- [ ] Opprett Railway/Render konto
- [ ] Deploy backend
- [ ] Sett environment variables
- [ ] Få backend URL
- [ ] Oppdater frontend `api.js`
- [ ] Oppdater GitHub Actions med backend URL
- [ ] Deploy frontend (automatisk via GitHub Actions)
- [ ] Test på mobil!

## 🎯 Resultat

✅ Backend kjører automatisk 24/7
✅ Frontend på GitHub Pages
✅ Tilgang fra mobil uten lokal backend
✅ Alle kan bruke nettsiden
✅ Gratis!

