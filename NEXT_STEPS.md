# ✅ Neste Steg - Push til GitHub

## 🎉 Git Repository er Klar!

Alle filer er committed og klar for push til GitHub.

## 📋 Neste Steg:

### 1. Opprett GitHub Repository

1. Gå til: https://github.com/new
2. **Repository name:** `polls-nettside` (eller hva du vil)
3. Velg **Public** eller **Private**
4. **VIKTIG:** Ikke huk av "Initialize with README" (vi har allerede filer)
5. Klikk **"Create repository"**

### 2. Koble Lokal Repository til GitHub

Etter at du har opprettet repository på GitHub, kjør denne kommandoen (erstatt `ditt-brukernavn` med ditt faktiske GitHub brukernavn):

```bash
git remote add origin https://github.com/ditt-brukernavn/polls-nettside.git
```

### 3. Push til GitHub

```bash
git push -u origin main
```

**Hvis du blir bedt om passord:**
- Bruk din **personal access token** (ikke passordet ditt)
- Hvis du ikke har token, opprett en på: https://github.com/settings/tokens/new
- Token trenger kun `repo` scope
- Kopier tokenen og bruk den som passord

### 4. Aktiver GitHub Pages

1. Gå til repository-innstillinger på GitHub
2. Gå til **"Pages"** i venstre meny
3. Under **"Source"**, velg **"GitHub Actions"**
4. Workflow vil automatisk kjøre når du pusher til `main`

### 5. Endre Base Path (viktig!)

Etter at du har pushet, må du oppdatere `frontend/vite.config.js`:

```js
base: process.env.NODE_ENV === 'production' ? '/ditt-repository-navn/' : '/',
```

Endre `ditt-repository-navn` til navnet på ditt GitHub repository.

## 🔍 Sjekk Status

Etter push, sjekk at:
- ✅ Alle filer er på GitHub
- ✅ GitHub Actions workflow er aktivert
- ✅ Pages er satt opp (kan ta noen minutter)

## 📝 Notater

- `backend/env` filen er **ikke** committed (sikkerhet)
- GitHub Actions vil automatisk bygge og deploye frontend
- Backend må deployes separat (se `DEPLOYMENT.md`)

