# 🔒 Sikkerhetsjekk - API Nøkler

## Status for dette prosjektet (SiD)

✅ **Dette prosjektet inneholder INGEN Operouter/OpenRouter API-nøkler**

Jeg har sjekket:
- ✅ Ingen referanser til "operouter" eller "openrouter" i koden
- ✅ `backend/env` filen er i `.gitignore` (ikke committet)
- ✅ Ingen API-nøkler funnet i git historikken

## Hva du må gjøre

### 1. Sjekk andre GitHub repositories

Operouter nøkkelen din må være i et **annet prosjekt**. Sjekk:

1. Gå til alle dine GitHub repositories:
   - https://github.com/kasa031?tab=repositories

2. Søk etter "operouter" eller "openrouter" i hvert prosjekt:
   ```powershell
   # I hvert prosjekt
   git grep -i "operouter"
   git grep -i "openrouter"
   git grep -i "sk-"
   ```

3. Sjekk commit historikken:
   ```powershell
   git log --all --full-history -p | Select-String -Pattern "sk-"
   ```

### 2. Sjekk om nøkkel er i commit historikken

Selv om du har slettet en fil, kan den fortsatt være i git historikken:

```powershell
# I hvert prosjekt
git log --all --full-history -p | Select-String -Pattern "sk-[a-zA-Z0-9]{20,}"
```

### 3. Hvis du finner nøkkelen

1. **Fjern fra git historikken:**
   ```powershell
   # Dette krever git filter-branch eller BFG Repo-Cleaner
   # Vanskelig prosess - se under
   ```

2. **Rotate nøkkelen:**
   - Gå til Operouter dashboard
   - Generer en NY API-nøkkel
   - Slett den gamle nøkkelen

3. **Oppdater alle prosjekter** med den nye nøkkelen

### 4. Sjekk .env filer

Sjekk om `.env` filer er committet i noen av dine prosjekter:

```powershell
# I hvert prosjekt
git ls-files | Select-String -Pattern "\.env"
```

Hvis `.env` filer er committet, må de:
1. Fjernes fra git
2. Legges til i `.gitignore`
3. Slettes fra git historikken

## Hvordan fjerne nøkkel fra git historikken

### Metode 1: Bruk git filter-branch (Advansert)
```powershell
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch FILENAME" --prune-empty --tag-name-filter cat -- --all
```

### Metode 2: Bruk BFG Repo-Cleaner (Anbefalt)
1. Last ned BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Kjør:
   ```powershell
   java -jar bfg.jar --delete-files FILENAME
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

### Metode 3: Force push (KUN hvis du er alene på prosjektet)
**⚠️ ADVARSEL: Dette overskriver git historikken!**
```powershell
git push origin --force --all
```

## For fremtiden

1. **Bruk .gitignore:**
   ```
   .env
   *.env
   **/env
   **/secrets
   ```

2. **Bruk environment variables:**
   - Ikke committ `.env` filer
   - Bruk GitHub Secrets for CI/CD
   - Bruk hosting platform secrets (Railway, Render, etc.)

3. **Sjekk før commit:**
   ```powershell
   git diff --cached | Select-String -Pattern "sk-|password|secret|api.*key"
   ```

4. **Bruk pre-commit hooks:**
   - Installer `git-secrets` eller `truffleHog`
   - Blokker commits med nøkler

## Hjelp

Hvis du trenger hjelp med å:
- Finne hvilket prosjekt som har nøkkelen
- Fjerne nøkkel fra git historikken
- Sette opp sikkerhet

Si ifra, så hjelper jeg deg!

