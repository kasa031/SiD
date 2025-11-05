# 🔒 Sikkerhetsforbedringer - SiD Prosjekt

## Implementerte forbedringer

### 1. ✅ Rate Limiting
- **Auth endpoints**: 5 forsøk per 15 minutter
- **API endpoints**: 100 forespørsler per 15 minutter  
- **Poll creation**: 10 polls per time
- **Beskyttelse mot**: Brute force attacks, DDoS

### 2. ✅ Security Headers (Helmet)
- Content Security Policy
- XSS Protection
- Frame Options
- HSTS (HTTP Strict Transport Security)
- **Beskyttelse mot**: XSS, clickjacking, MIME-sniffing

### 3. ✅ Input Sanitization
- Automatisk sanitization av all input
- Fjerner HTML tags og scripts
- Trim whitespace
- **Beskyttelse mot**: XSS, injection attacks

### 4. ✅ Input Validation
- Validering av brukernavn (3-50 tegn, alfanumerisk)
- Validering av passord (minst 8 tegn, bokstav + tall)
- Validering av e-post format
- Validering av poll-titler og kommentarer
- **Beskyttelse mot**: Invalid input, injection attacks

### 5. ✅ CORS Konfigurasjon
- Whitelist av tillatte origins
- Begrenset til spesifikke domener
- **Beskyttelse mot**: Cross-origin attacks

### 6. ✅ JWT Token Security
- Token expiration redusert fra 7 dager til 24 timer
- Kortere levetid = mindre risiko ved kompromittering
- **Beskyttelse mot**: Token hijacking

### 7. ✅ Body Size Limits
- JSON limit: 10MB
- URL encoded limit: 10MB
- **Beskyttelse mot**: DoS via store payloads

### 8. ✅ SQL Injection Protection
- Alltid bruker parameterized queries ($1, $2, etc.)
- Ingen string concatenation i SQL queries
- **Beskyttelse mot**: SQL injection

### 9. ✅ Password Security
- Bcrypt hashing (10 rounds)
- Minimum 8 tegn
- Må inneholde bokstav + tall
- **Beskyttelse mot**: Password cracking

### 10. ✅ File Upload Security
- Multer konfigurert med filtype/kjørbarfil-validering
- Filstørrelse-begrensninger
- **Beskyttelse mot**: Malicious file uploads

## Nye filer

1. **`backend/src/middleware/security.js`**
   - Rate limiting middleware
   - Security headers
   - Input sanitization

2. **`backend/src/utils/validation.js`**
   - Input validation utilities
   - Sanitization functions

3. **`backend/env.example`**
   - Template for environment variables
   - Ingen faktiske secrets

## Sikkerhetspraksis

### ✅ Gjort
- `.env` filer i `.gitignore`
- Parameterized SQL queries
- Password hashing
- JWT authentication
- Rate limiting
- Input validation
- CORS whitelisting

### ⚠️ For produksjon
1. **Endre JWT_SECRET** til en sterk, tilfeldig streng
   ```bash
   openssl rand -base64 32
   ```

2. **Database credentials**
   - Bruk sterke passord
   - Ikke commit `.env` filer
   - Bruk environment variables i hosting

3. **HTTPS**
   - Aktiver HTTPS i produksjon
   - Bruk Let's Encrypt eller lignende

4. **Monitoring**
   - Logge sikkerhetshendelser
   - Sette opp alerts for mistenkelig aktivitet

5. **Regular updates**
   - Hold dependencies oppdatert
   - `npm audit` regelmessig
   - Oppdater Node.js versjon

## Nye pakker

Installert:
- `express-rate-limit` - Rate limiting
- `helmet` - Security headers

## Testing

Test at sikkerhetsforbedringene fungerer:
1. Prøv å gjøre for mange login-forsøk (skal blokkere)
2. Prøv å sende HTML/script i input (skal sanitizes)
3. Prøv ugyldig input (skal validere)
4. Sjekk response headers (skal ha security headers)

## Notater

- Alle endringer er bakoverkompatible
- Ingen breaking changes
- Eksisterende funksjonalitet fungerer som før
- Bedre sikkerhet uten å påvirke UX

