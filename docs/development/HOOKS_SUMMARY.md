# 🔒 Pre-commit Hooks - Oppsummering

## Hva er satt opp

Jeg har laget automatisk beskyttelse mot å committe sensitive data:

### ✅ Pre-commit Hook

**Fungerer automatisk før hver commit:**
- 🔍 Sjekker alle filer som skal committes
- 🚫 Blokkerer commits med `.env` filer
- 🚫 Blokkerer commits med API-nøkler (`sk-...`, `sk_...`)
- 🚫 Blokkerer commits med passord og secrets
- ✅ Tillater dokumentasjonsfiler (`.md`, `.txt`, etc.)

### ✅ Pre-push Hook

**Fungerer automatisk før hver push:**
- 🔍 Dobbeltsjekker alle commits
- 🚫 Blokkerer push hvis sensitive data er funnet

## Hva som blokkeres

### Filnavn som blokkeres:
- `.env`
- `backend/env`
- `*.env` (uten .example)
- `secrets`
- `*.key`, `*.pem`

### Innhhold som blokkeres:
- API-nøkler: `sk-...` eller `sk_...` (32+ tegn)
- Passord i kode: `password="..."` (12+ tegn)
- Database URL med passord: `postgresql://user:pass@...`
- JWT secrets: `JWT_SECRET="..."` (20+ tegn)

### Hva som IKKE blokkeres:
- Dokumentasjonsfiler (`.md`, `.txt`, `.rst`)
- `.env.example` filer
- Eksempler i dokumentasjon

## Test at det fungerer

```powershell
# Test at hooken fungerer
echo "sk-123456789012345678901234567890" > test.txt
git add test.txt
git commit -m "test"
# Skal blokkere commit
```

## Hvis du trenger å committe noe spesielt

Hvis du virkelig må committe noe som hooken blokkerer (ikke sensitive data!), kan du:

```powershell
# Bypass hook (IKKE anbefalt!)
git commit --no-verify -m "message"
```

**⚠️ Viktig:** Bare gjør dette hvis du er 100% sikker på at det ikke er sensitive data!

## Oppsummering

✅ **Pre-commit hooks er aktivert**
✅ **Automatisk beskyttelse mot sensitive data**
✅ **Dokumentasjonsfiler tillates**
✅ **Fungerer for både bash og PowerShell**

Du er nå beskyttet mot å ved et uhell committe API-nøkler eller andre sensitive data!

