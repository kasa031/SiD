# GitHub Pages Setup Guide

## ⚠️ Viktig om GitHub Pages

**GitHub Pages kan kun serve statiske filer (frontend). Backend må kjøres separat!**

### Hva fungerer:
- ✅ Frontend vises på GitHub Pages
- ✅ Alle statiske filer (HTML, CSS, JS, bilder)
- ✅ Navigasjon mellom sider

### Hva som IKKE fungerer uten backend:
- ❌ Login/Registrering
- ❌ Opprette polls
- ❌ Stemme
- ❌ Kommentarer
- ❌ Profiler
- ❌ Statistikk
- ❌ Badges

## Løsninger for å få full funksjonalitet

### Løsning 1: Lokal utvikling (anbefalt for testing)
1. Start backend lokalt:
   ```powershell
   cd backend
   npm install
   npm start
   ```

2. Start frontend lokalt:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

3. Frontend vil koble til backend på `http://localhost:3001`

### Løsning 2: Deploy backend til hosting-tjeneste

For å få GitHub Pages til å fungere fullt ut, må du deploye backend til en hosting-tjeneste:

#### Alternativer:
1. **Heroku** (gratis tier nedlagt, men kan brukes)
2. **Railway** (gratis tier)
3. **Render** (gratis tier)
4. **Fly.io** (gratis tier)
5. **DigitalOcean App Platform** (betalt)
6. **Vercel** (for serverless)
7. **AWS/GCP/Azure** (betalt)

#### Etter backend er deployet:
1. Oppdater `frontend/.env.production` eller sett `VITE_API_URL` i GitHub Actions:
   ```yaml
   env:
     VITE_API_URL: https://din-backend-url.herokuapp.com/api
   ```

2. Frontend vil da koble til din deployede backend.

### Løsning 3: Fullstack hosting (anbefalt for produksjon)

Host både frontend og backend på samme tjeneste:
- **Vercel** (serverless)
- **Netlify** (med Netlify Functions)
- **Railway** (fullstack)
- **Render** (fullstack)

## Nåværende konfigurasjon

Frontend er konfigurert til å:
- I utvikling: Bruke `http://localhost:3001/api` (fra `vite.config.js` proxy)
- I produksjon: Bruke `VITE_API_URL` environment variable (hvis satt)

## Hva skjer når du åpner GitHub Pages nå?

1. Frontend laster inn
2. Frontend prøver å koble til backend
3. Uten backend vil API-kall feile
4. Du vil se feilmeldinger i nettleserkonsollen
5. Ingen funksjonalitet vil fungere

## For å teste lokalt nå

Jeg har startet både backend og frontend for deg. De skal nå kjøre på:
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173` (eller annen port)

Åpne nettleseren og gå til `http://localhost:5173` for å se siden!

