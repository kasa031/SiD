# 📦 Git Setup Guide

## Steg 1: Initialiser Git Repository

```bash
git init
```

## Steg 2: Legg til alle filer

```bash
git add .
```

## Steg 3: Lag første commit

```bash
git commit -m "Initial commit - Polls nettside"
```

## Steg 4: Opprett GitHub Repository

1. Gå til https://github.com/new
2. Navn: `polls-nettside` (eller hva du vil)
3. Velg **Public** eller **Private**
4. Ikke huk av "Initialize with README" (vi har allerede filer)
5. Klikk "Create repository"

## Steg 5: Koble til GitHub

### Valg A: Med SSH (anbefalt - ingen token nødvendig)

```bash
git remote add origin git@github.com:ditt-brukernavn/polls-nettside.git
git branch -M main
git push -u origin main
```

### Valg B: Med HTTPS (kan kreve token)

```bash
git remote add origin https://github.com/ditt-brukernavn/polls-nettside.git
git branch -M main
git push -u origin main
```

**Hvis du blir bedt om passord:**
- Bruk din **personal access token** (ikke passordet ditt)
- Token trenger `repo` scope

## Steg 6: Aktiver GitHub Pages

1. Gå til repository-innstillinger på GitHub
2. Gå til "Pages" i venstre meny
3. Under "Source", velg **"GitHub Actions"**
4. Workflow vil automatisk kjøre når du pusher til `main`

## 🔑 Trenger du Personal Access Token?

**JA** hvis:
- Du bruker HTTPS og ikke har SSH satt opp
- Du har 2FA aktivert
- Du får passordfeil ved push

**NEI** hvis:
- Du bruker SSH
- Du ikke har 2FA aktivert og bruker HTTPS uten token

### Hvordan lage token (hvis nødvendig):

1. Gå til: https://github.com/settings/tokens/new
2. Navn: `Polls Nettside` (eller hva du vil)
3. Expiration: Velg lengde (f.eks. 90 dager)
4. Scopes: Huk kun av **`repo`** (full kontroll av private repositories)
5. Klikk "Generate token"
6. **KOPIER TOKENEN** - du ser den ikke igjen!
7. Bruk token som passord når du pusher

## 📝 Viktig

- **Aldri commit** `backend/env` filen (den er allerede i .gitignore)
- Token skal være hemmelig - ikke del den
- GitHub Actions bruker automatisk `GITHUB_TOKEN` - ingen ekstra setup nødvendig

