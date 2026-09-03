# MOTOR Sandbox Testing

Status: testing-only scaffold. Live MOTOR calls are blocked until the provider contract is supplied and reviewed.

## Boundary

The authenticated app sends a VIN and the current WRNC access token to the WRNC proxy. The proxy validates the WRNC session before any lookup. MOTOR credentials remain server-side. Results are read-only and are not written to Supabase or copied into an existing vehicle.

Both flags must be explicitly enabled:

* App test surface: `EXPO_PUBLIC_ENABLE_MOTOR_SANDBOX=true`
* Server proxy: `MOTOR_SANDBOX_ENABLED=true`

For a native test build, `EXPO_PUBLIC_MOTOR_PROXY_URL` must be an HTTPS URL for the proxy. Mock mode uses `MOTOR_SANDBOX_MODE=mock` and supports only VIN `1HGCM82633A004352`.

## Required before live sandbox mode

Provide these through an approved secret channel, never chat, source control, screenshots, or an `EXPO_PUBLIC_*` variable:

1. MOTOR sandbox base URL and the exact VIN lookup path.
2. Authentication scheme, including required header names, token exchange flow if applicable, and sandbox API key or client credentials.
3. Official request example, required headers, query or body fields, timeout guidance, and rate limits.
4. Official success response schema and at least one sanctioned sandbox VIN with its expected response.
5. Error response schema and documented status codes, especially authentication, not found, throttling, and provider outage cases.
6. MOTOR terms for caching, retention, display attribution, logging, and whether VINs or returned data may be stored.
7. Sandbox IP allowlist or mTLS requirements, if any.
8. Confirmation of the intended first endpoint. This scaffold assumes VIN decode only.

After those details are reviewed, replace the `MOTOR_CONTRACT_REQUIRED` branch with the provider adapter and response mapper. Do not deploy or create a TestFlight build without Founder approval.
