# ⚡ Quick Deploy - 5 Minutter

## Den raskeste måten å få nettsiden online

### Steg 1: Railway (2 minutter)

1. Gå til: https://railway.app
2. Login med GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Velg `SiD` repository
5. Sett "Root Directory" til `backend`

✅ Railway deployer automatisk!

### Steg 2: Sett environment variables (1 minutt)

1. I Railway backend service → "Variables"
2. Legg til:
   ```
   JWT_SECRET=din_secret_her
   FRONTEND_URL=https://kasa031.github.io
   OPENROUTER_API_KEY=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
   ```

3. Legg til PostgreSQL database:
   - "New" → "Database" → "PostgreSQL"
   - Railway setter `DATABASE_URL` automatisk!

### Steg 3: Få backend URL (30 sekunder)

1. Backend service → "Settings"
2. Kopier "Public URL"
3. Eksempel: `https://sid-production.up.railway.app`

### Steg 4: Oppdater frontend (1 minutt)

1. Åpne `frontend/src/services/api.js`
2. Erstatt `your-backend-url.railway.app` med din Railway URL
3. Commit og push:
   ```bash
   git add frontend/src/services/api.js
   git commit -m "Oppdater backend URL"
   git push
   ```

### Steg 5: Database migrations (30 sekunder)

1. I Railway backend → "Deployments" → "View Logs"
2. Eller bruk Railway CLI:
   ```bash
   railway run psql $DATABASE_URL -f database/migrations/001_initial_schema.sql
   railway run psql $DATABASE_URL -f database/migrations/002_add_categories_and_badges.sql
   ```

### Steg 6: Test! (30 sekunder)

1. Frontend: `https://kasa031.github.io/SiD/`
2. Backend: Din Railway URL
3. Test på mobil!

## ✅ Ferdig!

Alt kjører automatisk nå. Når du pusher til GitHub:
- ✅ Backend redeployer automatisk på Railway
- ✅ Frontend redeployer automatisk på GitHub Pages

## 💡 Tips

- **Railway:** $5/måned gratis kreditt (nok for testing)
- **Database:** Gratis PostgreSQL inkludert
- **Automatisk deploy:** Pusher til GitHub = deployer automatisk
- **Tilgang:** Alle kan bruke nettsiden!

## Hvis du har problemer

1. Sjekk Railway logs: Backend service → "Deployments" → "View Logs"
2. Sjekk at environment variables er satt
3. Sjekk at database er opprettet
4. Sjekk at migrations er kjørt

