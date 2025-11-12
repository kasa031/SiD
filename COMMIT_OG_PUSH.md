# 🚀 Commit og Push Guide - SiD Prosjekt

## Rask Guide

### 1. Sjekk hva som skal committes

```powershell
git status
```

### 2. Sjekk for følsomme data (VIKTIG!)

```powershell
git diff --cached | Select-String -Pattern "sk-|password|secret|api.*key|OPENROUTER_API_KEY"
```

Hvis noe dukker opp, **IKKE commit** før det er fjernet!

### 3. Legg til alle endringer

```powershell
git add .
```

### 4. Commit med beskrivende melding

```powershell
git commit -m "feat: Legg til automatiserte tester (Jest + Vitest)

- Sett opp Jest for backend testing
- Sett opp Vitest for frontend testing  
- Lagt til grunnleggende tester for auth routes og validation utils
- Oppdatert dokumentasjon med test setup guide
- Oppdatert TODO-liste med testing fremgang"
```

### 5. Push til GitHub

```powershell
git push origin main
```

## Hva skjer etter push?

1. **Frontend:** GitHub Actions vil automatisk deploye til GitHub Pages
2. **Backend:** Må deployes manuelt til Railway (se TODO_SAMLET.md)

## Sjekk deployment status

- GitHub Actions: https://github.com/kasa031/SiD/actions
- GitHub Pages: https://kasa031.github.io/SiD/

## Hvis noe går galt

### Feil ved push?
- Sjekk at du har riktig remote: `git remote -v`
- Sjekk at du er på riktig branch: `git branch`

### Feil ved commit?
- Sjekk at .gitignore er korrekt
- Sjekk at ingen følsomme filer er inkludert

## 📚 Mer informasjon

- Se `PRE_COMMIT_CHECKLIST.md` for detaljert checklist
- Se `docs/security/SECURITY_CHECK.md` for sikkerhetsinfo
- Se `TODO_SAMLET.md` for gjenstående oppgaver

