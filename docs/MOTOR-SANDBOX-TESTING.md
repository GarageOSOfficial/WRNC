# MOTOR Sandbox Testing

Status: local testing only. The live sandbox adapter is implemented but remains disabled by default.

## Boundary

The authenticated app sends a VIN and the current WRNC access token to the WRNC proxy. The proxy validates the WRNC session before any lookup. MOTOR credentials remain server-side. Results are read-only and are not written to Supabase or copied into an existing vehicle.

Both flags must be explicitly enabled:

* App test surface: `EXPO_PUBLIC_ENABLE_MOTOR_SANDBOX=true`
* Server proxy: `MOTOR_SANDBOX_ENABLED=true`

For a native test build, `EXPO_PUBLIC_MOTOR_PROXY_URL` must be an HTTPS URL for the proxy. Mock mode uses `MOTOR_SANDBOX_MODE=mock` and supports only VIN `1HGCM82633A004352`.

## Verified sandbox contract

The vendor's 2024 sandbox document and live Swagger specification identify:

1. Base URL `https://api.motor.com`.
2. VIN route `/v1/Information/Vehicles/Search/ByVIN`.
3. HMAC-SHA256 signing over public key, HTTP verb, epoch seconds, and route path.
4. Query authentication using `Scheme`, `XDate`, `ApiKey`, and `Sig`.
5. MOTOR attribute names in the response.
6. Fifteen sanctioned sandbox VINs.

`MOTOR_SANDBOX_PUBLIC_KEY` and `MOTOR_SANDBOX_PRIVATE_KEY` are server-only. Never place them in source control, screenshots, logs, client code, or an `EXPO_PUBLIC_*` variable. The app receives only normalized fields. Requests time out after 10 seconds, are not cached, and results are not persisted.

## Still required before deployment

1. Written confirmation of current sandbox and production licensing.
2. Rate limits and documented error status behavior.
3. Caching, retention, logging, attribution, geography, and OEM notice requirements.
4. Founder approval for proxy deployment and a native test build.

Do not deploy or create a TestFlight build without Founder approval.
