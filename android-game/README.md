# Duskhollow

A one-hand survival horror game for Android. Your lantern is burning down, five
beacons are cold somewhere in a maze that is different every run, and something
in it hunts by sound.

Written in Kotlin with Jetpack Compose. No game engine, no art assets, no audio
files — the maze, the lighting, the creature's walk and every sound are generated
at runtime, which is why the download is tiny.

## Layout

| Module | What it is |
| --- | --- |
| `core/` | The simulation: maze generation, line of sight, pathfinding, stalker AI, objectives. Plain Kotlin, no Android imports, fully unit-tested. |
| `app/` | Everything you see and hear: Compose renderer, touch controls, procedural audio. |
| `store/` | Play Store icon, feature graphic, listing copy, privacy policy. |

Keeping the rules in `core/` means the game's behaviour can be tested on a plain
JVM in seconds, with no emulator and no Android SDK.

## Building

Requires JDK 17+ and an Android SDK.

```bash
./gradlew :app:assembleDebug          # APK you can sideload
./gradlew :app:bundleRelease          # .aab for the Play Store
./gradlew :core:test                  # game logic tests
```

`:app` is only included in the build when an Android SDK is found (via
`ANDROID_HOME`, `ANDROID_SDK_ROOT`, or `sdk.dir` in `local.properties`). Without
one, `./gradlew :core:test` still works.

Every push builds both artifacts in GitHub Actions and attaches them to the run,
so you never need a local Android install to get an installable build.

## Releasing to Google Play

### 1. Create a signing key — once, and never lose it

Play ties your app's identity to this key. If you lose it you cannot update your
own app.

```bash
keytool -genkeypair -v \
  -keystore duskhollow.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias duskhollow
```

Keep `duskhollow.jks` and its passwords somewhere you will still have them in
five years. **Never commit it** — `.gitignore` already blocks `*.jks` and
`*.keystore`.

### 2. Give the key to CI

```bash
base64 -w0 duskhollow.jks
```

In GitHub → Settings → Secrets and variables → Actions, add:

| Secret | Value |
| --- | --- |
| `DUSKHOLLOW_KEYSTORE_BASE64` | the base64 output above |
| `DUSKHOLLOW_KEYSTORE_PASSWORD` | keystore password |
| `DUSKHOLLOW_KEY_ALIAS` | `duskhollow` |
| `DUSKHOLLOW_KEY_PASSWORD` | key password |

Until these exist the release bundle still builds, just unsigned. Once they do,
every run produces a signed `.aab` ready to upload.

The build reads them from the environment, so a local signed build is:

```bash
DUSKHOLLOW_KEYSTORE=/path/to/duskhollow.jks \
DUSKHOLLOW_KEYSTORE_PASSWORD=... \
DUSKHOLLOW_KEY_ALIAS=duskhollow \
DUSKHOLLOW_KEY_PASSWORD=... \
./gradlew :app:bundleRelease
```

### 3. Upload

1. Register at [play.google.com/console](https://play.google.com/console) — a
   one-off $25 fee, and identity verification that can take a few days.
2. Create the app, then fill in the store listing using `store/listing.md` and
   the two images in `store/`.
3. Take at least two screenshots on a real device or emulator (see
   `store/listing.md` — Play requires genuine captures, so these cannot be
   generated ahead of time).
4. Host `store/PRIVACY.md` at a public URL and paste that URL into the listing.
   Play requires a reachable privacy policy link.
5. Complete the content rating questionnaire. Answer **yes** to horror and fear;
   the notes in `store/listing.md` explain why understating it is a bad trade.
6. Complete the Data safety form: nothing collected, nothing shared.
7. Upload the `.aab` to internal testing first. Play it on a real device before
   promoting to production.

### Version numbers

`versionCode` must increase with every upload. CI sets it from the workflow run
number automatically; for a local build, pass `DUSKHOLLOW_VERSION_CODE`.

## Changing the name or package

`applicationId` and `namespace` are set in `app/build.gradle.kts`; the display
name is `app/src/main/res/values/strings.xml`. Changing `applicationId` after
your first Play upload creates a *different app*, so decide before you publish.
