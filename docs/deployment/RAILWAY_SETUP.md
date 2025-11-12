# 🚂 Railway Setup - Steg for Steg

## Hvorfor Railway?

- ✅ Enklest setup
- ✅ Gratis tier ($5/måned kreditt)
- ✅ Automatisk deploy fra GitHub
- ✅ Ingen sleep (backend kjører alltid)
- ✅ Enkel database setup

## Steg-for-steg Guide

### 1. Opprett konto

1. Gå til: https://railway.app
2. Klikk "Login with GitHub"
3. Autoriser Railway tilgang til GitHub

### 2. Opprett nytt prosjekt

1. I Railway dashboard, klikk "New Project"
2. Velg "Deploy from GitHub repo"
3. Velg `kasa031/SiD` repository
4. Railway vil automatisk detektere prosjektet

### 3. Konfigurer backend service

1. Railway vil foreslå services - klikk "Add Service"
2. Velg "GitHub Repo" igjen
3. Velg `kasa031/SiD`
4. I settings, sett:
   - **Root Directory**: `backend`
   - **Build Command**: (automatisk detektert)
   - **Start Command**: `npm start`

### 4. Legg til PostgreSQL database

1. I Railway project, klikk "New" → "Database" → "PostgreSQL"
2. Railway oppretter database automatisk
3. Du får `DATABASE_URL` automatisk!

### 5. Sett environment variables

1. Klikk på backend service
2. Gå til "Variables" tab
3. Legg til:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
# Railway setter dette automatisk hvis du la til database

JWT_SECRET=din_sterke_secret_her
# Generer med: openssl rand -base64 32

PORT=3001

FRONTEND_URL=https://kasa031.github.io

OPENROUTER_API_KEY=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
```

**Viktig:** Railway setter `DATABASE_URL` automatisk hvis du la til PostgreSQL service!

### 6. Få backend URL

1. I backend service, gå til "Settings"
2. Du finner "Public URL" eller "Custom Domain"
3. URL ser ut som: `https://your-app-production.up.railway.app`
4. Kopier denne URL-en!

### 7. Kjør database migrations

1. I Railway backend service, gå til "Deployments"
2. Klikk på deployment → "View Logs"
3. Eller bruk Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run psql $DATABASE_URL -f database/migrations/001_initial_schema.sql
railway run psql $DATABASE_URL -f database/migrations/002_add_categories_and_badges.sql
```

**Eller manuelt via Railway:**
1. I backend service, gå til "Settings" → "Connect"
2. Bruk psql connection string
3. Kjør SQL-filene manuelt

### 8. Oppdater frontend

Oppdater `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-app-production.up.railway.app/api'  // ← Din Railway URL
    : 'http://localhost:3001/api');
```

### 9. Oppdater GitHub Actions

Oppdater `.github/workflows/deploy.yml`:

```yaml
- name: Build frontend
  run: |
    cd frontend
    npm install
    npm run build
  env:
    VITE_API_URL: https://your-app-production.up.railway.app/api
```

### 10. Deploy frontend

Frontend deployes automatisk når du pusher til GitHub, eller:

1. Manuell deploy:
   ```bash
   cd frontend
   npm run build
   # Push dist/ til GitHub Pages
   ```

## Testing

1. **Backend health check:**
   ```
   https://your-app-production.up.railway.app/api/health
   ```

2. **Frontend:**
   ```
   https://kasa031.github.io/SiD/
   ```

3. **Test på mobil:**
   - Åpne `https://kasa031.github.io/SiD/` på mobil
   - Alt skal fungere uten lokal backend!

## Troubleshooting

### Backend starter ikke
- Sjekk "View Logs" i Railway
- Sjekk at environment variables er satt
- Sjekk at `DATABASE_URL` er satt

### Database connection feil
- Sjekk at PostgreSQL service er opprettet
- Sjekk at `DATABASE_URL` er satt riktig
- Sjekk at migrations er kjørt

### Frontend kan ikke koble til backend
- Sjekk at backend URL er riktig i `api.js`
- Sjekk CORS settings i backend
- Sjekk at `FRONTEND_URL` er satt i Railway

## Kostnader

- **Gratis tier:** $5/måned kreditt
- **Backend:** ~$0.01-0.05/time (~$0.50-3/måned)
- **Database:** Inkludert i gratis tier
- **Total:** Gratis for liten trafikk!

## Automatisk deploy

Railway deployer automatisk når du pusher til GitHub `main` branch!

## ✅ Du er ferdig!

Nå kjører backend automatisk 24/7, og alle kan bruke nettsiden!

