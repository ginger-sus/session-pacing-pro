# Session Pacing Pro (PWA + Capacitor)

Aplicació web instal·lable (PWA) amb **cicles personalitzats**, **avisos amb TTS o gravacions**, **temes i paletes**, **idiomes (ca/es/en/fr)**, i **import/export** de configuració. També preparada per a empaquetar-se com **APK Android** i projecte **iOS/iPadOS** amb Capacitor.

## 🚀 Com provar-la (mode desenvolupament)
1. **Requisits**: Node 18+ i npm o pnpm.
2. Instal·la dependències:
   ```bash
   npm i
   ```
3. Executa en desenvolupament:
   ```bash
   npm run dev
   ```
4. Obri l’URL que et diga Vite (normalment http://localhost:5173).

## 📦 Build de producció (PWA)
```bash
npm run build
npm run preview
```
Els fitxers estan a `dist/`. Servix-los via HTTPS per a PWA i TTS estables.

## 📲 Instal·lable (PWA)
- Inclou `public/manifest.webmanifest` i `src/sw.ts` (service worker bàsic).
- En navegadors mòbils i d’escriptori apareixerà l’opció “Afegir a la pantalla d’inici / Install app”.

## 🤖 APK Android (Capacitor)
1. Instal·la Capacitor:
   ```bash
   npm i @capacitor/core @capacitor/cli @capacitor/android
   ```
2. Inicialitza i agrega Android:
   ```bash
   npx cap init "SessionPacing" com.example.sessionpacing
   npx cap add android
   ```
3. Build web i copia:
   ```bash
   npm run build
   npx cap copy
   npx cap open android
   ```
4. A Android Studio: signa i genera **APK/AAB** (vegeu `capacitor/ANDROID.md`).

## 🍎 iOS/iPadOS (Capacitor)
1. Afegeix iOS:
   ```bash
   npm i @capacitor/ios
   npx cap add ios
   npm run build && npx cap copy && npx cap open ios
   ```
2. A Xcode: afegeix **NSMicrophoneUsageDescription** a `Info.plist`, signa i compila (vegeu `capacitor/IOS.md`).

## 🔄 Import/Export i Compartició
- Botons dins l’app: **Importa configuració**, **Exporta configuració**, **Comparteix configuració** (Web Share API o còpia al porta-retalls).
- Les **gravacions** s’emmagatzemen com **dataURL** (base64) a localStorage i dins del JSON d’exportació.

## 🛡️ Privacitat i ús responsable
- Tot queda **local** al navegador fins que ho exportes.
- L’app és **genèrica** i **no mèdica**.


## 🛠️ Build automàtic (CI)

### Android (APK Debug) — GitHub Actions
- Workflow: `.github/workflows/android.yml`
- Quan faces push a `main` o el llances manualment, compila i et dona **app-debug.apk** com a Artifact.

### iOS (Simulator Debug) — GitHub Actions
- Workflow: `.github/workflows/ios.yml`
- Compila per a simulador i puja els artefactes de build (DerivedData). Per a arxiu/signatura caldrà macOS, Xcode i certificat.

## 🧰 Scripts locals
- `scripts/build-android.sh` → crea un **APK Debug** localment.
- `scripts/build-ios.sh` → compila per a **iOS (simulador)** localment.
