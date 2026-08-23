# Play Store listing copy

Paste these into Play Console → Main store listing. Everything here is editable;
nothing is auto-generated at build time.

## App name (30 char max)

```
Duskhollow
```

## Short description (80 char max)

```
Light five beacons in the dark. Something down here hunts by sound.
```

## Full description (4000 char max)

```
Your lantern is dying and you are not alone down here.

Duskhollow is a one-hand survival horror game about light, sound, and the thing
that wants both. Five beacons are cold somewhere in the hollow. Light them all,
then find your way back to the door you came in through.

The dark is the enemy
Your lantern shows you a few metres of wet stone and nothing more. Every corridor
you leave behind fades back into memory. The flame burns down as you go, and the
smaller it gets, the less warning you have.

It hunts by sound
Walk and it may never know you were there. Run and it will come. Lighting a
beacon is loud, and it refills your lantern at the exact moment it tells the
hollow exactly where you are. Every beacon you light makes it faster.

Every descent is different
The hollow is generated fresh each run, so no two escapes are the same maze, the
same route, or the same near miss.

Features
- Procedurally generated maze, different every run
- A stalker that patrols, investigates noise, and commits to a chase
- Lantern light that flickers, gutters, and burns down
- One-handed controls: drag to move, hold to run
- No ads, no in-app purchases, no accounts, no internet permission
- Plays completely offline
- Small download, no streamed assets

Not recommended for players sensitive to sudden loud sounds, flashing light, or
jump scares. Headphones make it considerably worse, which is the point.
```

## Categorisation

- Application type: **Game**
- Category: **Adventure** (Action is also defensible; Adventure fits the pacing)
- Tags: horror, survival, maze, atmospheric, single player

## Content rating questionnaire

Answer the IARC questionnaire honestly. For this game the relevant answers are:

| Question area | Answer |
| --- | --- |
| Violence | No blood, gore, or depicted injury. The player is caught, and the screen cuts. |
| Horror / fear | **Yes** — sustained menace, darkness, a pursuing creature, and jump scares. |
| Sexual content, drugs, gambling, profanity | None. |
| User-generated content / social features | None. |
| Shares location or personal info | No. |
| Digital purchases | None. |

Expect roughly **PEGI 12 / ESRB Teen / USK 12**, driven entirely by the horror
answers. Do not understate the jump scares — a rating challenge later is far more
expensive than a higher rating now.

## Data safety form

Declare **no data collected and no data shared**. This is accurate and checkable:

- The app declares no `INTERNET` permission, so it cannot transmit anything.
- The only stored value is your best escape time, in local `SharedPreferences`.
- The one permission requested is `VIBRATE`, for haptics.

## Screenshots

Play requires **at least 2 phone screenshots** (16:9 or 9:16, min 320px, max
3840px on the long side). These have to be real captures of the running game, so
take them yourself:

1. Install the debug APK from the CI run on a phone or emulator.
2. Play until the frame is worth keeping and take a screenshot.

Worth capturing: the lantern in a corridor with the maze fading out behind it, a
beacon mid-light with the ring filling, the stalker's eyes in the dark, and the
"you got out" screen.

## Assets in this folder

| File | Where it goes |
| --- | --- |
| `play-icon-512.png` | Store listing → App icon (512x512) |
| `play-feature-graphic-1024x500.png` | Store listing → Feature graphic |
