# WRNC Development Handoff — 2026-08-09

## Purpose and product decisions

- **WRNC** is the product. **Swear Like A Sailor, LLC** is the parent company. **Build Passport™** is the flagship feature.
- Do not introduce **GarageOS** references in new user-facing implementation. The GitHub organization still uses `GarageOSOfficial`; this is repository ownership/legacy context only.
- The approved Figma V1 homepage is the visual source of truth. Treat it as approved: implement it desktop-first and responsive, do not redesign it, and do not modify the Figma file.
- The approved full WRNC mark is the Hyper Silver artwork at `assets/brand/wrnc-master-logo-hyper-silver-080808.png`. It is an exact copy of the supplied master asset; do not recreate its letterforms with CSS or fonts.

## Repository and branch state

### Authoritative Git checkout

`/Users/travisty/Desktop/WRNC - Developer/WRNC-git`

| Item | Current value |
| --- | --- |
| Remote | `https://github.com/GarageOSOfficial/WRNC.git` |
| Working branch | `agent/website-launch-preview` |
| Main branch | Unchanged by this work |
| Latest local commit | `5348f26 fix: align app launch background with WRNC brand` |
| Latest published GitHub commit | `73b11d4 chore: register NativeWind style types` |
| Publish state | Local branch is **ahead by 1 commit** (`5348f26`) |

`WRNC-main` is a separate non-Git local development folder used for the running Expo server and local `.env`:

`/Users/travisty/Desktop/WRNC - Developer/WRNC-main`

Do not confuse it with the Git checkout above. Use `WRNC-git` for branch history, commits, GitHub Desktop, and Vercel source.

### Commit history for this work

1. `aaada82 feat: add WRNC web launch preview`
2. `bd00dcf fix: route authenticated members to workspace`
3. `676d895 fix: make web sign-in transition reliable`
4. `c5f3c80 fix: enable workspace styles on web`
5. `73b11d4 chore: register NativeWind style types`
6. `5348f26 fix: align app launch background with WRNC brand` — **not yet published at time of this handoff**

The terminal cannot push to GitHub because it has no usable GitHub credential (`fatal: could not read Username for 'https://github.com': Device not configured`). Use GitHub Desktop for publishing; do not share a password, PAT, or Supabase key in chat.

## Website and product implementation completed

### Public website

Implemented the WRNC marketing homepage with a reusable production component structure:

- `app/index.web.tsx` — web-only marketing entry, metadata/canonical URL, approved section order, and CTA routing.
- `components/marketing/MarketingHeader.tsx`
- `components/marketing/HomeHero.tsx`
- `components/marketing/WhyWrncSection.tsx`
- `components/marketing/HowWrncSection.tsx`
- `components/marketing/ProductValueSection.tsx`
- `components/marketing/FinalCtaSection.tsx`
- `components/marketing/MarketingButton.tsx`
- `components/marketing/MarketingPillar.tsx`
- `components/marketing/WrncLogo.tsx` — renders the supplied master logo asset, not text/CSS artwork.

Homepage CTA routes to `/signup`. The site includes:

- canonical `https://wrnc.app/`
- title and description metadata
- basic Open Graph/Twitter metadata
- `public/robots.txt`
- `public/sitemap.xml`

No new user-facing GarageOS naming was added.

### Authentication and onboarding routes

- `app/signup.tsx` — email/password sign-up with confirmation-email state.
- `app/login.tsx` — email/password sign-in, normalizes email, validates a returned Supabase session, and supports:
  - Return in email → moves focus to password
  - Return in password → signs in
- `app/auth/callback.tsx` — confirmation callback/status state.
- `app/(app)/workspace.tsx` — protected product route. Unauthenticated users return to `/login`; authenticated users enter the existing vehicle workspace.
- `app/(app)/_layout.tsx` — React Query provider/layout for protected product routes.

The successful login route now goes to `/workspace`, rather than returning to the public homepage.

### Vehicle workspace

