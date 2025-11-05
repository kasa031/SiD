# 🔧 Deployment Fixes - GitHub Pages

## ✅ Fikset i siste commit:

1. **Duplikat npm install:** Fjernet duplikat install i workflow
2. **Bedre caching:** Bruker `npm ci` for raskere, mer konsistent install
3. **Permissions:** Lagt til `contents: write` for github-actions bot

## 🔍 Hvis deploy fortsatt feiler:

### Sjekk disse tingene:

1. **GitHub Pages er aktivert:**
   - Gå til: https://github.com/kasa031/SiD/settings/pages
   - Source: Velg "Deploy from a branch"
   - Branch: Velg `gh-pages` / `(root)`
   - Klikk "Save"

2. **Sjekk GitHub Actions logg:**
   - Gå til: https://github.com/kasa031/SiD/actions
   - Klikk på den nyeste workflow-kjøringen
   - Se på "Build frontend" steget - hva er feilmeldingen?

3. **Vanlige feil og løsninger:**

   **Feil: "npm ci failed"**
   - Løsning: Sjekk at `package.json` er korrekt
   - Sjekk at alle dependencies er listet

   **Feil: "Build failed"**
   - Løsning: Test lokalt: `cd frontend && npm run build`
   - Hvis det fungerer lokalt, kan det være env variabel problem

   **Feil: "Permission denied"**
   - Løsning: Sjekk at `permissions: contents: write` er i workflow
   - Sjekk at GitHub Pages er aktivert

   **Feil: "gh-pages branch not found"**
   - Løsning: GitHub Actions oppretter branch automatisk
   - Vent på at første deploy fullfører

## 📋 Test lokalt først:

```bash
cd frontend
npm install
npm run build
```

Hvis dette fungerer lokalt, skal det fungere på GitHub Actions også.

## 🎯 Neste steg:

1. Vent på at GitHub Actions fullfører (2-3 minutter)
2. Sjekk status: https://github.com/kasa031/SiD/actions
3. Hvis det fortsatt feiler, kopier feilmeldingen og send til meg

## 📖 Relaterte filer:

- `.github/workflows/deploy.yml` - Workflow konfigurasjon
- `frontend/package.json` - Frontend dependencies
- `frontend/vite.config.js` - Vite build konfigurasjon

