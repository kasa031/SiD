# ⚠️ VIKTIG: API-nøkkel sikkerhet

## ⚠️ ALDRI DEL API-NØKKLER I CHAT!

Jeg har nå lagt til API-nøkkelen din i `backend/env` filen, som er i `.gitignore` og vil **IKKE** bli committet.

## Hva jeg har gjort:

1. ✅ Lagt til nøkkelen i `backend/env` (ikke committet)
2. ✅ Satt opp OpenRouter API integrasjon
3. ✅ Laget sikre API routes som krever autentisering
4. ✅ Nøkkelen brukes kun via environment variable

## Hvor nøkkelen er:

- ✅ `backend/env` - Lokal fil, ikke i git
- ❌ IKKE i kode
- ❌ IKKE i git historikk
- ❌ IKKE i GitHub

## Nye funksjoner:

### 1. Poll Suggestions (`/api/ai/suggest-poll`)
- Generer poll-forslag basert på et emne
- Krever autentisering
- Bruker AI til å lage balanserte poll-options

### 2. Comment Analysis (`/api/ai/analyze-comments`)
- Analyser sentiment i kommentarer
- Krever autentisering
- Gir oppsummering av kommentarer

## For fremtiden:

**⚠️ ALDRI:**
- Del API-nøkler i chat
- Committ `.env` filer
- Hardcode nøkler i kode

**✅ ALLTID:**
- Bruk environment variables
- Legg nøkler i `.env` filer
- Sjekk at `.env` er i `.gitignore`

## Hvis nøkkelen er kompromittert:

1. Gå til OpenRouter dashboard
2. Slett den gamle nøkkelen
3. Generer en ny nøkkel
4. Oppdater `backend/env` med ny nøkkel

## Nøkkelen er nå sikker!

✅ I `.env` fil (ikke committet)
✅ Brukt via `process.env.OPENROUTER_API_KEY`
✅ Beskyttet av pre-commit hooks
✅ Ikke eksponert i kode eller git

