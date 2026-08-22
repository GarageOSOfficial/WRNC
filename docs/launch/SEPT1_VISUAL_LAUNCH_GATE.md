# WRNC September 1 Visual Launch Gate

Status: ACTIVE
Owner: Development + Design Studio
Founder direction: execute reversible launch-critical corrections only.
Tracking: GitHub Issue #44

## Development handoff artifacts

- `docs/launch/SEPT1_VISUAL_LAUNCH_GATE.md` — controlling implementation brief
- `docs/launch/WRNC_ASSET_VERIFICATION_TEMPLATE.md` — brand/app asset provenance gate
- `docs/launch/WRNC_VISUAL_QA_CHECKLIST.md` — desktop/tablet/390px release QA

## Source of truth

- Foundation: `#080808`
- Canonical WRNC wordmark: approved Hyper Silver transparent placement asset. Preserve complete final C, proportions, clear space, and `contain` behavior.
- Headlines/headline-adjacent decoration: white, Hyper Silver, restrained gray only.
- Primary CTA/action: orange `#FF6400`.
- Product data/charts/selected/system states: purple `#7C3AED`.
- Never combine orange + purple as decorative headline emphasis.
- Preserve approved copy, product architecture, product claims, and product-led homepage composition.

## P0 execution order

1. Production asset identity
   - Verify `favicon.png`, `icon.png`, `adaptive-icon.png`, `splash.png` against authoritative artwork manifest v1.1.
   - Purpose-built exports are required. Do not substitute or approximate an unverified master.
2. Canonical logo/shell
   - Audit marketing, auth, workspace, vehicle, timeline, documents, add/create surfaces.
   - Remove legacy logo treatments and shell drift only when confirmed.
3. Semantic color/CTA pass
   - Orange = primary action.
   - Purple = data/state.
   - Neutral = headline/decorative hierarchy.
4. Responsive gate
   - Validate desktop, tablet, and exactly 390px width.
   - Zero horizontal overflow, clipped content, CTA truncation, or cropped WRNC C.
5. Native/web launch assets
   - Validate icon masks, splash background, favicon legibility, and system appearance against the dark WRNC shell.
6. Release-candidate proof QA
   - Capture desktop/tablet/390px proofs and compare with approved direction.

## Required validation

Run and record results for:

- type-check
- lint
- build:web
- focused tests
- 390px overflow validation
- desktop/tablet/mobile visual proof review

## Handoff report format

Development should update Issue #44 with:

### Files changed
- exact paths
- one-line reason for each change

### Validation
- command
- PASS/FAIL
- relevant output or failure cause

### Visual QA
- desktop proof location
- tablet proof location
- 390px proof location
- logo final-C/clear-space result
- overflow result
- CTA orange result
- purple data/state result

### Asset verification
For each of favicon, app icon, adaptive icon, splash:
- source/master
- dimensions
- alpha status
- approval/manifest reference
- result

### Conflicts/blockers
List only confirmed conflicts. Do not silently resolve brand-master ambiguity.

## Stop gates

- No Supabase changes.
- No production deployment.
- No merge to `main` without separate release approval.
- No product architecture redesign.
- No broadened claims/features.
- No replacement of an unverified brand master.

## Deferred P1

Do not spend launch time on these unless they create a P0 usability defect:
- typography-token consolidation
- spacing-token cleanup
- richer empty-state artwork
- extra breakpoint polish beyond launch-critical widths
- micro-interactions
- promotional/store artwork polish
