# Reppilot for Android

Reppilot now has a bundled Android app using Capacitor. The Android app ID is
`app.reppilot.mobile`. The old generated app ID was invalid because a Java package
segment began with a digit.

## Get a test APK without coding

1. Open the repository's **Actions** tab.
2. Choose **Android test APK**, then open a successful run for `codex/android-app`.
3. Download the **Reppilot-Android-test** artifact and extract the ZIP.
4. Open `app-debug.apk` on your Android phone (Android 7 or later).
5. If Android asks, allow this installation from your browser or file manager.
6. Sign in with your existing email and password, or create and confirm an account.

This is a debug test build, not a Play Store release. Each GitHub runner can use a
different debug signing key; subsequent test builds may require uninstalling the
previous build. Sync your data first, because uninstalling clears local data.

## What is included

- Bundled screens and Reppilot logo assets; no hosted preview required to launch.
- Existing workout, nutrition, progress and profile screens.
- Android Back button: close a sheet/dialog, navigate back, or minimize at the home/login screen.
- Dark launch screen, Reppilot icon, safe-area spacing and keyboard resizing.
- Email/password login using the existing Supabase project.
- Optional external-browser Google login using PKCE and a native callback.

Internet is required for login and cloud sync. Existing local training storage is
reused, but offline operation and conflict resolution still need real-device testing.

## Google login setup

Google login is hidden in Android until the backend is configured. Lovable's web
Google login is unchanged.

1. Enable/configure Google in the Supabase project's Authentication providers.
2. Add this exact URL to the Authentication redirect allowlist:
   `app.reppilot.mobile://auth/callback`
3. Build with `VITE_NATIVE_GOOGLE_AUTH=true`.
4. Test sign-in, cancellation, app closed/open callbacks, and logout on a phone.

The Android manifest already registers this callback. The native PKCE session is
transferred to the app's regular Supabase client. Email confirmation uses the
backend's configured site URL; after confirming, return to the app and sign in.

## Build locally

Requires Node 22+, Java 21, Android SDK 36/build-tools 36, and accepted Android SDK
licenses (Android Studio can install these).

```sh
npm ci
npm run android:sync
npm run android:open
```

In Android Studio choose **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
Or use `npm run android:apk` on macOS/Linux. On Windows, after `npm run android:sync`,
run `android\gradlew.bat -p android assembleDebug`.

Output: `android/app/build/outputs/apk/debug/app-debug.apk`.

The mobile build uses `vite.android.config.ts` and outputs `dist-android`.
`npm run build` still builds the website with its original TanStack Start setup.
Only public `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` values belong
in the client build. Never include a service-role key.

## Before Play Store publication

Test real accounts, workout saving, relaunch/session persistence, keyboard layout,
Back navigation, cloud sync and Google login if enabled. Create and securely keep
a release signing key, increase the version code for each release, and generate a
signed Android App Bundle in Android Studio. Store listing, privacy/data
information and the owner's Play Console account are still required.