The existing workspace already supports Create Vehicle. A verified signed-in account reached it successfully, and the database migration is intended to create one personal workspace per newly created user.

The web workspace initially appeared as raw black text on a white page because NativeWind was present but not enabled in Babel. The following fixes are published:

- `babel.config.js` — adds `nativewind/babel`.
- `nativewind-env.d.ts` — registers NativeWind type declarations.

Direct Babel verification confirmed the NativeWind transform is present. The post-fix Vercel visual result still needs a fresh browser check after the published deployment is Ready.

## Brand assets and native configuration

### Current approved assets

These project files were inspected directly and contain the Hyper Silver full WRNC logo on black:

- `assets/brand/wrnc-master-logo-hyper-silver-080808.png`
- `assets/icon.png`
- `assets/adaptive-icon.png`
- `assets/favicon.png`
- `assets/splash.png`

Finder may show old circular-W thumbnails; those are stale macOS previews, not the current file contents. Do not replace the verified files with unapproved mockup/presentation images from the Design folder.

### Pending native brand configuration commit

`5348f26` changes `app.json` only:

- splash background `#ffffff` → `#080808`
- Android adaptive-icon background `#ffffff` → `#080808`

This aligns native app launch surfaces with the approved black-field logo artwork. It is local and requires one GitHub Desktop publish.

## Supabase setup and validation

### Environment variables

