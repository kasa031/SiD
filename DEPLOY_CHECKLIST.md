# ✅ Deployment Checklist

## Lokalt (Ferdig ✅)

- [x] Git repository initialisert
- [x] Alle filer committed
- [x] Branch satt til `main`
- [x] `.gitignore` konfigurert (backend/env ekskludert)
- [x] GitHub Actions workflow opprettet
- [x] Vite base path konfigurert

## GitHub (Du må gjøre dette)

- [ ] Opprett repository på https://github.com/new
- [ ] Koble remote: `git remote add origin <URL>`
- [ ] Push: `git push -u origin main`
- [ ] Aktiver GitHub Pages (Settings → Pages → GitHub Actions)
- [ ] Vent på deployment (2-5 minutter)

## Testing

- [ ] Verifiser at alle filer er på GitHub
- [ ] Sjekk at GitHub Actions workflow kjører
- [ ] Test at nettsiden fungerer på GitHub Pages
- [ ] Sjekk at backend kan koble til (hvis deployet)

## Backend Deployment (Senere)

- [ ] Velg hosting platform (Heroku/Railway/Render)
- [ ] Deploy backend
- [ ] Sett opp database
- [ ] Oppdater frontend API URL
- [ ] Test full funksjonalitet

## Ferdig! 🎉

Når alt er deployet:
- Frontend: `https://ditt-brukernavn.github.io/polls-nettside/`
- Backend: `https://din-backend-url.com`

