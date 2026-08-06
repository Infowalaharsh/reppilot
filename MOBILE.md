# Reppilot — iOS & Android builds (Capacitor)

Capacitor is configured in `capacitor.config.ts` (app id `app.lovable.619ef9c14a9d44c5a1008033f62ab120`, app name `Reppilot`).

## One-time setup on your own machine

1. Push this project to GitHub (Github button, top right) and `git clone` it locally.
2. `npm install`
3. Add the platforms you need:
   ```bash
   npx cap add ios       # requires macOS + Xcode
   npx cap add android   # requires Android Studio
   ```
4. Build the web assets and copy them into the native projects:
   ```bash
   npm run build
   npx cap sync
   ```
5. Run on a device/emulator:
   ```bash
   npx cap run ios
   npx cap run android
   ```

## Live reload vs. store build

`capacitor.config.ts` currently points `server.url` at the hosted preview, so the
native shell loads the latest deployed app — handy for testing on a real phone
without rebuilding.

For a **store-ready build**, delete the whole `server` block, then run
`npm run build && npx cap sync` so the app ships its own bundled assets.

## After every git pull

Run `npx cap sync` again to pick up dependency and asset changes.