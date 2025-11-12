# 🔒 Sikkerhetspolicy - SiD Prosjekt

## Regel: Aldri commit sensitive informasjon

### ❌ Dette skal ALDRI committes:

1. **API-nøkler og tokens**
   - OpenRouter API keys
   - Andre API keys (`sk-...`, `sk_...`)
   - Access tokens
   - Bearer tokens

2. **Passord og secrets**
   - Database passord
   - JWT secrets
   - Encryption keys
   - Passord hashes

3. **Environment filer**
   - `.env` filer
   - `backend/env` fil
   - `env` filer uten .example
   - Alle filer med faktiske secrets

4. **Private keys**
   - `.key` filer
   - `.pem` filer
   - `.p12` filer
   - SSH keys

### ✅ Hva skal committes:

1. **Templates**
   - `.env.example` filer
   - Dokumentasjon
   - Konfigurasjonsfiler uten secrets

2. **Kode**
   - Alle kildefiler
   - README filer
   - Dokumentasjon

## Automatisk beskyttelse

### Pre-commit hooks

Jeg har satt opp pre-commit hooks som automatisk:
- ✅ Blokkerer commits med sensitive filer
- ✅ Sjekker for API-nøkler i kode
- ✅ Varsler deg før du committer

### Hvordan det fungerer:

1. **Før hver commit:**
   - Sjekker om du prøver å committe `.env` filer
   - Sjekker etter API-nøkler i koden
   - Blokkerer commit hvis noe sensitivt funnes

2. **Før hver push:**
   - Dobbeltsjekker alle commits
   - Varsler hvis sensitive data er funnet

## Hvis du har committet sensitive data

### Umiddelbart:

1. **Rotate alle eksponerte nøkler:**
   - Generer nye API-nøkler
   - Slett gamle nøkler
   - Oppdater alle systemer

2. **Fjern fra git historikken:**
   ```powershell
   # Bruk git filter-branch eller BFG Repo-Cleaner
   # Se SECURITY_CHECK.md for detaljer
   ```

3. **Force push (KUN hvis du er alene):**
   ```powershell
   git push origin --force --all
   ```

## Best practices

### 1. Bruk environment variables
```javascript
// ❌ IKKE SÅ:
const API_KEY = "sk-XXXXXXXXXXXXXXXXXXXXXXXX";

// ✅ BRUK SÅ:
const API_KEY = process.env.OPENROUTER_API_KEY;
```

### 2. Bruk .env.example
```bash
# .env.example (committ dette)
OPENROUTER_API_KEY=your_key_here
DATABASE_URL=postgresql://username:pass@localhost/db

# .env (committ IKKE dette)
OPENROUTER_API_KEY=sk-actual-real-key-here
DATABASE_URL=postgresql://user:realpass@localhost/db
```

### 3. Sjekk .gitignore
```gitignore
# Sørg for at disse er i .gitignore
.env
.env.*
!*.env.example
backend/env
*.key
*.pem
```

### 4. Test før commit
```powershell
# Sjekk manuelt
git diff --cached | Select-String -Pattern "sk-|password|secret|api.*key"
```

## Hvordan sjekke GitHub repository

Jeg kan ikke direkte få tilgang til GitHub, men du kan:

1. **Sjekk alle repositories:**
   - Gå til https://github.com/kasa031?tab=repositories
   - Søk etter "operouter" eller "openrouter" i hvert prosjekt

2. **Bruk GitHub's security features:**
   - GitHub varsler automatisk om eksponerte secrets
   - Sjekk Security tab i hvert repository

3. **Bruk git-secrets:**
   ```powershell
   git clone https://github.com/awslabs/git-secrets.git
   cd git-secrets
   ./install.sh
   git secrets --install
   ```

## Hjelp

Hvis du trenger hjelp med:
- Finne eksponerte nøkler
- Fjerne nøkler fra git historikk
- Sette opp sikkerhet

Si ifra, så hjelper jeg deg!

