#!/usr/bin/env bash
set -euo pipefail

# Debug APK local build script
# Requirements:
# - Node 18+, Java 17, Android SDK with cmdline-tools, ANDROID_HOME set
# - Capacitor CLI installed (npx is fine)
# - Gradle will be handled by Android project wrapper

echo "== Build web =="
npm ci || npm i
npm run build

echo "== Ensure Capacitor Android platform =="
if [ ! -d android ]; then
  npx cap add android
fi

echo "== Copy web assets to native =="
npx cap copy

echo "== Build debug APK =="
cd android
./gradlew assembleDebug

APK_PATH=$(find app/build/outputs/apk/debug -name '*.apk' | head -n 1)
echo "APK disponible en: $APK_PATH"
