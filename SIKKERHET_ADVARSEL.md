# ⚠️ Sikkerhetsadvarsel - API-nøkler i dokumentasjon

## Viktig informasjon

Det er **faktiske API-nøkler** i noen dokumentasjonsfiler i prosjektet. Disse er i:
- `docs/deployment/*.md` filer
- `TODO_SAMLET.md` (nå oppdatert med placeholder)

## Hva betyr dette?

- API-nøklene er i **dokumentasjonsfiler**, ikke i faktisk kode
- De er allerede eksponert i git-historikken hvis de har blitt committet før
- De bør **roteres** i OpenRouter dashboard hvis du er bekymret

## Anbefalinger

1. **Rotér API-nøkkelen** i OpenRouter dashboard:
   - Gå til https://openrouter.ai/keys
   - Lag en ny nøkkel
   - Slett eller deaktiver den gamle

2. **Oppdater dokumentasjonen** (valgfritt):
   - Erstatt faktiske nøkler med placeholders som `din_api_key_her`
   - Dette er allerede gjort i `TODO_SAMLET.md`

3. **Fremtidig praksis:**
   - Bruk alltid placeholders i dokumentasjon
   - Bruk environment variables i kode
   - Aldri commit faktiske nøkler

## Er det trygt å committe nå?

**JA**, fordi:
- Nøklene er allerede i git-historikken (hvis de har blitt committet før)
- De er kun i dokumentasjonsfiler, ikke i kode
- Du kan rotere nøkkelen i OpenRouter hvis nødvendig

**MEN**, vurder å:
- Rotere API-nøkkelen i OpenRouter
- Oppdatere dokumentasjonsfiler med placeholders (valgfritt)

## Hjelp

Hvis du trenger hjelp med å:
- Rotere API-nøkkelen
- Oppdatere dokumentasjon
- Sjekke git-historikk

Si ifra, så hjelper jeg deg!

