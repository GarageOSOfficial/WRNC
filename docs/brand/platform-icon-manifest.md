# WRNC Platform Icon Manifest

Status: Founder approved for production

Founder: Travis Townsend

Approval date: 2026-08-23

## Identity boundary

The circular badge is the canonical WRNC platform, application, social-avatar, favicon, and compact identity icon. It does not replace the Hyper Silver WRNC master wordmark used in the website header, authenticated application shell, or full corporate and product-logo compositions.

## Controlled asset chain

### Master

| Asset | Dimensions | Alpha | SHA-256 |
| --- | ---: | --- | --- |
| `assets/brand/platform/wrnc-platform-icon-master.png` | 1254x1254 | No | `80770aa554f1fea18a0045f09f4e257103b1d1798e66b797ad2c3bd3f93194d0` |

The repository master is an exact byte-for-byte copy of the founder-supplied Design Studio artwork. It must not be redrawn, regenerated, recolored, re-typeset, distorted, cropped, traced, or approximated.

### Approved derivatives

| Asset | Dimensions | Alpha | Purpose |
| --- | ---: | --- | --- |
| `assets/brand/platform/wrnc-app-icon-ios-1024.png` | 1024x1024 | No | iOS and App Store icon source |
| `assets/brand/platform/wrnc-adaptive-icon-foreground.png` | 1024x1024 | No | Android adaptive foreground with proportional safe-region padding |
| `assets/brand/platform/wrnc-adaptive-icon-background.png` | 1024x1024 | No | Android black adaptive background export |
| `assets/brand/platform/wrnc-social-profile-icon.png` | 1080x1080 | No | Social profile source |
| `assets/brand/platform/wrnc-platform-favicon.png` | 512x512 | No | Web favicon source |

All derivatives preserve the complete approved composition proportionally. Only canvas size, resolution, color-profile normalization, and black safe-area treatment differ.

## Application mapping

| Surface | Configuration |
| --- | --- |
| Expo application icon | `wrnc-app-icon-ios-1024.png` |
| Android adaptive foreground | `wrnc-adaptive-icon-foreground.png` |
| Android adaptive background | `#000000`, with the matching PNG retained as the controlled export |
| Expo web favicon | `wrnc-platform-favicon.png` |

The splash screen and full WRNC wordmark assets remain unchanged.

## Adaptive safety

Android reserves a centered 66 by 66 safe region within a 108 by 108 adaptive-icon canvas. The complete source composition is scaled to 626 by 626 pixels and centered on the 1024 by 1024 foreground, keeping it within that safe region across circle, squircle, and rounded-square masks.

## Governance

Production exports must descend from the repository master. Generated concepts, the previous standalone C placeholder, colored speedometer artwork, white-only substitutes, and recolored badge variants are not approved platform identities.
