# 🔐 Admin Dashboard Setup Guide

## Oversikt

Admin dashboard gir administratorer mulighet til å:
- Se statistikk over brukere, polls, stemmer og kommentarer
- Se og moderere rapporterte polls
- Slette polls permanent
- Oppdatere status på rapporter

## 📋 Forutsetninger

- Database migrations er kjørt (inkluderer migration 004)
- Backend kjører
- Du har en bruker i databasen

## 🚀 Setup Steg

### Steg 1: Kjør database migrations

Sørg for at alle migrations er kjørt, inkludert de nye:

```bash
cd backend
npm run migrate
```

Dette kjører:
- `001_initial_schema.sql` - Grunnleggende tabeller
- `002_add_categories_and_badges.sql` - Kategorier og badges
- `003_add_poll_moderation.sql` - Poll moderation (rapportering, soft delete)
- `004_add_admin_support.sql` - Admin-støtte (is_admin flag, rapport status)

### Steg 2: Opprett admin-bruker

Du kan gjøre dette på to måter:

**Metode 1: Via SQL (anbefalt)**

```sql
-- Sett en eksisterende bruker som admin
UPDATE users SET is_admin = TRUE WHERE username = 'ditt_brukernavn';
```

**Metode 2: Via psql**

```bash
psql -U postgres -d polls_db -c "UPDATE users SET is_admin = TRUE WHERE username = 'ditt_brukernavn';"
```

### Steg 3: Logg inn med admin-bruker

1. Gå til frontend: http://localhost:5173
2. Logg inn med admin-brukeren
3. Du vil nå se "Admin" link i navigasjonen

### Steg 4: Gå til admin dashboard

1. Klikk på "Admin" i navigasjonen
2. Eller gå direkte til: http://localhost:5173/admin

## 🎯 Funksjonalitet

### Statistikk

Admin dashboard viser:
- Totalt antall brukere
- Totalt antall polls
- Totalt antall stemmer
- Totalt antall kommentarer
- Antall ventende rapporter
- Totalt antall rapporter

### Rapporter

- **Filtrering:** Filtrer rapporter etter status (pending, reviewed, resolved)
- **Detaljer:** Se grunn, beskrivelse, rapporterende bruker, og poll-informasjon
- **Handlinger:**
  - Marker som gjennomgått (pending → reviewed)
  - Marker som løst (reviewed → resolved)
  - Slett poll permanent (hard delete)

### Status-typer

- **Pending:** Ny rapport, ikke gjennomgått
- **Reviewed:** Gjennomgått av admin, men ikke løst
- **Resolved:** Løst/ferdig behandlet

## 🔒 Sikkerhet

- Kun brukere med `is_admin = TRUE` har tilgang
- Alle admin-routes krever autentisering
- Admin middleware sjekker admin-status for hver forespørsel
- Frontend sjekker også admin-status før visning

## 🧪 Testing

### Test admin-tilgang

1. Logg inn med admin-bruker
2. Gå til `/admin`
3. Du skal se dashboard med statistikk

### Test med ikke-admin

1. Logg inn med vanlig bruker
2. Prøv å gå til `/admin`
3. Du skal få "Ingen tilgang" melding

### Test rapportering

1. Logg inn som vanlig bruker
2. Gå til en poll
3. Klikk "Rapporter"
4. Fyll ut skjema og send
5. Logg inn som admin
6. Gå til admin dashboard
7. Du skal se rapporten i listen

## 📝 Notater

- Admin-bruker kan se alle rapporter, ikke bare sine egne
- Permanent sletting (hard delete) kan ikke angres
- Soft delete (fra poll-eier) kan sees i admin dashboard
- Rapporter lagres permanent for historikk

## 🔧 Troubleshooting

### "Ingen tilgang" melding

- Sjekk at bruker har `is_admin = TRUE` i databasen
- Sjekk at du er logget inn
- Sjekk at backend kjører

### Ingen rapporter vises

- Sjekk at migration 003 er kjørt
- Sjekk at `poll_reports` tabell eksisterer
- Sjekk at det faktisk er rapporter i databasen

### Admin link vises ikke

- Sjekk at bruker er admin i databasen
- Sjekk at frontend har kjørt `checkAdminStatus()`
- Sjekk nettleserkonsollen for feil

## 📚 Relatert Dokumentasjon

- `docs/development/TEST_SETUP.md` - Test setup
- `docs/security/SECURITY_AUDIT.md` - Sikkerhetsaudit
- `TODO_SAMLET.md` - Todo-liste

