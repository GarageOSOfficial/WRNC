# WRNC Kit Account Setup

## Account identity

- Account owner/login: `admin@wrnc.app`
- Public brand: `WRNC`
- Website: `https://wrnc.app`
- Default time zone: Pacific Time
- Account recovery must remain under Founder-controlled WRNC access.

## Sender decision

The locked email hierarchy does not currently define a public newsletter sender.

- Recommended temporary visible sender: `travis@wrnc.app`
- Customer support: `support@wrnc.app`
- Do not use `admin@wrnc.app`, `subscribed@wrnc.app`, `noreply@wrnc.app`, or `test@wrnc.app` as the visible marketing sender.
- Founder approval is required before creating a new public alias such as `updates@wrnc.app`.

## Required Kit account information

- Founder-controlled login and recovery method
- WRNC business name and website
- Verified sending address on `@wrnc.app`
- Physical mailing address required for marketing email footers
- Pacific Time as the default sending time zone
- Approved brand colors and sender name
- Verified sending domain DNS records for `wrnc.app` or an approved sending subdomain

## Landing-page form

Create an inline Form in Kit named `WRNC Launch List`.

- Required field: Email
- Optional field: First name
- Double opt-in: Enabled
- Tag: `WRNC Landing Page`
- Success behavior: Show a clear confirmation message or redirect to an approved WRNC confirmation route
- Confirmation email: Use approved WRNC copy before publishing
- Form purpose: Explicitly state that the subscriber is joining the WRNC launch and product-update email list

## Development handoff

For the recommended managed embed, provide Development:

1. The published Kit Form ID
2. The JavaScript embed snippet copied from Kit
3. The approved visible form copy
4. The approved confirmation message or redirect URL
5. Confirmation that double opt-in is enabled
6. Confirmation that the sender address and sending domain are verified

Do not send an API secret through chat or place one in client-side code. A custom API integration would require a server-side environment secret and a separate deployment approval.

## Operational verification

Before production use:

1. Submit a disposable external email address through the WRNC landing page.
2. Confirm receipt of the double-opt-in email.
3. Confirm the subscriber remains unconfirmed until the confirmation link is used.
4. Confirm the subscriber appears in the correct Kit Form and tag after confirmation.
5. Confirm unsubscribe works.
6. Confirm the visible sender, reply path, mailing address, privacy link, and branding are correct.
