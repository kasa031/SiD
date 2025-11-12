# 🔐 GitHub Secrets Guide

## Hvorfor GitHub Secrets?

GitHub Secrets er en sikker måte å lagre sensitive data (API-nøkler, URLer, secrets) i GitHub-repositoryet ditt. Disse hemmelighetene er **ikke synlige** i koden din og kan trygt brukes av GitHub Actions-arbeidsflyter.

## ✅ Secrets du må legge til for SiD-prosjektet

### 1. VITE_API_URL (Obligatorisk etter Railway deploy)

**Hva:** Backend API URL for frontend-bygget.

**Hvorfor:** Frontend må vite hvor backend er når den bygges. Dette settes som environment variable under build.

**Hvordan:**
1. Gå til: https://github.com/kasa031/SiD/settings/secrets/actions
2. Klikk "New repository secret"
3. **Name:** `VITE_API_URL`
4. **Secret:** Din Railway backend URL (f.eks. `https://sid-production.up.railway.app/api`)
5. Klikk "Add secret"

**Når:** Legg til dette **etter** du har deployet backend til Railway og fått backend URL.

**Viktig:** 
- Ikke legg til denne før backend er deployet (bruker fallback-verdi i mellomtiden)
- Dette er den **eneste** secret du trenger for GitHub Pages deploy

## 🔒 Backend Secrets (Railway, ikke GitHub)

Backend-secrets (som `JWT_SECRET`, `OPENROUTER_API_KEY`, `DATABASE_URL`) settes **direkte i Railway**, ikke i GitHub Secrets. Railway har sin egen sikker håndtering av environment variables.

**Hvorfor:**
- Backend kjører på Railway, ikke GitHub Actions
- Railway har eget sikker system for secrets
- GitHub Secrets er kun for GitHub Actions-arbeidsflyter

## 📋 Checklist

**Før Railway deploy:**
- [ ] Ingen secrets nødvendig i GitHub ennå

**Etter Railway deploy:**
- [ ] Legg til `VITE_API_URL` som GitHub Secret
- [ ] Trigger ny GitHub Actions deploy (push til GitHub)
- [ ] Verifiser at frontend bygges med riktig backend URL

## 🎯 Resultat

Etter dette vil:
- ✅ Frontend bygges med riktig backend URL
- ✅ Alle secrets er sikker lagret
- ✅ Ingen sensitive data i kode
- ✅ Automatisk deploy fungerer perfekt

## ⚠️ Sikkerhet

**VIKTIG:**
- ❌ **ALDRIG** committ API keys eller secrets til Git
- ✅ **ALDRIG** hardkode sensitive data i kode
- ✅ **BARE** bruk GitHub Secrets eller Railway environment variables
- ✅ Sjekk `.gitignore` at `.env` filer er ignorert

## 📖 Relaterte filer

- `.github/workflows/deploy.yml` - Bruker `VITE_API_URL` secret
- `backend/env.example` - Template for lokale environment variables
- `SECURITY_POLICY.md` - Generell sikkerhetspolicy

