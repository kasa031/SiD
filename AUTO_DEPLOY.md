# 🚀 Automatisk Deployment Guide

## ✅ Lokalt er alt klart!

Git repository er initialisert og alle filer er committed.

## 📋 Hva du må gjøre manuelt (5 minutter):

### 1. Opprett GitHub Repository

1. Gå til: **https://github.com/new**
2. Repository name: `polls-nettside`
3. Velg **Public** (eller Private hvis du vil)
4. **IKKE** huk av "Initialize with README"
5. Klikk **"Create repository"**

### 2. Kopier Repository URL

Etter at repository er opprettet, kopier URL-en som GitHub viser deg. Den ser ut som:
- `https://github.com/ditt-brukernavn/polls-nettside.git`

### 3. Kjør Disse Kommandoene

Etter at du har repository URL, kjør disse kommandoene i terminalen:

```bash
# Sett remote (erstatt URL med din faktiske URL)
git remote add origin https://github.com/ditt-brukernavn/polls-nettside.git

# Push til GitHub
git push -u origin main
```

**Hvis du blir bedt om passord:**
- Dette er fordi GitHub ikke lenger tillater passord
- Du må bruke en **Personal Access Token**
- Opprett token på: https://github.com/settings/tokens/new
- Scope: Kun **`repo`** (full kontroll)
- Kopier tokenen og bruk den som passord

### 4. Aktiver GitHub Pages

1. Gå til repository-innstillinger på GitHub
2. Gå til **"Pages"** i venstre meny  
3. Under **"Source"**, velg **"GitHub Actions"**
4. Workflow vil automatisk kjøre!

### 5. Vent på Deployment

GitHub Actions vil automatisk:
- ✅ Bygge frontend
- ✅ Deploye til GitHub Pages
- ✅ Tilgjengelig på: `https://ditt-brukernavn.github.io/polls-nettside/`

Dette tar vanligvis 2-5 minutter.

## 🎯 Status

**Lokalt:** ✅ Ferdig
**GitHub Repository:** ⏳ Du må opprette
**Push:** ⏳ Etter repository er opprettet
**Pages:** ⏳ Aktiveres automatisk

## 📝 Notater

- Base path er satt til `/polls-nettside/` i `vite.config.js`
- Hvis du endrer repository-navn, må du også endre base path
- Backend må deployes separat (se `DEPLOYMENT.md`)

