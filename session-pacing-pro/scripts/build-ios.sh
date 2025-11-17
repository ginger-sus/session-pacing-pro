#!/usr/bin/env bash
set -euo pipefail

# iOS archive local build script (requires macOS + Xcode)
# Requirements:
# - Node 18+, Xcode command line tools, CocoaPods
# - Capacitor CLI installed (npx is fine)

echo "== Build web =="
npm ci || npm i
npm run build

echo "== Ensure Capacitor iOS platform =="
if [ ! -d ios ]; then
  npx cap add ios
fi

echo "== Copy web assets to native =="
npx cap copy

echo "== Install pods =="
cd ios
if [ -f Podfile ]; then
  pod install
fi

echo "== Build with xcodebuild (Debug) =="
# Adjust the scheme if different; default is App name. We set 'Session Pacing Pro' commonly.
# We'll try to detect a workspace first.
if [ -d "App.xcworkspace" ]; then
  xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug -sdk iphonesimulator -derivedDataPath build
else
  xcodebuild -project App/App.xcodeproj -scheme App -configuration Debug -sdk iphonesimulator -derivedDataPath build
fi

echo "Build completat. Artefactes en ios/build"
