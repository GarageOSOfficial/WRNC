# WRNC Coming Soon traffic-control surface

Route: `https://wrnc.app/coming-soon`

Purpose: temporary pre-launch destination for Linktree and social traffic. It is intentionally isolated from authenticated/product navigation and from `/founding23`.

## Indexing

`/coming-soon` uses `noindex,follow` during pre-launch so the temporary campaign page does not compete with the canonical WRNC homepage. This is route-local and does not alter indexing for the rest of the application.

## Analytics

The route loads the existing Vercel Web Analytics endpoint at `/_vercel/insights/script.js` and records the custom event `Coming Soon Visit` with:

- `source`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Recognized referrer fallbacks include Instagram, TikTok, Facebook, YouTube, Reddit, and Linktree. Incoming UTM values are also retained in session storage for the current browser session.

The hidden product-preview slot is already wired to emit `Coming Soon Product Preview Interaction` when an approved asset is later enabled. The public `SEE WHAT WE’RE BUILDING` CTA remains omitted until an approved real-product preview asset exists, per the pre-launch directive.

## Product preview

`ProductPreviewSlot` renders nothing unless an approved `assetUri` is supplied. No placeholder, fictional UI, stock imagery, or unfinished product screenshot is publicly visible.

## Public navigation

The route intentionally exposes no navigation into signup, login, Garage, Build Passport, Timeline, `/founding23`, or other product routes.
