# Testing Guide for SiD

## Hvordan teste nettstedet lokalt

### 1. Backend Setup

```powershell
# Gå til backend-mappen
cd backend

# Installer dependencies (hvis ikke allerede gjort)
npm install

# Start backend serveren
npm start
```

Backend serveren kjører nå på `http://localhost:3001`

### 2. Frontend Setup

```powershell
# Gå til frontend-mappen (i en ny terminal)
cd frontend

# Installer dependencies (hvis ikke allerede gjort)
npm install

# Start utviklingsserveren
npm run dev
```

Frontend serveren kjører nå på `http://localhost:5173` (eller annen port hvis opptatt)

### 3. Database Setup

Sørg for at PostgreSQL kjører og at du har:
- Laget en database
- Kjørte migrasjonene fra `database/migrations/`
- Satt opp `DATABASE_URL` i `backend/.env`

### 4. Testing Funksjoner

#### Test Autentisering
1. Gå til `/register` og opprett en ny bruker
2. Logg inn med brukeren på `/login`
3. Sjekk at du blir sendt til forsiden etter innlogging

#### Test Poll Opprettelse
1. Logg inn
2. Gå til `/create-poll`
3. Opprett en poll med:
   - Tittel (minst 3 tegn)
   - Minst 2 alternativer
   - Kategori (valgfritt)
   - Lokasjon (land eller by)
4. Sjekk at pollen vises på forsiden

#### Test Stemmegiving
1. Gå til en poll-detaljside
2. Velg et alternativ og stem
3. Sjekk at toast-melding vises
4. Sjekk at du ikke kan stemme igjen

#### Test Kommentarer
1. Gå til en poll-detaljside
2. Skriv en kommentar
3. Sjekk at kommentaren vises

#### Test Søk
1. Gå til `/search`
2. Test tekstsøk
3. Test kategori-filtrering
4. Test lokasjons-filtrering

#### Test Statistikk
1. Gå til `/stats`
2. Sjekk at oversikt vises
3. Test kategori-filtrering
4. Sjekk by-sammenligning

#### Test Badges
1. Stem på flere polls
2. Opprett polls
3. Skriv kommentarer
4. Gå til profilen din
5. Sjekk at badges vises

#### Test Responsivt Design
1. Åpne nettleseren i utviklermodus (F12)
2. Test på iPhone-størrelse (375px)
3. Test på iPad-størrelse (768px)
4. Test på desktop

### 5. Test Feilhåndtering

#### Test Validering
1. Prøv å registrere bruker med:
   - For kort brukernavn (< 3 tegn)
   - For kort passord (< 6 tegn)
   - Ugyldig e-post
2. Sjekk at valideringsmeldinger vises

#### Test Error Boundary
1. Åpne nettleserkonsollen (F12)
2. Prøv å trigge en feil (f.eks. ved å endre kode)
3. Sjekk at error boundary vises

#### Test Toast Notifications
1. Utfør ulike handlinger (stemme, kommentere, etc.)
2. Sjekk at toast-meldinger vises
3. Sjekk at de forsvinner automatisk

### 6. Test på GitHub Pages

Nettstedet er automatisk deployet til GitHub Pages når du pusher til `main` branch.

1. Gå til `https://kasa031.github.io/SiD/`
2. Test alle funksjoner på produksjonsversjonen

### 7. Testing med flere brukere

1. Opprett flere brukere
2. Test at hver bruker kun kan stemme én gang per poll
3. Test at badges tildeles korrekt
4. Test at statistikk oppdateres

## Troubleshooting

### Backend starter ikke
- Sjekk at port 3001 ikke er opptatt
- Sjekk at DATABASE_URL er satt riktig i `.env`
- Sjekk at PostgreSQL kjører

### Frontend starter ikke
- Sjekk at port 5173 ikke er opptatt
- Kjør `npm install` igjen
- Sjekk at Node.js er installert

### Database-feil
- Sjekk at migrasjonene er kjørt
- Sjekk at DATABASE_URL er korrekt
- Sjekk at tabellene eksisterer

### CORS-feil
- Sjekk at FRONTEND_URL er satt riktig i backend `.env`
- Sjekk at backend kjører på riktig port

