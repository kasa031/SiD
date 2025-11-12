# 🔧 Railway Deployment Fix - Viktig!

## ❌ Problem
Railway feiler med: "Nixpacks was unable to generate a build plan"

## ✅ Løsning: Sett Root Directory

Railway ser i rot-mappen, men backend ligger i `backend/` mappen.

### Steg-for-steg:

1. **I Railway dashboard:**
   - Klikk på backend service (den som feilet)
   - Gå til **"Settings"** tab
   - Scroll ned til **"Root Directory"** seksjon
   - Sett til: **`backend`**
   - Klikk **"Save"**

2. **Railway vil automatisk redeploye:**
   - Vent 2-3 minutter
   - Sjekk "Deployments" tab
   - Nå skal det fungere! ✅

## 🎯 Etter dette:

1. Legg til PostgreSQL database
2. Sett environment variables
3. Kjør migrations
4. Få backend URL
5. Oppdater frontend

Se `DEPLOY_NOW.md` for full guide!

