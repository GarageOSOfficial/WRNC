# WRNC Production Asset Verification

Complete before replacing launch artwork.

| Surface | Repo path | Canonical source/master | Dimensions | Color space | Alpha allowed | Manifest approval | QA result |
|---|---|---|---:|---|---|---|---|
| Web favicon | `assets/brand/platform/wrnc-platform-favicon.png` | `wrnc-platform-icon-master.png` | 512x512 | sRGB | No | Founder directive, 2026-08-23 | PASS |
| iOS/App Store icon | `assets/brand/platform/wrnc-app-icon-ios-1024.png` | `wrnc-platform-icon-master.png` | 1024x1024 | sRGB | No | Founder directive, 2026-08-23 | PASS |
| Android adaptive foreground | `assets/brand/platform/wrnc-adaptive-icon-foreground.png` | Authoritative artwork V1.2 approved derivative | 1024x1024, composition within 66/108 safe region | sRGB | Yes, transparent exterior required | Founder directive, 2026-08-23 | PASS |
| Android adaptive background | `assets/brand/platform/wrnc-adaptive-icon-background.png` | Authoritative artwork V1.2 approved derivative | 1024x1024 | sRGB | No | Founder directive, 2026-08-23 | PASS |
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
