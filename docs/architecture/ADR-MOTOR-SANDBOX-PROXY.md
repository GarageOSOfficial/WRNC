# ADR: Server-side MOTOR sandbox adapter

Status: Proposed for local validation

Date: 2026-09-02

Decider: Founder

## Context

MOTOR DaaS requests require a private HMAC key. An Expo application bundle cannot keep that key secret. The first approved scope is a read-only native VIN lookup against MOTOR's 15-vehicle sandbox, with no persistence, deployment, database change, or website UI change.

## Decision

The authenticated native app sends a VIN and its WRNC access token to a WRNC server route. The route validates the session, signs the MOTOR request using server-only credentials, maps the vendor response to WRNC-owned fields, disables caching, and returns the normalized result. The feature is disabled unless both client and server sandbox flags are enabled.

## Options considered

1. Sign inside the app. Rejected because the private key would be recoverable from the app bundle.
2. Call MOTOR through a server adapter. Selected because it protects credentials and isolates vendor schema changes.
3. Add a Supabase Edge Function. Deferred because Supabase deployment and configuration changes are outside the approved local-only scope.

## Consequences

- Native code never receives MOTOR credentials.
- A reachable HTTPS proxy is required for physical-device testing.
- MOTOR licensing, attribution, caching, retention, and production access remain separate approval gates.
- Results remain transient until persistence is explicitly designed and approved.
