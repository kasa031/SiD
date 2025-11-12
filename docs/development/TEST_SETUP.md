# 🧪 Test Setup Guide - SiD Prosjekt

## Oversikt

Prosjektet har nå automatiserte tester satt opp for både frontend og backend:

- **Backend:** Jest med Supertest for API-testing
- **Frontend:** Vitest med React Testing Library for komponent-testing

## 📦 Installasjon

### Backend

```bash
cd backend
npm install
```

Dette installerer:
- `jest` - Test-rammeverk
- `supertest` - HTTP assertions for API-testing

### Frontend

```bash
cd frontend
npm install
```

Dette installerer:
- `vitest` - Test-rammeverk (kompatibel med Vite)
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - DOM matchers
- `@testing-library/user-event` - User interaction testing
- `jsdom` - DOM environment for testing

## 🚀 Kjøre Tester

### Backend Tester

```bash
cd backend
npm test
```

Kjøre tester i watch mode:
```bash
npm run test:watch
```

### Frontend Tester

```bash
cd frontend
npm test
```

Kjøre tester med UI:
```bash
npm run test:ui
```

Kjøre tester med coverage:
```bash
npm run test:coverage
```

## 📁 Test Struktur

### Backend

```
backend/
├── __tests__/
│   ├── routes/
│   │   └── auth.test.js          # Auth endpoint tester
│   └── utils/
│       └── validation.test.js     # Validation utility tester
└── jest.config.js                 # Jest konfigurasjon
```

### Frontend

```
frontend/
├── src/
│   └── __tests__/
│       ├── setup.js               # Test setup og konfigurasjon
│       ├── components/
│       │   └── LoadingSpinner.test.jsx
│       └── utils/
│           └── validation.test.js
└── vite.config.js                 # Vite konfigurasjon (inkluderer test config)
```

## ✅ Eksisterende Tester

### Backend

1. **Auth Routes** (`backend/__tests__/routes/auth.test.js`)
   - Registrering med validering
   - Login med validering
   - Feilhåndtering

2. **Validation Utils** (`backend/__tests__/utils/validation.test.js`)
   - Username validering
   - Password validering
   - Email validering
   - Poll title validering
   - Location name validering
   - Sanitization

### Frontend

1. **Validation Utils** (`frontend/src/__tests__/utils/validation.test.js`)
   - Alle valideringsfunksjoner
   - Edge cases

2. **Komponenter** (`frontend/src/__tests__/components/LoadingSpinner.test.jsx`)
   - LoadingSpinner komponent
   - Props testing

## 📝 Skrive Nye Tester

### Backend Test Eksempel

```javascript
import request from 'supertest';
import express from 'express';
import yourRoutes from '../../src/routes/yourRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/your', yourRoutes);

describe('Your Routes', () => {
  it('skal gjøre noe', async () => {
    const response = await request(app)
      .get('/api/your/endpoint')
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
  });
});
```

### Frontend Test Eksempel

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import YourComponent from '../../components/YourComponent.jsx';

describe('YourComponent', () => {
  it('skal rendre korrekt', () => {
    render(<YourComponent prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## 🎯 Neste Steg

For å utvide testdekningen, vurder å legge til:

1. **Backend:**
   - Polls routes tester
   - Votes routes tester
   - Comments routes tester
   - Stats routes tester
   - Badges routes tester

2. **Frontend:**
   - Alle komponenter
   - Side-komponenter (pages)
   - Integration tests
   - E2E tests (med Playwright eller Cypress)

## 🔧 Troubleshooting

### Backend tester feiler

- Sjekk at database mock er satt opp riktig
- Sjekk at alle dependencies er installert
- Sjekk at Jest konfigurasjon er korrekt

### Frontend tester feiler

- Sjekk at `setup.js` er konfigurert riktig
- Sjekk at `vite.config.js` har test-konfigurasjon
- Sjekk at alle dependencies er installert

## 📚 Ressurser

- [Jest Dokumentasjon](https://jestjs.io/)
- [Vitest Dokumentasjon](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Dokumentasjon](https://github.com/visionmedia/supertest)

