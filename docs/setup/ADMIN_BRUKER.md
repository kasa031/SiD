# 🔐 Admin Bruker - mstery

## Brukernavn

**Admin brukernavn:** `mstery`

## 📝 Steg for å aktivere admin

### Steg 1: Sjekk om brukeren eksisterer

```sql
SELECT username, is_admin FROM users WHERE username = 'mstery';
```

### Steg 2: Hvis brukeren ikke eksisterer

1. Gå til: http://localhost:5173/register
2. Registrer med brukernavn: `mstery`
3. Velg et sterkt passord

### Steg 3: Sett brukeren som admin

```sql
UPDATE users SET is_admin = TRUE WHERE username = 'mstery';
```

### Steg 4: Verifiser

```sql
SELECT username, is_admin FROM users WHERE username = 'mstery';
```

Resultatet skal vise `is_admin = TRUE`.

## 🔗 Tilgang

- **Admin Dashboard:** http://localhost:5173/admin
- **Produksjon:** https://kasa031.github.io/SiD/admin

## 📚 Se også

- `docs/development/ADMIN_SETUP.md` - Full admin setup guide