The application and Vercel use exactly these public client variables:

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
```

- A local `.env` exists only in `WRNC-main` and is intentionally Git-ignored.
- Vercel was configured with both variables for **Production and Preview**.
- Do not commit `.env`, expose its values, use a service-role/secret key in the client, or paste them into chat.

### Auth results

- Email/password signup was tested locally.
- A confirmation email was delivered successfully.
- The account was confirmed and appears in Supabase Authentication → Users.
- Local Supabase Auth health check returned HTTP `200` after the key setup was corrected.
- Preview sign-in has been proven to create a session and reach `/workspace`.

### Database/migration expectation

`supabase/migrations/20260802160000_vehicle_crud.sql` creates `workspaces` and `vehicles` and defines `handle_new_user()`, which auto-creates a personal `workspaces` row after a new `auth.users` insert. It also enables RLS and scopes rows to the owner.

Before production release, verify that this migration is actually applied to the live Supabase project by creating a fresh test account and confirming it can create a vehicle. Do not solve a missing workspace by weakening RLS or adding a client-side privileged key.

### Redirect URLs still needed

In Supabase Authentication → URL Configuration, allow the exact callback destinations used by active environments:

```text
https://wrncapp-git-agent-website-launch-preview-wrnc.vercel.app/auth/callback
https://wrnc.app/auth/callback
```

For local development, the configured callback is:

```text
http://localhost:8081/auth/callback
```

Use the exact live Vercel preview URL if it changes. Do not use an old frozen Vercel deployment URL for auth testing.

## Vercel setup and deployment state

### Project

| Item | Value |
| --- | --- |
| Vercel project | `wrnc` |
| Team | `WRNC` (Hobby) |
| GitHub source | `GarageOSOfficial/WRNC` |
| Preview branch | `agent/website-launch-preview` |
| Build command | `npm run build:web` → `expo export --platform web` |
| Routing | `vercel.json` serves filesystem assets first, then routes all paths to `index.html` for Expo Router client routes |

### Current preview URL

Use this moving branch alias, while signed into Vercel:

```text
https://wrncapp-git-agent-website-launch-preview-wrnc.vercel.app
```

Preview protection is enabled. Unauthenticated requests redirect to Vercel SSO; leave that protection enabled during review.

Avoid the older unique deployment URL (`wrnc-ifvau6ckc-wrnc.vercel.app` or any similarly dated unique URL). Those URLs are frozen to the commit that created them and caused confusion during testing.

### Deployment status at handoff

- `73b11d4` is published to GitHub and should be the source of Vercel's latest branch preview. Confirm Vercel shows a Ready deployment for that commit before visual testing.
- `5348f26` is not yet on GitHub/Vercel; publish it when ready.
- This agent could not independently open the protected preview. Browser validation depends on an authenticated Vercel user/session or screenshots from the owner.

## Build/deployment issues encountered and resolved

| Issue | Cause | Resolution |
| --- | --- | --- |
| Initial Vercel build failed | Original icon/splash placeholders were non-image 96-byte files; Expo/Jimp could not detect MIME | Replaced with valid PNG derivatives based on the approved master asset in `aaada82` |
| First deployment served old login behavior | Vercel log showed frozen commit `aaada82`, before auth fixes | Use branch alias and verify commit source; published routing fixes are `bd00dcf` and `676d895` |
| Login returned to public page | Successful sign-in originally routed to `/` | Route successful login and confirmation CTA to protected `/workspace` |
| Return key did not sign in | Inputs had no submission handling | Password Return calls sign-in; email Return advances focus |
| Workspace appeared unstyled on web | NativeWind Babel plugin/types were absent | Added `nativewind/babel` and `nativewind-env.d.ts`; requires visual validation on the latest preview |
| Initial Supabase requests failed | `.env` was missing/malformed and a new publishable-key attempt did not authenticate for this project setup | Created local `.env`, removed stray text, used the valid public client key; Auth health later returned 200 |
| Full `npm run type-check` fails | Large pre-existing type/test/model drift unrelated to this preview work | Do not claim type-check is clean; lint and Expo web export pass for this work. Address type debt separately |
| Terminal could not publish | No CLI GitHub credential | Use GitHub Desktop; do not share credentials |

## Verification already performed

Passed:

- `npm run lint`
- `npx expo export --platform web`
- Export contains `index.html`, favicon, robots file, sitemap, JS bundle, and the canonical logo asset.
- JSON validation of `app.json` after the black background adjustment.
- Direct NativeWind Babel transform check against `VehicleWorkspaceShell.tsx`.
- Local signup and confirmation email delivery.
- Preview login resulting in `/workspace`.

Not passed / not yet appropriate to claim:

- Full `npm run type-check` (pre-existing failures).
- Full test suite.
- Fresh visual QA of the NativeWind styling fix on the latest Vercel preview.
- Production custom-domain deployment.

## Domains and DNS

As of this handoff, `wrnc.app` is **not** served by Vercel. It currently points to a Shopify password/"Opening soon" storefront.

Observed configuration:

- Apex `wrnc.app` A record: `23.227.38.32`
- `www` CNAME: `shops.myshopify.com`

Do **not** change DNS, disconnect Shopify, or assign `wrnc.app` in Vercel until preview QA, legal/SEO, CTA verification, and a deliberate production cutover decision are complete.

## Outstanding work and release risks

1. **Publish `5348f26`** from GitHub Desktop. This is only the black launch/adaptive background adjustment.
2. In Vercel, wait for the branch deployment to be **Ready** and confirm its source commit.
3. Test the moving branch alias in an authenticated Vercel browser session:
   - `/login` with a confirmed account
   - press Return in password field
   - confirm `/workspace` opens
   - open Create Vehicle and confirm the form is visually styled
   - create a disposable/test vehicle to verify the workspace trigger and vehicle RLS path
4. Add/verify the Vercel preview and production `/auth/callback` URLs in Supabase.
5. Do a dedicated responsive QA pass on the Figma-approved homepage and auth routes.
6. Complete legal pages, final SEO/social preview image, CTA analytics/verification, and accessibility checks before production cutover.
7. Resolve the pre-existing TypeScript/test/schema drift in a separate, scoped engineering task. It should not be silently folded into marketing-site work.
8. Only after the above: create a PR from `agent/website-launch-preview` to `main`, approve/merge, assign the Vercel production deployment, then perform the explicit Shopify/DNS transition.

## Exact next recommended task

**Publish `5348f26`, then run one authenticated Vercel preview QA pass focused on the workspace style fix and first vehicle creation.**

This is the smallest task that verifies the current release candidate end-to-end without changing production infrastructure or expanding into a new design effort.
