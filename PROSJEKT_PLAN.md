# 🗳️ Polls-Nettside Prosjektplan

## 📋 Oversikt
En interaktiv polls-nettside som kobler folket og politikere sammen gjennom meningsmålinger. Prosjektet skal deployes til GitHub Pages.

---

## 🎯 Funksjonelle Krav

### 1. **Autentisering**
- ✅ Brukernavn og passord login
- ✅ Registrering av nye brukere
- ✅ JWT-basert autentisering
- ✅ Session management

### 2. **Brukerprofil**
- ✅ Profilbilde-opplasting og visning
- ✅ Brukerinformasjon
- ✅ Visning av brukerens egne polls
- ✅ Visning av brukerens stemmer

### 3. **Poll-funksjonalitet**
- ✅ Opprette nye polls (kun innloggede brukere)
- ✅ Vise alle polls med detaljer
- ✅ Stemme på polls (maks én stemme per bruker per poll)
- ✅ Validering av stemmer (forhindre dobbeltstemming)
- ✅ Visning av resultater i real-time

### 4. **Søk og Filtrering**
- ✅ Søk i polls (tekstbasert)
- ✅ Filtrer etter geografisk område (by eller hele landet)
- ✅ Søk etter politiker-navn (for politikere)

### 5. **Kommentarer**
- ✅ Legge til kommentarer på polls
- ✅ Vise alle kommentarer på en poll
- ✅ Kommentarer knyttet til bruker som kommenterte

### 6. **Politiker-tagging**
- ✅ Tagge politikere i polls når man oppretter dem
- ✅ Politikere kan søke opp navnet sitt
- ✅ Visning av alle polls hvor en politiker er tagget

### 7. **Geografisk Funksjonalitet**
- ✅ Kategorisere polls etter by eller "Hele landet"
- ✅ Søk basert på geografisk område

---

## 🏗️ Teknisk Arkitektur

### Frontend
- **Teknologi:** React med TypeScript (eller Next.js med static export for GitHub Pages)
- **Styling:** CSS med knalle farger (rødt, grønt, blått) + kontrast-hensyn
- **Deployment:** GitHub Pages

### Backend
- **Teknologi:** Node.js + Express
- **Database:** PostgreSQL (bruker eksisterende setup)
- **Autentisering:** JWT tokens
- **API:** RESTful API

### Database Tabeller
1. **users**
   - id, username, password_hash, email, profile_picture_url, created_at

2. **polls**
   - id, creator_id, title, description, location_type (by/land), location_name, created_at, ends_at

3. **poll_options**
   - id, poll_id, option_text, votes_count

4. **votes**
   - id, poll_id, user_id, option_id, created_at

5. **comments**
   - id, poll_id, user_id, content, created_at

6. **politician_tags**
   - id, poll_id, politician_name, created_at

---

## 🎨 Design Krav

### Farger
- **Primærfarger:** Rødt, grønt, blått (knalle farger)
- **Kontrast:** Minst WCAG AA standard for lesbarhet
- **Bakgrunn:** Mørk eller lys basert på kontrast-hensyn

### UI/UX
- Norsk tekst overalt
- Responsivt design
- Klar og intuitiv navigasjon
- Tydelig visning av poll-resultater

---

## 📁 Prosjektstruktur

```
polls-nettside/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.ts (eller Next.js config)
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── services/
│   ├── env
│   └── package.json
├── database/
│   └── migrations/
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

---

## 🚀 Implementasjonsfaser

### Fase 1: Grunnleggende Setup
1. Opprett prosjektstruktur
2. Setup database (PostgreSQL)
3. Backend API grunnlag
4. Frontend setup

### Fase 2: Autentisering og Brukere
1. Brukerregistrering
2. Login funksjonalitet
3. JWT autentisering
4. Profilbilde-opplasting

### Fase 3: Poll Core Funksjonalitet
1. Opprette polls
2. Vise polls
3. Stemme på polls
4. Validering av stemmer

### Fase 4: Avanserte Funksjoner
1. Kommentarer
2. Politiker-tagging
3. Søk og filtrering
4. Geografisk søk

### Fase 5: Design og Polishing
1. Styling med knalle farger
2. Responsivt design
3. Kontrast-optimalisering
4. Norsk tekst

### Fase 6: Deployment
1. GitHub Pages setup
2. CI/CD pipeline
3. Testing

---

## 📝 Notater
- Alle tekster skal være på norsk
- Prosjektet skal være enkelt og fokusert (kun det som trengs)
- GitHub Pages krever statisk frontend eller Next.js med static export

