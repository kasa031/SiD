# 🚀 Kjør Disse Kommandoene

## Steg 1: Opprett GitHub Repository Først

1. Gå til: **https://github.com/new**
2. Navn: `polls-nettside`
3. Velg **Public**
4. **IKKE** huk av "Initialize with README"
5. Klikk **"Create repository"**

## Steg 2: Kopier Repository URL

Etter opprettelse, kopier URL-en GitHub viser (f.eks. `https://github.com/kasa031/polls-nettside.git`)

## Steg 3: Kjør Disse Kommandoene

Erstatt `ditt-brukernavn` med ditt faktiske GitHub brukernavn:

```bash
git remote add origin https://github.com/ditt-brukernavn/polls-nettside.git
git push -u origin main
```

## Hvis du blir bedt om passord:

1. Gå til: https://github.com/settings/tokens/new
2. Navn: `Polls Nettside`
3. Expiration: 90 dager (eller lengre)
4. Scopes: Kun **`repo`** ✅
5. Klikk **"Generate token"**
6. **KOPIER TOKENEN** (du ser den ikke igjen!)
7. Bruk tokenen som passord når git spør

## Steg 4: Aktiver GitHub Pages

1. Gå til repository på GitHub
2. Klikk **Settings** → **Pages**
3. Under **Source**, velg **"GitHub Actions"**
4. Ferdig! Workflow kjører automatisk

## 🎉 Nettstedet ditt blir tilgjengelig på:

`https://ditt-brukernavn.github.io/polls-nettside/`

(Det tar 2-5 minutter før det er live)

