# iOS/iPadOS — Guia ràpida

1) Instal·la plataforma iOS:
```bash
npm i @capacitor/ios
npx cap add ios
```
2) Build i sincronitza:
```bash
npm run build
npx cap copy
npx cap open ios
```
3) A Xcode:
- Afegeix `NSMicrophoneUsageDescription` a Info.plist (per a gravacions).
- Signa amb el teu equip Apple Developer.
- Compila per a simulador o dispositiu real.
