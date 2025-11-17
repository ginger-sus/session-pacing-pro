# Android (APK) — Guia ràpida

1) Instal·la dependències Capacitor:
```bash
npm i @capacitor/core @capacitor/cli @capacitor/android
```
2) Inicialitza i afegeix Android:
```bash
npx cap init "SessionPacing" com.example.sessionpacing
npx cap add android
```
3) Build i copia:
```bash
npm run build
npx cap copy
npx cap open android
```
4) A Android Studio:
- Ajusta `minSdkVersion` si cal.
- Signa i genera APK/AAB (Build > Generate Signed Bundle/APK).
- Concedeix permís de micròfon a l'app si uses gravacions.
