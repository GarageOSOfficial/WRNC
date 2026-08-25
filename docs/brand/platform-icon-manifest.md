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

| Asset | Dimensions | Alpha | SHA-256 | Purpose |
| --- | ---: | --- | --- | --- |
| `assets/brand/platform/wrnc-app-icon-ios-1024.png` | 1024x1024 | No | `aa1bd2129e9ad8ffaf626027304bd6c5531be4ee6c863425c2d3cf370603a759` | Byte-identical V1.2 iOS and App Store icon source |
| `assets/brand/platform/wrnc-adaptive-icon-foreground.png` | 1024x1024 | Yes | `c732191134e1a70b079b9fa08640b537ea3392035802d7049269e28f8e4da439` | Byte-identical V1.2 Android foreground with a transparent exterior |
| `assets/brand/platform/wrnc-adaptive-icon-background.png` | 1024x1024 | No | `7cbaaa8483968c422c72111663ee483dbf58e6a4036603671ce5e42d8a80c71c` | Byte-identical V1.2 opaque black Android background |
| `assets/brand/platform/wrnc-social-profile-icon.png` | 1080x1080 | No | `d17e1e6c411909c57610832ee1e13b00fb5c854db603ae5d3ebb7985e6ae93f2` | Byte-identical V1.2 social profile source |
| `assets/brand/platform/wrnc-platform-favicon.png` | 512x512 | No | `693f195199a6f59e26666856fec1439a5d6eedfb60abeda786f48d188fff238b` | Controlled web favicon export from the locked master |

The iOS, Android, and social derivatives are installed byte-for-byte from the validated V1.2 package. The favicon preserves the complete approved composition proportionally as a controlled compact export.

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
