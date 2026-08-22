# WRNC Production Asset Verification

Complete before replacing launch artwork.

| Surface | Repo path | Canonical source/master | Dimensions | Color space | Alpha allowed | Manifest approval | QA result |
|---|---|---|---:|---|---|---|---|
| Web favicon | `assets/favicon.png` | TBD from authoritative artwork v1.1 | TBD | sRGB required | platform-specific | TBD | PENDING |
| iOS/App Store icon | `assets/icon.png` | TBD from authoritative artwork v1.1 | 1024x1024 master required | sRGB required | No | TBD | PENDING |
| Android adaptive foreground | `assets/adaptive-icon.png` | TBD from authoritative artwork v1.1 | verify Expo/Android requirement | sRGB required | Yes where supported | TBD | PENDING |
| Splash/launch | `assets/splash.png` | TBD from authoritative artwork v1.1 | verify app config/export | sRGB required | verify | TBD | PENDING |

## Required checks

- Canonical approved mark only.
- No clipped final C.
- No legacy colored speedometer mark.
- No plain-white substitute wordmark.
- No redraw/recolor/distortion/approximation.
- Correct safe area under iOS icon mask.
- Correct Android adaptive-icon safe zone/masks.
- Splash works on `#080808` without seams.
- Favicon remains recognizable at small browser sizes.
- No unnecessary JPEG recompression.
- Record exact authoritative source before replacement.

## Important

Do not mark an asset APPROVED based only on filename or visual similarity. Trace it to the signed-off manifest/master first.
