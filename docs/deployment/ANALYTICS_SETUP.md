# 📊 Google Analytics Setup Guide

## Oversikt

Google Analytics er implementert i prosjektet og klar til bruk. Analytics er kun aktiv i produksjon og krever en Measurement ID.

## ✅ Hva er implementert

- Google Analytics 4 (GA4) integrasjon
- Automatisk page view tracking
- Event tracking funksjoner (poll creation, votes, comments, etc.)
- Development mode detection (ikke aktiv i dev)

## 🔧 Slik aktiverer du Google Analytics

### Steg 1: Opprett Google Analytics Property

1. Gå til [Google Analytics](https://analytics.google.com/)
2. Opprett en ny property (hvis du ikke har en)
3. Velg "Web" som platform
4. Fyll inn nettstedets navn og URL
5. Kopier **Measurement ID** (ser ut som: `G-XXXXXXXXXX`)

### Steg 2: Legg til Measurement ID

**For GitHub Pages deployment:**

1. Gå til GitHub repository → Settings → Secrets → Actions
2. Legg til ny secret:
   - **Name:** `VITE_GA_MEASUREMENT_ID`
   - **Value:** Din Measurement ID (f.eks. `G-XXXXXXXXXX`)

**For lokal testing:**

Opprett `.env` fil i `frontend/` mappen:
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Steg 3: Deploy

Etter at du har lagt til Measurement ID:
- GitHub Actions vil automatisk bruke den ved build
- Analytics vil være aktiv i produksjon
- Analytics er **ikke aktiv** i development mode

## 📈 Trackede Events

Følgende events er implementert og kan brukes:

### Automatisk Tracking
- **Page views** - Automatisk når bruker navigerer

### Manuell Event Tracking

```javascript
import { 
  trackEvent, 
  trackPollCreation, 
  trackVote, 
  trackComment,
  trackRegistration,
  trackLogin 
} from './utils/analytics';

// Poll opprettelse
trackPollCreation(pollId, category);

// Stemme
trackVote(pollId, optionId);

// Kommentar
trackComment(pollId);

// Registrering
trackRegistration();

// Innlogging
trackLogin();

// Custom event
trackEvent('custom_event_name', {
  custom_param: 'value'
});
```

## 🔍 Verifisering

### Sjekk at Analytics fungerer:

1. Deploy til produksjon med Measurement ID
2. Besøk nettsiden
3. Gå til Google Analytics → Realtime
4. Du skal se aktivitet innen 1-2 minutter

### Development Mode

I development mode:
- Analytics er **ikke aktiv**
- Console logger: "Google Analytics ikke aktivert (development mode eller manglende ID)"
- Dette er for å unngå test-data i Analytics

## 📝 Notater

- Analytics er kun aktiv i produksjon (`import.meta.env.PROD`)
- Measurement ID må settes via environment variable
- Alle events er anonymisert (ingen personlig informasjon)
- Følger GDPR-retningslinjer (ingen cookies uten samtykke)

## 🛠️ Feilsøking

**Analytics fungerer ikke:**
1. Sjekk at `VITE_GA_MEASUREMENT_ID` er satt korrekt
2. Sjekk at du er i produksjon (ikke development)
3. Sjekk browser console for feilmeldinger
4. Verifiser at CSP tillater Google Analytics (se `backend/src/middleware/security.js`)

**Events vises ikke:**
1. Vent 1-2 minutter (realtime kan ha delay)
2. Sjekk at event tracking funksjoner kalles
3. Sjekk Google Analytics → Events i dashboard

