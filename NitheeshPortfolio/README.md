# NitheeshPortfolio — visionOS app

Built and verified entirely from Windows via **GitHub Actions** + **XcodeGen**.

## How the loop works

```
Edit .swift files on Windows
       │
       ▼
git push to main
       │
       ▼
GitHub Actions → macos-15 runner
       │
       ├─ xcodegen generate          (creates .xcodeproj from project.yml)
       ├─ xcodebuild build           (compiles for visionOS Simulator)
       ├─ boots a visionOS sim
       ├─ installs + launches the app
       └─ uploads a screenshot artifact
       │
       ▼
You download the screenshot from the Actions run.
```

## Files you edit

- `NitheeshPortfolio/**/*.swift` — every scene, model, view model.
- `project.yml` — only if you add new dependencies or scenes.

## Files you never touch by hand

- `NitheeshPortfolio.xcodeproj/` — generated on every build by XcodeGen.

## Running the workflow

Either:
- **Push** to `main` with changes under `NitheeshPortfolio/` → builds automatically, or
- Open **Actions → visionOS Build → Run workflow** → manual trigger.

Find the result under **Artifacts**:
- `xcodebuild-log` — full compile log (read this when it fails).
- `NitheeshPortfolio-app` — the built `.app` bundle.
- `visionOS-screenshot` — a PNG of the running app in the visionOS Simulator.

## What this gives you on Windows

| You get | You don't get |
|---------|---------------|
| ✅ Compile verification on every push | ❌ Live interactive simulator |
| ✅ A real screenshot of the app running | ❌ Hot-reload preview |
| ✅ The compiled `.app` bundle as a downloadable artifact | ❌ TestFlight upload (needs signing creds, see below) |

## If you want TestFlight / device installs later

1. Get an Apple Developer account ($99/yr).
2. Create an App Store Connect app entry.
3. Add `APPLE_API_KEY_ID`, `APPLE_API_ISSUER_ID`, and `APPLE_API_PRIVATE_KEY` as GitHub repo secrets.
4. I can add a second job that uses `xcrun altool` or `fastlane pilot` to upload the `.ipa`.
