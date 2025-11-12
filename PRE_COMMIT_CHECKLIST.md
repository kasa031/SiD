# ✅ Pre-Commit Checklist - SiD Prosjekt

## Før du committer og pusher

### 🔒 Sikkerhetssjekk

- [ ] **Ingen API-nøkler i kode**
  ```powershell
  # Kjør denne for å sjekke:
  git diff --cached | Select-String -Pattern "sk-|password|secret|api.*key|OPENROUTER_API_KEY"
  ```
  Hvis noe dukker opp, fjern det først!

- [ ] **Sjekk at .env filer ikke committes**
  - `backend/env` skal IKKE være i commit
  - Kun `env.example` filer skal committes

### 📦 Dependencies

- [ ] **Backend dependencies installert**
  ```powershell
  cd backend
  npm install
  ```

- [ ] **Frontend dependencies installert**
  ```powershell
  cd frontend
  npm install
  ```

### 🧪 Tester (valgfritt, men anbefalt)

- [ ] **Backend tester kjører**
  ```powershell
  cd backend
  npm test
  ```

- [ ] **Frontend tester kjører**
  ```powershell
  cd frontend
  npm test
  ```

### 📝 Commit Melding

Anbefalt commit melding:
```
feat: Legg til automatiserte tester (Jest + Vitest)

- Sett opp Jest for backend testing
- Sett opp Vitest for frontend testing
- Lagt til grunnleggende tester for auth routes og validation utils
- Oppdatert dokumentasjon med test setup guide
- Oppdatert TODO-liste med testing fremgang
```

### 🚀 Push og Deployment

1. **Commit endringene:**
   ```powershell
   git add .
   git commit -m "feat: Legg til automatiserte tester (Jest + Vitest)"
   ```

2. **Push til GitHub:**
   ```powershell
   git push origin main
   ```

3. **Frontend vil automatisk deploye** til GitHub Pages via GitHub Actions

4. **Backend må deployes manuelt** til Railway (se TODO_SAMLET.md)

### ⚠️ Viktig

- **Aldri commit** følsomme data (API-nøkler, passord, etc.)
- **Sjekk alltid** hva som skal committes med `git status` først
- **Test lokalt** først hvis mulig

## 📚 Hjelp

Se `docs/security/SECURITY_CHECK.md` for mer informasjon om sikkerhet.

