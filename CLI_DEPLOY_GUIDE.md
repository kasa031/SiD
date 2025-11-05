# 🚀 CLI Deployment Guide

## ✅ CLI-basert deployment (anbefalt)

I stedet for GitHub Actions, kan du deploye direkte fra terminalen med én kommando!

## 📋 Installer gh-pages (første gang)

```bash
# I root-mappen
npm install -g gh-pages
```

Eller bruk `npx` (anbefalt, trenger ikke installere globalt):
- `npx gh-pages` brukes automatisk i scriptet

## 🎯 Deploy til GitHub Pages

### Enkel deploy:
```bash
cd frontend
npm run deploy
```

### Eller fra root-mappen:
```bash
cd frontend && npm run deploy
```

### Hvis du trenger å force push (hvis noe går galt):
```bash
cd frontend
npm run deploy:force
```

## 🔄 Hva skjer?

1. **Bygger frontend:** `npm run build` → lager `dist/` mappen
2. **Deployer til GitHub Pages:** `gh-pages -d dist` → pusher til `gh-pages` branch
3. **Ferdig!** Frontend er tilgjengelig på GitHub Pages

## 📝 Workflow

1. Gjør endringer i koden
2. Commit og push til `main` branch:
   ```bash
   git add .
   git commit -m "Din melding"
   git push
   ```
3. Deploy frontend:
   ```bash
   cd frontend
   npm run deploy
   ```

## ⚙️ Environment Variables

For å sette `VITE_API_URL` før deploy:
```bash
cd frontend
VITE_API_URL=https://din-railway-url.railway.app/api npm run deploy
```

## 🎯 Ferdig!

Etter `npm run deploy`:
- ✅ Frontend er bygget
- ✅ Pushet til `gh-pages` branch
- ✅ Tilgjengelig på GitHub Pages om 1-2 minutter

## 📖 Hvorfor CLI?

✅ **Kontroll:** Du bestemmer når du deployer
✅ **Raskt:** Ingen venting på GitHub Actions
✅ **Enkelt:** Én kommando
✅ **Debugging:** Ser feilmeldinger direkte
✅ **Fleksibelt:** Enkel å automatisere med scripts

## 🔧 Troubleshooting

**Feil: "gh-pages command not found"**
- Bruk: `npx gh-pages` i stedet (allerede i scriptet)

**Feil: "Permission denied"**
- Sjekk at du er logget inn på GitHub: `git config --global user.name`

**Feil: "Branch gh-pages already exists"**
- Bruk: `npm run deploy:force`

## 🎉 Tips

Lage et alias for raskere deploy:
```bash
# I PowerShell (Windows)
Set-Alias deploy "cd frontend; npm run deploy"
```

Eller i bash/zsh (Mac/Linux):
```bash
alias deploy='cd frontend && npm run deploy'
```

Da kan du bare kjøre:
```bash
deploy
```

