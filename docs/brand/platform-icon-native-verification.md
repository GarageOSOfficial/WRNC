# WRNC Platform Icon Native Verification

Status: PASS

Verified release-candidate source: `9c1d950b06b49d223db41afafa7ac5825545f9c9`

Verification date: 2026-08-25

## Method

Expo native projects were generated from the release candidate in a disposable checkout with:

`expo prebuild --no-install --platform all`

The generated iOS and Android icon resources were inspected separately from the source assets. The disposable native projects were not committed.

## iOS result

- Generated App Store icon: 1024 by 1024
- Alpha: none
- Pixel comparison with the approved V1.2 iOS source: exact
- Mean per-channel pixel difference: 0

Expo rewrote PNG container metadata, so the generated-file checksum differs from the source checksum. The decoded pixels are identical.

## Android result

Both generated adaptive-icon definitions reference:

- foreground: `@mipmap/ic_launcher_foreground`
- background: `@color/iconBackground`

The generated background color is `#000000`.

| Density | Canvas | Visible alpha bounds | Approximate 66/108 safe bounds | Result |
| --- | ---: | --- | --- | --- |
| mdpi | 108 by 108 | x 25 to 82, y 24 to 82 | x 21 to 87, y 21 to 87 | PASS |
| hdpi | 162 by 162 | x 37 to 124, y 36 to 124 | x 31.5 to 130.5, y 31.5 to 130.5 | PASS |
| xhdpi | 216 by 216 | x 49 to 165, y 49 to 165 | x 42 to 174, y 42 to 174 | PASS |
| xxhdpi | 324 by 324 | x 74 to 248, y 73 to 248 | x 63 to 261, y 63 to 261 | PASS |
| xxxhdpi | 432 by 432 | x 99 to 331, y 98 to 331 | x 84 to 348, y 84 to 348 | PASS |

Every generated Android foreground retains transparent exterior pixels and keeps the complete badge inside the adaptive safe region.

## Boundaries

- No native project was committed.
- No source artwork was changed during native generation.
- No manual mask, crop, padding, recolor, or scaling pass was added.
- Physical Android launcher review remains separate device evidence when a device is available.
